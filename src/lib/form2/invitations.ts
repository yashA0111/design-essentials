import { createHash, randomBytes, randomUUID, timingSafeEqual } from "node:crypto";
import { Resend } from "resend";
import { decryptSecret, encryptSecret } from "@/lib/crypto/secrets";
import { getContactConfig } from "@/lib/config/server";
import { getSql } from "@/lib/db/client";
import { JobFailure } from "@/lib/jobs/types";
export function createInviteVerifier() { return randomBytes(32).toString("base64url"); }
export function hashInviteVerifier(verifier: string) { return createHash("sha256").update(verifier).digest("hex"); }
export function verifyInviteVerifier(verifier: string, hash: string) { const actual = Buffer.from(hashInviteVerifier(verifier), "hex"); const expected = Buffer.from(hash, "hex"); return actual.length === expected.length && timingSafeEqual(actual, expected); }
function invitationUrl(baseUrl: string, inviteId: string, verifier: string) { const url = new URL(baseUrl); if (process.env.NODE_ENV === "production" && url.protocol !== "https:") throw new JobFailure("FORM2_URL_INVALID", false); url.searchParams.set("token", `v1.${inviteId}.${verifier}`); return url.toString(); }
/** A random verifier is encrypted at rest and separately hashed for future verification. It is reused for a stable provider idempotency key. */
export async function sendForm2Invitation(enquiryId: string, leadId: string) {
 const config = getContactConfig(); if (!config.form2Enabled) throw new JobFailure("FORM2_DISABLED", true, 60_000); if (!config.form2BaseUrl || !config.resendApiKey || !config.resendFrom) throw new JobFailure("FORM2_CONFIG", false);
 const sql = getSql();
 const invite = await sql.begin(async (tx) => {
   const current = await tx<{ id: string; encrypted_verifier: string; normalized_email: string }[]>`SELECT i.id, i.encrypted_verifier, e.normalized_email FROM form2_invites i JOIN enquiries e ON e.id = i.enquiry_id WHERE i.enquiry_id = ${enquiryId}::uuid AND i.consumed_at IS NULL AND i.revoked_at IS NULL AND i.expires_at > now() FOR UPDATE`;
   if (current[0]) return current[0];
   const rows = await tx<{ normalized_email: string }[]>`SELECT normalized_email FROM enquiries WHERE id = ${enquiryId}::uuid`; if (!rows[0]) throw new JobFailure("ENQUIRY_NOT_FOUND", false);
   const verifier = createInviteVerifier(); const id = randomUUID(); const encryptedVerifier = encryptSecret(verifier);
   await tx`INSERT INTO form2_invites (id, lead_id, enquiry_id, token_hash, encrypted_verifier, expires_at) VALUES (${id}::uuid, ${leadId}::uuid, ${enquiryId}::uuid, ${hashInviteVerifier(verifier)}, ${encryptedVerifier}, now() + (${config.form2TtlHours} * interval '1 hour'))`;
   return { id, encrypted_verifier: encryptedVerifier, normalized_email: rows[0].normalized_email };
 });
 let verifier: string; try { verifier = decryptSecret(invite.encrypted_verifier); } catch { throw new JobFailure("FORM2_VERIFIER_UNAVAILABLE", false); }
 const response = await new Resend(config.resendApiKey).emails.send({ from: config.resendFrom, to: invite.normalized_email, subject: "Continue your Design Essentials enquiry", text: `Continue your project discovery: ${invitationUrl(config.form2BaseUrl, invite.id, verifier)}` }, { idempotencyKey: `contact/${enquiryId}/form2-invite/v1` });
 if (response.error) throw new JobFailure(response.error.name === "validation_error" ? "FORM2_SEND_INVALID" : "FORM2_SEND_FAILED", response.error.name !== "validation_error"); await sql`UPDATE form2_invites SET sent_at = COALESCE(sent_at, now()) WHERE id = ${invite.id}::uuid`; return response.data?.id;
}
