import { Text } from "@react-email/components";
import {
  EMAIL_COLORS,
  EmailLayout,
  emailTextStyle,
} from "@/lib/email/EmailLayout";

type ContactConfirmationEmailProps = {
  name: string;
};

export function ContactConfirmationEmail({
  name,
}: ContactConfirmationEmailProps) {
  return (
    <EmailLayout
      preview="We've received your inquiry — Design Essentials"
      heading={`Thank you, ${name}`}
      headingWeight={300}
    >
      <Text style={emailTextStyle}>
        We&apos;ve received your project inquiry and our team will review it
        within 24 hours. A member of the Design Essentials team will be in touch
        shortly to discuss your vision.
      </Text>
      <Text style={emailTextStyle}>
        In the meantime, feel free to explore our portfolio at
        designessentials.in/projects.
      </Text>
      <Text style={{ color: EMAIL_COLORS.gold, marginTop: 32 }}>
        — Design Essentials
      </Text>
    </EmailLayout>
  );
}
