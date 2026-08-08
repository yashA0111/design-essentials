import { decryptSecret, encryptSecret } from "@/lib/crypto/secrets";
import { getContactConfig } from "@/lib/config/server";
import { getSql } from "@/lib/db/client";
import { JobFailure } from "@/lib/jobs/types";
const accountsDomains: Record<string, string> = { IN: "https://accounts.zoho.in", US: "https://accounts.zoho.com", EU: "https://accounts.zoho.eu", AU: "https://accounts.zoho.com.au", JP: "https://accounts.zoho.jp", CA: "https://accounts.zohocloud.ca" };
export const zohoApiDomains: Record<string, string> = { IN: "https://www.zohoapis.in", US: "https://www.zohoapis.com", EU: "https://www.zohoapis.eu", AU: "https://www.zohoapis.com.au", JP: "https://www.zohoapis.jp", CA: "https://www.zohoapis.ca" };
export async function getZohoAccessToken(forceRefresh = false) {
 const config = getContactConfig(); const dataCenter = config.zohoDataCenter?.toUpperCase(); const accounts = dataCenter && accountsDomains[dataCenter]; if (!accounts || !config.zohoClientId || !config.zohoClientSecret || !config.zohoRefreshToken) throw new JobFailure("ZOHO_AUTH_CONFIG", false);
 const sql = getSql(); const existing = await sql<{ access_token: string | null; expires_at: Date | null }[]>`SELECT access_token, expires_at FROM provider_tokens WHERE provider = 'zoho'`;
 if (!forceRefresh && existing[0]?.access_token && existing[0].expires_at && new Date(existing[0].expires_at).getTime() > Date.now() + 120_000) { try { return decryptSecret(existing[0].access_token); } catch { /* re-auth rather than expose ciphertext errors */ } }
 const acquired = await sql`INSERT INTO provider_tokens (provider, refresh_locked_until) VALUES ('zoho', now() + interval '30 seconds') ON CONFLICT (provider) DO UPDATE SET refresh_locked_until = now() + interval '30 seconds', refresh_attempted_at = now() WHERE provider_tokens.refresh_locked_until IS NULL OR provider_tokens.refresh_locked_until < now() RETURNING provider`;
 if (!acquired.length) {
   const refreshed = await sql<{ access_token: string | null; expires_at: Date | null }[]>`SELECT access_token, expires_at FROM provider_tokens WHERE provider = 'zoho'`;
   if (refreshed[0]?.access_token && refreshed[0].expires_at && new Date(refreshed[0].expires_at).getTime() > Date.now() + 30_000) return decryptSecret(refreshed[0].access_token);
   throw new JobFailure("ZOHO_REFRESH_IN_PROGRESS", true, 1_000);
 }
 let response: Response; try { response = await fetch(`${accounts}/oauth/v2/token`, { method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ grant_type: "refresh_token", client_id: config.zohoClientId, client_secret: config.zohoClientSecret, refresh_token: config.zohoRefreshToken }), signal: AbortSignal.timeout(10_000) }); } catch { throw new JobFailure("ZOHO_AUTH_NETWORK", true); }
 if (response.status === 429) throw new JobFailure("ZOHO_AUTH_THROTTLED", true, Number(response.headers.get("retry-after") ?? 1) * 1000);
 if (!response.ok) throw new JobFailure("ZOHO_AUTH_FAILED", response.status >= 500);
 const body = await response.json() as { access_token?: string; expires_in_sec?: number }; if (!body.access_token) throw new JobFailure("ZOHO_AUTH_INVALID", false);
 await sql`UPDATE provider_tokens SET access_token = ${encryptSecret(body.access_token)}, expires_at = ${new Date(Date.now() + Math.max(60, (body.expires_in_sec ?? 3600) - 120) * 1000)}, refresh_locked_until = NULL, updated_at = now() WHERE provider = 'zoho'`;
 return body.access_token;
}
