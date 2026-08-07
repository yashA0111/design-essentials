import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { projects } from "@/lib/data/projects";
import { services } from "@/lib/data/services";
import { blogPosts } from "@/lib/data/siteContent";

const DEFAULT_BASE_URL = "https://designessentials.in";

async function loadSitemap(baseUrl?: string) {
  vi.resetModules();
  if (baseUrl === undefined) {
    delete process.env.NEXT_PUBLIC_SITE_URL;
  } else {
    process.env.NEXT_PUBLIC_SITE_URL = baseUrl;
  }
  const mod = await import("@/app/sitemap");
  return mod.default();
}

const originalSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2024-05-01T00:00:00.000Z"));
});

afterEach(() => {
  vi.useRealTimers();
  if (originalSiteUrl === undefined) {
    delete process.env.NEXT_PUBLIC_SITE_URL;
  } else {
    process.env.NEXT_PUBLIC_SITE_URL = originalSiteUrl;
  }
});

describe("sitemap", () => {
  it("includes one entry per static route, service, project and blog post", async () => {
    const entries = await loadSitemap();
    expect(entries).toHaveLength(
      6 + services.length + projects.length + blogPosts.length
    );
    expect(new Set(entries.map((e) => e.url)).size).toBe(entries.length);
  });

  it("falls back to the production base url", async () => {
    const entries = await loadSitemap();
    expect(entries[0].url).toBe(DEFAULT_BASE_URL);
    expect(entries.every((e) => e.url.startsWith(DEFAULT_BASE_URL))).toBe(true);
  });

  it("uses NEXT_PUBLIC_SITE_URL when set", async () => {
    const entries = await loadSitemap("https://staging.example.com");
    expect(entries[0].url).toBe("https://staging.example.com");
    expect(
      entries.every((e) => e.url.startsWith("https://staging.example.com"))
    ).toBe(true);
  });

  it("links every service, project and blog detail page", async () => {
    const urls = (await loadSitemap()).map((e) => e.url);
    for (const service of services) {
      expect(urls).toContain(`${DEFAULT_BASE_URL}/services/${service.slug}`);
    }
    for (const project of projects) {
      expect(urls).toContain(`${DEFAULT_BASE_URL}/projects/${project.slug}`);
    }
    for (const post of blogPosts) {
      expect(urls).toContain(`${DEFAULT_BASE_URL}/blog/${post.slug}`);
    }
  });

  it("gives the homepage top priority and stamps lastModified with the current time", async () => {
    const entries = await loadSitemap();
    expect(entries[0].priority).toBe(1);
    for (const entry of entries) {
      expect(entry.priority).toBeGreaterThan(0);
      expect(entry.priority).toBeLessThanOrEqual(1);
      expect(entry.lastModified).toEqual(new Date("2024-05-01T00:00:00.000Z"));
    }
  });
});
