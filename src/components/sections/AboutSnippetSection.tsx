"use client";

import Link from "next/link";
import { homeAboutContent } from "@/lib/data/siteContent";
import { GOLD_LINK } from "@/lib/styles";
import { SectionLabel } from "@/components/common/SectionLabel";
import { SplitTitle } from "@/components/common/AnimatedTitle";
import { ImageWithFallback } from "@/components/common/ImageWithFallback";
import { useScrollReveal } from "@/components/animations/useScrollReveal";

export function AboutSnippetSection() {
  const ref = useScrollReveal();

  return (
    <section ref={ref} className="section-padding">
      <div className="container grid grid-cols-1 items-center gap-12 lg:grid-cols-[55%_45%] lg:gap-16">
        <div
          data-reveal
          className="relative aspect-4/5 overflow-hidden rounded-sm"
        >
          <ImageWithFallback
            src={homeAboutContent.image}
            alt={homeAboutContent.imageAlt}
            fill
            sizes="(max-width: 1024px) 100vw, 55vw"
          />
        </div>
        <div>
          <div data-reveal>
            <SectionLabel className="mb-6">{homeAboutContent.eyebrow}</SectionLabel>
          </div>
          <div data-reveal>
            <SplitTitle
              rest={homeAboutContent.headingRest}
              italicWord={homeAboutContent.headingItalic}
              className="mb-8"
            />
          </div>
          {homeAboutContent.paragraphs.map((p) => (
            <p key={p.slice(0, 20)} data-reveal className="text-body mb-4">
              {p}
            </p>
          ))}
          <p data-reveal className="text-nav mt-6 text-(--text-primary)">
            {homeAboutContent.stats}
          </p>
          <Link
            data-reveal
            href="/about"
            className={`text-nav mt-6 inline-block ${GOLD_LINK}`}
          >
            {homeAboutContent.ctaLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
