import { describe, expect, it } from "vitest";
import { DEFAULT_PHONE_COUNTRY } from "@/lib/validation/contact";
import { GET } from "./route";

function request(headers?: HeadersInit) {
  return new Request("https://designessentials.in/api/contact/context", {
    headers,
  });
}

describe("GET /api/contact/context", () => {
  it("uses Vercel country headers when available", async () => {
    const response = GET(request({ "x-vercel-ip-country": "ae" }));
    await expect(response.json()).resolves.toEqual({ countryCode: "AE" });
  });

  it("falls back to India when no country header is present", async () => {
    const response = GET(request());
    await expect(response.json()).resolves.toEqual({
      countryCode: DEFAULT_PHONE_COUNTRY,
    });
  });
});
