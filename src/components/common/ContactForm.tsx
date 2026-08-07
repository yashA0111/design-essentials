"use client";

import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import PhoneInput, { type Country } from "react-phone-number-input";
import { contactPageContent } from "@/lib/data/siteContent";
import {
  CONTACT_FIELD_LIMITS,
  DEFAULT_PHONE_COUNTRY,
  contactSchema,
  type ContactFormData,
} from "@/lib/validation/contact";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const FIELD_ORDER = [
  "fullName",
  "email",
  "phone",
  "enquiry",
] as const satisfies readonly (keyof ContactFormData)[];

const inputClassName = cn(
  "h-14 rounded-none border-0 border-b border-[var(--border)] bg-transparent px-3 py-4",
  "font-(family-name:--font-body) text-[15px] text-[var(--text-primary)] shadow-none",
  "transition-all duration-300",
  "focus-visible:border-[var(--gold)] focus-visible:outline-2 focus-visible:outline-[var(--gold)] focus-visible:outline-offset-2",
  "placeholder:text-[var(--text-tertiary)] placeholder:font-light"
);

const textareaClassName = cn(
  "rounded-none border-0 border-b border-[var(--border)] bg-transparent px-3 py-4",
  "font-(family-name:--font-body) text-[15px] text-[var(--text-primary)] shadow-none",
  "transition-all duration-300 resize-none min-h-[130px]",
  "focus-visible:border-[var(--gold)] focus-visible:outline-2 focus-visible:outline-[var(--gold)] focus-visible:outline-offset-2",
  "placeholder:text-[var(--text-tertiary)] placeholder:font-light"
);

const labelClassName =
  "text-eyebrow mb-2 block text-[var(--text-tertiary)] text-[10px]";

type FieldKey = (typeof FIELD_ORDER)[number];

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [errorMessage, setErrorMessage] = useState<string>(
    contactPageContent.errorMessage
  );
  const formRef = useRef<HTMLFormElement>(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    getValues,
    setFocus,
    setValue,
    trigger,
    watch,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: { phoneCountry: DEFAULT_PHONE_COUNTRY },
  });

  const selectedPhoneCountry = watch("phoneCountry") ?? DEFAULT_PHONE_COUNTRY;

  useEffect(() => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (timezone) {
      setValue("timezone", timezone, {
        shouldDirty: false,
        shouldValidate: false,
      });
    }

    let cancelled = false;

    fetch("/api/contact/context")
      .then((response) => (response.ok ? response.json() : null))
      .then((payload: unknown) => {
        if (cancelled || !payload || typeof payload !== "object") {
          return;
        }

        const countryCode = (payload as { countryCode?: unknown }).countryCode;
        if (typeof countryCode !== "string" || countryCode.length !== 2) {
          return;
        }

        const normalizedCountry = countryCode.toUpperCase() as Country;
        setValue("geoCountryCode", normalizedCountry, {
          shouldDirty: false,
          shouldValidate: false,
        });
        setValue("phoneCountry", normalizedCountry, {
          shouldDirty: false,
          shouldValidate: false,
        });
      })
      .catch(() => {
        // Country detection is only a convenience; India remains the fallback.
      });

    return () => {
      cancelled = true;
    };
  }, [setValue]);

  const focusNextEmptyField = async (currentField: FieldKey) => {
    // Validate current field immediately when pressing Enter
    await trigger(currentField);

    const values = getValues();
    const currentIndex = FIELD_ORDER.indexOf(currentField);

    for (let i = currentIndex + 1; i < FIELD_ORDER.length; i += 1) {
      const field = FIELD_ORDER[i];
      const value = values[field];
      if (!value || String(value).trim() === "") {
        setFocus(field);
        return;
      }
    }

    const firstEmpty = FIELD_ORDER.find((field) => {
      const value = values[field];
      return !value || String(value).trim() === "";
    });

    if (firstEmpty) {
      setFocus(firstEmpty);
      return;
    }

    formRef.current?.requestSubmit();
  };

  const handleFieldKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
    currentField: FieldKey
  ) => {
    if (event.key !== "Enter" || event.shiftKey || event.ctrlKey || event.metaKey) {
      return;
    }

    event.preventDefault();
    void focusNextEmptyField(currentField);
  };

  const onSubmit = async (data: ContactFormData) => {
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const payload: unknown = await res.json().catch(() => null);
        const serverMessage =
          payload &&
          typeof payload === "object" &&
          "error" in payload &&
          typeof (payload as { error: unknown }).error === "string"
            ? (payload as { error: string }).error
            : null;

        setErrorMessage(
          res.status === 429 && serverMessage
            ? serverMessage
            : contactPageContent.errorMessage
        );
        setStatus("error");
        return;
      }

      setStatus("success");
      reset();
    } catch {
      setErrorMessage(contactPageContent.errorMessage);
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="py-16 text-center"
        >
          {/* Gold check icon */}
          <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-full border border-[var(--gold)]/30">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--gold)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h3 className="font-(family-name:--font-display) text-3xl font-light text-[var(--text-primary)]">
            {contactPageContent.successTitle}
          </h3>
          <p className="text-body mx-auto mt-4 max-w-sm text-[var(--text-secondary)]">
            {contactPageContent.successMessage}
          </p>
          <button
            type="button"
            className="mt-10 text-eyebrow border-b border-[var(--gold)] pb-1 text-[var(--text-primary)] transition-colors hover:text-[var(--gold)] cursor-pointer"
            onClick={() => setStatus("idle")}
          >
            {contactPageContent.successCta}
          </button>
        </motion.div>
      </AnimatePresence>
    );
  }

  const { fields } = contactPageContent;

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-0"
    >
      {/* Honeypot */}
      <input
        type="text"
        {...register("website")}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      {/* Full Name */}
      <div className="pb-8">
        <label htmlFor="fullName" className={labelClassName}>
          {fields.fullName}
        </label>
        <Input
          id="fullName"
          type="text"
          autoComplete="name"
          autoCapitalize="words"
          maxLength={CONTACT_FIELD_LIMITS.fullName}
          placeholder="Enter your full name"
          {...register("fullName")}
          onKeyDown={(event) => handleFieldKeyDown(event, "fullName")}
          className={inputClassName}
          aria-invalid={Boolean(errors.fullName)}
        />
        <p
          className={cn(
            "mt-2 min-h-[18px] text-xs text-[var(--error)] transition-opacity duration-200",
            errors.fullName ? "opacity-100" : "opacity-0"
          )}
        >
          {errors.fullName?.message ?? "\u00A0"}
        </p>
      </div>

      {/* Email */}
      <div className="pb-8">
        <label htmlFor="email" className={labelClassName}>
          {fields.email}
        </label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          maxLength={CONTACT_FIELD_LIMITS.email}
          placeholder="Enter your email address"
          {...register("email")}
          onKeyDown={(event) => handleFieldKeyDown(event, "email")}
          className={inputClassName}
          aria-invalid={Boolean(errors.email)}
        />
        <p
          className={cn(
            "mt-2 min-h-[18px] text-xs text-[var(--error)] transition-opacity duration-200",
            errors.email ? "opacity-100" : "opacity-0"
          )}
        >
          {errors.email?.message ?? "\u00A0"}
        </p>
      </div>

      {/* Phone */}
      <div className="pb-8">
        <label htmlFor="phone" className={labelClassName}>
          {fields.phone}
        </label>
        <Controller
          name="phone"
          control={control}
          render={({ field }) => (
            <PhoneInput
              id="phone"
              international
              defaultCountry={DEFAULT_PHONE_COUNTRY}
              country={selectedPhoneCountry as Country}
              value={field.value}
              onChange={(value: string | undefined) => field.onChange(value ?? "")}
              onCountryChange={(country: Country | undefined) => {
                if (country) {
                  setValue("phoneCountry", country, { shouldValidate: true });
                }
              }}
              onBlur={field.onBlur}
              onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) =>
                handleFieldKeyDown(event, "phone")
              }
              numberInputProps={{
                ref: field.ref,
                name: field.name,
                autoComplete: "tel",
                inputMode: "tel",
                maxLength: CONTACT_FIELD_LIMITS.phone,
                placeholder: "Enter your phone number",
                className: inputClassName,
                "aria-invalid": Boolean(errors.phone),
              }}
              className="flex items-center gap-3"
            />
          )}
        />
        <p
          className={cn(
            "mt-2 min-h-[18px] text-xs text-[var(--error)] transition-opacity duration-200",
            errors.phone ? "opacity-100" : "opacity-0"
          )}
        >
          {errors.phone?.message ?? "\u00A0"}
        </p>
      </div>

      {/* Enquiry */}
      <div className="pb-8">
        <label htmlFor="enquiry" className={labelClassName}>
          {fields.enquiry}
        </label>
        <Textarea
          id="enquiry"
          rows={4}
          maxLength={CONTACT_FIELD_LIMITS.enquiry}
          placeholder="Tell us about your project, space, or vision…"
          {...register("enquiry")}
          onKeyDown={(event) => handleFieldKeyDown(event, "enquiry")}
          className={textareaClassName}
          aria-invalid={Boolean(errors.enquiry)}
        />
        <p
          className={cn(
            "mt-2 min-h-[18px] text-xs text-[var(--error)] transition-opacity duration-200",
            errors.enquiry ? "opacity-100" : "opacity-0"
          )}
        >
          {errors.enquiry?.message ?? "\u00A0"}
        </p>
      </div>

      {/* Required field notice */}
      <p className="mb-4 text-[11px] text-[var(--text-tertiary)]">
        * All fields are required
      </p>

      {/* Error banner */}
      <AnimatePresence>
        {status === "error" && (
          <motion.p
            role="alert"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="pb-6 text-sm text-[var(--error)]"
          >
            {errorMessage}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Submit */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={status === "loading"}
          className={cn(
            "group relative w-full border border-[var(--gold)] bg-[var(--gold)] py-4 text-center cursor-pointer",
            "font-(family-name:--font-utility) text-[11px] font-medium uppercase tracking-[0.18em]",
            "text-[#1a1a1a] transition-all duration-300",
            "hover:bg-[#b08d4a] hover:border-[#b08d4a]",
            "disabled:cursor-not-allowed disabled:opacity-50"
          )}
        >
          {status === "loading"
            ? contactPageContent.submitLoadingLabel
            : contactPageContent.submitLabel}
        </button>
      </div>
    </form>
  );
}
