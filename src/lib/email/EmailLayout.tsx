import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
} from "@react-email/components";

export const EMAIL_COLORS = {
  gold: "#C4A96B",
  text: "#F0EDE8",
  muted: "#8C8C8C",
  void: "#080808",
  surface: "#111111",
} as const;

export const emailTextStyle = {
  color: EMAIL_COLORS.muted,
  lineHeight: 1.75,
} as const;

type EmailLayoutProps = {
  preview: string;
  heading: React.ReactNode;
  backgroundColor?: string;
  headingWeight?: number;
  children: React.ReactNode;
};

export function EmailLayout({
  preview,
  heading,
  backgroundColor = EMAIL_COLORS.void,
  headingWeight = 400,
  children,
}: EmailLayoutProps) {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body
        style={{
          backgroundColor,
          color: EMAIL_COLORS.text,
          fontFamily: "sans-serif",
        }}
      >
        <Container style={{ padding: "40px 20px" }}>
          <Heading style={{ color: EMAIL_COLORS.gold, fontWeight: headingWeight }}>
            {heading}
          </Heading>
          {children}
        </Container>
      </Body>
    </Html>
  );
}
