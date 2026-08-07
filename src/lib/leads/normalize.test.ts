import { describe, expect, it } from "vitest";
import { buildWebsiteLeadPayload, splitLeadName } from "./normalize";

const normalizedLead = {
  fullName: "Asha Menon",
  email: "asha@example.com",
  phone: "+919876543210",
  phoneCountry: "IN" as const,
  geoCountryCode: "IN" as const,
  timezone: "Asia/Kolkata",
  enquiry: "We are planning a container studio in Goa and would like a quote.",
};

describe("lead normalization", () => {
  it("splits full names at the first space", () => {
    expect(splitLeadName("  Asha   Menon Nair  ")).toEqual({
      firstName: "Asha",
      lastName: "Menon Nair",
    });
  });

  it("uses a single provided name as the last name", () => {
    expect(splitLeadName("Cher")).toEqual({ firstName: null, lastName: "Cher" });
  });

  it("builds the website lead staging payload", () => {
    expect(buildWebsiteLeadPayload(normalizedLead)).toEqual({
      email: "asha@example.com",
      normalized_phone: "+919876543210",
      first_name: "Asha",
      last_name: "Menon",
      country_code: "IN",
      form_1_payload: {
        full_name: "Asha Menon",
        email: "asha@example.com",
        phone: "+919876543210",
        country_code: "IN",
        geo_country_code: "IN",
        timezone: "Asia/Kolkata",
        enquiry: "We are planning a container studio in Goa and would like a quote.",
      },
    });
  });
});
