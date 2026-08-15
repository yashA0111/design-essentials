/** PII-safe structured event sink. Callers pass IDs/codes only, never payloads or URLs. */
export function contactPipelineEvent(event: string, fields: Record<string, string | number | boolean | undefined>) {
  const safe = Object.fromEntries(Object.entries(fields).filter(([, value]) => value !== undefined));
  console.info(JSON.stringify({ event, ...safe }));
}
