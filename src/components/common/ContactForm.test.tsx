import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { ContactForm } from "./ContactForm";
import { contactPageContent } from "@/lib/data/siteContent";

const fetchMock = vi.fn();

function fillForm() {
  fireEvent.change(screen.getByLabelText(contactPageContent.fields.fullName), {
    target: { value: "Asha Menon" },
  });
  fireEvent.change(screen.getByLabelText(contactPageContent.fields.email), {
    target: { value: "asha@example.com" },
  });
  fireEvent.change(screen.getByLabelText(contactPageContent.fields.phone), {
    target: { value: "+91 98765 43210" },
  });
  fireEvent.change(screen.getByLabelText(contactPageContent.fields.enquiry), {
    target: { value: "We would like a quote for a container studio in Goa." },
  });
}

function submit() {
  fireEvent.click(
    screen.getByRole("button", { name: contactPageContent.submitLabel })
  );
}

describe("ContactForm", () => {
  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("posts the enquiry and shows the success state", async () => {
    fetchMock.mockResolvedValue({ ok: true, status: 202 });
    render(<ContactForm />);
    fillForm();
    submit();

    await screen.findByText(contactPageContent.successTitle);
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/contact",
      expect.objectContaining({ method: "POST" })
    );
    const [, init] = fetchMock.mock.calls[0];
    expect(JSON.parse(init.body)).toMatchObject({
      fullName: "Asha Menon",
      email: "asha@example.com",
      submissionId: expect.any(String),
    });
  });

  it("includes the Zoho processing disclosure", () => { render(<ContactForm />); expect(screen.getByText(/share them with Zoho CRM/i)).toBeDefined(); expect(screen.getByRole("link", { name: /privacy policy/i })).toBeDefined(); });

  it("blocks submission and reports invalid fields", async () => {
    render(<ContactForm />);
    fireEvent.change(screen.getByLabelText(contactPageContent.fields.email), {
      target: { value: "not-an-email" },
    });
    submit();

    await screen.findByText("Please enter a valid email address");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("surfaces the rate limit message from the server", async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 429,
      json: async () => ({ error: "Too many enquiries. Try later." }),
    });
    render(<ContactForm />);
    fillForm();
    submit();

    await screen.findByText("Too many enquiries. Try later.");
  });

  it("falls back to the generic message for other failures", async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({ error: "Failed to send email" }),
    });
    render(<ContactForm />);
    fillForm();
    submit();

    await waitFor(() =>
      expect(
        screen.getByText(contactPageContent.errorMessage)
      ).toBeDefined()
    );
  });
});
