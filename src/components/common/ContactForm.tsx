"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { services } from "@/lib/data/services";
import { BUDGET_OPTIONS } from "@/lib/constants";
import { contactSchema, type ContactFormData } from "@/lib/validation/contact";
import { GOLD_BUTTON } from "@/lib/styles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const FIELD_CLASS = "border-border bg-(--surface)";
const SELECT_CLASS =
  "flex h-9 w-full rounded-lg border border-border bg-(--surface) px-3 text-sm text-(--text-primary) outline-none";

type FieldProps = {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
};

function Field({ id, label, error, children }: FieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="text-nav mb-2 block text-(--text-secondary)"
      >
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-sm text-(--error)">{error}</p>}
    </div>
  );
}

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

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
      <div className="rounded-sm border border-(--success)/30 bg-(--surface) p-8 text-center">
        <h3 className="text-card-title text-(--text-primary)">
          Thank you for reaching out
        </h3>
        <p className="text-body mt-3">
          We&apos;ve received your inquiry and will respond within 24 hours.
        </p>
        <Button
          type="button"
          variant="outline"
          className="mt-6 border-border"
          onClick={() => setStatus("idle")}
        >
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <input
        type="text"
        {...register("website")}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      <Field id="name" label="Name *" error={errors.name?.message}>
        <Input id="name" {...register("name")} className={FIELD_CLASS} />
      </Field>

      <Field id="email" label="Email *" error={errors.email?.message}>
        <Input
          id="email"
          type="email"
          {...register("email")}
          className={FIELD_CLASS}
        />
      </Field>

      <Field id="phone" label="Phone">
        <Input
          id="phone"
          type="tel"
          {...register("phone")}
          className={FIELD_CLASS}
        />
      </Field>

      <Field
        id="service"
        label="Service Interest *"
        error={errors.service?.message}
      >
        <select id="service" {...register("service")} className={SELECT_CLASS}>
          <option value="">Select a service</option>
          {services.map((s) => (
            <option key={s.id} value={s.name}>
              {s.name}
            </option>
          ))}
        </select>
      </Field>

      <Field id="brief" label="Project Brief *" error={errors.brief?.message}>
        <Textarea
          id="brief"
          rows={5}
          {...register("brief")}
          className={FIELD_CLASS}
        />
      </Field>

      <Field id="budget" label="Budget Range">
        <select id="budget" {...register("budget")} className={SELECT_CLASS}>
          <option value="">Select budget range</option>
          {BUDGET_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.label}>
              {opt.label}
            </option>
          ))}
        </select>
      </Field>

      {status === "error" && (
        <p className="text-sm text-(--error)">
          Something went wrong. Please try again or email us directly.
        </p>
      )}

      <Button
        type="submit"
        disabled={status === "loading"}
        className={`w-full ${GOLD_BUTTON}`}
      >
        {status === "loading" ? "Sending..." : "Submit Inquiry"}
      </Button>
    </form>
  );
}
