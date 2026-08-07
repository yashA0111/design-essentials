import type { Metadata } from "next";
import { services } from "@/lib/data/services";
import { PageHeader } from "@/components/common/PageHeader";
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
      <PageHeader
        eyebrow="OUR SERVICES"
        title="Complete Design Solutions"
        description="Six domains, one vision — from concept to completion, we deliver spaces that inspire across every scale and sector."
      />

      <section className="section-padding pt-0">
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
