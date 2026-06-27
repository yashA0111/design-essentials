import type { ServiceId } from "./service";

export type ProjectSeo = {
  metaTitle: string;
  metaDescription: string;
};

export type Project = {
  id: string;
  slug: string;
  title: string;
  client: string;
  category: ServiceId;
  year: number;
  location: string;
  heroImage: string;
  heroImageFallback?: string;
  galleryImages: string[];
  galleryImageFallbacks?: string[];
  description: string;
  challenge: string;
  solution: string;
  featured: boolean;
  seo: ProjectSeo;
};
