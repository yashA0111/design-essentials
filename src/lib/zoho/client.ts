import { getContactConfig } from "@/lib/config/server";
import { JobFailure } from "@/lib/jobs/types";
import { getZohoAccessToken, zohoApiDomains } from "./auth";
export async function zohoFetch(path: string, init: RequestInit = {}, retried = false) {
 const domain = zohoApiDomains[getContactConfig().zohoDataCenter?.toUpperCase() ?? ""]; if (!domain) throw new JobFailure("ZOHO_DATA_CENTER", false);
 let response: Response; try { response = await fetch(`${domain}/crm/v8${path}`, { ...init, headers: { ...init.headers, Authorization: `Zoho-oauthtoken ${await getZohoAccessToken(retried)}`, "content-type": "application/json" }, signal: AbortSignal.timeout(12_000) }); } catch { throw new JobFailure("ZOHO_NETWORK", true); }
 if (response.status === 401 && !retried) return zohoFetch(path, init, true);
 if (response.status === 429) throw new JobFailure("ZOHO_THROTTLED", true, Number(response.headers.get("retry-after") ?? 1) * 1000);
 if (response.status >= 500) throw new JobFailure("ZOHO_UNAVAILABLE", true);
 if (!response.ok) throw new JobFailure("ZOHO_REQUEST_INVALID", false);
 return response;
}
