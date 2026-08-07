import { z } from "zod";
import { Resend } from "resend";
import { ContactConfirmationEmail } from "@/lib/email/templates/ContactConfirmation";
import { InternalNotificationEmail } from "@/lib/email/templates/InternalNotification";
import { SITE } from "@/lib/constants";

const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().max(254),
  phone: z.string().max(30).optional(),
  service: z.string().min(1).max(100),
  brief: z.string().min(10).max(5000),
  budget: z.string().max(100).optional(),
  website: z.string().max(0).optional(),
});

const MAX_BODY_BYTES = 20_000;
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;

const submissions = new Map<string, number[]>();

function clientId(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "unknown";
}

function isRateLimited(id: string): boolean {
  const now = Date.now();
  const recent = (submissions.get(id) ?? []).filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS
  );

  if (submissions.size > 10_000) submissions.clear();

  if (recent.length >= RATE_LIMIT_MAX) {
    submissions.set(id, recent);
    return true;
  }

  recent.push(now);
  submissions.set(id, recent);
  return false;
}

export async function POST(request: Request) {
  if (isRateLimited(clientId(request))) {
    return Response.json(
      { error: "Too many requests" },
      { status: 429, headers: { "Retry-After": "600" } }
    );
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_BODY_BYTES) {
    return Response.json({ error: "Payload too large" }, { status: 413 });
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) {
    return Response.json({ error: "Payload too large" }, { status: 413 });
  }

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json({ error: "Invalid data" }, { status: 400 });
  }

  if (parsed.data.website) {
    return Response.json({ success: true });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "Email service not configured" },
      { status: 503 }
    );
  }

  const resend = new Resend(apiKey);

  const subjectSafe = (value: string) => value.replace(/[\r\n]+/g, " ").trim();

  try {
    await Promise.all([
      resend.emails.send({
        from: `Design Essentials <${SITE.email}>`,
        to: parsed.data.email,
        subject: "We've received your inquiry — Design Essentials",
        react: ContactConfirmationEmail({ name: parsed.data.name }),
      }),
      resend.emails.send({
        from: `Website Contact <${SITE.email}>`,
        to: SITE.email,
        subject: `New Project Inquiry: ${subjectSafe(parsed.data.service)} — ${subjectSafe(parsed.data.name)}`,
        react: InternalNotificationEmail(parsed.data),
      }),
    ]);

    return Response.json({ success: true });
  } catch {
    return Response.json({ error: "Failed to send email" }, { status: 500 });
  }
}
