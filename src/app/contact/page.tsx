import type { Metadata } from "next";
import { SITE } from "@/lib/constants";
import { SectionLabel } from "@/components/common/SectionLabel";
import { ContactForm } from "@/components/common/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Design Essentials to start your architectural or interior design project. Based in Noida, serving clients across India.",
};

export default function ContactPage() {
  return (
    <section className="section-padding pt-32">
      <div className="container">
        <SectionLabel className="mb-6">GET IN TOUCH</SectionLabel>
        <h1 className="text-section mb-16 text-(--text-primary)">
          Start Your Project
        </h1>

        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[40%_60%]">
          <div>
            <h2 className="text-card-title mb-6 text-(--text-primary)">
              Contact Information
            </h2>
            <address className="text-body space-y-4 not-italic">
              <p>{SITE.address.full}</p>
              <p>
                <a
                  href={`mailto:${SITE.email}`}
                  className="transition-colors hover:text-(--gold)"
                >
                  {SITE.email}
                </a>
              </p>
              <p>
                <a
                  href={`tel:${SITE.phone.replace(/\s/g, "")}`}
                  className="transition-colors hover:text-(--gold)"
                >
                  {SITE.phone}
                </a>
              </p>
            </address>

            <div className="mt-8 flex gap-4">
              {Object.entries(SITE.socials).map(([key, href]) => (
                <a
                  key={key}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-nav capitalize text-(--text-secondary) transition-colors hover:text-(--gold)"
                >
                  {key}
                </a>
              ))}
            </div>

            <div className="mt-12 aspect-video overflow-hidden rounded-sm border border-border bg-(--surface)">
              <iframe
                title="Design Essentials office location map"
                src="https://maps.google.com/maps?q=Noida+Sector+18&t=&z=13&ie=UTF8&iwloc=&output=embed"
                className="h-full w-full border-0"
                loading="lazy"
              />
            </div>
          </div>

          <div>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
