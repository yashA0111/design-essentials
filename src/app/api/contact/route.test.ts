import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SITE } from "@/lib/constants";

const send = vi.fn();

vi.mock("resend", () => ({
  Resend: vi.fn().mockImplementation((apiKey: string) => ({
    apiKey,
    emails: { send },
  })),
}));

vi.mock("@/lib/email/templates/ContactConfirmation", () => ({
  ContactConfirmationEmail: vi.fn(() => "confirmation-email"),
}));

vi.mock("@/lib/email/templates/InternalNotification", () => ({
  InternalNotificationEmail: vi.fn(() => "internal-email"),
}));

const validPayload = {
  name: "Asha Patel",
  email: "asha@example.com",
  phone: "+91 90000 00000",
  service: "pre-engineered-homes",
  brief: "We would like a two storey pre-engineered home near Pune.",
  budget: "50l-2cr",
};

function post(body: unknown) {
  return new Request("http://localhost/api/contact", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

async function callRoute(body: unknown) {
  const { POST } = await import("@/app/api/contact/route");
  const response = await POST(post(body));
  return { response, json: await response.json() };
}

beforeEach(() => {
  vi.resetModules();
  send.mockReset();
  send.mockResolvedValue({ id: "email-id" });
  process.env.RESEND_API_KEY = "test-api-key";
});

afterEach(() => {
  delete process.env.RESEND_API_KEY;
});

describe("POST /api/contact", () => {
  it("sends a confirmation and an internal notification for a valid submission", async () => {
    const { response, json } = await callRoute(validPayload);

    expect(response.status).toBe(200);
    expect(json).toEqual({ success: true });
    expect(send).toHaveBeenCalledTimes(2);

    const [confirmation, internal] = send.mock.calls.map(([args]) => args);
    expect(confirmation.to).toBe(validPayload.email);
    expect(confirmation.from).toContain(SITE.email);
    expect(internal.to).toBe(SITE.email);
    expect(internal.subject).toContain(validPayload.name);
    expect(internal.subject).toContain(validPayload.service);
  });

  it("accepts a submission without the optional fields", async () => {
    const required = { ...validPayload, phone: undefined, budget: undefined };
    const { response } = await callRoute(required);

    expect(response.status).toBe(200);
    expect(send).toHaveBeenCalledTimes(2);
  });

  it.each([
    ["a short name", { ...validPayload, name: "A" }],
    ["an invalid email", { ...validPayload, email: "not-an-email" }],
    ["a short brief", { ...validPayload, brief: "too short" }],
    ["a missing service", { ...validPayload, service: undefined }],
  ])("rejects %s with 400 and does not send email", async (_label, payload) => {
    const { response, json } = await callRoute(payload);

    expect(response.status).toBe(400);
    expect(json.error).toBe("Invalid data");
    expect(json.details).toBeDefined();
    expect(send).not.toHaveBeenCalled();
  });

  it("rejects honeypot submissions without sending email", async () => {
    const { response, json } = await callRoute({
      ...validPayload,
      website: "http://spam.example.com",
    });

    expect(response.status).toBe(400);
    expect(json.error).toBe("Invalid data");
    expect(send).not.toHaveBeenCalled();
  });

  it("still sends email when the honeypot field is present but empty", async () => {
    const { response } = await callRoute({ ...validPayload, website: "" });

    expect(response.status).toBe(200);
    expect(send).toHaveBeenCalledTimes(2);
  });

  it("returns 503 when RESEND_API_KEY is not configured", async () => {
    delete process.env.RESEND_API_KEY;
    const { response, json } = await callRoute(validPayload);

    expect(response.status).toBe(503);
    expect(json.error).toBe("Email service not configured");
    expect(send).not.toHaveBeenCalled();
  });

  it("returns 500 when the email provider fails", async () => {
    send.mockRejectedValue(new Error("provider down"));
    const { response, json } = await callRoute(validPayload);

    expect(response.status).toBe(500);
    expect(json.error).toBe("Failed to send email");
  });
});
