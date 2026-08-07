import { describe, expect, it } from "vitest";
import { getServiceById, getServiceBySlug, services } from "@/lib/data/services";

describe("services data", () => {
  it("has unique ids and slugs", () => {
    expect(new Set(services.map((s) => s.id)).size).toBe(services.length);
    expect(new Set(services.map((s) => s.slug)).size).toBe(services.length);
  });

  it("numbers process steps sequentially from 1", () => {
    for (const service of services) {
      expect(service.process.map((p) => p.step)).toEqual(
        service.process.map((_, index) => index + 1)
      );
    }
  });

  it("gives every service seo keywords", () => {
    for (const service of services) {
      expect(service.seo.keywords.length).toBeGreaterThan(0);
    }
  });
});

describe("getServiceBySlug", () => {
  it("returns the service matching the slug", () => {
    const service = services[0];
    expect(getServiceBySlug(service.slug)).toBe(service);
  });

  it("returns undefined for an unknown slug", () => {
    expect(getServiceBySlug("no-such-service")).toBeUndefined();
  });

  it("is case sensitive", () => {
    expect(getServiceBySlug(services[0].slug.toUpperCase())).toBeUndefined();
  });
});

describe("getServiceById", () => {
  it("returns the service matching the id", () => {
    const service = services[1];
    expect(getServiceById(service.id)).toBe(service);
  });

  it("returns undefined for an unknown id", () => {
    expect(getServiceById("no-such-id")).toBeUndefined();
  });
});
