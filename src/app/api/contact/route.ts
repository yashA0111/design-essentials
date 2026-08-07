import { Resend } from "resend";
import { ContactConfirmationEmail } from "@/lib/email/templates/ContactConfirmation";
import { InternalNotificationEmail } from "@/lib/email/templates/InternalNotification";
import { SITE } from "@/lib/constants";
import { buildWebsiteLeadPayload } from "@/lib/leads/normalize";
import { contactSchema } from "@/lib/validation/contact";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

const MAX_BODY_BYTES = 16 * 1024;
const RATE_LIMIT = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;

function errorResponse(
  message: string,
  status: number,
  extra?: Record<string, unknown>,
  headers?: HeadersInit
) {
  return Response.json({ error: message, ...extra }, { status, headers });
}

export async function POST(request: Request) {
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return errorResponse("Unsupported content type", 415);
  }

  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (declaredLength > MAX_BODY_BYTES) {
    return errorResponse("Payload too large", 413);
  }

  const rawBody = await request.text().catch(() => null);
  if (rawBody === null) {
    return errorResponse("Could not read request body", 400);
  }
  if (rawBody.length > MAX_BODY_BYTES) {
    return errorResponse("Payload too large", 413);
  }

  let body: unknown;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return errorResponse("Malformed JSON body", 400);
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse("Invalid data", 400, {
      fieldErrors: parsed.error.flatten().fieldErrors,
    });
  }

  // Honeypot — bots fill the hidden website field. Respond as if accepted.
  if (parsed.data.website) {
    return Response.json({ success: true });
  }

  const limit = rateLimit(
    `contact:${getClientIp(request)}`,
    RATE_LIMIT,
    RATE_LIMIT_WINDOW_MS
  );
  if (!limit.allowed) {
    return errorResponse(
      "Too many enquiries from this address. Please try again later.",
      429,
      undefined,
      { "Retry-After": String(limit.retryAfterSeconds) }
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[contact] RESEND_API_KEY is not configured");
    return errorResponse("Email service not configured", 503);
  }

  const resend = new Resend(apiKey);
  const leadPayload = buildWebsiteLeadPayload(parsed.data);
  const { fullName, email, phone, enquiry } = parsed.data;

  try {
    // TODO: Insert leadPayload into website_leads_staging once Supabase is provisioned.
    void leadPayload;

    const results = await Promise.allSettled([
      resend.emails.send({
        from: `Design Essentials <${SITE.email}>`,
        to: email,
        subject: "We've received your inquiry — Design Essentials",
        react: ContactConfirmationEmail({ name: fullName }),
      }),
      resend.emails.send({
        from: `Website Contact <${SITE.email}>`,
        to: SITE.email,
        subject: `New Enquiry — ${fullName}`,
        react: InternalNotificationEmail({ fullName, email, phone, enquiry }),
      }),
    ]);

    const [confirmation, notification] = results;

    for (const result of results) {
      if (result.status === "rejected") {
        console.error("[contact] email delivery threw", result.reason);
      } else if (result.value?.error) {
        console.error("[contact] email delivery failed", result.value.error);
      }
    }

    const delivered = (result: (typeof results)[number]) =>
      result.status === "fulfilled" && !result.value?.error;

    // The internal notification is the one the studio cannot afford to lose.
    if (!delivered(notification)) {
      return errorResponse("Failed to send email", 502);
    }

    return Response.json({
      success: true,
      confirmationSent: delivered(confirmation),
    });
  } catch (error) {
    console.error("[contact] unexpected failure", error);
    return errorResponse("Failed to send email", 500);
  }
}
