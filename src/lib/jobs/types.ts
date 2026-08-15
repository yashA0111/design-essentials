export type JobKind = "acknowledgment_email" | "internal_notification" | "zoho_lead_sync" | "form2_invitation";
export class JobFailure extends Error { constructor(public code: string, public retryable: boolean, public retryAfterMs?: number) { super(code); } }
export const RESEND_IDEMPOTENCY_WINDOW_MS = 24 * 60 * 60 * 1000;
export const MAX_EMAIL_RETRY_HORIZON_MS = 6 * 60 * 60 * 1000;

export const maxAttemptsFor: Record<JobKind, number> = { acknowledgment_email: 8, internal_notification: 8, zoho_lead_sync: 12, form2_invitation: 8 };
export function retryDelayMs(attempt: number, retryAfterMs?: number) { if (retryAfterMs) return Math.min(retryAfterMs, 60 * 60 * 1000); return Math.floor(Math.random() * Math.min(60 * 60 * 1000, 1_000 * 2 ** Math.max(0, attempt))); }
