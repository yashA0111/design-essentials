import { getContactConfig } from "../src/lib/config/server";
import { getSql } from "../src/lib/db/client";
import { zohoFetch } from "../src/lib/zoho/client";
async function main() {
 const config = getContactConfig(); const baseRequired = ["databaseUrl", "idempotencySecret", "abuseSecret", "cronSecret"] as const;
 const zohoRequired = config.zohoEnabled ? (["zohoDataCenter", "zohoClientId", "zohoClientSecret", "zohoRefreshToken", "zohoLayoutId", "zohoProjectField"] as const) : [];
 const inviteRequired = config.form2Enabled ? (["form2BaseUrl", "resendApiKey", "resendFrom"] as const) : [];
 const emailRequired = config.emailEnabled ? (["resendApiKey", "resendFrom", "internalRecipient"] as const) : [];
 const missing = [...baseRequired, ...zohoRequired, ...inviteRequired, ...emailRequired].filter((key) => !config[key]); if (missing.length) throw new Error(`Missing required configuration: ${missing.join(", ")}`);
 if ((config.zohoEnabled || config.form2Enabled) && !process.env.CONTACT_TOKEN_ENCRYPTION_KEY) throw new Error("CONTACT_TOKEN_ENCRYPTION_KEY is required when Zoho or Form 2 is enabled");
 await getSql()`SELECT 1`;
 if (config.zohoEnabled) {
   const [fieldsResponse, layoutsResponse] = await Promise.all([zohoFetch("/settings/fields?module=Leads"), zohoFetch("/settings/layouts?module=Leads")]);
   const fields = await fieldsResponse.json() as { fields?: Array<{ api_name?: string }> }; const layouts = await layoutsResponse.json() as { layouts?: Array<{ id?: string; sections?: Array<{ fields?: Array<{ api_name?: string; required?: boolean; system_mandatory?: boolean; private?: boolean }> }> }> };
   const supplied = new Set(["First_Name", "Last_Name", "Email", "Phone", "Company", "Lead_Source", "Lead_Status", config.zohoProjectField]); const absent = [...supplied].filter((name) => !fields.fields?.some((field) => field.api_name === name)); if (absent.length) throw new Error(`Zoho Lead fields missing: ${absent.join(", ")}`);
   const layout = layouts.layouts?.find((candidate) => candidate.id === config.zohoLayoutId); if (!layout) throw new Error("Configured Zoho layout was not found");
   const unsatisfied = layout.sections?.flatMap((section) => section.fields ?? []).filter((field) => field.required && !field.system_mandatory && !field.private && field.api_name && !supplied.has(field.api_name)).map((field) => field.api_name) ?? []; if (unsatisfied.length) throw new Error(`Zoho layout has unsatisfied required fields: ${unsatisfied.join(", ")}`);
 }
 console.log("Contact pipeline preflight passed (no secret values were printed).");
}
main().catch((error) => { console.error(error instanceof Error ? error.message : "Preflight failed"); process.exitCode = 1; });
