import { createClient } from "@sanity/client";
import { createImageUrlBuilder } from "@sanity/image-url";
import type { Project } from "@/types/project";
import type { Service } from "@/types/service";
import type { Testimonial } from "@/types/testimonial";
import type { BlogPost, Milestone, PhilosophyPillar, ProcessStep, Stat, TeamMember } from "@/types/site";
import { projects as fallbackProjects } from "./data/projects";
import { services as fallbackServices } from "./data/services";
import { testimonials as fallbackTestimonials } from "./data/testimonials";
import { stats as fallbackStats } from "./data/stats";
import {
  aboutContent as fallbackAboutContent,
  blogPosts as fallbackBlogPosts,
  contactCtaContent as fallbackContactCtaContent,
  ecoSectionContent as fallbackEcoSectionContent,
  heroContent as fallbackHeroContent,
  homeAboutContent as fallbackHomeAboutContent,
  marqueeItems as fallbackMarqueeItems,
  milestones as fallbackMilestones,
  processSteps as fallbackProcessSteps,
  teamMembers as fallbackTeamMembers,
} from "./data/siteContent";

export const sanityClient = createClient({
  projectId:
    (typeof import.meta !== "undefined" && import.meta.env?.PUBLIC_SANITY_PROJECT_ID) ||
    process.env.PUBLIC_SANITY_PROJECT_ID ||
    "dummy-project",
  dataset:
    (typeof import.meta !== "undefined" && import.meta.env?.PUBLIC_SANITY_DATASET) ||
    process.env.PUBLIC_SANITY_DATASET ||
    "production",
  useCdn: true,
  apiVersion: "2024-01-01",
});

const builder = createImageUrlBuilder(sanityClient);

export type SanityImageSource = Parameters<ReturnType<typeof createImageUrlBuilder>["image"]>[0];

export function urlForImage(source: SanityImageSource) {
  return builder.image(source);
}

export function getImageUrl(image: any, fallback: string = ""): string {
  if (!image) return fallback;
  if (typeof image === "string") return image;
  try {
    return urlForImage(image).auto("format").fit("max").url();
  } catch {
    return fallback;
  }
}

/**
 * Fetch all projects from Sanity with fallback to static mock data
 */
export async function getProjects(): Promise<Project[]> {
  try {
    const query = `*[_type == "project"] | order(order asc, year desc) {
      "id": _id,
      "slug": slug.current,
      title,
      client,
      category,
      year,
      location,
      "heroImage": heroImage.asset->url,
      "galleryImages": galleryImages[].asset->url,
      description,
      challenge,
      solution,
      featured,
      seo
    }`;
    const data = await sanityClient.fetch<Project[]>(query);
    if (data && data.length > 0) {
      return data.map((item) => {
        const fallback = fallbackProjects.find((p) => p.slug === item.slug) || fallbackProjects[0];
        return {
          ...fallback,
          ...item,
          heroImage: item.heroImage || fallback.heroImage || fallback.heroImageFallback || "",
          heroImageFallback: fallback.heroImageFallback,
          galleryImages: (item.galleryImages && item.galleryImages.filter(Boolean).length > 0)
            ? item.galleryImages.filter(Boolean)
            : fallback.galleryImages,
          galleryImageFallbacks: fallback.galleryImageFallbacks,
        };
      });
    }
  } catch (err) {
    console.warn("[Sanity] Falling back to static projects data:", err);
  }
  return fallbackProjects;
}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  const all = await getProjects();
  return all.find((p) => p.slug === slug);
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const all = await getProjects();
  const featured = all.filter((p) => p.featured);
  return featured.length > 0 ? featured : all.slice(0, 3);
}

/**
 * Fetch all services from Sanity with fallback to static mock data
 */
export async function getServices(): Promise<Service[]> {
  try {
    const query = `*[_type == "service"] | order(order asc) {
      "id": _id,
      "slug": slug.current,
      name,
      tagline,
      shortDescription,
      description,
      icon,
      "heroImage": heroImage.asset->url,
      "cardImage": cardImage.asset->url,
      features,
      process,
      seo
    }`;
    const data = await sanityClient.fetch<Service[]>(query);
    if (data && data.length > 0) {
      return data.map((item) => {
        const fallback = fallbackServices.find((s) => s.slug === item.slug || s.id === item.id) || fallbackServices[0];
        return {
          ...fallback,
          ...item,
          id: fallback.id,
          heroImage: item.heroImage || fallback.heroImage || fallback.heroImageFallback || "",
          heroImageFallback: fallback.heroImageFallback,
          cardImage: item.cardImage || fallback.cardImage || fallback.cardImageFallback || "",
          cardImageFallback: fallback.cardImageFallback,
        };
      });
    }
  } catch (err) {
    console.warn("[Sanity] Falling back to static services data:", err);
  }
  return fallbackServices;
}

export async function getServiceBySlug(slug: string): Promise<Service | undefined> {
  const all = await getServices();
  return all.find((s) => s.slug === slug);
}

/**
 * Fetch all testimonials from Sanity with fallback to static mock data
 */
export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const query = `*[_type == "testimonial"] | order(order asc) {
      "id": _id,
      clientName,
      company,
      quote,
      "avatar": avatar.asset->url
    }`;
    const data = await sanityClient.fetch<Testimonial[]>(query);
    if (data && data.length > 0) {
      return data.map((item, idx) => {
        const fallback = fallbackTestimonials[idx] || fallbackTestimonials.find((t) => t.clientName === item.clientName) || fallbackTestimonials[0];
        return {
          ...fallback,
          ...item,
          avatar: item.avatar || fallback.avatar,
        };
      });
    }
  } catch (err) {
    console.warn("[Sanity] Falling back to static testimonials data:", err);
  }
  return fallbackTestimonials;
}

/**
 * Fetch stats from Sanity with fallback
 */
export async function getStats(): Promise<Stat[]> {
  try {
    const query = `*[_type == "siteSettings"][0].stats[] {
      "id": label,
      value,
      suffix,
      label
    }`;
    const data = await sanityClient.fetch<Stat[]>(query);
    if (data && data.length > 0) {
      return data;
    }
  } catch (err) {
    console.warn("[Sanity] Falling back to static stats data:", err);
  }
  return fallbackStats;
}

/**
 * Fetch global site settings (phone, email, address, socials, contact page)
 */
export async function getSiteSettings() {
  try {
    const query = `*[_type == "siteSettings"][0] {
      title,
      phone,
      email,
      address,
      instagramUrl,
      linkedinUrl,
      behanceUrl,
      pinterestUrl,
      contactPage
    }`;
    const data = await sanityClient.fetch(query);
    if (data) {
      return data;
    }
  } catch (err) {
    console.warn("[Sanity] Falling back to default site settings:", err);
  }
  return null;
}

/**
 * Fetch Home Page content from Sanity
 */
export async function getHomePageContent() {
  try {
    const query = `*[_type == "homePage"][0] {
      hero {
        eyebrow,
        titleBefore,
        titleItalic,
        titleAfter,
        subtitle,
        "backgroundImage": backgroundImage.asset->url,
        "backgroundAlt": backgroundImage.alt,
        ctaPrimary,
        ctaSecondary
      },
      aboutSnippet {
        eyebrow,
        headingRest,
        headingItalic,
        paragraphs,
        stats,
        ctaLabel,
        "image": image.asset->url,
        "imageAlt": image.alt
      },
      marquee,
      processSteps,
      ecoSection,
      contactCta
    }`;
    const data = await sanityClient.fetch(query);
    if (data) {
      return {
        hero: {
          ...fallbackHeroContent,
          ...(data.hero?.titleBefore ? data.hero : {}),
          backgroundImage: data.hero?.backgroundImage || fallbackHeroContent.backgroundImage,
        },
        aboutSnippet: {
          ...fallbackHomeAboutContent,
          ...(data.aboutSnippet?.headingRest ? data.aboutSnippet : {}),
          image: data.aboutSnippet?.image || fallbackHomeAboutContent.image,
        },
        marquee: data.marquee && data.marquee.length > 0 ? data.marquee : fallbackMarqueeItems,
        processSteps: data.processSteps && data.processSteps.length > 0 ? data.processSteps : fallbackProcessSteps,
        ecoSection: {
          ...fallbackEcoSectionContent,
          ...(data.ecoSection?.headingRest ? data.ecoSection : {}),
        },
        contactCta: {
          ...fallbackContactCtaContent,
          ...(data.contactCta?.headingRest ? data.contactCta : {}),
        },
      };
    }
  } catch (err) {
    console.warn("[Sanity] Falling back to static home page data:", err);
  }
  return {
    hero: fallbackHeroContent,
    aboutSnippet: fallbackHomeAboutContent,
    marquee: fallbackMarqueeItems,
    processSteps: fallbackProcessSteps,
    ecoSection: fallbackEcoSectionContent,
    contactCta: fallbackContactCtaContent,
  };
}

/**
 * Fetch About Page content from Sanity
 */
export async function getAboutPageContent() {
  try {
    const query = `*[_type == "aboutPage"][0] {
      heroEyebrow,
      heroTitle,
      heroSubtitle,
      "heroImage": heroImage.asset->url,
      mission,
      storyIntro,
      philosophyPillars,
      milestones,
      "teamMembers": teamMembers[] {
        name,
        title,
        bio,
        "image": image.asset->url
      },
      ecoHeading,
      ecoBody,
      seo
    }`;
    const data = await sanityClient.fetch(query);
    if (data && (data.heroTitle || data.mission)) {
      return {
        about: {
          ...fallbackAboutContent,
          heroEyebrow: data.heroEyebrow || fallbackAboutContent.heroEyebrow,
          heroTitle: data.heroTitle || fallbackAboutContent.heroTitle,
          heroSubtitle: data.heroSubtitle || fallbackAboutContent.heroSubtitle,
          heroImage: data.heroImage || fallbackAboutContent.heroImage,
          mission: data.mission || fallbackAboutContent.mission,
          storyIntro: data.storyIntro || fallbackAboutContent.storyIntro,
          philosophyPillars: (data.philosophyPillars && data.philosophyPillars.length > 0) ? data.philosophyPillars : fallbackAboutContent.philosophyPillars,
          ecoHeading: data.ecoHeading || fallbackAboutContent.ecoHeading,
          ecoBody: data.ecoBody || fallbackAboutContent.ecoBody,
          seo: data.seo || fallbackAboutContent.seo,
        },
        milestones: (data.milestones && data.milestones.length > 0) ? data.milestones : fallbackMilestones,
        teamMembers: (data.teamMembers && data.teamMembers.length > 0)
          ? data.teamMembers.map((m: any, idx: number) => {
              const fallbackMember = fallbackTeamMembers[idx] || fallbackTeamMembers[0];
              return {
                ...fallbackMember,
                ...m,
                image: m.image || fallbackMember.image,
              };
            })
          : fallbackTeamMembers,
      };
    }
  } catch (err) {
    console.warn("[Sanity] Falling back to static about page data:", err);
  }
  return {
    about: fallbackAboutContent,
    milestones: fallbackMilestones,
    teamMembers: fallbackTeamMembers,
  };
}

/**
 * Fetch Blog Posts from Sanity
 */
export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const query = `*[_type == "blogPost"] | order(date desc) {
      "id": _id,
      "slug": slug.current,
      title,
      excerpt,
      body,
      category,
      date,
      "image": image.asset->url,
      seo
    }`;
    const data = await sanityClient.fetch<BlogPost[]>(query);
    if (data && data.length > 0) {
      return data.map((item) => {
        const fallback = fallbackBlogPosts.find((b) => b.slug === item.slug) || fallbackBlogPosts[0];
        return {
          ...fallback,
          ...item,
          image: item.image || fallback.image,
        };
      });
    }
  } catch (err) {
    console.warn("[Sanity] Falling back to static blog data:", err);
  }
  return fallbackBlogPosts;
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
  const all = await getBlogPosts();
  return all.find((b) => b.slug === slug);
}
