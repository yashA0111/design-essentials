import type { Metadata } from "next";
import { services } from "@/lib/data/services";
import { servicesPageContent } from "@/lib/data/siteContent";
import { SectionLabel } from "@/components/common/SectionLabel";
import { ServiceCard } from "@/components/cards/ServiceCard";
import { ContactCTASection } from "@/components/sections/ContactCTASection";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Explore Design Essentials services — pre-engineered homes, container architecture, museum interiors, exhibition design, experience centers, and office interiors.",
};

export default function ServicesPage() {
  return (
    <>
      <section data-theme="light" className="section-padding bg-[var(--void)] pt-32">
        <div className="container">
          <SectionLabel className="mb-6">{servicesPageContent.eyebrow}</SectionLabel>
          <h1 className="text-section mb-6 text-[var(--text-primary)]">
            {servicesPageContent.title}
          </h1>
          <p className="text-body max-w-2xl text-lg">
            {servicesPageContent.intro}
          </p>
        </div>
      </section>

      <section data-theme="light" className="section-padding bg-[var(--void)] pt-0">
        <div className="container grid grid-cols-1 gap-8 md:grid-cols-2">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              variant="detailed"
            />
          ))}
        </div>
      </section>

      <ContactCTASection />
    </>
  );
}
