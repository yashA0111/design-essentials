# Design Essentials contact lead pipeline

The contact form is database-first: accepted submissions return only after the canonical lead/enquiry and transactional outbox jobs are committed. Provider work is at-least-once, so Resend uses idempotency keys and Zoho reconciliation is deliberately search-first.

## Local setup

```bash
corepack pnpm install
cp .env.example .env.local
corepack pnpm db:generate
corepack pnpm db:migrate
corepack pnpm jobs:preflight
```

`DATABASE_URL` must be the pooled TLS URL used at runtime; use `DATABASE_MIGRATION_URL` only if the provider requires a direct connection for migrations. The Postgres client disables prepared statements for pooled/serverless compatibility.

## External scheduler (required)

Vercel Hobby cron is intentionally not configured. Configure an external scheduler (GitHub Actions, cron-job.org, Better Uptime, etc.) to `POST` every **1–5 minutes** to:

```text
https://YOUR_DEPLOYMENT/api/cron/contact-pipeline
Authorization: Bearer $CRON_SECRET
```

The route is authenticated, claims a small leased batch, and stops starting work inside a 45-second budget. Claimed jobs have a 90-second lease, intentionally longer than the work budget and below Vercel’s `maxDuration=60`, so a process crash is safely reclaimable rather than racing a still-running invocation. It is safe for overlapping invocations and has no minute cron in `vercel.json`.

## Enablement and Zoho preflight

1. Apply the migration and leave all `CONTACT_WORKER_*_ENABLED` flags `false`.
2. Submit a synthetic contact, confirm one enquiry and durable jobs, then remove the synthetic PII.
3. Configure Resend and enable email jobs.
4. In a Zoho sandbox, run `corepack pnpm jobs:preflight`. It checks fields and the configured layout. Validate picklist values and perform a one-record sandbox dry run before production.
5. Enable Zoho, then configure the external Form 2 destination and enable invitations.

Zoho synchronization always searches Email and Phone separately before creating/updating. It **does not use multi-field upsert**. A duplicate that maps to different or multiple Zoho Leads produces `ZOHO_IDENTITY_CONFLICT`, marks the Zoho job dead, cancels its dependent invitation with `ZOHO_DEPENDENCY_DEAD`, and requires review. `Salutation` is intentionally omitted. `First_Name` is supplied for a mononym by duplicating its normalized token into both First_Name and Last_Name because some layouts make First_Name mandatory.

## Repair and requeue

For an identity conflict, verify identities and merge/repair the canonical lead manually; do not move aliases automatically. Resolve duplicate Zoho records in Zoho, set the intended `leads.zoho_lead_id`, then reset only the relevant dead Zoho job to `retry`, clear its error fields, and reset its dependent invitation from `cancelled` to `blocked` if appropriate. Requeue after confirming the repair. Do not requeue an unresolved conflict.

## Retention and erasure

Raw submitted strings are nulled after `CONTACT_RAW_RETENTION_DAYS` (90 default). Canonical enquiry, lead, identity, and job audit records are retained for legitimate business processing; raw purge does **not** erase canonical PII. Each enquiry also retains the selected ISO 3166-1 alpha-2 phone country (`country_code`) to preserve the user’s country context where E.164 calling codes are shared; the normalized E.164 number remains the sole phone identity and idempotency input. For an approved erasure request, transactionally delete pending jobs/invites, enquiries, identities, and then the lead (FKs cascade as configured). Delete/verify the corresponding Zoho Lead separately: V1 is not bidirectional.

## Secrets and rotation

Use random 32-byte secrets. Rotate `CRON_SECRET` through a scheduler update. Rotate idempotency/abuse HMAC secrets only with a bounded overlap strategy because active request/retry keys depend on them. The persisted Zoho access token must be encrypted using `CONTACT_TOKEN_ENCRYPTION_KEY`; rotate by retaining the old decrypt key until active token expiry, then force a refresh. Form 2 tokens are `v1.<invite-id>.<random-verifier>`; the verifier is random and hash-only at rest, and a retry ambiguity revokes/reissues rather than deriving the same link.

## Rollback

Disable worker flags or the external scheduler to stop side effects without losing intake. Keep the additive schema and queued jobs; repair then re-enable workers. Do not down-migrate queued production data.
