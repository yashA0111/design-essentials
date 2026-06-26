"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { services } from "@/lib/data/services";
import { BUDGET_OPTIONS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().optional(),
  service: z.string().min(1, "Please select a service"),
  brief: z.string().min(10, "Please provide at least 10 characters"),
  budget: z.string().optional(),
  website: z.string().max(0).optional(),
});

type ContactFormData = z.infer<typeof contactSchema>;

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
      <div className="rounded-sm border border-[var(--success)]/30 bg-[var(--surface)] p-8 text-center">
        <h3 className="text-card-title text-[var(--text-primary)]">
          Thank you for reaching out
        </h3>
        <p className="text-body mt-3">
          We&apos;ve received your inquiry and will respond within 24 hours.
        </p>
        <Button
          type="button"
          variant="outline"
          className="mt-6 border-[var(--border)]"
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

      <div>
        <label htmlFor="name" className="text-nav mb-2 block text-[var(--text-secondary)]">
          Name *
        </label>
        <Input
          id="name"
          {...register("name")}
          className="border-[var(--border)] bg-[var(--surface)]"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-[var(--error)]">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="text-nav mb-2 block text-[var(--text-secondary)]">
          Email *
        </label>
        <Input
          id="email"
          type="email"
          {...register("email")}
          className="border-[var(--border)] bg-[var(--surface)]"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-[var(--error)]">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="phone" className="text-nav mb-2 block text-[var(--text-secondary)]">
          Phone
        </label>
        <Input
          id="phone"
          type="tel"
          {...register("phone")}
          className="border-[var(--border)] bg-[var(--surface)]"
        />
      </div>

      <div>
        <label htmlFor="service" className="text-nav mb-2 block text-[var(--text-secondary)]">
          Service Interest *
        </label>
        <select
          id="service"
          {...register("service")}
          className={cn(
            "flex h-9 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--text-primary)] outline-none"
          )}
        >
          <option value="">Select a service</option>
          {services.map((s) => (
            <option key={s.id} value={s.name}>
              {s.name}
            </option>
          ))}
        </select>
        {errors.service && (
          <p className="mt-1 text-sm text-[var(--error)]">{errors.service.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="brief" className="text-nav mb-2 block text-[var(--text-secondary)]">
          Project Brief *
        </label>
        <Textarea
          id="brief"
          rows={5}
          {...register("brief")}
          className="border-[var(--border)] bg-[var(--surface)]"
        />
        {errors.brief && (
          <p className="mt-1 text-sm text-[var(--error)]">{errors.brief.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="budget" className="text-nav mb-2 block text-[var(--text-secondary)]">
          Budget Range
        </label>
        <select
          id="budget"
          {...register("budget")}
          className="flex h-9 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--text-primary)] outline-none"
        >
          <option value="">Select budget range</option>
          {BUDGET_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.label}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {status === "error" && (
        <p className="text-sm text-[var(--error)]">
          Something went wrong. Please try again or email us directly.
        </p>
      )}

      <Button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-full bg-[var(--gold)] text-[var(--void)] hover:bg-[var(--gold-muted)]"
      >
        {status === "loading" ? "Sending..." : "Submit Inquiry"}
      </Button>
    </form>
  );
}
