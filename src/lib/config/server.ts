
const bool = (value: string | undefined) => value === "true";
const integer = (value: string | undefined, fallback: number) => {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
};

/** Server-only contact pipeline configuration. Integrations are deliberately off by default. */
export function getContactConfig() {
  return {
    databaseUrl: process.env.DATABASE_URL,
    idempotencySecret: process.env.CONTACT_IDEMPOTENCY_SECRET,
    abuseSecret: process.env.CONTACT_ABUSE_HMAC_SECRET,
    privacyNoticeVersion: process.env.CONTACT_PRIVACY_NOTICE_VERSION ?? "v1",
    rawRetentionDays: integer(process.env.CONTACT_RAW_RETENTION_DAYS, 90),
    cronSecret: process.env.CRON_SECRET,
    batchSize: Math.min(integer(process.env.CONTACT_JOB_BATCH_SIZE, 8), 20),
    workerBudgetMs: Math.min(integer(process.env.CONTACT_WORKER_BUDGET_MS, 45_000), 45_000),
    emailEnabled: bool(process.env.CONTACT_WORKER_EMAIL_ENABLED),
    zohoEnabled: bool(process.env.CONTACT_WORKER_ZOHO_ENABLED),
    form2Enabled: bool(process.env.CONTACT_WORKER_FORM2_ENABLED),
    resendApiKey: process.env.RESEND_API_KEY,
    resendFrom: process.env.CONTACT_RESEND_FROM,
    internalRecipient: process.env.CONTACT_INTERNAL_RECIPIENT,
    form2BaseUrl: process.env.FORM2_BASE_URL,
    form2TtlHours: integer(process.env.FORM2_TOKEN_TTL_HOURS, 168),
    zohoDataCenter: process.env.ZOHO_DATA_CENTER,
    zohoClientId: process.env.ZOHO_CLIENT_ID,
    zohoClientSecret: process.env.ZOHO_CLIENT_SECRET,
    zohoRefreshToken: process.env.ZOHO_REFRESH_TOKEN,
    zohoLayoutId: process.env.ZOHO_LEAD_LAYOUT_ID,
    zohoProjectField: process.env.ZOHO_PROJECT_DISCOVERY_FIELD,
    zohoCompany: process.env.ZOHO_DEFAULT_COMPANY ?? "Individual – Website Enquiry",
    zohoLeadSource: process.env.ZOHO_LEAD_SOURCE ?? "Website",
    zohoLeadStatus: process.env.ZOHO_LEAD_STATUS ?? "Not Contacted",
  };
}

export type ContactConfig = ReturnType<typeof getContactConfig>;
