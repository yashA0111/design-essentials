"use client";

import Link from "next/link";
import { contactCtaContent } from "@/lib/data/siteContent";
import { GOLD_BUTTON } from "@/lib/styles";
import { Button } from "@/components/ui/button";
import { useScrollReveal } from "@/components/animations/useScrollReveal";

export function ContactCTASection() {
  const ref = useScrollReveal();

  return (
    <section
      ref={ref}
      className="relative overflow-hidden py-[200px]"
    >
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.03]"
        aria-hidden="true"
      >
        <pattern
          id="arch-lines"
          x="0"
          y="0"
          width="80"
          height="80"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M0 80 L80 0"
            stroke="var(--gold)"
            strokeWidth="0.5"
            fill="none"
          />
        </pattern>
        <rect width="100%" height="100%" fill="url(#arch-lines)" />
      </svg>
      <div className="container relative z-10 text-center">
        <h2
          data-reveal
          className="text-section mb-6 text-[var(--text-primary)]"
        >
          {contactCtaContent.headingRest}{" "}
          <em className="font-light italic text-[var(--gold)]">
            {contactCtaContent.headingItalic}
          </em>
        </h2>
        <p data-reveal className="text-body mx-auto mb-10 max-w-xl text-lg">
          {contactCtaContent.subtext}
        </p>
        <div data-reveal>
          <Button
            asChild
            size="lg"
            className={`px-10 py-6 text-lg ${GOLD_BUTTON}`}
          >
            <Link href="/contact">{contactCtaContent.ctaLabel}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
