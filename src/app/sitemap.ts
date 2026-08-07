import type { MetadataRoute } from "next";
import { services } from "@/lib/data/services";
import { projects } from "@/lib/data/projects";
import { blogPosts } from "@/lib/data/siteContent";
import { SITE_URL } from "@/lib/constants";

type SitemapEntry = MetadataRoute.Sitemap[number];

function entry(
  path: string,
  changeFrequency: SitemapEntry["changeFrequency"],
  priority: number
): SitemapEntry {
  return {
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  };
}

function collectionEntries(
  items: readonly { slug: string }[],
  basePath: string,
  priority: number
): MetadataRoute.Sitemap {
  return items.map((item) =>
    entry(`${basePath}/${item.slug}`, "monthly", priority)
  );
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    entry("", "weekly", 1),
    entry("/about", "monthly", 0.9),
    entry("/services", "monthly", 0.9),
    entry("/projects", "monthly", 0.8),
    entry("/contact", "monthly", 0.7),
    entry("/blog", "weekly", 0.7),
    ...collectionEntries(services, "/services", 0.8),
    ...collectionEntries(projects, "/projects", 0.7),
    ...collectionEntries(blogPosts, "/blog", 0.6),
  ];
}
