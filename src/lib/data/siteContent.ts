import type {
  BlogPost,
  Milestone,
  PhilosophyPillar,
  ProcessStep,
  TeamMember,
} from "@/types/site";
import { findBySlug } from "@/lib/data/query";

export const processSteps: ProcessStep[] = [
  {
    step: 1,
    title: "Discovery & Brief",
    description:
      "We immerse ourselves in your vision, site conditions, and goals to define a clear design brief.",
  },
  {
    step: 2,
    title: "Concept Design",
    description:
      "Spatial concepts, material direction, and 3D visualizations bring the vision to life for your approval.",
  },
  {
    step: 3,
    title: "Detailed Development",
    description:
      "Technical drawings, MEP coordination, and vendor specifications for flawless execution.",
  },
  {
    step: 4,
    title: "Material & Vendor Selection",
    description:
      "Curated material palettes and vetted vendor partnerships ensure quality at every touchpoint.",
  },
  {
    step: 5,
    title: "Execution & Handover",
    description:
      "Site supervision, quality control, and a seamless handover — your space, ready to inhabit.",
  },
];

export const aboutContent = {
  heroEyebrow: "About Us",
  heroTitle: "Design Essentials",
  heroSubtitle: "Where Vision Becomes Space",
  mission:
    "We believe every space has a story waiting to be told. Design Essentials exists to uncover that story — through rigorous design thinking, material honesty, and an unwavering commitment to delivering spaces that inspire the people who inhabit them.",
  storyIntro:
    "Founded in 2016, Design Essentials began with a single conviction: that exceptional architectural design should be accessible, efficient, and deeply personal. What started as a small studio in Noida has grown into a full-service practice spanning six design domains and over fifty completed projects across India.",
  philosophyPillars: [
    {
      title: "Innovation",
      description:
        "We push boundaries — pre-engineered systems, container architecture, and immersive experience design are not compromises, they are innovations.",
    },
    {
      title: "Sustainability",
      description:
        "Every material choice, every structural decision is evaluated through the lens of environmental responsibility and long-term durability.",
    },
    {
      title: "Precision",
      description:
        "From the first sketch to the final handover, we hold ourselves to a standard of detail that leaves nothing to chance.",
    },
  ] satisfies PhilosophyPillar[],
  ecoHeading: "Sustainable by Design",
  ecoBody:
    "Sustainability is not a feature we add — it is embedded in how we think about every project. Pre-engineered construction reduces on-site waste by up to 60%. Container repurposing gives industrial materials a second life. Our material library prioritises locally sourced, low-VOC, and recyclable options wherever specification allows.",
};

export const milestones: Milestone[] = [
  {
    year: "2016",
    title: "Studio Founded",
    description:
      "Design Essentials established in Noida with a focus on residential pre-engineered homes.",
  },
  {
    year: "2018",
    title: "First Institutional Project",
    description:
      "Completed our first museum interior project, expanding into institutional design.",
  },
  {
    year: "2020",
    title: "Container Architecture Launch",
    description:
      "Introduced container architecture as a core service, completing three residential and commercial projects.",
  },
  {
    year: "2022",
    title: "Experience Center Specialisation",
    description:
      "Launched dedicated experience center design practice, serving technology and automotive clients.",
  },
  {
    year: "2024",
    title: "50+ Projects Milestone",
    description:
      "Crossed 50 completed projects across six design domains, with a team of 12 architects and designers.",
  },
];

export const teamMembers: TeamMember[] = [
  {
    id: "founder",
    name: "Ar. [Founder Name]",
    title: "Principal Architect & Founder",
    bio: "With over 15 years of experience in architectural design and project delivery, [Founder Name] leads Design Essentials with a vision for design that is both ambitious and grounded.",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
  },
  {
    id: "design-lead",
    name: "Ar. [Design Lead]",
    title: "Design Director",
    bio: "Specialising in institutional and exhibition design, [Design Lead] brings a curatorial eye and technical rigour to every project in the studio's portfolio.",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80",
  },
  {
    id: "project-lead",
    name: "[Project Lead Name]",
    title: "Head of Project Delivery",
    bio: "Ensuring every project moves from concept to completion on schedule and within specification, [Project Lead Name] manages vendor relationships and on-site quality control.",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&q=80",
  },
];

export const blogPosts: BlogPost[] = [
  {
    id: "blog-1",
    slug: "future-of-pre-engineered-homes",
    title: "The Future of Pre-Engineered Homes in India",
    excerpt:
      "Why factory-precision construction is reshaping residential architecture — and what it means for homeowners seeking quality without compromise.",
    category: "Architecture",
    date: "2024-11-15",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
    seo: {
      metaTitle: "The Future of Pre-Engineered Homes | Design Essentials Blog",
      metaDescription:
        "Explore how pre-engineered construction is reshaping residential architecture in India.",
    },
  },
  {
    id: "blog-2",
    slug: "container-architecture-sustainability",
    title: "Container Architecture: Sustainability Meets Bold Design",
    excerpt:
      "Shipping containers are more than industrial relics — they are a sustainable building block for the next generation of architecture.",
    category: "Sustainability",
    date: "2024-10-02",
    image:
      "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800&q=80",
    seo: {
      metaTitle: "Container Architecture & Sustainability | Design Essentials Blog",
      metaDescription:
        "How container architecture combines sustainability with bold, bespoke design.",
    },
  },
  {
    id: "blog-3",
    slug: "designing-immersive-experience-centers",
    title: "Designing Immersive Experience Centers That Convert",
    excerpt:
      "The principles behind experience center design that creates emotional connections and drives measurable business outcomes.",
    category: "Experience Design",
    date: "2024-09-18",
    image:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&q=80",
    seo: {
      metaTitle: "Designing Experience Centers | Design Essentials Blog",
      metaDescription:
        "Principles for experience center design that creates emotional connections and drives conversion.",
    },
  },
];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return findBySlug(blogPosts, slug);
}

export const marqueeItems = [
  "PRE-ENGINEERED HOMES",
  "CONTAINER HOUSES",
  "MUSEUM INTERIORS",
  "EXHIBITION DESIGN",
  "DEMO CENTERS",
  "EXPERIENCE CENTERS",
  "OFFICE INTERIORS",
];

export const homeAboutContent = {
  eyebrow: "ABOUT US",
  headingItalic: "Tell Stories",
  headingRest: "Designing Spaces That",
  paragraphs: [
    "Design Essentials is a full-service architectural and interior design firm. We craft environments that inspire — from pre-engineered homes to immersive experience centers.",
    "Our approach combines rigorous design thinking with efficient delivery, ensuring every project reflects your vision without compromise on quality or timeline.",
  ],
  stats: "50+ Projects · 8+ Years · 6 Design Domains",
  ctaLabel: "About Design Essentials →",
  image:
    "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=900&q=80",
  imageAlt:
    "Moody architectural interior showcasing Design Essentials design philosophy",
};

export const heroContent = {
  eyebrow: "Architecture · Interiors · Experience Design",
  titleBefore: "Where Vision",
  titleItalic: "Becomes",
  titleAfter: "Space",
  subtitle:
    "Design Essentials crafts environments that inspire — from pre-engineered homes to immersive experience centers.",
  ctaPrimary: "Start Your Project",
  ctaSecondary: "View Our Work ↓",
  backgroundImage:
    "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1920&q=80",
  backgroundAlt: "Dramatic architectural interior with warm lighting",
};

export const contactCtaContent = {
  headingItalic: "Mind?",
  headingRest: "Have a Space in",
  subtext: "Let's design something remarkable together.",
  ctaLabel: "Start Your Project",
};
