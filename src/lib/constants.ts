export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://designessentials.in";

export const SITE = {
  name: "Design Essentials",
  tagline: "Where Vision Becomes Space",
  description:
    "Design Essentials is a full-service architectural and interior design firm specializing in pre-engineered homes, container architecture, exhibition design, and immersive experiential spaces across India.",
  email: "hello@designessentials.in",
  phone: "+91 98765 43210",
  address: {
    line1: "B-12, Sector 18",
    city: "Noida",
    state: "Uttar Pradesh",
    pin: "201301",
    full: "B-12, Sector 18, Noida, Uttar Pradesh 201301",
  },
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

export const BUDGET_OPTIONS = [
  { value: "under-50l", label: "Under ₹50L" },
  { value: "50l-2cr", label: "₹50L – 2Cr" },
  { value: "2cr-plus", label: "₹2Cr+" },
] as const;

export const PROJECT_FILTERS = [
  { value: "all", label: "All" },
  { value: "pre-engineered-homes", label: "Pre-Engineered" },
  { value: "institutional-interiors", label: "Interiors" },
  { value: "exhibition-design", label: "Exhibitions" },
  { value: "office-interiors", label: "Offices" },
] as const;
