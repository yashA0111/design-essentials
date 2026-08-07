import { beforeEach, describe, expect, it } from "vitest";
import { getClientIp, rateLimit, resetRateLimits } from "./rate-limit";

describe("rateLimit", () => {
  beforeEach(() => {
    resetRateLimits();
  });

  it("allows requests up to the limit and blocks the next one", () => {
    const results = Array.from({ length: 3 }, () =>
      rateLimit("key", 2, 1000, 0)
    );
    expect(results.map((r) => r.allowed)).toEqual([true, true, false]);
    expect(results[2].retryAfterSeconds).toBe(1);
  });

  it("starts a fresh window once the previous one expires", () => {
    rateLimit("key", 1, 1000, 0);
    expect(rateLimit("key", 1, 1000, 500).allowed).toBe(false);
    expect(rateLimit("key", 1, 1000, 1500).allowed).toBe(true);
  });

  it("tracks keys independently", () => {
    rateLimit("a", 1, 1000, 0);
    expect(rateLimit("b", 1, 1000, 0).allowed).toBe(true);
  });
});

describe("getClientIp", () => {
  it("prefers the first x-forwarded-for entry", () => {
    const request = new Request("https://example.com", {
      headers: { "x-forwarded-for": "203.0.113.5, 70.41.3.18" },
    });
    expect(getClientIp(request)).toBe("203.0.113.5");
  });

  it("falls back to x-real-ip and then to a placeholder", () => {
    const withRealIp = new Request("https://example.com", {
      headers: { "x-real-ip": "198.51.100.7" },
    });
    expect(getClientIp(withRealIp)).toBe("198.51.100.7");
    expect(getClientIp(new Request("https://example.com"))).toBe("unknown");
  });
});
