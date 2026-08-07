import { describe, expect, it } from "vitest";
import { stats } from "@/lib/data/stats";
import { testimonials } from "@/lib/data/testimonials";
import { BUDGET_OPTIONS, NAV_LINKS, PROJECT_FILTERS } from "@/lib/constants";
import { projects } from "@/lib/data/projects";
import { services } from "@/lib/data/services";

describe("stats", () => {
  it("has unique ids and non-negative values", () => {
    expect(new Set(stats.map((s) => s.id)).size).toBe(stats.length);
    for (const stat of stats) {
      expect(stat.value).toBeGreaterThanOrEqual(0);
      expect(stat.label).not.toBe("");
    }
  });
});

describe("testimonials", () => {
  it("has unique ids and a quote, client and avatar for each entry", () => {
    expect(new Set(testimonials.map((t) => t.id)).size).toBe(
      testimonials.length
    );
    for (const testimonial of testimonials) {
      expect(testimonial.quote.length).toBeGreaterThan(0);
      expect(testimonial.clientName).not.toBe("");
      expect(testimonial.avatar).toMatch(/^https:\/\//);
    }
  });
});

describe("navigation and filter constants", () => {
  it("uses unique hrefs pointing at internal routes", () => {
    const hrefs = NAV_LINKS.map((link) => link.href);
    expect(new Set(hrefs).size).toBe(hrefs.length);
    expect(hrefs.every((href) => href.startsWith("/"))).toBe(true);
  });

  it("has unique budget option values", () => {
    const values = BUDGET_OPTIONS.map((option) => option.value);
    expect(new Set(values).size).toBe(values.length);
  });

  it('maps every project filter except "all" to a real service id', () => {
    const serviceIds = new Set(services.map((s) => s.id));
    for (const filter of PROJECT_FILTERS.filter((f) => f.value !== "all")) {
      expect(serviceIds.has(filter.value)).toBe(true);
    }
  });
});

describe("cross-collection integrity", () => {
  it("assigns every project a category that is a known service id", () => {
    const serviceIds = new Set(services.map((s) => s.id));
    for (const project of projects) {
      expect(serviceIds.has(project.category)).toBe(true);
    }
  });
});
