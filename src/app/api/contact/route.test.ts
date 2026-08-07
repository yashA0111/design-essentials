import { beforeEach, describe, expect, it, vi } from "vitest";
import { resetRateLimits } from "@/lib/rate-limit";

const send = vi.fn();

vi.mock("resend", () => ({
  Resend: class {
    emails = { send };
  },
}));

vi.mock("@/lib/email/templates/ContactConfirmation", () => ({
  ContactConfirmationEmail: () => null,
}));

vi.mock("@/lib/email/templates/InternalNotification", () => ({
  InternalNotificationEmail: () => null,
}));

const { POST } = await import("./route");

const validBody = {
  fullName: "Asha Menon",
  email: "asha@example.com",
  phone: "+91 98765 43210",
  phoneCountry: "IN",
  enquiry: "We are planning a container studio in Goa and would like a quote.",
};

function post(body: unknown, init: RequestInit = {}) {
  return new Request("https://designessentials.in/api/contact", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: typeof body === "string" ? body : JSON.stringify(body),
    ...init,
  });
}

describe("POST /api/contact", () => {
  beforeEach(() => {
    resetRateLimits();
    send.mockReset();
    send.mockResolvedValue({ data: { id: "email-id" }, error: null });
    vi.stubEnv("RESEND_API_KEY", "test-key");
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("normalizes contact data and sends both emails for a valid enquiry", async () => {
    const response = await POST(post({ ...validBody, email: "  ASHA@EXAMPLE.COM  " }));
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({ success: true });
    expect(send).toHaveBeenCalledTimes(2);
    expect(send).toHaveBeenCalledWith(
      expect.objectContaining({ to: "asha@example.com" })
    );
  });

  it("rejects a non-JSON content type", async () => {
    const response = await POST(
      post(validBody, { headers: { "content-type": "text/plain" } })
    );
    expect(response.status).toBe(415);
    expect(send).not.toHaveBeenCalled();
  });

  it("rejects malformed JSON", async () => {
    const response = await POST(post("{ not json"));
    expect(response.status).toBe(400);
  });

  it("returns field errors for invalid data", async () => {
    const response = await POST(post({ ...validBody, email: "nope" }));
    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      fieldErrors: { email: expect.any(Array) },
    });
  });

  it("rejects an oversized payload", async () => {
    const response = await POST(
      post({ ...validBody, enquiry: "x".repeat(20_000) })
    );
    expect(response.status).toBe(413);
  });

  it("silently accepts honeypot submissions without sending email", async () => {
    const response = await POST(
      post({ ...validBody, website: "https://spam.example" })
    );
    expect(response.status).toBe(200);
    expect(send).not.toHaveBeenCalled();
  });

  it("rate limits repeated submissions from one address", async () => {
    const headers = {
      "content-type": "application/json",
      "x-forwarded-for": "203.0.113.9",
    };

    for (let i = 0; i < 5; i += 1) {
      const ok = await POST(post(validBody, { headers }));
      expect(ok.status).toBe(200);
    }

    const limited = await POST(post(validBody, { headers }));
    expect(limited.status).toBe(429);
    expect(limited.headers.get("Retry-After")).toBeTruthy();
  });

  it("reports a 503 when the email service is not configured", async () => {
    vi.stubEnv("RESEND_API_KEY", "");
    const response = await POST(post(validBody));
    expect(response.status).toBe(503);
  });

  it("reports a 502 when the internal notification fails", async () => {
    send
      .mockResolvedValueOnce({ data: { id: "ok" }, error: null })
      .mockResolvedValueOnce({ data: null, error: { message: "boom" } });
    const response = await POST(post(validBody));
    expect(response.status).toBe(502);
  });

  it("still succeeds when only the confirmation email fails", async () => {
    send
      .mockRejectedValueOnce(new Error("network"))
      .mockResolvedValueOnce({ data: { id: "ok" }, error: null });
    const response = await POST(post(validBody));
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      success: true,
      confirmationSent: false,
    });
  });
});
