"use client";

import { services } from "@/lib/data/services";
import { SectionLabel } from "@/components/common/SectionLabel";
import { SplitTitle } from "@/components/common/SplitTitle";
import { ServiceCard } from "@/components/cards/ServiceCard";
import { useScrollReveal } from "@/components/animations/useScrollReveal";
import type { Service } from "@/types/service";

export function ServicesSection({
  initialServices = services,
}: {
  initialServices?: Service[];
} = {}) {
  const ref = useScrollReveal(0.08);

  return (
    <section ref={ref} data-theme="light" className="section-padding bg-[var(--void)]">
      <div className="container">
        <div data-reveal className="mb-16 max-w-2xl">
          <SectionLabel className="mb-6">OUR SERVICES</SectionLabel>
          <SplitTitle rest="Six Domains," italicWord="One Vision" />
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {initialServices.map((service) => (
            <div key={service.id} data-reveal>
              <ServiceCard service={service} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
