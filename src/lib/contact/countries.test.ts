import { describe, expect, it } from "vitest";
import { COUNTRY_CALLING_CODE_OPTIONS, DEFAULT_COUNTRY_CODE, SUPPORTED_COUNTRY_CODES } from "./countries";

describe("static country calling-code options", () => {
  it("covers the pinned libphonenumber-js country set with a deterministic order", () => {
    expect(DEFAULT_COUNTRY_CODE).toBe("IN");
    expect(SUPPORTED_COUNTRY_CODES.size).toBe(245);
    expect(COUNTRY_CALLING_CODE_OPTIONS).toHaveLength(245);
    expect(COUNTRY_CALLING_CODE_OPTIONS.slice(0, 3).map(({ code }) => code)).toEqual(["IN", "AF", "AX"]);
    expect(COUNTRY_CALLING_CODE_OPTIONS).toContainEqual({ code: "IN", name: "India", callingCode: "+91" });
    expect(COUNTRY_CALLING_CODE_OPTIONS).toContainEqual({ code: "US", name: "United States", callingCode: "+1" });
  });
});
