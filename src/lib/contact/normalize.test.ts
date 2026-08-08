import { describe, expect, it } from "vitest";
import { advisoryLockKey, contactPayloadDigest, normalizeContactInput, splitZohoName } from "./normalize";
const input = { fullName: "  Åsha\tMenon ", email: " ASHA+Project@Example.COM ", phone: "9876543210", enquiry: "\r\nA studio enquiry\rwith useful detail.\n" };

describe("normalizeContactInput", () => {
  it("makes the canonical persistence/provider snapshot with India as the compatibility default", () => {
    const value = normalizeContactInput(input);
    expect(value).toMatchObject({ countryCode: "IN", normalizedFullName: "Åsha Menon", normalizedEmail: "asha+project@example.com", normalizedPhone: "+919876543210", normalizedEnquiry: "A studio enquiry\nwith useful detail.", firstName: "Åsha", lastName: "Menon" });
  });

  it.each([
    ["NO", "21 23 45 67", "+4721234567"],
    ["DK", "20 12 34 56", "+4520123456"],
    ["SG", "8123 4567", "+6581234567"],
  ])("normalizes a valid short national number for %s", (countryCode, phone, normalizedPhone) => {
    expect(normalizeContactInput({ ...input, countryCode, phone }).normalizedPhone).toBe(normalizedPhone);
  });

  it("uses the selected country for local phone input", () => {
    expect(normalizeContactInput({ ...input, phone: "020 7946 0018", countryCode: "GB" }).normalizedPhone).toBe("+442079460018");
  });

  it("keeps explicit international numbers canonical regardless of selected country", () => {
    expect(normalizeContactInput({ ...input, phone: "+44 20 7946 0018", countryCode: "IN" }).normalizedPhone).toBe("+442079460018");
  });

  it.each(["+44 20 7946 0018", "0091 9876543210", "09876543210"])("accepts canonicalizable phone %s", (phone) => {
    expect(normalizeContactInput({ ...input, phone }).normalizedPhone).toMatch(/^\+/);
  });

  it("rejects invalid countries, controls, and phone extensions", () => {
    expect(() => normalizeContactInput({ ...input, countryCode: "XX" })).toThrow();
    expect(() => normalizeContactInput({ ...input, fullName: "A\u0000sha" })).toThrow();
    expect(() => normalizeContactInput({ ...input, phone: "+91 98765 43210 ext 4" })).toThrow();
  });

  it("does not include country selection in the canonical identity digest", () => {
    const value = normalizeContactInput(input);
    expect(contactPayloadDigest(value, "key")).toEqual(contactPayloadDigest({ ...value, countryCode: "GB" }, "key"));
  });

  it("duplicates a mononym into both Zoho required names", () => {
    expect(splitZohoName("Madonna")).toEqual({ firstName: "Madonna", lastName: "Madonna" });
  });

  it("uses unambiguous field framing and signed advisory keys", () => {
    const value = normalizeContactInput(input);
    expect(contactPayloadDigest(value, "key")).not.toEqual(contactPayloadDigest({ ...value, normalizedFullName: "Åsha Menonx" }, "key"));
    expect(BigInt(advisoryLockKey("email:a@example.com", "key"))).toBeGreaterThanOrEqual(-(BigInt(2) ** BigInt(63)));
  });
});
