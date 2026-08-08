import { describe, expect, it } from "vitest";
import { advisoryLockKey, contactPayloadDigest, normalizeContactInput, splitZohoName } from "./normalize";
const input = { fullName: "  Åsha\tMenon ", email: " ASHA+Project@Example.COM ", phone: "9876543210", enquiry: "\r\nA studio enquiry\rwith useful detail.\n" };
describe("normalizeContactInput", () => {
 it("makes the one canonical persistence/provider snapshot", () => { const value = normalizeContactInput(input); expect(value).toMatchObject({ normalizedFullName: "Åsha Menon", normalizedEmail: "asha+project@example.com", normalizedPhone: "+919876543210", normalizedEnquiry: "A studio enquiry\nwith useful detail.", firstName: "Åsha", lastName: "Menon" }); });
 it.each(["+44 20 7946 0018", "0091 9876543210", "09876543210"])("accepts canonicalizable phone %s", (phone) => { expect(normalizeContactInput({ ...input, phone }).normalizedPhone).toMatch(/^\+/); });
 it("rejects controls and phone extensions", () => { expect(() => normalizeContactInput({ ...input, fullName: "A\u0000sha" })).toThrow(); expect(() => normalizeContactInput({ ...input, phone: "+91 98765 43210 ext 4" })).toThrow(); });
 it("duplicates a mononym into both Zoho required names", () => expect(splitZohoName("Madonna")).toEqual({ firstName: "Madonna", lastName: "Madonna" }));
 it("uses unambiguous field framing and signed advisory keys", () => { const value = normalizeContactInput(input); expect(contactPayloadDigest(value, "key")).not.toEqual(contactPayloadDigest({ ...value, normalizedFullName: "Åsha Menonx" }, "key")); expect(BigInt(advisoryLockKey("email:a@example.com", "key"))).toBeGreaterThanOrEqual(-(BigInt(2) ** BigInt(63))); });
});
