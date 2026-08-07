"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { stats } from "@/lib/data/stats";
import { useScrollReveal } from "@/components/animations/useScrollReveal";

gsap.registerPlugin(ScrollTrigger);

function StatItem({
  value,
  suffix,
  label,
}: {
  value: number;
  suffix: string;
  label: string;
}) {
  const displayRef = useRef<HTMLSpanElement>(null);
  const elementRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef({ val: 0 });

  useEffect(() => {
    if (!elementRef.current || !displayRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(counterRef.current, {
        val: value,
        duration: 1.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: elementRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
        onUpdate: () => {
          if (displayRef.current) {
            displayRef.current.textContent =
              Math.round(counterRef.current.val) + suffix;
          }
        },
      });
    });

    return () => ctx.revert();
  }, [value, suffix]);

  return (
    <div ref={elementRef} className="text-center">
      <span
        ref={displayRef}
        className="font-(family-name:--font-display) text-5xl text-(--gold) md:text-6xl"
      >
        {`0${suffix}`}
      </span>
      <p className="text-nav mt-3 text-(--text-secondary)">{label}</p>
    </div>
  );
}

export function StatsSection() {
  const ref = useScrollReveal();

  return (
    <section ref={ref} className="section-padding stats-grid-bg">
      <div className="container">
        <div className="grid grid-cols-2 gap-12 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.id} data-reveal>
              <StatItem
                value={stat.value}
                suffix={stat.suffix}
                label={stat.label}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
