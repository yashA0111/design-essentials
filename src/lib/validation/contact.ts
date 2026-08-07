import { z } from "zod";

export const CONTACT_FIELD_LIMITS = {
  fullName: 120,
  email: 254,
  phone: 24,
  enquiry: 4000,
} as const;

export const contactSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Full name is required")
    .max(CONTACT_FIELD_LIMITS.fullName, "Full name is too long"),
  email: z
    .string()
    .trim()
    .max(CONTACT_FIELD_LIMITS.email, "Email address is too long")
    .email("Please enter a valid email address"),
  phone: z
    .string()
    .trim()
    .min(10, "Please enter a valid phone number")
    .max(CONTACT_FIELD_LIMITS.phone, "Please enter a valid phone number")
    .regex(/^[+\d][\d\s()-]*$/, "Please enter a valid phone number"),
  enquiry: z
    .string()
    .trim()
    .min(10, "Please provide at least 10 characters")
    .max(CONTACT_FIELD_LIMITS.enquiry, "Enquiry is too long"),
  // Honeypot — real users never see this field; a non-empty value means a bot
  website: z.string().optional(),
});

export type ContactFormData = z.infer<typeof contactSchema>;
