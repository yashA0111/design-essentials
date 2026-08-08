import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import { getSql } from "@/lib/db/client";
import { IdempotencyConflictError, persistContactSubmission } from "./intake";
import { normalizeContactInput } from "./normalize";

const enabled = Boolean(process.env.CONTACT_INTEGRATION_DATABASE_URL && process.env.RUN_CONTACT_INTEGRATION_TESTS === "true");
const describeDb = enabled ? describe : describe.skip;
let sql: ReturnType<typeof getSql>;
const normalize = (email: string, phone: string) => normalizeContactInput({ fullName: "Asha Menon", email, phone, enquiry: "A detailed enquiry for a studio project." });
const ids = { first: "00000000-0000-4000-8000-000000000001", second: "00000000-0000-4000-8000-000000000002", third: "00000000-0000-4000-8000-000000000003" };

describeDb("Postgres contact intake integration", () => {
  beforeAll(() => { sql = getSql();  process.env.CONTACT_IDEMPOTENCY_SECRET = "integration-idempotency-secret"; process.env.CONTACT_ABUSE_HMAC_SECRET = "integration-abuse-secret"; });
  beforeEach(async () => { await sql`TRUNCATE workflow_jobs, form2_invites, lead_identities, enquiries, leads, contact_abuse_counters CASCADE`; });

  it("persists an exact replay once and rejects a reused UUID with a different canonical payload", async () => {
    const input = normalizeContactInput({ fullName: "Asha Menon", email: "asha@example.com", phone: "21 23 45 67", countryCode: "NO", enquiry: "A detailed enquiry for a studio project." });
    const first = await persistContactSubmission(input, ids.first);
    const replay = await persistContactSubmission(input, ids.first);
    expect(first.replayed).toBe(false); expect(replay).toMatchObject({ replayed: true, enquiryId: first.enquiryId });
    await expect(persistContactSubmission(normalize("other@example.com", "+91 98765 43210"), ids.first)).rejects.toBeInstanceOf(IdempotencyConflictError);
    const counts = await sql<{ enquiries: number; jobs: number; country_code: string; normalized_phone: string }[]>`SELECT (SELECT count(*)::int FROM enquiries) AS enquiries, (SELECT count(*)::int FROM workflow_jobs) AS jobs, (SELECT country_code FROM enquiries LIMIT 1) AS country_code, (SELECT normalized_phone FROM enquiries LIMIT 1) AS normalized_phone`;
    expect(counts[0]).toEqual({ enquiries: 1, jobs: 4, country_code: "NO", normalized_phone: "+4721234567" });
  });

  it("links repeated identities to one lead but persists split email/phone evidence as an identity conflict", async () => {
    const one = await persistContactSubmission(normalize("same@example.com", "+91 98765 43210"), ids.first);
    const sameLead = await persistContactSubmission(normalize("same@example.com", "+91 98765 43210"), ids.second);
    expect(sameLead.enquiryId).not.toBe(one.enquiryId);
    const independent = await persistContactSubmission(normalize("other@example.com", "+91 91234 56789"), ids.third);
    const conflict = await persistContactSubmission(normalize("same@example.com", "+91 91234 56789"), "00000000-0000-4000-8000-000000000004");
    const conflictId = conflict.enquiryId!;
    const rows = await sql<{ resolution_state: string; lead_id: string | null; candidates: number; jobs: number }[]>`SELECT e.resolution_state, e.lead_id, cardinality(e.conflicting_lead_ids) AS candidates, (SELECT count(*)::int FROM workflow_jobs WHERE enquiry_id = e.id) AS jobs FROM enquiries e WHERE e.id = ${conflictId}::uuid`;
    expect(independent.enquiryId).toBeTruthy(); expect(rows[0]).toEqual({ resolution_state: "identity_conflict", lead_id: null, candidates: 2, jobs: 2 });
  });
});
