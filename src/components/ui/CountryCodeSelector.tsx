"use client";

import { useEffect, useRef, useState, useId } from "react";
import {
  COUNTRY_CALLING_CODE_OPTIONS,
  DEFAULT_COUNTRY_CODE,
  FEATURED_COUNTRY_OPTIONS,
  type CountryCallingCodeOption,
} from "@/lib/contact/countries";
import { cn } from "@/lib/utils";

const OPTIONS_BY_CODE = new Map(
  COUNTRY_CALLING_CODE_OPTIONS.map((opt) => [opt.code, opt])
);

export interface CountryCodeSelectorProps {
  id?: string;
  name?: string;
  value?: string;
  onChange?: (value: string) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLSelectElement>) => void;
  onSelectNext?: () => void;
  disabled?: boolean;
  hasError?: boolean;
  className?: string;
}

export function CountryCodeSelector({
  id = "countryCode",
  name = "countryCode",
  value = DEFAULT_COUNTRY_CODE,
  onChange,
  onKeyDown,
  onSelectNext,
  disabled = false,
  hasError = false,
  className,
}: CountryCodeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const selectId = useId();

  const selectedOption = OPTIONS_BY_CODE.get(value) ?? OPTIONS_BY_CODE.get(DEFAULT_COUNTRY_CODE) ?? {
    code: "IN",
    name: "India",
    callingCode: "+91",
  };

  // Filter options based on search query
  const query = searchQuery.trim().toLowerCase();
  const isFiltering = query.length > 0;

  const filteredOptions = isFiltering
    ? COUNTRY_CALLING_CODE_OPTIONS.filter((opt) => {
        const nameMatch = opt.name.toLowerCase().includes(query);
        const codeMatch = opt.code.toLowerCase().includes(query);
        const callingMatch = opt.callingCode.includes(query);
        return nameMatch || codeMatch || callingMatch;
      })
    : FEATURED_COUNTRY_OPTIONS;

  // Click outside to close
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Focus search input on open
  useEffect(() => {
    if (isOpen) {
      setSearchQuery("");
      setFocusedIndex(-1);
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const handleSelect = (code: string) => {
    onChange?.(code);
    setIsOpen(false);
    onSelectNext?.();
  };

  const handleTriggerKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setIsOpen(true);
    }
  };

  const handleNativeSelectKeyDown = (e: React.KeyboardEvent<HTMLSelectElement>) => {
    if (onKeyDown) {
      onKeyDown(e);
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      setIsOpen(false);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedIndex((prev) => (prev < filteredOptions.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedIndex((prev) => (prev > 0 ? prev - 1 : filteredOptions.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (focusedIndex >= 0 && focusedIndex < filteredOptions.length) {
        handleSelect(filteredOptions[focusedIndex].code);
      } else if (filteredOptions.length > 0) {
        handleSelect(filteredOptions[0].code);
      }
    }
  };

  // Scroll active item into view
  useEffect(() => {
    if (focusedIndex >= 0 && listRef.current) {
      const activeEl = listRef.current.children[focusedIndex] as HTMLElement | undefined;
      if (typeof activeEl?.scrollIntoView === "function") {
        activeEl.scrollIntoView({ block: "nearest" });
      }
    }
  }, [focusedIndex]);


  return (
    <div ref={containerRef} className={cn("relative h-14 w-24 shrink-0 border-r border-[var(--border)]", className)}>
      {/* Accessible native select (visually hidden, fully functional for form state/RHF & vitest) */}
      <label htmlFor={id} className="sr-only">
        Phone country or region
      </label>
      <select
        id={id}
        name={name}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.value)}
        onKeyDown={handleNativeSelectKeyDown}
        tabIndex={-1}
        className="pointer-events-none absolute inset-0 opacity-0"
        aria-hidden="true"
      >
        {COUNTRY_CALLING_CODE_OPTIONS.map(({ code, name: countryName, callingCode }) => (
          <option key={code} value={code}>
            {callingCode} · {code} — {countryName}
          </option>
        ))}
      </select>

      {/* Styled Trigger Button */}
      <button
        type="button"
        id={`${selectId}-trigger`}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label="Phone country or region"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={handleTriggerKeyDown}
        className={cn(
          "flex h-full w-full items-center justify-between px-3 bg-transparent font-(family-name:--font-body) text-[15px] text-[var(--text-primary)] transition-colors duration-200 cursor-pointer",
          "hover:bg-[var(--surface-2)]/40 focus-visible:outline-2 focus-visible:outline-[var(--gold)] focus-visible:outline-offset-2",
          hasError && "text-[var(--error)]"
        )}
      >
        <span className="flex items-center gap-1 truncate">
          <span className="font-medium tracking-tight text-[var(--text-primary)]">
            {selectedOption.callingCode}
          </span>
          <span className="text-[10px] font-semibold tracking-wider text-[var(--text-tertiary)] uppercase">
            {selectedOption.code}
          </span>
        </span>
        <svg
          className={cn(
            "h-3.5 w-3.5 shrink-0 text-[var(--gold)] transition-transform duration-200",
            isOpen && "rotate-180"
          )}
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="m4 6 4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Custom Dropdown Popover */}
      {isOpen && (
        <div
          role="listbox"
          id={`${selectId}-popover`}
          className={cn(
            "absolute top-full left-0 z-50 mt-1 w-72 rounded-sm border border-[var(--border)] bg-[#111111] py-2 shadow-2xl backdrop-blur-md transition-all",
            "max-h-[340px] flex flex-col"
          )}
        >
          {/* Search Header */}
          <div className="px-2.5 pb-2 border-b border-[var(--border)]/60">
            <div className="relative flex items-center">
              <svg
                className="absolute left-2.5 h-3.5 w-3.5 text-[var(--gold)]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setFocusedIndex(0);
                }}
                onKeyDown={handleSearchKeyDown}
                placeholder="Search region or code (+91, US)..."
                className={cn(
                  "w-full bg-[var(--surface-2)] pl-8 pr-7 py-1.5 text-xs text-[var(--text-primary)] rounded-none border border-[var(--border)]",
                  "placeholder:text-[var(--text-tertiary)] focus:border-[var(--gold)] focus:outline-none"
                )}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] cursor-pointer text-xs"
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Section Header Label */}
          <div className="px-3 pt-2 pb-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-[var(--gold)]">
            {isFiltering ? `Search Results (${filteredOptions.length})` : "Featured Regions (US, UK, EU, India)"}
          </div>

          {/* Options List */}
          <ul
            ref={listRef}
            className="flex-1 overflow-y-auto divide-y divide-[var(--border)]/20 py-1"
          >
            {filteredOptions.length === 0 ? (
              <li className="px-4 py-3 text-center text-xs text-[var(--text-tertiary)]">
                No matching countries found
              </li>
            ) : (
              filteredOptions.map((opt: CountryCallingCodeOption, index: number) => {
                const isSelected = opt.code === selectedOption.code;
                const isFocused = index === focusedIndex;

                return (
                  <li key={opt.code}>
                    <button
                      type="button"
                      onClick={() => handleSelect(opt.code)}
                      onMouseEnter={() => setFocusedIndex(index)}
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-2 text-left text-xs transition-colors duration-150 cursor-pointer",
                        isSelected
                          ? "bg-[var(--gold)]/15 text-[var(--gold)] font-medium"
                          : isFocused
                          ? "bg-[var(--surface-2)] text-[var(--text-primary)]"
                          : "text-[var(--text-primary)] hover:bg-[var(--surface-2)]"
                      )}
                    >
                      <div className="flex items-center gap-2 truncate pr-2">
                        <span className="font-mono text-[10px] w-6 shrink-0 text-[var(--text-tertiary)] font-bold uppercase">
                          {opt.code}
                        </span>
                        <span className="truncate text-[var(--text-primary)]">{opt.name}</span>
                      </div>
                      <span className="font-mono text-xs font-semibold text-[var(--gold)] shrink-0">
                        {opt.callingCode}
                      </span>
                    </button>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
