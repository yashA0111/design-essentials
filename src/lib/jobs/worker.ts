import { randomUUID } from "node:crypto";
import { getContactConfig } from "@/lib/config/server";
import { sendContactEmail } from "@/lib/email/send";
import { JobFailure } from "./types";
import { sendForm2Invitation } from "@/lib/form2/invitations";
import { claimJobs, completeJob, failJob, purgeRetainedData, releaseJobWithoutAttempt } from "./repository";
import { syncZohoLead } from "@/lib/zoho/lead-sync";
import { contactPipelineEvent } from "@/lib/observability/contact-pipeline";

export async function runContactWorker() {
 const config = getContactConfig(); const startedAt = Date.now(); const workerId = randomUUID();
 const enabledKinds = [
   ...(config.emailEnabled ? ["acknowledgment_email", "internal_notification"] as const : []),
   ...(config.zohoEnabled ? ["zoho_lead_sync"] as const : []),
   ...(config.form2Enabled ? ["form2_invitation"] as const : []),
 ];
 const jobs = await claimJobs(workerId, config.batchSize, enabledKinds);
 for (const job of jobs) contactPipelineEvent("job.claimed", { jobId: job.id, enquiryId: job.enquiry_id, kind: job.kind, attempt: job.attempt_count });
 let succeeded = 0; let retried = 0; let dead = 0;
 for (const job of jobs) {
   if (Date.now() - startedAt >= config.workerBudgetMs) { await releaseJobWithoutAttempt(job); continue; }
   try {
     let providerId: string | undefined;
     if (job.kind === "acknowledgment_email" || job.kind === "internal_notification") { providerId = await sendContactEmail(job.kind, job.enquiry_id); contactPipelineEvent("email.sent", { enquiryId: job.enquiry_id, kind: job.kind }); }
     else if (job.kind === "zoho_lead_sync") { if (!job.lead_id) throw new JobFailure("LEAD_NOT_FOUND", false); providerId = await syncZohoLead(job.enquiry_id, job.lead_id); contactPipelineEvent("zoho.synced", { enquiryId: job.enquiry_id, leadId: job.lead_id }); }
     else { if (!job.lead_id) throw new JobFailure("LEAD_NOT_FOUND", false); providerId = await sendForm2Invitation(job.enquiry_id, job.lead_id); contactPipelineEvent("invite.sent", { enquiryId: job.enquiry_id, leadId: job.lead_id }); }
     if (await completeJob(job, providerId)) { succeeded += 1; contactPipelineEvent("job.succeeded", { jobId: job.id, enquiryId: job.enquiry_id, kind: job.kind, attempt: job.attempt_count }); }
   } catch (error) { const failure = error instanceof JobFailure ? error : new JobFailure("WORKER_FAILURE", true); const isDead = await failJob(job, failure); if (isDead) { dead += 1; contactPipelineEvent("job.dead", { jobId: job.id, enquiryId: job.enquiry_id, kind: job.kind, attempt: job.attempt_count, code: failure.code }); } else { retried += 1; contactPipelineEvent("job.retry", { jobId: job.id, enquiryId: job.enquiry_id, kind: job.kind, attempt: job.attempt_count, code: failure.code }); } }
 }
 if (Date.now() - startedAt < config.workerBudgetMs) { const purged = await purgeRetainedData(); if (purged.abuse || purged.raw || purged.invites) contactPipelineEvent("retention.purged", purged); }
 return { claimed: jobs.length, succeeded, retried, dead, elapsedMs: Date.now() - startedAt };
}
