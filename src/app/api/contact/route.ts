import { randomUUID } from "node:crypto";
import { getContactConfig } from "@/lib/config/server";
import { enforceContactAbuseLimit, getClientIp } from "@/lib/contact/abuse";
import { findSubmissionReplay, IdempotencyConflictError, persistContactSubmission } from "@/lib/contact/intake";
import { normalizeContactInput } from "@/lib/contact/normalize";
import { contactRequestSchema } from "@/lib/validation/contact";

const MAX_BODY_BYTES = 16 * 1024;
const errorResponse = (message: string, status: number, extra?: Record<string, unknown>, headers?: HeadersInit) => Response.json({ error: message, ...extra }, { status, headers });

export async function POST(request: Request) {
  if (!request.headers.get("content-type")?.includes("application/json")) return errorResponse("Unsupported content type", 415);
  if (Number(request.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) return errorResponse("Payload too large", 413);
  const rawBody = await request.text().catch(() => null);
  if (rawBody === null) return errorResponse("Could not read request body", 400);
  if (Buffer.byteLength(rawBody, "utf8") > MAX_BODY_BYTES) return errorResponse("Payload too large", 413);
  let body: unknown;
  try { body = JSON.parse(rawBody); } catch { return errorResponse("Malformed JSON body", 400); }
  const parsed = contactRequestSchema.safeParse(body);
  if (!parsed.success) return errorResponse("Invalid data", 400, { fieldErrors: parsed.error.flatten().fieldErrors });
  if (parsed.data.website?.trim()) return Response.json({ success: true });
  let normalized;
  try { normalized = normalizeContactInput(parsed.data); } catch { return errorResponse("Invalid data", 400); }
  const config = getContactConfig();
  if (!config.databaseUrl || !config.idempotencySecret || !config.abuseSecret) return errorResponse("Service temporarily unavailable", 503);
  try {
    const suppliedSubmissionId = parsed.data.submissionId;
    const replay = suppliedSubmissionId ? await findSubmissionReplay(suppliedSubmissionId, normalized) : false;
    const limit = replay ? { allowed: true, retryAfterSeconds: 0 } : await enforceContactAbuseLimit({ email: normalized.normalizedEmail, phone: normalized.normalizedPhone }, getClientIp(request), config.abuseSecret);
    if (!limit.allowed) return errorResponse("Too many enquiries from this address. Please try again later.", 429, undefined, { "Retry-After": String(limit.retryAfterSeconds) });
    const submissionId = suppliedSubmissionId ?? randomUUID();
    const result = await persistContactSubmission(normalized, submissionId);
    return Response.json({ success: true, submissionId: result.submissionId }, { status: result.replayed ? 200 : 202 });
  } catch (error) {
    if (error instanceof IdempotencyConflictError) return errorResponse("Submission conflict", 409);
    console.error("[contact] intake failed", { errorClass: error instanceof Error ? error.name : "unknown" });
    return errorResponse("Service temporarily unavailable", 503);
  }
}
