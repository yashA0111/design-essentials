import { describe, expect, it, vi } from "vitest";
import { render } from "react-email";
const send = vi.fn();
const query = vi.fn();
vi.mock("resend", () => ({ Resend: class { emails = { send }; } }));
vi.mock("@/lib/db/client", () => ({ getSql: () => query }));
const { resendFailure, sendContactEmail } = await import("./send");

describe("Resend contact sender", () => {
  it("treats validation as permanent and throttling as retryable", () => {
    expect(resendFailure({ statusCode: 400 }).retryable).toBe(false);
    expect(resendFailure({ statusCode: 429 }).retryable).toBe(true);
    expect(resendFailure({}).retryable).toBe(true);
  });

  it("uses the SDK idempotency option and branded React payload rather than custom headers", async () => {
    vi.stubEnv("CONTACT_WORKER_EMAIL_ENABLED", "true"); vi.stubEnv("RESEND_API_KEY", "key"); vi.stubEnv("CONTACT_RESEND_FROM", "Studio <studio@example.com>"); vi.stubEnv("CONTACT_INTERNAL_RECIPIENT", "team@example.com");
    query.mockResolvedValue([{ normalized_email: "a@example.com", normalized_full_name: "Asha", normalized_phone: "+919876543210", country_code: "IN", normalized_enquiry: "A detailed project request", resolution_state: "resolved" }]);
    send.mockResolvedValue({ data: { id: "mail-1" }, error: null });
    await sendContactEmail("acknowledgment_email", "enquiry-1");
    expect(send).toHaveBeenCalledWith(expect.objectContaining({ react: expect.anything() }), { idempotencyKey: "contact/enquiry-1/ack/v1" });
    expect(send.mock.calls[0][0].headers).toBeUndefined();

    await sendContactEmail("internal_notification", "enquiry-1");
    const internalPayload = send.mock.calls[1][0];
    expect(internalPayload).toMatchObject({ to: "team@example.com", subject: "New Enquiry — enquiry-1" });
    const internalHtml = await render(internalPayload.react);
    expect(internalHtml.replace(/<!--.*?-->/g, "")).toContain("+919876543210 (IN)");
  });
});
