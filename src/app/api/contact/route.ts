import { z } from "zod";
import { Resend } from "resend";
import { ContactConfirmationEmail } from "@/lib/email/templates/ContactConfirmation";
import { InternalNotificationEmail } from "@/lib/email/templates/InternalNotification";
import { SITE } from "@/lib/constants";

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  service: z.string(),
  brief: z.string().min(10),
  budget: z.string().optional(),
  website: z.string().max(0).optional(),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch (error) {
    console.error("[api/contact] Malformed request body", error);
    return Response.json(
      { error: "Request body must be valid JSON" },
      { status: 400 }
    );
  }

  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      { error: "Invalid data", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  if (parsed.data.website) {
    return Response.json({ success: true });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[api/contact] RESEND_API_KEY is not set");
    return Response.json(
      { error: "Email service not configured" },
      { status: 503 }
    );
  }

  const resend = new Resend(apiKey);

  let results;
  try {
    results = await Promise.all([
      resend.emails.send({
        from: `Design Essentials <${SITE.email}>`,
        to: parsed.data.email,
        subject: "We've received your inquiry — Design Essentials",
        react: ContactConfirmationEmail({ name: parsed.data.name }),
      }),
      resend.emails.send({
        from: `Website Contact <${SITE.email}>`,
        to: SITE.email,
        subject: `New Project Inquiry: ${parsed.data.service} — ${parsed.data.name}`,
        react: InternalNotificationEmail(parsed.data),
      }),
    ]);
  } catch (error) {
    console.error("[api/contact] Email delivery threw", error);
    return Response.json({ error: "Failed to send email" }, { status: 500 });
  }

  const [confirmation, notification] = results;

  if (confirmation.error) {
    console.error(
      "[api/contact] Confirmation email failed",
      confirmation.error
    );
  }

  if (notification.error) {
    console.error(
      "[api/contact] Internal notification email failed",
      notification.error
    );
    return Response.json({ error: "Failed to send email" }, { status: 500 });
  }

  return Response.json({ success: true });
}
