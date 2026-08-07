import { describe, expect, it } from "vitest";
import { CONTACT_FIELD_LIMITS, contactSchema } from "./contact";

const validInput = {
  fullName: "Asha Menon",
  email: "asha@example.com",
  phone: "+91 98765 43210",
  phoneCountry: "IN",
  enquiry: "We are planning a container studio in Goa and would like a quote.",
};

describe("contactSchema", () => {
  it("accepts a well-formed enquiry and trims whitespace", () => {
    const parsed = contactSchema.parse({
      ...validInput,
      fullName: "  Asha Menon  ",
      email: "  ASHA@EXAMPLE.COM  ",
    });
    expect(parsed.fullName).toBe("Asha Menon");
    expect(parsed.email).toBe("asha@example.com");
    expect(parsed.phone).toBe("+919876543210");
  });

  it.each([
    ["fullName", "A"],
    ["email", "not-an-email"],
    ["phone", "12345"],
    ["phone", "call me"],
    ["enquiry", "too short"],
  ])("rejects an invalid %s", (field, value) => {
    const result = contactSchema.safeParse({ ...validInput, [field]: value });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors).toHaveProperty(field);
    }
  });

  it("rejects oversized fields", () => {
    const result = contactSchema.safeParse({
      ...validInput,
      enquiry: "x".repeat(CONTACT_FIELD_LIMITS.enquiry + 1),
    });
    expect(result.success).toBe(false);
  });

  it("keeps the honeypot value for the caller to inspect", () => {
    const parsed = contactSchema.parse({
      ...validInput,
      website: "https://spam.example",
    });
    expect(parsed.website).toBe("https://spam.example");
  });
});
