import { z } from "zod";
import { Resend } from "resend";
import { ContactConfirmationEmail } from "@/lib/email/templates/ContactConfirmation";
import { InternalNotificationEmail } from "@/lib/email/templates/InternalNotification";
import { SITE } from "@/lib/constants";

const contactSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(10),
  enquiry: z.string().min(10),
  website: z.string().max(0).optional(),
});

export async function POST(request: Request) {
  const body: unknown = await request.json();
  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      { error: "Invalid data", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  // Honeypot check — bots fill the hidden website field
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
  const fullName = `${parsed.data.firstName} ${parsed.data.lastName}`;

  try {
    await Promise.all([
      resend.emails.send({
        from: `Design Essentials <${SITE.email}>`,
        to: parsed.data.email,
        subject: "We've received your inquiry — Design Essentials",
        react: ContactConfirmationEmail({ name: fullName }),
      }),
      resend.emails.send({
        from: `Website Contact <${SITE.email}>`,
        to: SITE.email,
        subject: `New Enquiry — ${fullName}`,
        react: InternalNotificationEmail({
          firstName: parsed.data.firstName,
          lastName: parsed.data.lastName,
          email: parsed.data.email,
          phone: parsed.data.phone,
          enquiry: parsed.data.enquiry,
        }),
      }),
    ]);

    return Response.json({ success: true });
  } catch {
    return Response.json({ error: "Failed to send email" }, { status: 500 });
  }
}
