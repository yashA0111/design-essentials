import type { Project } from "@/types/project";

export const projects: Project[] = [
  {
    id: "modern-peb-residence",
    slug: "modern-peb-residence",
    title: "Modern PEB Residence",
    client: "Private Client",
    category: "pre-engineered-homes",
    year: 2024,
    location: "Gurgaon, Haryana",
    heroImage:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=80",
    ],
    description:
      "A 4,200 sq ft pre-engineered home featuring open-plan living, floor-to-ceiling glazing, and a cantilevered terrace — delivered in 14 months from concept to handover.",
    challenge:
      "The client needed a premium home on a tight timeline without compromising architectural quality or energy performance.",
    solution:
      "We leveraged factory-fabricated structural components and a modular MEP strategy, reducing on-site construction time by 40% while achieving an airtight, high-performance envelope.",
    featured: true,
    seo: {
      metaTitle: "Modern PEB Residence | Design Essentials Projects",
      metaDescription:
        "A 4,200 sq ft pre-engineered home in Gurgaon — delivered in 14 months with cantilevered terrace and floor-to-ceiling glazing.",
    },
  },
  {
    id: "container-loft-studio",
    slug: "container-loft-studio",
    title: "Container Loft Studio",
    client: "Creative Agency",
    category: "container-architecture",
    year: 2023,
    location: "Noida, Uttar Pradesh",
    heroImage:
      "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=1600&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
    ],
    description:
      "Six repurposed shipping containers stacked and clad in corten steel, housing a 1,800 sq ft creative studio with double-height atrium and green roof.",
    challenge:
      "Transform an industrial container shell into a premium creative workspace within a constrained urban plot.",
    solution:
      "Strategic stacking created a double-height atrium for natural light, while corten cladding and a green roof softened the industrial aesthetic.",
    featured: true,
    seo: {
      metaTitle: "Container Loft Studio | Design Essentials Projects",
      metaDescription:
        "Six repurposed shipping containers transformed into a premium creative studio in Noida with double-height atrium.",
    },
  },
  {
    id: "heritage-museum-gallery",
    slug: "heritage-museum-gallery",
    title: "Heritage Museum Gallery",
    client: "Cultural Trust",
    category: "institutional-interiors",
    year: 2023,
    location: "Jaipur, Rajasthan",
    heroImage:
      "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1600&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200&q=80",
    ],
    description:
      "A 12,000 sq ft permanent gallery within a restored haveli, featuring climate-controlled vitrines, adaptive lighting, and a curated visitor journey through four thematic zones.",
    challenge:
      "Integrate modern museum infrastructure into a 200-year-old heritage building without compromising its architectural integrity.",
    solution:
      "We designed a reversible insert system — all new infrastructure is independent of the heritage fabric and can be removed without damage.",
    featured: true,
    seo: {
      metaTitle: "Heritage Museum Gallery | Design Essentials Projects",
      metaDescription:
        "12,000 sq ft museum gallery within a restored Jaipur haveli — climate-controlled vitrines and adaptive lighting.",
    },
  },
  {
    id: "auto-expo-pavilion",
    slug: "auto-expo-pavilion",
    title: "Auto Expo Pavilion",
    client: "Automotive Brand",
    category: "exhibition-design",
    year: 2024,
    location: "Greater Noida, Uttar Pradesh",
    heroImage:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80",
      "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=1200&q=80",
    ],
    description:
      "An 8,000 sq ft trade show pavilion featuring a rotating vehicle display platform, immersive LED tunnel, and VIP lounge — attracting 45,000 visitors over five days.",
    challenge:
      "Create maximum visual impact and visitor throughput within a 5-day build window and strict expo regulations.",
    solution:
      "Modular prefabricated panels enabled a 72-hour on-site assembly, while the LED tunnel created a memorable brand moment that drove 3x average dwell time.",
    featured: false,
    seo: {
      metaTitle: "Auto Expo Pavilion | Design Essentials Projects",
      metaDescription:
        "8,000 sq ft automotive trade show pavilion with rotating display platform and immersive LED tunnel.",
    },
  },
  {
    id: "tech-brand-experience-hub",
    slug: "tech-brand-experience-hub",
    title: "Tech Brand Experience Hub",
    client: "Technology Company",
    category: "experience-centers",
    year: 2024,
    location: "Bangalore, Karnataka",
    heroImage:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1600&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200&q=80",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80",
    ],
    description:
      "A 6,500 sq ft permanent experience center with six interactive zones, a product demo theatre, and a customer onboarding lounge — designed to convert visitors into advocates.",
    challenge:
      "Design an experience that works equally for technical buyers, enterprise decision-makers, and end consumers.",
    solution:
      "We created parallel visitor paths with shared anchor moments, allowing each audience segment to engage at their own depth without friction.",
    featured: false,
    seo: {
      metaTitle: "Tech Brand Experience Hub | Design Essentials Projects",
      metaDescription:
        "6,500 sq ft technology experience center in Bangalore with six interactive zones and product demo theatre.",
    },
  },
  {
    id: "corporate-headquarters",
    slug: "corporate-headquarters",
    title: "Corporate Headquarters",
    client: "Financial Services Firm",
    category: "office-interiors",
    year: 2023,
    location: "Mumbai, Maharashtra",
    heroImage:
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1600&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200&q=80",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80",
    ],
    description:
      "A 22,000 sq ft headquarters spanning three floors — open-plan workspaces, executive suites, a town hall, and a wellness lounge with biophilic design throughout.",
    challenge:
      "Consolidate three separate offices into one cohesive headquarters while supporting hybrid work and maintaining acoustic privacy.",
    solution:
      "Activity-based zoning with acoustic pods, phone booths, and a central town hall created flexibility without sacrificing focus or collaboration.",
    featured: false,
    seo: {
      metaTitle: "Corporate Headquarters | Design Essentials Projects",
      metaDescription:
        "22,000 sq ft corporate headquarters in Mumbai with activity-based zoning, biophilic design, and hybrid work support.",
    },
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getFeaturedProjects(): Project[] {
  return projects.filter((p) => p.featured);
}

export function getProjectsByCategory(category: string): Project[] {
  if (category === "all") return projects;
  return projects.filter((p) => p.category === category);
}

export function getRelatedProjects(
  category: string,
  excludeSlug: string,
  limit = 3
): Project[] {
  return projects
    .filter((p) => p.category === category && p.slug !== excludeSlug)
    .slice(0, limit);
}
