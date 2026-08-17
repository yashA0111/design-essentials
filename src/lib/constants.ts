const getSiteUrl = () => {
  if (typeof import.meta !== "undefined" && import.meta.env?.PUBLIC_SITE_URL) {
    return import.meta.env.PUBLIC_SITE_URL;
  }
  if (typeof process !== "undefined") {
    if (process.env.PUBLIC_SITE_URL) return process.env.PUBLIC_SITE_URL;
    if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:4321";
};

export const SITE = {
  name: "Design Essentials",
  url: getSiteUrl(),
  tagline: "Where Vision Becomes Space",
  description:
    "Design Essentials is a full-service architectural and interior design firm specializing in pre-engineered homes, container architecture, exhibition design, and immersive experiential spaces across India.",
  email: "[email]",
  phone: "[Phone Number]",
  address: {
    line1: "[line 1]",
    city: "[city]",
    state: "[state]",
    pin: "[pin]",
    full: "[line 1], [city], [state], [pin], India",
  },
  mapUrl:
    "",
  socials: {
    instagram: "",
    linkedin: "",
    behance: "",
    pinterest: "",
  },
} as const;

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services", hasDropdown: true },
  { label: "Projects", href: "/projects" },
  { label: "Blog", href: "/blog" },
] as const;

