import { z } from "zod";

export const CONTACT_FIELD_LIMITS = { fullName: 120, email: 254, phone: 32, enquiry: 4000 } as const;
const rawString = (max: number) => z.string().max(max);
/** Shape-only validation shared with the browser. Server normalization is authoritative. */
export const contactSchema = z.object({
  fullName: rawString(CONTACT_FIELD_LIMITS.fullName).trim().min(2, "Full name is required"),
  email: rawString(CONTACT_FIELD_LIMITS.email).trim().email("Please enter a valid email address"),
  phone: rawString(CONTACT_FIELD_LIMITS.phone).trim().min(10, "Please enter a valid phone number").regex(/^\+?[\d][\d\s().-]*$/, "Please enter a valid phone number"),
  enquiry: rawString(CONTACT_FIELD_LIMITS.enquiry).trim().min(10, "Please provide at least 10 characters"),
  website: z.string().optional(),
});
export const contactRequestSchema = contactSchema.extend({ submissionId: z.string().uuid().optional() });
export type ContactFormData = z.infer<typeof contactSchema>;
export type ContactRequestData = z.infer<typeof contactRequestSchema>;
