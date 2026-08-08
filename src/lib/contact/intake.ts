import { timingSafeEqual } from "node:crypto";
import { getContactConfig } from "@/lib/config/server";
import { getSql } from "@/lib/db/client";
import { contactPipelineEvent } from "@/lib/observability/contact-pipeline";
import { advisoryLockKey, contactPayloadDigest, type NormalizedContact } from "./normalize";

export class IdempotencyConflictError extends Error { code = "IDEMPOTENCY_CONFLICT"; }
export type IntakeResult = { submissionId: string; replayed: boolean; enquiryId?: string };
const MAX_TRANSACTION_RETRIES = 3;
const safeEqual = (a: string, b: string) => a.length === b.length && timingSafeEqual(Buffer.from(a), Buffer.from(b));

export async function findSubmissionReplay(submissionId: string, input: NormalizedContact) {
  const secret = getContactConfig().idempotencySecret; if (!secret) return false; const rows = await getSql()<{ payload_digest: string }[]>`SELECT payload_digest FROM enquiries WHERE submission_id = ${submissionId}::uuid`; return Boolean(rows[0] && safeEqual(rows[0].payload_digest, contactPayloadDigest(input, secret)));
}

export async function persistContactSubmission(input: NormalizedContact, submissionId: string): Promise<IntakeResult> {
  const config = getContactConfig();
  const idempotencySecret = config.idempotencySecret;
  if (!idempotencySecret) throw new Error("CONTACT_DATABASE_UNAVAILABLE");
  const digest = contactPayloadDigest(input, idempotencySecret);
  const sql = getSql();
  for (let attempt = 0; attempt < MAX_TRANSACTION_RETRIES; attempt += 1) {
    try {
      return await sql.begin(async (tx) => {
        const existing = await tx<{ submission_id: string; payload_digest: string; id: string }[]>`SELECT submission_id, payload_digest, id FROM enquiries WHERE submission_id = ${submissionId}::uuid FOR UPDATE`;
        if (existing[0]) {
          if (!safeEqual(existing[0].payload_digest, digest)) throw new IdempotencyConflictError();
          return { submissionId: existing[0].submission_id, replayed: true, enquiryId: existing[0].id };
        }
        const lockKeys = [advisoryLockKey(`email:${input.normalizedEmail}`, idempotencySecret), advisoryLockKey(`phone:${input.normalizedPhone}`, idempotencySecret)].sort();
        for (const key of lockKeys) await tx`SELECT pg_advisory_xact_lock(${key}::bigint)`;
        const identities = await tx<{ lead_id: string; normalized_value: string }[]>`SELECT lead_id, normalized_value FROM lead_identities WHERE (kind = 'email' AND normalized_value = ${input.normalizedEmail}) OR (kind = 'phone' AND normalized_value = ${input.normalizedPhone}) FOR UPDATE`;
        const leadIds = [...new Set(identities.map((row) => row.lead_id))];
        let leadId: string | null = null;
        let conflictIds: string[] = [];
        if (leadIds.length > 1) conflictIds = leadIds.sort();
        else if (leadIds.length === 1) leadId = leadIds[0];
        else {
          const created = await tx<{ id: string }[]>`INSERT INTO leads (display_name, first_name, last_name) VALUES (${input.normalizedFullName}, ${input.firstName}, ${input.lastName}) RETURNING id`;
          leadId = created[0].id;
        }
        if (leadId) {
          await tx`UPDATE leads SET display_name = ${input.normalizedFullName}, first_name = ${input.firstName}, last_name = ${input.lastName}, updated_at = now() WHERE id = ${leadId}::uuid`;
          for (const [kind, value] of [["email", input.normalizedEmail], ["phone", input.normalizedPhone]] as const) {
            await tx`UPDATE lead_identities SET is_current = 0 WHERE lead_id = ${leadId}::uuid AND kind = ${kind}`;
            await tx`INSERT INTO lead_identities (lead_id, kind, normalized_value, is_current) VALUES (${leadId}::uuid, ${kind}::identity_kind, ${value}, 1) ON CONFLICT (kind, normalized_value) DO UPDATE SET last_seen_at = now(), is_current = 1`;
          }
        }
        const rows = await tx<{ id: string }[]>`INSERT INTO enquiries (submission_id, payload_digest, lead_id, resolution_state, conflicting_lead_ids, raw_full_name, raw_email, raw_phone, raw_enquiry, normalized_full_name, first_name, last_name, normalized_email, normalized_phone, normalized_enquiry, privacy_notice_version, raw_purge_after) VALUES (${submissionId}::uuid, ${digest}, ${leadId}::uuid, ${leadId ? "resolved" : "identity_conflict"}::resolution_state, ${conflictIds}::uuid[], ${input.fullName}, ${input.email}, ${input.phone}, ${input.enquiry}, ${input.normalizedFullName}, ${input.firstName}, ${input.lastName}, ${input.normalizedEmail}, ${input.normalizedPhone}, ${input.normalizedEnquiry}, ${config.privacyNoticeVersion}, now() + (${config.rawRetentionDays} * interval '1 day')) RETURNING id`;
        const enquiryId = rows[0].id;
        const job = async (kind: string, status: string, maxAttempts: number, prerequisiteJobId: string | null = null) => (await tx<{ id: string }[]>`INSERT INTO workflow_jobs (enquiry_id, lead_id, kind, status, max_attempts, prerequisite_job_id, dedupe_key) VALUES (${enquiryId}::uuid, ${leadId}::uuid, ${kind}::job_kind, ${status}::job_status, ${maxAttempts}, ${prerequisiteJobId}::uuid, ${`enquiry:${enquiryId}:${kind}:v1`}) RETURNING id`)[0].id;
        await job("acknowledgment_email", "pending", 8);
        await job("internal_notification", "pending", 8);
        if (leadId) { const zoho = await job("zoho_lead_sync", "pending", 12); await job("form2_invitation", "blocked", 8, zoho); }
        if (leadId) await tx`UPDATE lead_identities SET first_seen_enquiry_id = ${enquiryId}::uuid WHERE lead_id = ${leadId}::uuid AND first_seen_enquiry_id IS NULL AND (kind = 'email' AND normalized_value = ${input.normalizedEmail} OR kind = 'phone' AND normalized_value = ${input.normalizedPhone})`;
        contactPipelineEvent(leadId ? "submission.persisted" : "identity.conflict", { submissionId, enquiryId, leadId: leadId ?? undefined });
        return { submissionId, replayed: false, enquiryId };
      });
    } catch (error) {
      if ((error as { code?: string }).code === "23505" && attempt + 1 < MAX_TRANSACTION_RETRIES) continue;
      throw error;
    }
  }
  throw new Error("CONTACT_DATABASE_UNAVAILABLE");
}
