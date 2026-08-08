import { describe, expect, it } from "vitest";
import { CONTACT_FIELD_LIMITS, contactRequestSchema, contactSchema } from "./contact";

const validInput = {
  fullName: "Asha Menon",
  email: "asha@example.com",
  phone: "+91 98765 43210",
  enquiry: "We are planning a container studio in Goa and would like a quote.",
};

describe("contactSchema", () => {
  it("accepts a well-formed enquiry and trims whitespace", () => {
    const parsed = contactSchema.parse({ ...validInput, fullName: "  Asha Menon  " });
    expect(parsed.fullName).toBe("Asha Menon");
  });

  it("accepts short national-phone shapes and delegates country-specific validity to the server", () => {
    for (const phone of ["21 23 45 67", "20 12 34 56", "8123 4567"]) {
      expect(contactSchema.safeParse({ ...validInput, phone }).success).toBe(true);
    }
  });

  it("normalizes a supplied ISO country code and defaults legacy requests to India", () => {
    expect(contactSchema.parse({ ...validInput, countryCode: " gb " }).countryCode).toBe("GB");
    expect(contactRequestSchema.parse(validInput).countryCode).toBe("IN");
  });

  it.each([
    ["fullName", "A"],
    ["email", "not-an-email"],
    ["phone", ""],
    ["phone", "call me"],
    ["countryCode", "India"],
    ["enquiry", "too short"],
  ])("rejects an invalid %s", (field, value) => {
    const result = contactSchema.safeParse({ ...validInput, [field]: value });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.flatten().fieldErrors).toHaveProperty(field);
  });

  it("rejects oversized fields", () => {
    expect(contactSchema.safeParse({ ...validInput, enquiry: "x".repeat(CONTACT_FIELD_LIMITS.enquiry + 1) }).success).toBe(false);
  });

  it("keeps the honeypot value for the caller to inspect", () => {
    expect(contactSchema.parse({ ...validInput, website: "https://spam.example" }).website).toBe("https://spam.example");
  });
});
