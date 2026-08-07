import { afterEach, describe, expect, it, vi } from "vitest";

async function loadRobots(baseUrl?: string) {
  vi.resetModules();
  if (baseUrl === undefined) {
    delete process.env.NEXT_PUBLIC_SITE_URL;
  } else {
    process.env.NEXT_PUBLIC_SITE_URL = baseUrl;
  }
  const mod = await import("@/app/robots");
  return mod.default();
}

const originalSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;

afterEach(() => {
  if (originalSiteUrl === undefined) {
    delete process.env.NEXT_PUBLIC_SITE_URL;
  } else {
    process.env.NEXT_PUBLIC_SITE_URL = originalSiteUrl;
  }
});

describe("robots", () => {
  it("allows all user agents to crawl the whole site", async () => {
    const robots = await loadRobots();
    expect(robots.rules).toEqual({ userAgent: "*", allow: "/" });
  });

  it("points at the sitemap on the default base url", async () => {
    const robots = await loadRobots();
    expect(robots.sitemap).toBe("https://designessentials.in/sitemap.xml");
  });

  it("points at the sitemap on NEXT_PUBLIC_SITE_URL when set", async () => {
    const robots = await loadRobots("https://staging.example.com");
    expect(robots.sitemap).toBe("https://staging.example.com/sitemap.xml");
  });
});
