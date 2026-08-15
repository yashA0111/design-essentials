import { getSql } from "@/lib/db/client";
import { retryDelayMs } from "./types";
export type ClaimedJob = { id: string; enquiry_id: string; lead_id: string | null; kind: "acknowledgment_email" | "internal_notification" | "zoho_lead_sync" | "form2_invitation"; attempt_count: number; max_attempts: number; locked_by: string };

export async function claimJobs(workerId: string, limit: number, enabledKinds: ClaimedJob["kind"][]): Promise<ClaimedJob[]> {
  if (enabledKinds.length === 0) return [];
  const sql = getSql();
  return sql.begin(async (tx) => tx<ClaimedJob[]>`
    WITH candidates AS (SELECT id FROM workflow_jobs WHERE kind = ANY(${enabledKinds}::job_kind[]) AND ((status IN ('pending','retry') AND next_attempt_at <= now()) OR (status = 'running' AND lease_expires_at < now())) ORDER BY next_attempt_at, created_at FOR UPDATE SKIP LOCKED LIMIT ${limit})
    UPDATE workflow_jobs j SET status = 'running', locked_by = ${workerId}::uuid, locked_at = now(), lease_expires_at = now() + interval '90 seconds', attempt_count = j.attempt_count + 1, updated_at = now() FROM candidates WHERE j.id = candidates.id
    RETURNING j.id, j.enquiry_id, j.lead_id, j.kind, j.attempt_count, j.max_attempts, j.locked_by`);
}
export async function completeJob(job: ClaimedJob, providerRecordId?: string) {
  const sql = getSql();
  const rows = await sql`UPDATE workflow_jobs SET status = 'succeeded', provider_record_id = ${providerRecordId ?? null}, completed_at = now(), updated_at = now() WHERE id = ${job.id}::uuid AND status = 'running' AND locked_by = ${job.locked_by}::uuid RETURNING id`;
  if (rows.length && job.kind === "zoho_lead_sync") await sql`UPDATE workflow_jobs SET status = 'pending', next_attempt_at = now(), updated_at = now() WHERE prerequisite_job_id = ${job.id}::uuid AND status = 'blocked'`;
  return rows.length === 1;
}
export async function releaseJobWithoutAttempt(job: ClaimedJob) { const sql = getSql(); await sql`UPDATE workflow_jobs SET status = 'pending', locked_by = NULL, locked_at = NULL, lease_expires_at = NULL, attempt_count = attempt_count - 1, next_attempt_at = now() + interval '1 second', updated_at = now() WHERE id = ${job.id}::uuid AND status = 'running' AND locked_by = ${job.locked_by}::uuid`; }
export async function failJob(job: ClaimedJob, error: { code: string; retryable: boolean; retryAfterMs?: number }) {
  const sql = getSql(); const dead = !error.retryable || job.attempt_count >= job.max_attempts;
  await sql`UPDATE workflow_jobs SET status = ${dead ? "dead" : "retry"}::job_status, next_attempt_at = ${dead ? new Date() : new Date(Date.now() + retryDelayMs(job.attempt_count, error.retryAfterMs))}, last_error_code = ${error.code}, last_error_class = ${dead ? "terminal" : "retryable"}, last_error_at = now(), completed_at = ${dead ? new Date() : null}, updated_at = now() WHERE id = ${job.id}::uuid AND status = 'running' AND locked_by = ${job.locked_by}::uuid`;
  if (dead && job.kind === "zoho_lead_sync") await sql`UPDATE workflow_jobs SET status = 'cancelled', last_error_code = 'ZOHO_DEPENDENCY_DEAD', last_error_class = 'terminal', completed_at = now(), updated_at = now() WHERE prerequisite_job_id = ${job.id}::uuid AND status = 'blocked'`;
  return dead;
}
export async function purgeRetainedData(limit = 100) { const sql = getSql(); const abuse = await sql`DELETE FROM contact_abuse_counters WHERE window_expires_at < now() - interval '1 hour'`; const raw = await sql`UPDATE enquiries SET raw_full_name = NULL, raw_email = NULL, raw_phone = NULL, raw_enquiry = NULL, raw_purged_at = now(), updated_at = now() WHERE id IN (SELECT id FROM enquiries WHERE raw_purged_at IS NULL AND raw_purge_after <= now() LIMIT ${limit})`; const invites = await sql`DELETE FROM form2_invites WHERE id IN (SELECT id FROM form2_invites WHERE (expires_at < now() OR revoked_at IS NOT NULL OR consumed_at IS NOT NULL) AND created_at < now() - interval '30 days' LIMIT ${limit})`; return { abuse: abuse.count, raw: raw.count, invites: invites.count }; }
