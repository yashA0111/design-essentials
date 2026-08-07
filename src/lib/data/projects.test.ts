import { describe, expect, it } from "vitest";
import {
  getFeaturedProjects,
  getProjectBySlug,
  getProjectsByCategory,
  getRelatedProjects,
  projects,
} from "@/lib/data/projects";

describe("projects data", () => {
  it("has unique ids and slugs", () => {
    expect(new Set(projects.map((p) => p.id)).size).toBe(projects.length);
    expect(new Set(projects.map((p) => p.slug)).size).toBe(projects.length);
  });
});

describe("getProjectBySlug", () => {
  it("returns the project matching the slug", () => {
    const project = projects[0];
    expect(getProjectBySlug(project.slug)).toBe(project);
  });

  it("returns undefined for an unknown slug", () => {
    expect(getProjectBySlug("no-such-project")).toBeUndefined();
  });

  it("matches slugs exactly rather than partially", () => {
    expect(getProjectBySlug(projects[0].slug.slice(0, 3))).toBeUndefined();
  });
});

describe("getFeaturedProjects", () => {
  it("returns only featured projects", () => {
    const featured = getFeaturedProjects();
    expect(featured.length).toBeGreaterThan(0);
    expect(featured.every((p) => p.featured)).toBe(true);
    expect(featured).toHaveLength(projects.filter((p) => p.featured).length);
  });

  it("does not mutate the source list", () => {
    getFeaturedProjects().pop();
    expect(getFeaturedProjects()).toHaveLength(
      projects.filter((p) => p.featured).length
    );
  });
});

describe("getProjectsByCategory", () => {
  it('returns every project for the "all" category', () => {
    expect(getProjectsByCategory("all")).toEqual(projects);
  });

  it("filters to a single category", () => {
    const category = projects[0].category;
    const result = getProjectsByCategory(category);
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((p) => p.category === category)).toBe(true);
  });

  it("returns an empty list for an unknown category", () => {
    expect(getProjectsByCategory("unknown-category")).toEqual([]);
  });
});

describe("getRelatedProjects", () => {
  it("excludes the current project and keeps the category", () => {
    const project = projects[0];
    const related = getRelatedProjects(project.category, project.slug);
    expect(related.every((p) => p.category === project.category)).toBe(true);
    expect(related.some((p) => p.slug === project.slug)).toBe(false);
  });

  it("caps results at the limit", () => {
    const category = projects[0].category;
    expect(getRelatedProjects(category, "none", 1)).toHaveLength(1);
  });

  it("defaults the limit to 3", () => {
    expect(
      getRelatedProjects(projects[0].category, "none").length
    ).toBeLessThanOrEqual(3);
  });

  it("returns an empty list for an unknown category", () => {
    expect(getRelatedProjects("unknown-category", "none")).toEqual([]);
  });

  it("returns an empty list when the limit is zero", () => {
    expect(getRelatedProjects(projects[0].category, "none", 0)).toEqual([]);
  });
});
