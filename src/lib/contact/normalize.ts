import { createHmac } from "node:crypto";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { z } from "zod";

export type RawContactInput = { fullName: string; email: string; phone: string; enquiry: string };
export type NormalizedContact = RawContactInput & { normalizedFullName: string; normalizedEmail: string; normalizedPhone: string; normalizedEnquiry: string; firstName: string; lastName: string };

const hasForbiddenControl = (value: string, allowTabsAndNewlines = false) => /[\p{Cc}\p{Cs}]/u.test(allowTabsAndNewlines ? value.replace(/[\t\n]/g, "") : value);
const unicodeTrim = (value: string) => value.replace(/^\s+|\s+$/gu, "");

export function splitZohoName(name: string) {
  const tokens = name.split(" ");
  if (tokens.length === 1) {
    // Zoho layouts commonly require First_Name. Duplicate mononyms intentionally;
    // this is a required-field compatibility fallback, not identity normalization.
    return { firstName: tokens[0], lastName: tokens[0] };
  }
  return { firstName: tokens.slice(0, -1).join(" "), lastName: tokens.at(-1)! };
}

export function normalizeContactInput(raw: RawContactInput): NormalizedContact {
  const normalizedFullName = unicodeTrim(raw.fullName.normalize("NFKC")).replace(/\s+/gu, " ");
  const normalizedEmail = unicodeTrim(raw.email.normalize("NFKC")).toLowerCase();
  const phoneSource = unicodeTrim(raw.phone.normalize("NFKC")).replace(/^00/, "+");
  const normalizedEnquiry = unicodeTrim(raw.enquiry.normalize("NFKC").replace(/\r\n?/g, "\n"));
  if (normalizedFullName.length < 2 || normalizedFullName.length > 120 || hasForbiddenControl(normalizedFullName)) throw new Error("CONTACT_INVALID");
  if (normalizedEmail.length > 254 || !z.string().email().safeParse(normalizedEmail).success) throw new Error("CONTACT_INVALID");
  if (normalizedEnquiry.length < 10 || normalizedEnquiry.length > 4000 || hasForbiddenControl(normalizedEnquiry, true)) throw new Error("CONTACT_INVALID");
  if (/\b(?:ext\.?|extension|x)\s*\d+/iu.test(phoneSource)) throw new Error("CONTACT_INVALID");
  const parsedPhone = parsePhoneNumberFromString(phoneSource, phoneSource.startsWith("+") ? undefined : "IN");
  if (!parsedPhone?.isValid() || !parsedPhone.number.startsWith("+")) throw new Error("CONTACT_INVALID");
  const { firstName, lastName } = splitZohoName(normalizedFullName);
  return { ...raw, normalizedFullName, normalizedEmail, normalizedPhone: parsedPhone.number, normalizedEnquiry, firstName, lastName };
}

/** HMAC of length-prefixed canonical fields eliminates delimiter ambiguity. */
export function contactPayloadDigest(input: NormalizedContact, secret: string) {
  const payload = [input.normalizedFullName, input.normalizedEmail, input.normalizedPhone, input.normalizedEnquiry].map((v) => `${Buffer.byteLength(v, "utf8")}:${v}`).join("");
  return createHmac("sha256", secret).update(payload).digest("hex");
}

export function advisoryLockKey(value: string, secret: string) {
  const digest = createHmac("sha256", secret).update(value).digest();
  return BigInt.asIntN(64, digest.readBigInt64BE(0)).toString();
}
