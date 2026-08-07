"use client";

import Link from "next/link";
import { Leaf } from "lucide-react";
import { aboutContent, ecoSectionContent } from "@/lib/data/siteContent";
import { SectionLabel } from "@/components/common/SectionLabel";
import { useScrollReveal } from "@/components/animations/useScrollReveal";

export function EcoSection() {
  const ref = useScrollReveal();

  return (
    <section
      ref={ref}
      className="section-padding relative overflow-hidden bg-[var(--void)]"
    >
      <Leaf
        className="pointer-events-none absolute -right-20 -bottom-20 h-96 w-96 text-[var(--sage-muted)] opacity-10"
        strokeWidth={0.5}
      />
      <div className="container relative z-10 max-w-3xl">
        <div data-reveal>
          <SectionLabel className="mb-6 sage-text">{ecoSectionContent.eyebrow}</SectionLabel>
        </div>
        <div data-reveal>
          <h2 className="text-section text-[var(--text-primary)]">
            <em className="font-light italic text-[var(--sage)]">{ecoSectionContent.headingItalic}</em>{" "}
            {ecoSectionContent.headingRest}
          </h2>
        </div>
        <p data-reveal className="text-body mt-8 text-lg">
          {aboutContent.ecoBody}
        </p>
        <Link
          data-reveal
          href="/about#eco"
          className="text-nav mt-8 inline-block text-[var(--sage)] transition-colors hover:text-[var(--sage-muted)]"
        >
          {ecoSectionContent.ctaLabel}
        </Link>
      </div>
    </section>
  );
}
