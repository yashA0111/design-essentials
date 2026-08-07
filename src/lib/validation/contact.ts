import {
  isValidPhoneNumber,
  parsePhoneNumberFromString,
  type CountryCode,
} from "libphonenumber-js";
import { z } from "zod";

export const DEFAULT_PHONE_COUNTRY = "IN" satisfies CountryCode;

export const CONTACT_FIELD_LIMITS = {
  fullName: 120,
  email: 254,
  phone: 32,
  enquiry: 4000,
} as const;

const countryCodeSchema = z
  .string()
  .trim()
  .length(2, "Please select a valid country")
  .transform((value) => value.toUpperCase() as CountryCode);

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

export function normalizePhoneNumber(
  phone: string,
  countryCode: CountryCode = DEFAULT_PHONE_COUNTRY
) {
  const parsed = parsePhoneNumberFromString(phone.trim(), countryCode);

  if (!parsed?.isValid()) {
    return null;
  }

  return parsed.number;
}

export const contactSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, "Full name is required")
      .max(CONTACT_FIELD_LIMITS.fullName, "Full name is too long"),
    email: z
      .string()
      .trim()
      .max(CONTACT_FIELD_LIMITS.email, "Email address is too long")
      .email("Please enter a valid email address")
      .transform(normalizeEmail),
    phone: z
      .string()
      .trim()
      .min(8, "Please enter a valid phone number")
      .max(CONTACT_FIELD_LIMITS.phone, "Please enter a valid phone number"),
    phoneCountry: countryCodeSchema.default(DEFAULT_PHONE_COUNTRY),
    geoCountryCode: countryCodeSchema.optional(),
    timezone: z.string().trim().max(80).optional(),
    enquiry: z
      .string()
      .trim()
      .min(10, "Please provide at least 10 characters")
      .max(CONTACT_FIELD_LIMITS.enquiry, "Enquiry is too long"),
    // Honeypot — real users never see this field; a non-empty value means a bot
    website: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (!isValidPhoneNumber(data.phone, data.phoneCountry)) {
      ctx.addIssue({
        code: "custom",
        path: ["phone"],
        message: "Please enter a valid phone number",
      });
    }
  })
  .transform((data) => ({
    ...data,
    phone: normalizePhoneNumber(data.phone, data.phoneCountry) ?? data.phone,
  }));

export type ContactFormData = z.input<typeof contactSchema>;
export type NormalizedContactFormData = z.output<typeof contactSchema>;
