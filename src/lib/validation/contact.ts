import { z } from "zod";
import { DEFAULT_COUNTRY_CODE, SUPPORTED_COUNTRY_CODES } from "@/lib/contact/countries";

export const CONTACT_FIELD_LIMITS = { fullName: 120, email: 254, phone: 32, enquiry: 4000 } as const;
const rawString = (max: number) => z.string().max(max);
const countryCode = z
  .string()
  .trim()
  .toUpperCase()
  .refine((value) => SUPPORTED_COUNTRY_CODES.has(value), "Please select a valid country");
const phoneShape = rawString(CONTACT_FIELD_LIMITS.phone)
  .trim()
  .min(1, "Please enter a valid phone number")
  .regex(/^\+?[\d][\d\s().-]*$/, "Please enter a valid phone number");

/**
 * Client-safe field validation. Full national-number validation is performed by
 * server-side libphonenumber-js normalization using countryCode.
 */
export const contactSchema = z.object({
  fullName: rawString(CONTACT_FIELD_LIMITS.fullName).trim().min(2, "Full name is required"),
  email: rawString(CONTACT_FIELD_LIMITS.email).trim().email("Please enter a valid email address"),
  phone: phoneShape,
  countryCode: countryCode.optional(),
  enquiry: rawString(CONTACT_FIELD_LIMITS.enquiry).trim().min(10, "Please provide at least 10 characters"),
  website: z.string().optional(),
});
/** Request clients that predate country selection continue to default to India. */
export const contactRequestSchema = contactSchema.extend({ countryCode: countryCode.default(DEFAULT_COUNTRY_CODE), submissionId: z.string().uuid().optional() });
export type ContactFormData = z.infer<typeof contactSchema>;
export type ContactRequestData = z.infer<typeof contactRequestSchema>;
