import { Resend } from "resend";
import { getContactConfig } from "@/lib/config/server";
import { ContactConfirmationEmail } from "@/lib/email/templates/ContactConfirmation";
import { InternalNotificationEmail } from "@/lib/email/templates/InternalNotification";
import { JobFailure } from "@/lib/jobs/types";

type ResendError = { statusCode?: number | null; name?: string };
export function resendFailure(error: ResendError) {
 const status = error.statusCode;
 const retryable = status == null || status === 408 || status === 425 || status === 429 || status >= 500;
 return new JobFailure(retryable ? "RESEND_TRANSIENT" : "RESEND_PERMANENT", retryable);
}
export async function sendContactEmail(kind: "acknowledgment_email" | "internal_notification", enquiryId: string) {
 const config = getContactConfig(); if (!config.emailEnabled) throw new JobFailure("EMAIL_DISABLED", true, 60_000); if (!config.resendApiKey || !config.resendFrom || !config.internalRecipient) throw new JobFailure("EMAIL_CONFIG", false);
 const { getSql } = await import("@/lib/db/client"); const rows = await getSql()<{ normalized_email: string; normalized_full_name: string; normalized_phone: string; normalized_enquiry: string; resolution_state: string }[]>`SELECT normalized_email, normalized_full_name, normalized_phone, normalized_enquiry, resolution_state FROM enquiries WHERE id = ${enquiryId}::uuid`; const enquiry = rows[0]; if (!enquiry) throw new JobFailure("ENQUIRY_NOT_FOUND", false);
 const isAck = kind === "acknowledgment_email";
 const payload = isAck ? { from: config.resendFrom, to: enquiry.normalized_email, subject: "We've received your inquiry — Design Essentials", react: ContactConfirmationEmail({ name: enquiry.normalized_full_name }) } : { from: config.resendFrom, to: config.internalRecipient, subject: `New Enquiry — ${enquiryId}`, react: InternalNotificationEmail({ fullName: enquiry.normalized_full_name, email: enquiry.normalized_email, phone: enquiry.normalized_phone, enquiry: enquiry.normalized_enquiry, enquiryId, identityConflict: enquiry.resolution_state === "identity_conflict" }) };
 let result; try { result = await new Resend(config.resendApiKey).emails.send(payload, { idempotencyKey: `contact/${enquiryId}/${isAck ? "ack" : "internal"}/v1` }); } catch { throw new JobFailure("RESEND_NETWORK", true); }
 if (result.error) throw resendFailure(result.error); return result.data?.id;
}
