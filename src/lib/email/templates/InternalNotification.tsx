import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from "@react-email/components";

type InternalNotificationEmailProps = {
  name: string;
  email: string;
  phone?: string;
  service: string;
  brief: string;
  timeline: string;
};

export function InternalNotificationEmail({
  name,
  email,
  phone,
  service,
  brief,
  timeline,
}: InternalNotificationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>
        New inquiry: {service} — {name}
      </Preview>
      <Body style={{ backgroundColor: "#111111", color: "#F0EDE8", fontFamily: "sans-serif" }}>
        <Container style={{ padding: "40px 20px" }}>
          <Heading style={{ color: "#C4A96B", fontWeight: 400 }}>
            New Project Inquiry
          </Heading>
          <Text style={{ color: "#F0EDE8" }}>
            <strong>Name:</strong> {name}
          </Text>
          <Text style={{ color: "#F0EDE8" }}>
            <strong>Email:</strong> {email}
          </Text>
          {phone && (
            <Text style={{ color: "#F0EDE8" }}>
              <strong>Phone:</strong> {phone}
            </Text>
          )}
          <Text style={{ color: "#F0EDE8" }}>
            <strong>Service:</strong> {service}
          </Text>
          <Text style={{ color: "#F0EDE8" }}>
            <strong>Project Timeline:</strong> {timeline}
          </Text>
          <Text style={{ color: "#8C8C8C", lineHeight: 1.75, marginTop: 24 }}>
            <strong style={{ color: "#F0EDE8" }}>Brief:</strong>
            <br />
            {brief}
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
