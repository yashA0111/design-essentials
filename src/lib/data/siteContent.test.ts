import { describe, expect, it } from "vitest";
import {
  blogPosts,
  getBlogPostBySlug,
  marqueeItems,
  processSteps,
} from "@/lib/data/siteContent";

describe("getBlogPostBySlug", () => {
  it("returns the post matching the slug", () => {
    const post = blogPosts[0];
    expect(getBlogPostBySlug(post.slug)).toBe(post);
  });

  it("returns undefined for an unknown slug", () => {
    expect(getBlogPostBySlug("no-such-post")).toBeUndefined();
  });

  it("returns undefined for an empty slug", () => {
    expect(getBlogPostBySlug("")).toBeUndefined();
  });
});

describe("blogPosts", () => {
  it("has unique ids and slugs", () => {
    expect(new Set(blogPosts.map((p) => p.id)).size).toBe(blogPosts.length);
    expect(new Set(blogPosts.map((p) => p.slug)).size).toBe(blogPosts.length);
  });

  it("uses parseable ISO dates", () => {
    for (const post of blogPosts) {
      expect(post.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(Number.isNaN(Date.parse(post.date))).toBe(false);
    }
  });
});

describe("processSteps", () => {
  it("is numbered sequentially from 1", () => {
    expect(processSteps.map((s) => s.step)).toEqual(
      processSteps.map((_, index) => index + 1)
    );
  });
});

describe("marqueeItems", () => {
  it("is a non-empty list of uppercase labels", () => {
    expect(marqueeItems.length).toBeGreaterThan(0);
    for (const item of marqueeItems) {
      expect(item).toBe(item.toUpperCase());
    }
  });
});
