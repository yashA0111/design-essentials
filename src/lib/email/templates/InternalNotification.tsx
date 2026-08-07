import { Text } from "@react-email/components";
import {
  EMAIL_COLORS,
  EmailLayout,
  emailTextStyle,
} from "@/lib/email/EmailLayout";

type InternalNotificationEmailProps = {
  name: string;
  email: string;
  phone?: string;
  service: string;
  brief: string;
  budget?: string;
};

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <Text style={{ color: EMAIL_COLORS.text }}>
      <strong>{label}:</strong> {value}
    </Text>
  );
}

export function InternalNotificationEmail({
  name,
  email,
  phone,
  service,
  brief,
  budget,
}: InternalNotificationEmailProps) {
  return (
    <EmailLayout
      preview={`New inquiry: ${service} — ${name}`}
      heading="New Project Inquiry"
      backgroundColor={EMAIL_COLORS.surface}
    >
      <DetailRow label="Name" value={name} />
      <DetailRow label="Email" value={email} />
      {phone && <DetailRow label="Phone" value={phone} />}
      <DetailRow label="Service" value={service} />
      {budget && <DetailRow label="Budget" value={budget} />}
      <Text style={{ ...emailTextStyle, marginTop: 24 }}>
        <strong style={{ color: EMAIL_COLORS.text }}>Brief:</strong>
        <br />
        {brief}
      </Text>
    </EmailLayout>
  );
}
