import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { CountryCodeSelector } from "./CountryCodeSelector";

describe("CountryCodeSelector", () => {
  it("renders trigger with default calling code and code label", () => {
    render(<CountryCodeSelector value="IN" />);
    expect(screen.getByRole("combobox", { name: "Phone country or region" })).toBeDefined();
    expect(screen.getByText("+91")).toBeDefined();
    expect(screen.getByText("IN")).toBeDefined();
  });

  it("opens popover with featured regions (US, UK, EU, India) on click", async () => {
    render(<CountryCodeSelector value="IN" />);
    const trigger = screen.getByRole("combobox", { name: "Phone country or region" });
    fireEvent.click(trigger);

    expect(screen.getByText(/Featured Regions/i)).toBeDefined();
    expect(screen.getByText("India")).toBeDefined();
    expect(screen.getByText("United States")).toBeDefined();
    expect(screen.getByText("United Kingdom")).toBeDefined();
    expect(screen.getByText("Germany")).toBeDefined();
  });

  it("filters country list live when typing in search input", async () => {
    render(<CountryCodeSelector value="IN" />);
    fireEvent.click(screen.getByRole("combobox", { name: "Phone country or region" }));

    const searchInput = screen.getByPlaceholderText(/Search region or code/i);
    fireEvent.change(searchInput, { target: { value: "Germany" } });

    await waitFor(() => {
      expect(screen.getByText("Germany")).toBeDefined();
      expect(screen.getByText("+49")).toBeDefined();
      expect(screen.queryByText("India")).toBeNull();
    });
  });

  it("calls onChange and onSelectNext when an option is selected", async () => {
    const onChange = vi.fn();
    const onSelectNext = vi.fn();

    render(<CountryCodeSelector value="IN" onChange={onChange} onSelectNext={onSelectNext} />);
    fireEvent.click(screen.getByRole("combobox", { name: "Phone country or region" }));

    const searchInput = screen.getByPlaceholderText(/Search region or code/i);
    fireEvent.change(searchInput, { target: { value: "United Kingdom" } });

    const option = await screen.findByText("United Kingdom");
    fireEvent.click(option);

    expect(onChange).toHaveBeenCalledWith("GB");
    expect(onSelectNext).toHaveBeenCalled();
  });
});
