"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { processSteps } from "@/lib/data/siteContent";
import { formatStepNumber } from "@/lib/format";
import { SectionLabel } from "@/components/common/SectionLabel";
import { SplitTitle } from "@/components/common/AnimatedTitle";
import { ProcessStepCard } from "@/components/cards/ProcessStepCard";
import { cn } from "@/lib/utils";

export function ProcessSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinContainerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [openStep, setOpenStep] = useState<number | null>(1);

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      if (!sectionRef.current || !trackRef.current || !pinContainerRef.current) return;

      const totalWidth = trackRef.current.scrollWidth;
      const viewportWidth = window.innerWidth;
      const scrollDistance = totalWidth - viewportWidth;

      gsap.to(trackRef.current, {
        x: -scrollDistance,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: `+=${scrollDistance}`,
          scrub: 1,
          pin: pinContainerRef.current,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="section-padding overflow-hidden bg-(--surface)"
    >
      <div ref={pinContainerRef} className="w-full">
        <div className="container mb-16">
          <SectionLabel className="mb-6">OUR PROCESS</SectionLabel>
          <SplitTitle rest="From" italicWord="Concept to Completion" />
        </div>

        {/* Desktop horizontal scroll */}
        <div className="hidden lg:block">
          <div ref={trackRef} className="flex gap-8 px-[clamp(20px,5vw,100px)]">
            {processSteps.map((step) => (
              <ProcessStepCard
                key={step.step}
                step={step}
                variant="wide"
                className="w-[400px] shrink-0"
              />
            ))}
          </div>
        </div>

        {/* Mobile accordion */}
        <div className="container lg:hidden">
          {processSteps.map((step) => (
            <div
              key={step.step}
              className="border-b border-border"
            >
              <button
                type="button"
                onClick={() =>
                  setOpenStep(openStep === step.step ? null : step.step)
                }
                className="flex w-full items-center justify-between py-6 text-left"
              >
                <span className="flex items-center gap-4">
                  <span className="font-(family-name:--font-display) text-2xl text-(--gold)">
                    {formatStepNumber(step.step)}
                  </span>
                  <span className="text-card-title text-(--text-primary)">
                    {step.title}
                  </span>
                </span>
                <span className="text-(--gold)">
                  {openStep === step.step ? "−" : "+"}
                </span>
              </button>
              <div
                className={cn(
                  "overflow-hidden transition-all duration-(--dur-base)",
                  openStep === step.step ? "max-h-40 pb-6" : "max-h-0"
                )}
              >
                <p className="text-body">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
