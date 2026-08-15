CREATE TYPE "public"."identity_kind" AS ENUM('email', 'phone');--> statement-breakpoint
CREATE TYPE "public"."job_kind" AS ENUM('acknowledgment_email', 'internal_notification', 'zoho_lead_sync', 'form2_invitation');--> statement-breakpoint
CREATE TYPE "public"."job_status" AS ENUM('blocked', 'pending', 'running', 'retry', 'succeeded', 'dead', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."resolution_state" AS ENUM('resolved', 'identity_conflict');--> statement-breakpoint
CREATE TABLE "contact_abuse_counters" (
	"bucket" text PRIMARY KEY NOT NULL,
	"count" integer NOT NULL,
	"window_expires_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "enquiries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"submission_id" uuid NOT NULL,
	"payload_digest" text NOT NULL,
	"lead_id" uuid,
	"resolution_state" "resolution_state" NOT NULL,
	"conflicting_lead_ids" uuid[] DEFAULT ARRAY[]::uuid[] NOT NULL,
	"raw_full_name" text,
	"raw_email" text,
	"raw_phone" text,
	"raw_enquiry" text,
	"normalized_full_name" text NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"normalized_email" text NOT NULL,
	"normalized_phone" text NOT NULL,
	"normalized_enquiry" text NOT NULL,
	"privacy_notice_version" text NOT NULL,
	"consented_at" timestamp with time zone DEFAULT now() NOT NULL,
	"raw_purge_after" timestamp with time zone NOT NULL,
	"raw_purged_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "enquiries_submission_id_unique" UNIQUE("submission_id"),
	CONSTRAINT "enquiries_resolution_consistency" CHECK (("enquiries"."resolution_state" = 'resolved' AND "enquiries"."lead_id" IS NOT NULL AND cardinality("enquiries"."conflicting_lead_ids") = 0) OR ("enquiries"."resolution_state" = 'identity_conflict' AND "enquiries"."lead_id" IS NULL AND cardinality("enquiries"."conflicting_lead_ids") = 2))
);
--> statement-breakpoint
CREATE TABLE "form2_invites" (
	"id" uuid PRIMARY KEY NOT NULL,
	"lead_id" uuid NOT NULL,
	"enquiry_id" uuid NOT NULL,
	"purpose" text DEFAULT 'form2' NOT NULL,
	"token_version" integer DEFAULT 1 NOT NULL,
	"token_hash" text NOT NULL,
	"encrypted_verifier" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"sent_at" timestamp with time zone,
	"consumed_at" timestamp with time zone,
	"revoked_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "form2_invites_token_hash_unique" UNIQUE("token_hash"),
	CONSTRAINT "form2_invites_purpose_check" CHECK ("form2_invites"."purpose" = 'form2')
);
--> statement-breakpoint
CREATE TABLE "lead_identities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lead_id" uuid NOT NULL,
	"kind" "identity_kind" NOT NULL,
	"normalized_value" text NOT NULL,
	"is_current" integer DEFAULT 1 NOT NULL,
	"first_seen_enquiry_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_seen_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "leads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"display_name" text NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"zoho_lead_id" text,
	"zoho_synced_at" timestamp with time zone,
	"zoho_sync_version" integer DEFAULT 0 NOT NULL,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "leads_zoho_lead_id_unique" UNIQUE("zoho_lead_id")
);
--> statement-breakpoint
CREATE TABLE "provider_tokens" (
	"provider" text PRIMARY KEY NOT NULL,
	"access_token" text,
	"expires_at" timestamp with time zone,
	"refresh_locked_until" timestamp with time zone,
	"refresh_attempted_at" timestamp with time zone,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"metadata" jsonb
);
--> statement-breakpoint
CREATE TABLE "workflow_jobs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"enquiry_id" uuid NOT NULL,
	"lead_id" uuid,
	"kind" "job_kind" NOT NULL,
	"status" "job_status" NOT NULL,
	"dedupe_key" text NOT NULL,
	"prerequisite_job_id" uuid,
	"attempt_count" integer DEFAULT 0 NOT NULL,
	"max_attempts" integer NOT NULL,
	"next_attempt_at" timestamp with time zone DEFAULT now() NOT NULL,
	"locked_at" timestamp with time zone,
	"lease_expires_at" timestamp with time zone,
	"locked_by" uuid,
	"provider_record_id" text,
	"last_error_code" text,
	"last_error_class" text,
	"last_error_at" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "workflow_jobs_dedupe_key_unique" UNIQUE("dedupe_key")
);
--> statement-breakpoint
ALTER TABLE "enquiries" ADD CONSTRAINT "enquiries_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "form2_invites" ADD CONSTRAINT "form2_invites_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "form2_invites" ADD CONSTRAINT "form2_invites_enquiry_id_enquiries_id_fk" FOREIGN KEY ("enquiry_id") REFERENCES "public"."enquiries"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lead_identities" ADD CONSTRAINT "lead_identities_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lead_identities" ADD CONSTRAINT "lead_identities_first_seen_enquiry_id_enquiries_id_fk" FOREIGN KEY ("first_seen_enquiry_id") REFERENCES "public"."enquiries"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workflow_jobs" ADD CONSTRAINT "workflow_jobs_enquiry_id_enquiries_id_fk" FOREIGN KEY ("enquiry_id") REFERENCES "public"."enquiries"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workflow_jobs" ADD CONSTRAINT "workflow_jobs_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workflow_jobs" ADD CONSTRAINT "workflow_jobs_prerequisite_fk" FOREIGN KEY ("prerequisite_job_id") REFERENCES "public"."workflow_jobs"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "abuse_counter_expiry_idx" ON "contact_abuse_counters" USING btree ("window_expires_at");--> statement-breakpoint
CREATE INDEX "enquiries_lead_idx" ON "enquiries" USING btree ("lead_id");--> statement-breakpoint
CREATE UNIQUE INDEX "form2_invites_one_active_per_enquiry" ON "form2_invites" USING btree ("enquiry_id") WHERE "form2_invites"."consumed_at" IS NULL AND "form2_invites"."revoked_at" IS NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "identity_global_unique" ON "lead_identities" USING btree ("kind","normalized_value");--> statement-breakpoint
CREATE UNIQUE INDEX "identity_current_per_kind" ON "lead_identities" USING btree ("lead_id","kind") WHERE "lead_identities"."is_current" = 1;--> statement-breakpoint
CREATE INDEX "identity_lead_last_seen_idx" ON "lead_identities" USING btree ("lead_id","kind","last_seen_at");--> statement-breakpoint
CREATE INDEX "workflow_jobs_claim_idx" ON "workflow_jobs" USING btree ("status","next_attempt_at","created_at");