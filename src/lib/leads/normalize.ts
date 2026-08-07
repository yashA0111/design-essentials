import type { CountryCode } from "libphonenumber-js";
import type { ContactFormData } from "@/lib/validation/contact";

type LeadName = {
  firstName: string | null;
  lastName: string;
};

export type WebsiteLeadStagingInsert = {
  email: string;
  normalized_phone: string;
  first_name: string | null;
  last_name: string;
  country_code: CountryCode;
  form_1_payload: {
    full_name: string;
    email: string;
    phone: string;
    country_code: CountryCode;
    geo_country_code?: CountryCode;
    timezone?: string;
    enquiry: string;
  };
};

export function splitLeadName(fullName: string): LeadName {
  const normalized = fullName.trim().replace(/\s+/g, " ");
  const firstSpaceIndex = normalized.indexOf(" ");

  if (firstSpaceIndex === -1) {
    return { firstName: null, lastName: normalized };
  }

  return {
    firstName: normalized.slice(0, firstSpaceIndex),
    lastName: normalized.slice(firstSpaceIndex + 1),
  };
}

export function buildWebsiteLeadPayload(
  data: ContactFormData
): WebsiteLeadStagingInsert {
  const { firstName, lastName } = splitLeadName(data.fullName);

  return {
    email: data.email,
    normalized_phone: data.phone,
    first_name: firstName,
    last_name: lastName,
    country_code: data.phoneCountry,
    form_1_payload: {
      full_name: data.fullName,
      email: data.email,
      phone: data.phone,
      country_code: data.phoneCountry,
      ...(data.geoCountryCode ? { geo_country_code: data.geoCountryCode } : {}),
      ...(data.timezone ? { timezone: data.timezone } : {}),
      enquiry: data.enquiry,
    },
  };
}
