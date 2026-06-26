import type { Metadata } from "next";
import { displayFont, bodyFont, utilityFont } from "./fonts";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/common/SmoothScroll";
import { SITE } from "@/lib/constants";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://designessentials.in"
  ),
  title: {
    default: "Design Essentials | Architecture & Interior Design Studio",
    template: "%s | Design Essentials",
  },
  description: SITE.description,
  keywords: [
    "architect India",
    "interior designer",
    "pre-engineered homes",
    "container architecture",
    "exhibition design",
    "experience center design",
    "office interior design",
    "museum interior",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://designessentials.in",
    siteName: SITE.name,
    title: "Design Essentials | Architecture & Interior Design Studio",
    description: SITE.description,
    images: [{ url: "/og/home.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Design Essentials | Architecture & Interior Design Studio",
    description: SITE.description,
    images: ["/og/home.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: SITE.name,
  description: SITE.description,
  url: "https://designessentials.in",
  telephone: "+91-98765-43210",
  email: SITE.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: SITE.address.line1,
    addressLocality: SITE.address.city,
    addressRegion: SITE.address.state,
    postalCode: SITE.address.pin,
    addressCountry: "IN",
  },
  priceRange: "₹₹₹",
  serviceType: [
    "Architecture",
    "Interior Design",
    "Exhibition Design",
    "Experience Center Design",
  ],
  sameAs: [SITE.socials.instagram, SITE.socials.linkedin],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${displayFont.variable} ${bodyFont.variable} ${utilityFont.variable}`}
    >
      <body suppressHydrationWarning>
        <SmoothScroll>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </SmoothScroll>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
