"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Milestone } from "@/types/site";

gsap.registerPlugin(ScrollTrigger);

export function TimelineSection({ milestones }: { milestones: Milestone[] }) {
  const timelineRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!timelineRef.current || !lineRef.current) return;

    const ctx = gsap.context(() => {
      // Animate the gold line growing downward as user scrolls
      gsap.fromTo(
        lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: timelineRef.current,
            start: "top 70%",
            end: "bottom 80%",
            scrub: 0.5,
          },
        }
      );

      // Reveal each milestone card
      const items =
        timelineRef.current!.querySelectorAll("[data-timeline-item]");
      items.forEach((item) => {
        gsap.fromTo(
          item,
          { opacity: 0, x: 24 },
          {
            opacity: 1,
            x: 0,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: {
              trigger: item,
              start: "top 88%",
              toggleActions: "play none none none",
            },
          }
        );
      });

      // Animate dots scaling in
      const dots = timelineRef.current!.querySelectorAll("[data-timeline-dot]");
      dots.forEach((dot) => {
        gsap.fromTo(
          dot,
          { scale: 0 },
          {
            scale: 1,
            duration: 0.4,
            ease: "back.out(2)",
            scrollTrigger: {
              trigger: dot,
              start: "top 88%",
              toggleActions: "play none none none",
            },
          }
        );
      });
    }, timelineRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={timelineRef} className="relative max-w-3xl">
      {/* Vertical gold line running down the left gutter */}
      <div className="absolute left-[7px] top-2 bottom-2 md:left-[47px]">
        <div
          ref={lineRef}
          className="h-full w-px origin-top bg-(--gold)/40"
        />
      </div>

      <div className="flex flex-col gap-12 md:gap-16">
        {milestones.map((m) => (
          <div
            key={m.year}
            className="grid grid-cols-[16px_1fr] gap-5 md:grid-cols-[80px_16px_1fr] md:gap-6"
          >
            {/* ── Year (desktop only, left of the line) ── */}
            <div className="hidden md:flex md:items-start md:justify-end md:pt-0.5">
              <span className="font-(family-name:--font-display) text-2xl tabular-nums text-(--gold)">
                {m.year}
              </span>
            </div>

            {/* ── Dot on the line ── */}
            <div className="flex justify-center pt-1.5">
              <div
                data-timeline-dot
                className="relative z-10 flex h-[14px] w-[14px] items-center justify-center"
              >
                <span className="absolute h-[14px] w-[14px] rounded-full border border-(--gold)/50 bg-(--void)" />
                <span className="h-1.5 w-1.5 rounded-full bg-(--gold)" />
              </div>
            </div>

            {/* ── Content card ── */}
            <div data-timeline-item className="pb-2">
              {/* Mobile year */}
              <span className="font-(family-name:--font-display) text-lg text-(--gold) md:hidden">
                {m.year}
              </span>
              <h3 className="text-card-title text-(--text-primary) md:mt-0 mt-1">
                {m.title}
              </h3>
              <p className="text-body mt-2 text-sm leading-relaxed">
                {m.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
