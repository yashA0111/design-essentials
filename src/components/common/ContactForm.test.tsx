import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { ContactForm } from "./ContactForm";
import { contactPageContent } from "@/lib/data/siteContent";

const fetchMock = vi.fn();

function fillForm() {
  fireEvent.change(screen.getByLabelText(contactPageContent.fields.fullName), { target: { value: "Asha Menon" } });
  fireEvent.change(screen.getByLabelText(contactPageContent.fields.email), { target: { value: "asha@example.com" } });
  fireEvent.change(screen.getByLabelText(contactPageContent.fields.phone), { target: { value: "+91 98765 43210" } });
  fireEvent.change(screen.getByLabelText(contactPageContent.fields.enquiry), { target: { value: "We would like a quote for a container studio in Goa." } });
}

function submit() {
  fireEvent.click(screen.getByRole("button", { name: contactPageContent.submitLabel }));
}

describe("ContactForm", () => {
  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => vi.unstubAllGlobals());

  it("shows only the selected calling code while retaining full country options", () => {
    render(<ContactForm />);
    const country = screen.getByLabelText("Phone country or region") as HTMLSelectElement;
    expect(country.value).toBe("IN");
    expect(country.className).toContain("opacity-0");
    expect(screen.getByText("+91")).toBeDefined();
    expect(screen.queryByText("+91 · IN")).toBeNull();
    expect(screen.getByRole("option", { name: "+91 · IN — India" })).toBeDefined();
    expect(screen.getByRole("option", { name: "+44 · GB — United Kingdom" })).toBeDefined();
  });

  it("updates the visible calling code when the country changes", () => {
    render(<ContactForm />);
    fireEvent.change(screen.getByLabelText("Phone country or region"), { target: { value: "GB" } });
    expect(screen.getByText("+44")).toBeDefined();
    expect(screen.queryByText("GB")).toBeNull();
  });

  it("posts the selected country and enquiry, then shows the success state", async () => {
    fetchMock.mockResolvedValue({ ok: true, status: 202 });
    render(<ContactForm />);
    fillForm();
    fireEvent.change(screen.getByLabelText("Phone country or region"), { target: { value: "GB" } });
    submit();

    await screen.findByText(contactPageContent.successTitle);
    const [, init] = fetchMock.mock.calls[0];
    expect(JSON.parse(init.body)).toMatchObject({ fullName: "Asha Menon", email: "asha@example.com", countryCode: "GB", submissionId: expect.any(String) });
  });

  it("moves from country selector to phone on Enter", async () => {
    render(<ContactForm />);
    fireEvent.keyDown(screen.getByLabelText("Phone country or region"), { key: "Enter" });
    await waitFor(() => expect(document.activeElement).toBe(screen.getByLabelText(contactPageContent.fields.phone)));
  });

  it("preserves Enter navigation from the phone input", async () => {
    render(<ContactForm />);
    fillForm();
    fireEvent.change(screen.getByLabelText(contactPageContent.fields.enquiry), { target: { value: "" } });
    fireEvent.keyDown(screen.getByLabelText(contactPageContent.fields.phone), { key: "Enter" });
    await waitFor(() => expect(document.activeElement).toBe(screen.getByLabelText(contactPageContent.fields.enquiry)));
  });

  it("includes the Zoho processing disclosure", () => {
    render(<ContactForm />);
    expect(screen.getByText(/share them with Zoho CRM/i)).toBeDefined();
    expect(screen.getByRole("link", { name: /privacy policy/i })).toBeDefined();
  });

  it("blocks submission and reports invalid fields", async () => {
    render(<ContactForm />);
    fireEvent.change(screen.getByLabelText(contactPageContent.fields.email), { target: { value: "not-an-email" } });
    submit();
    await screen.findByText("Please enter a valid email address");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("surfaces the rate limit message from the server", async () => {
    fetchMock.mockResolvedValue({ ok: false, status: 429, json: async () => ({ error: "Too many enquiries. Try later." }) });
    render(<ContactForm />);
    fillForm();
    submit();
    await screen.findByText("Too many enquiries. Try later.");
  });

  it("falls back to the generic message for other failures", async () => {
    fetchMock.mockResolvedValue({ ok: false, status: 500, json: async () => ({ error: "Failed to send email" }) });
    render(<ContactForm />);
    fillForm();
    submit();
    await waitFor(() => expect(screen.getByText(contactPageContent.errorMessage)).toBeDefined());
  });
});
