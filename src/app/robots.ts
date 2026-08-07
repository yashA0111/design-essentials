import type { MetadataRoute } from "next";
import { SITE } from "@/lib/constants";

const BASE_URL = SITE.url;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
