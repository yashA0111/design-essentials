import { getContactConfig } from "@/lib/config/server";
import { getSql } from "@/lib/db/client";
import { JobFailure } from "@/lib/jobs/types";
import { zohoFetch } from "./client";

type ZohoLead = { id: string };
type ZohoResult = { code?: string; details?: { id?: string }; message?: string };
async function bodyOrEmpty(response: Response): Promise<{ data?: ZohoResult[] }> { if (response.status === 204 || !response.headers.get("content-type")?.includes("json")) return {}; return response.json() as Promise<{ data?: ZohoResult[] }>; }
function resultId(body: { data?: ZohoResult[] }) { const result = body.data?.[0]; if (!result || !["SUCCESS", "DUPLICATE_DATA"].includes(result.code ?? "")) return undefined; return result.details?.id; }
function nationalPhone(value: string) { return value.replace(/^\+91/, ""); }
async function search(field: "Email" | "Phone", value: string): Promise<ZohoLead[]> { const result = await zohoFetch(`/Leads/search?criteria=${encodeURIComponent(`(${field}:equals:${value})`)}`); return ((await bodyOrEmpty(result)).data ?? []) as ZohoLead[]; }
async function reconcile(email: string, phone: string) { const phoneValues = [...new Set([phone, nationalPhone(phone)])]; const matches = await Promise.all([search("Email", email), ...phoneValues.map((value) => search("Phone", value))]); const ids = new Set(matches.flat().map((match) => match.id)); if (ids.size > 1 || matches.some((match) => match.length > 1)) throw new JobFailure("ZOHO_IDENTITY_CONFLICT", false); return ids.values().next().value as string | undefined; }
async function write(method: "POST" | "PUT", path: string, record: object) { const response = await zohoFetch(path, { method, body: JSON.stringify({ data: [record] }) }); const body = await bodyOrEmpty(response); const result = body.data?.[0]; if (result && result.code && !["SUCCESS", "DUPLICATE_DATA"].includes(result.code)) throw new JobFailure(`ZOHO_${result.code}`, false); return resultId(body); }
export async function syncZohoLead(enquiryId: string, leadId: string) {
 const config = getContactConfig(); if (!config.zohoEnabled) throw new JobFailure("ZOHO_DISABLED", true, 60_000); if (!config.zohoProjectField || !config.zohoLayoutId) throw new JobFailure("ZOHO_FIELD_CONFIG", false);
 const sql = getSql(); const rows = await sql<{ zoho_lead_id: string | null; first_name: string; last_name: string; normalized_email: string; normalized_phone: string; normalized_enquiry: string }[]>`SELECT l.zoho_lead_id, e.first_name, e.last_name, e.normalized_email, e.normalized_phone, e.normalized_enquiry FROM enquiries e JOIN leads l ON l.id = e.lead_id WHERE e.id = ${enquiryId}::uuid AND l.id = ${leadId}::uuid`;
 const lead = rows[0]; if (!lead) throw new JobFailure("LEAD_NOT_FOUND", false);
 const record = { First_Name: lead.first_name, Last_Name: lead.last_name, Email: lead.normalized_email, Phone: lead.normalized_phone, Company: config.zohoCompany, Lead_Source: config.zohoLeadSource, Lead_Status: config.zohoLeadStatus, [config.zohoProjectField]: lead.normalized_enquiry, Layout: { id: config.zohoLayoutId } };
 let zohoId = lead.zoho_lead_id ?? undefined;
 if (zohoId) { const responseId = await write("PUT", `/Leads/${zohoId}`, record); zohoId = responseId ?? zohoId; }
 else {
   zohoId = await reconcile(lead.normalized_email, lead.normalized_phone);
   if (zohoId) await write("PUT", `/Leads/${zohoId}`, record);
   else { const created = await write("POST", "/Leads", record); zohoId = created; if (!zohoId) { /* stale duplicate/create ambiguity: reconcile before retrying. */ zohoId = await reconcile(lead.normalized_email, lead.normalized_phone); if (!zohoId) throw new JobFailure("ZOHO_MALFORMED_RESPONSE", false); } }
 }
 try { await sql`UPDATE leads SET zoho_lead_id = ${zohoId}, zoho_synced_at = now(), zoho_sync_version = zoho_sync_version + 1, updated_at = now() WHERE id = ${leadId}::uuid`; } catch (error) { if ((error as { code?: string }).code === "23505") throw new JobFailure("ZOHO_LOCAL_ID_CONFLICT", false); throw error; }
 return zohoId;
}
