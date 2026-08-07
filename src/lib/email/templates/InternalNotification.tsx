import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from "react-email";

type InternalNotificationEmailProps = {
  fullName: string;
  email: string;
  phone: string;
  enquiry: string;
};

export function InternalNotificationEmail({
  fullName,
  email,
  phone,
  enquiry,
}: InternalNotificationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>
        New enquiry — {fullName}
      </Preview>
      <Body style={{ backgroundColor: "#111111", color: "#F0EDE8", fontFamily: "sans-serif" }}>
        <Container style={{ padding: "40px 20px" }}>
          <Heading style={{ color: "#C4A96B", fontWeight: 400 }}>
            New Project Enquiry
          </Heading>
          <Text style={{ color: "#F0EDE8" }}>
            <strong>Name:</strong> {fullName}
          </Text>
          <Text style={{ color: "#F0EDE8" }}>
            <strong>Email:</strong> {email}
          </Text>
          <Text style={{ color: "#F0EDE8" }}>
            <strong>Phone:</strong> {phone}
          </Text>
          <Text style={{ color: "#8C8C8C", lineHeight: 1.75, marginTop: 24 }}>
            <strong style={{ color: "#F0EDE8" }}>Enquiry:</strong>
            <br />
            {enquiry}
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
