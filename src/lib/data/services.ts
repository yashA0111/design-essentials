import type { Service } from "@/types/service";
import { findById, findBySlug } from "@/lib/data/query";

export const services: Service[] = [
  {
    id: "pre-engineered-homes",
    slug: "pre-engineered-homes",
    name: "Pre-Engineered Homes",
    tagline: "Modern Living, Engineered to Perfection",
    description:
      "Factory-precision meets architectural vision. Our pre-engineered homes deliver faster build times, superior quality control, and exceptional design tailored to your lifestyle and site conditions.",
    shortDescription:
      "Factory-precision homes with faster timelines and complete design-to-delivery.",
    icon: "House",
    heroImage:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80",
    cardImage:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
    features: [
      "Faster construction timelines (30–50% faster than conventional)",
      "Precision-engineered structural components",
      "Eco-conscious material selection",
      "Complete architectural design + execution",
      "Custom floor plans and elevations",
    ],
    process: [
      {
        step: 1,
        title: "Site Assessment",
        description:
          "We evaluate topography, orientation, and local regulations to define the optimal build strategy.",
      },
      {
        step: 2,
        title: "Architectural Design",
        description:
          "Concept through detailed drawings — floor plans, elevations, and material palettes tailored to you.",
      },
      {
        step: 3,
        title: "Engineering & Fabrication",
        description:
          "Structural engineering and off-site fabrication ensure precision before anything reaches your site.",
      },
      {
        step: 4,
        title: "Assembly & Fit-Out",
        description:
          "On-site assembly, MEP integration, and interior fit-out — delivered turnkey.",
      },
    ],
    seo: {
      metaTitle: "Pre-Engineered Homes | Design Essentials",
      metaDescription:
        "Modern pre-engineered homes designed and delivered by Design Essentials. Faster build, precision quality, complete architectural solutions.",
      keywords: [
        "pre engineered homes",
        "modern homes india",
        "architectural design",
        "prefab homes",
      ],
    },
  },
  {
    id: "container-architecture",
    slug: "container-architecture",
    name: "Container Architecture",
    tagline: "Industrial Soul, Architectural Heart",
    description:
      "Repurposed shipping containers transformed into stunning residential and commercial spaces. Bold, sustainable, and completely bespoke — container architecture redefines what a building can be.",
    shortDescription:
      "Shipping containers transformed into bold, sustainable bespoke spaces.",
    icon: "Container",
    heroImage:
      "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=1600&q=80",
    cardImage:
      "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800&q=80",
    features: [
      "Structural repurposing of ISO shipping containers",
      "Custom cladding, glazing, and green roof integration",
      "Modular and expandable layouts",
      "High-end interior fit-out within the shell",
      "Significantly lower carbon footprint",
    ],
    process: [
      {
        step: 1,
        title: "Concept & Feasibility",
        description:
          "We assess container count, stacking configuration, and structural requirements for your brief.",
      },
      {
        step: 2,
        title: "Design Development",
        description:
          "Exterior cladding, glazing strategy, and interior spatial planning within the modular shell.",
      },
      {
        step: 3,
        title: "Fabrication",
        description:
          "Off-site modification, insulation, and MEP rough-in before transport to site.",
      },
      {
        step: 4,
        title: "Installation",
        description:
          "Crane placement, connection, and final interior fit-out on your prepared foundation.",
      },
    ],
    seo: {
      metaTitle: "Container Architecture | Design Essentials",
      metaDescription:
        "Bold container architecture by Design Essentials — sustainable, modular spaces for residential and commercial use across India.",
      keywords: [
        "container architecture",
        "container house india",
        "modular architecture",
        "sustainable design",
      ],
    },
  },
  {
    id: "institutional-interiors",
    slug: "institutional-interiors",
    name: "Museum & Institutional Interiors",
    tagline: "Spaces That Educate, Inspire, and Endure",
    description:
      "We design museum galleries, cultural institutions, and educational environments that balance curatorial requirements with immersive visitor experience — spaces built to last decades.",
    shortDescription:
      "Museum and institutional interiors that educate, inspire, and endure.",
    icon: "Landmark",
    heroImage:
      "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1600&q=80",
    cardImage:
      "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80",
    features: [
      "Curatorial flow and visitor journey mapping",
      "Climate-controlled display environments",
      "Acoustic and lighting design integration",
      "Durable, low-maintenance material specification",
      "Accessibility and wayfinding systems",
    ],
    process: [
      {
        step: 1,
        title: "Brief & Programming",
        description:
          "Understanding collection requirements, visitor demographics, and institutional goals.",
      },
      {
        step: 2,
        title: "Spatial Concept",
        description:
          "Gallery layouts, circulation paths, and thematic zoning for optimal visitor flow.",
      },
      {
        step: 3,
        title: "Technical Design",
        description:
          "Lighting, HVAC, display systems, and material specifications for long-term durability.",
      },
      {
        step: 4,
        title: "Execution",
        description:
          "Vendor coordination, site supervision, and commissioning of all interior systems.",
      },
    ],
    seo: {
      metaTitle: "Museum & Institutional Interiors | Design Essentials",
      metaDescription:
        "Museum and institutional interior design by Design Essentials — immersive, durable spaces for cultural and educational institutions.",
      keywords: [
        "museum interior design",
        "institutional interiors",
        "gallery design india",
        "cultural space design",
      ],
    },
  },
  {
    id: "exhibition-design",
    slug: "exhibition-design",
    name: "Exhibition & Demo Centers",
    tagline: "Designed to Captivate, Built to Impress",
    description:
      "From trade show pavilions to permanent demo centers, we create exhibition environments that stop visitors in their tracks and communicate your brand story with clarity and impact.",
    shortDescription:
      "Exhibition and demo environments designed to captivate and convert.",
    icon: "Presentation",
    heroImage:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=80",
    cardImage:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
    features: [
      "Brand narrative and spatial storytelling",
      "Modular and reusable booth systems",
      "Interactive display integration",
      "Rapid deployment for trade shows",
      "Permanent demo center design",
    ],
    process: [
      {
        step: 1,
        title: "Brand Immersion",
        description:
          "Deep dive into your brand, products, and target audience to define the spatial narrative.",
      },
      {
        step: 2,
        title: "Concept Design",
        description:
          "3D visualizations, material boards, and visitor flow diagrams for stakeholder approval.",
      },
      {
        step: 3,
        title: "Technical Documentation",
        description:
          "Fabrication drawings, MEP coordination, and vendor specifications.",
      },
      {
        step: 4,
        title: "Build & Launch",
        description:
          "On-site assembly, AV integration, and launch-day support.",
      },
    ],
    seo: {
      metaTitle: "Exhibition & Demo Centers | Design Essentials",
      metaDescription:
        "Exhibition and demo center design by Design Essentials — captivating brand environments for trade shows and permanent installations.",
      keywords: [
        "exhibition design",
        "demo center design",
        "trade show booth",
        "brand experience india",
      ],
    },
  },
  {
    id: "experience-centers",
    slug: "experience-centers",
    name: "Experience Centers",
    tagline: "Immersive Environments That Tell Your Brand Story",
    description:
      "Experience centers go beyond display — they immerse visitors in your brand world. We design multi-sensory environments that create lasting emotional connections and drive conversion.",
    shortDescription:
      "Multi-sensory brand environments that create lasting connections.",
    icon: "Layers",
    heroImage:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1600&q=80",
    cardImage:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&q=80",
    features: [
      "Multi-sensory spatial design",
      "Interactive technology integration",
      "Customer journey mapping",
      "Premium material and finish specification",
      "Post-launch analytics and optimization",
    ],
    process: [
      {
        step: 1,
        title: "Experience Strategy",
        description:
          "Mapping the customer journey and defining key touchpoints and emotional beats.",
      },
      {
        step: 2,
        title: "Immersive Design",
        description:
          "Spatial zones, lighting sequences, and interactive moments designed as a cohesive narrative.",
      },
      {
        step: 3,
        title: "Technology Integration",
        description:
          "AV, digital displays, and interactive systems coordinated with spatial design.",
      },
      {
        step: 4,
        title: "Delivery & Handover",
        description:
          "Full build supervision, staff training, and post-launch optimization support.",
      },
    ],
    seo: {
      metaTitle: "Experience Centers | Design Essentials",
      metaDescription:
        "Immersive experience center design by Design Essentials — multi-sensory brand environments that drive engagement and conversion.",
      keywords: [
        "experience center design",
        "brand experience",
        "immersive design",
        "customer experience india",
      ],
    },
  },
  {
    id: "office-interiors",
    slug: "office-interiors",
    name: "Office Interiors",
    tagline: "Workspaces Designed for Performance",
    description:
      "We design office environments that balance productivity, culture, and wellbeing. From startup studios to corporate headquarters, every workspace reflects your organization's identity and ambitions.",
    shortDescription:
      "Productivity-focused workspaces that reflect your organization's identity.",
    icon: "Building2",
    heroImage:
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1600&q=80",
    cardImage:
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80",
    features: [
      "Workplace strategy and space planning",
      "Acoustic and privacy zoning",
      "Biophilic and wellness design integration",
      "Flexible and hybrid work configurations",
      "Complete FF&E specification and procurement",
    ],
    process: [
      {
        step: 1,
        title: "Workplace Analysis",
        description:
          "Understanding team structure, work patterns, and growth projections to inform space planning.",
      },
      {
        step: 2,
        title: "Concept & Layout",
        description:
          "Zoning, furniture planning, and material direction aligned with your brand identity.",
      },
      {
        step: 3,
        title: "Detailed Design",
        description:
          "MEP coordination, custom joinery drawings, and FF&E specifications.",
      },
      {
        step: 4,
        title: "Build & Move-In",
        description:
          "Site supervision, vendor coordination, and seamless move-in support.",
      },
    ],
    seo: {
      metaTitle: "Office Interiors | Design Essentials",
      metaDescription:
        "Office interior design by Design Essentials — performance-driven workspaces for startups and corporate headquarters across India.",
      keywords: [
        "office interior design",
        "workplace design india",
        "corporate interiors",
        "office fit-out",
      ],
    },
  },
];

export function getServiceBySlug(slug: string): Service | undefined {
  return findBySlug(services, slug);
}

export function getServiceById(id: string): Service | undefined {
  return findById(services, id);
}
