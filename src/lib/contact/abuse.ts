import { createHmac } from "node:crypto";
import { getSql } from "@/lib/db/client";

const WINDOW_MS = 10 * 60 * 1000;
const LIMIT = 5;
export function getClientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request.headers.get("x-real-ip")?.trim();
}
function hmac(value: string, secret: string) { return createHmac("sha256", secret).update(value).digest("hex"); }

/** DB-backed counters avoid retaining raw IPs; identity values are normalized before hashing. */
export async function enforceContactAbuseLimit(identity: { email: string; phone: string }, ip: string | undefined, secret: string) {
  const keys = [`identity:${hmac(`${identity.email}|${identity.phone}`, secret)}`];
  if (ip) keys.push(`ip:${hmac(ip, secret)}`);
  const sql = getSql();
  const now = new Date();
  const expires = new Date(now.getTime() + WINDOW_MS);
  for (const key of keys) {
    const rows = await sql<{ count: number; window_expires_at: Date }[]>`
      INSERT INTO contact_abuse_counters (bucket, count, window_expires_at)
      VALUES (${key}, 1, ${expires})
      ON CONFLICT (bucket) DO UPDATE SET
        count = CASE WHEN contact_abuse_counters.window_expires_at <= ${now} THEN 1 ELSE contact_abuse_counters.count + 1 END,
        window_expires_at = CASE WHEN contact_abuse_counters.window_expires_at <= ${now} THEN ${expires} ELSE contact_abuse_counters.window_expires_at END,
        updated_at = now()
      RETURNING count, window_expires_at`;
    if (rows[0].count > LIMIT) return { allowed: false, retryAfterSeconds: Math.max(1, Math.ceil((new Date(rows[0].window_expires_at).getTime() - now.getTime()) / 1000)) };
  }
  return { allowed: true, retryAfterSeconds: Math.ceil(WINDOW_MS / 1000) };
}
