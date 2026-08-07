import type { Metadata } from "next";

type EntitySeo = {
  metaTitle: string;
  metaDescription: string;
  keywords?: string[];
};

export function metadataFromSeo(seo: EntitySeo | undefined): Metadata {
  if (!seo) return {};
  return {
    title: seo.metaTitle,
    description: seo.metaDescription,
    ...(seo.keywords ? { keywords: seo.keywords } : {}),
  };
}
