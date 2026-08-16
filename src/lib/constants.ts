export const SITE = {
  name: "Design Essentials",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://designessentials.in",
  tagline: "Where Vision Becomes Space",
  description:
    "Design Essentials is a full-service architectural and interior design firm specializing in pre-engineered homes, container architecture, exhibition design, and immersive experiential spaces across India.",
  email: "contact@designessentials.in",
  phone: "+91 98765 43210",
  address: {
    line1: "Plot 42, Sector 18",
    city: "Gurgaon",
    state: "Haryana",
    pin: "122002",
    full: "Plot 42, Sector 18, Gurgaon, Haryana, India",
  },
  mapUrl:
    "https://maps.google.com/maps?q=Gurgaon+Sector+18&t=&z=13&ie=UTF8&iwloc=&output=embed",
  socials: {
    instagram: "https://instagram.com/designessentials",
    linkedin: "https://linkedin.com/company/designessentials",
    behance: "https://behance.net/designessentials",
    pinterest: "https://pinterest.com/designessentials",
  },
} as const;

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services", hasDropdown: true },
  { label: "Projects", href: "/projects" },
  { label: "Blog", href: "/blog" },
] as const;

