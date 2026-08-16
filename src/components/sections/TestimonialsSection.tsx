"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { testimonials as staticTestimonials } from "@/lib/data/testimonials";
import { TestimonialCard } from "@/components/cards/TestimonialCard";
import { SectionLabel } from "@/components/common/SectionLabel";
import type { Testimonial } from "@/types/testimonial";

export function TestimonialsSection({
  initialTestimonials = staticTestimonials,
}: {
  initialTestimonials?: Testimonial[];
} = {}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const testimonials = initialTestimonials.length > 0 ? initialTestimonials : staticTestimonials;

  useEffect(() => {
    if (paused || testimonials.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [paused, testimonials.length]);

  return (
    <section
      data-theme="light"
      className="section-padding bg-[var(--surface)]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="container">
        <SectionLabel className="mb-16 justify-center">
          CLIENT VOICES
        </SectionLabel>
        <AnimatePresence mode="wait">
          <motion.div
            key={testimonials[index].id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <TestimonialCard testimonial={testimonials[index]} />
          </motion.div>
        </AnimatePresence>
        <div className="mt-10 flex justify-center gap-2">
          {testimonials.map((t, i) => (
            <button
              key={t.id}
              type="button"
              aria-label={`View testimonial ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === index
                  ? "w-8 bg-[var(--gold)]"
                  : "w-1.5 bg-[var(--border)]"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
