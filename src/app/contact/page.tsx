import type { Metadata } from "next";
import { SITE } from "@/lib/constants";
import { contactPageContent } from "@/lib/data/siteContent";
import { SectionLabel } from "@/components/common/SectionLabel";
import { ContactForm } from "@/components/common/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Design Essentials to start your architectural or interior design project. Based in Noida, serving clients across India.",
};

export default function ContactPage() {
  return (
    <section
      data-theme="light"
      className="min-h-screen bg-[var(--void)] pt-32 pb-24 lg:pt-40 lg:pb-32"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16 items-start">
          {/* Left Column: Heading, Intro & Direct Contact Info */}
          <div className="lg:col-span-5">
            <SectionLabel className="mb-6">
              {contactPageContent.eyebrow}
            </SectionLabel>
            
            <h1 className="font-(family-name:--font-display) text-[clamp(36px,4.5vw,56px)] font-light leading-[1.1] text-[var(--text-primary)]">
              {contactPageContent.headingLine1}{" "}
              <em className="font-light italic text-[var(--gold)]">
                {contactPageContent.headingItalic}
              </em>
              <br />
              {contactPageContent.headingLine2}
            </h1>
            
            <p className="text-body mt-6 text-[var(--text-secondary)] text-base leading-relaxed">
              {contactPageContent.intro}
            </p>

            {/* Direct Contact Info */}
            <div className="mt-12 space-y-8 border-t border-[var(--border)] pt-8">
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-1">
                <div className="min-w-0">
                  <p className="text-eyebrow mb-2 text-[var(--text-tertiary)]">
                    Email
                  </p>
                  <a
                    href={`mailto:${SITE.email}`}
                    className="text-body text-sm text-[var(--text-primary)] transition-colors hover:text-[var(--gold)] break-words [overflow-wrap:anywhere]"
                  >
                    {SITE.email}
                  </a>
                </div>

                <div>
                  <p className="text-eyebrow mb-2 text-[var(--text-tertiary)]">
                    Phone
                  </p>
                  <a
                    href={`tel:${SITE.phone.replace(/\s/g, "")}`}
                    className="text-body text-sm text-[var(--text-primary)] transition-colors hover:text-[var(--gold)]"
                  >
                    {SITE.phone}
                  </a>
                </div>

                <div>
                  <p className="text-eyebrow mb-2 text-[var(--text-tertiary)]">
                    Studio
                  </p>
                  <address className="text-body text-sm not-italic text-[var(--text-primary)]">
                    {SITE.address.full}
                  </address>
                </div>

                <div>
                  <p className="text-eyebrow mb-3 text-[var(--text-tertiary)]">
                    Follow
                  </p>
                  <div className="flex flex-wrap gap-x-5 gap-y-1">
                    {Object.entries(SITE.socials).map(([key, href]) => (
                      <a
                        key={key}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-nav text-xs capitalize text-[var(--text-secondary)] transition-colors hover:text-[var(--gold)]"
                      >
                        {key}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
