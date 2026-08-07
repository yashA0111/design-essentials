import { Resend } from "resend";
import { ContactConfirmationEmail } from "@/lib/email/templates/ContactConfirmation";
import { InternalNotificationEmail } from "@/lib/email/templates/InternalNotification";
import { SITE } from "@/lib/constants";
import { contactSchema } from "@/lib/validation/contact";

export async function POST(request: Request) {
  const body: unknown = await request.json();
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
    return Response.json(
      { error: "Email service not configured" },
      { status: 503 }
    );
  }

  const resend = new Resend(apiKey);

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
        subject: `New Project Inquiry: ${parsed.data.service} — ${parsed.data.name}`,
        react: InternalNotificationEmail(parsed.data),
      }),
    ]);

    return Response.json({ success: true });
  } catch {
    return Response.json({ error: "Failed to send email" }, { status: 500 });
  }
}
