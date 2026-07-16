export const SITE = {
  name: "Design Essentials",
  tagline: "Where Vision Becomes Space",
  description:
    "Design Essentials is a full-service architectural and interior design firm specializing in pre-engineered homes, container architecture, exhibition design, and immersive experiential spaces across India.",
  email: "onboarding@resend.dev", //temporary dev mail as of now for demo
  phone: "[phone number]",
  address: {
    line1: "[address line 1]",
    city: "[city]",
    state: "[state]",
    pin: "[pin code]",
    full: "[address line 1], [city], [state] - [pin code]",
  },
  mapUrl:
    "https://maps.google.com/maps?q=Noida+Sector+18&t=&z=13&ie=UTF8&iwloc=&output=embed",
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
  { label: "Contact", href: "/contact" },
] as const;

export const PROJECT_TIMELINE_OPTIONS = [
  { value: "ready-immediately", label: "Ready to start immediately" },
  { value: "planning-1-3", label: "Planning for 1–3 months" },
  { value: "exploring-3-6", label: "Exploring for 3–6 months" },
  { value: "researching", label: "Just researching for now" },
] as const;

export const PROJECT_FILTERS = [
  { value: "all", label: "All" },
  { value: "pre-engineered-homes", label: "Pre-Engineered" },
  { value: "institutional-interiors", label: "Interiors" },
  { value: "exhibition-design", label: "Exhibitions" },
  { value: "office-interiors", label: "Offices" },
] as const;
