"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { contactPageContent } from "@/lib/data/siteContent";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const contactSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  enquiry: z.string().min(10, "Please provide at least 10 characters"),
  website: z.string().max(0).optional(),
});

type ContactFormData = z.infer<typeof contactSchema>;

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
  const formRef = useRef<HTMLFormElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    setFocus,
    trigger,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
  });

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
      if (!res.ok) throw new Error("Failed");
      setStatus("success");
      reset();
    } catch {
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
        <Input
          id="phone"
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          placeholder="Enter your phone number"
          {...register("phone")}
          onKeyDown={(event) => handleFieldKeyDown(event, "phone")}
          className={inputClassName}
          aria-invalid={Boolean(errors.phone)}
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
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="pb-6 text-sm text-[var(--error)]"
          >
            {contactPageContent.errorMessage}
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
