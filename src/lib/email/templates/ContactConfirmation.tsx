import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from "react-email";
import { SITE } from "@/lib/constants";

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
      <Body style={{ backgroundColor: "#080808", color: "#F0EDE8", fontFamily: "sans-serif", margin: "0", padding: "0" }}>
        <Container style={{ padding: "40px 20px", maxWidth: "600px", margin: "0 auto" }}>
          <Heading style={{ color: "#C4A96B", fontWeight: 300, fontSize: "24px", margin: "0 0 20px" }}>
            Thank you, {name}
          </Heading>
          <Text style={{ color: "#8C8C8C", lineHeight: "1.75", fontSize: "16px", margin: "0 0 16px" }}>
            We&apos;ve received your project inquiry and our team will review it
            within 24 hours. A member of the Design Essentials team will be in
            touch shortly to discuss your vision.
          </Text>
          <Text style={{ color: "#8C8C8C", lineHeight: "1.75", fontSize: "16px", margin: "0 0 24px" }}>
            In the meantime, feel free to explore our portfolio at{" "}
            <a href={`${SITE.url}/projects`} style={{ color: "#C4A96B", textDecoration: "none" }}>
              {SITE.url.replace(/^https?:\/\//, "")}/projects
            </a>.
          </Text>
          <Text style={{ color: "#C4A96B", marginTop: "32px", fontSize: "14px", fontWeight: "bold" }}>
            — Design Essentials
          </Text>
        </Container>
      </Body>
    </Html>
  );
}