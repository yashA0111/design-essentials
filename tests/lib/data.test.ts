import { describe, expect, it } from "vitest";
import {
  getFeaturedProjects,
  getProjectBySlug,
  getRelatedProjects,
  projects,
} from "@/lib/data/projects";
import { getServiceById, getServiceBySlug, services } from "@/lib/data/services";
import { blogPosts, getBlogPostBySlug } from "@/lib/data/siteContent";

describe("content lookups", () => {
  it("resolves projects, services and posts by slug", () => {
    expect(getProjectBySlug(projects[0].slug)?.id).toBe(projects[0].id);
    expect(getServiceBySlug(services[0].slug)?.id).toBe(services[0].id);
    expect(getBlogPostBySlug(blogPosts[0].slug)?.id).toBe(blogPosts[0].id);
  });

  it("returns undefined for unknown slugs", () => {
    expect(getProjectBySlug("nope")).toBeUndefined();
    expect(getServiceBySlug("nope")).toBeUndefined();
    expect(getBlogPostBySlug("nope")).toBeUndefined();
  });

  it("returns only featured projects", () => {
    const featured = getFeaturedProjects();
    expect(featured.length).toBeGreaterThan(0);
    expect(featured.every((p) => p.featured)).toBe(true);
  });

  it("excludes the current project from related projects and honours the limit", () => {
    const [project] = projects;
    const related = getRelatedProjects(project.category, project.slug, 2);
    expect(related.length).toBeLessThanOrEqual(2);
    expect(related.some((p) => p.slug === project.slug)).toBe(false);
    expect(related.every((p) => p.category === project.category)).toBe(true);
  });
});

describe("content integrity", () => {
  it("uses unique slugs", () => {
    const slugs = [
      ...projects.map((p) => p.slug),
      ...services.map((s) => s.slug),
      ...blogPosts.map((p) => p.slug),
    ];
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("points every project at a known service category", () => {
    for (const project of projects) {
      expect(getServiceById(project.category)).toBeDefined();
    }
  });
});
