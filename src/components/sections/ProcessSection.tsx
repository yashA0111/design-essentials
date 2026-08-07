"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { processSteps } from "@/lib/data/siteContent";
import { SectionLabel } from "@/components/common/SectionLabel";
import { SplitTitle } from "@/components/common/SplitTitle";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

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
      data-theme="light"
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
              <div
                key={step.step}
                className="w-[400px] shrink-0 border border-border bg-(--void) p-8"
              >
                <span className="font-(family-name:--font-display) text-5xl text-(--gold)">
                  {String(step.step).padStart(2, "0")}
                </span>
                <h3 className="text-card-title mt-4 text-(--text-primary)">
                  {step.title}
                </h3>
                <p className="text-body mt-3">{step.description}</p>
              </div>
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
                    {String(step.step).padStart(2, "0")}
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
