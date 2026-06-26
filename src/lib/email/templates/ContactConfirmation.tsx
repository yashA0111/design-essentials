import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from "@react-email/components";

type ContactConfirmationEmailProps = {
  name: string;
};

export function ContactConfirmationEmail({
  name,
}: ContactConfirmationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>We&apos;ve received your inquiry — Design Essentials</Preview>
      <Body style={{ backgroundColor: "#080808", color: "#F0EDE8", fontFamily: "sans-serif" }}>
        <Container style={{ padding: "40px 20px" }}>
          <Heading style={{ color: "#C4A96B", fontWeight: 300 }}>
            Thank you, {name}
          </Heading>
          <Text style={{ color: "#8C8C8C", lineHeight: 1.75 }}>
            We&apos;ve received your project inquiry and our team will review it
            within 24 hours. A member of the Design Essentials team will be in
            touch shortly to discuss your vision.
          </Text>
          <Text style={{ color: "#8C8C8C", lineHeight: 1.75 }}>
            In the meantime, feel free to explore our portfolio at
            designessentials.in/projects.
          </Text>
          <Text style={{ color: "#C4A96B", marginTop: 32 }}>
            — Design Essentials
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
