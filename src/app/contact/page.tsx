import type { Metadata } from "next";
import { PageHeader } from "@/components/common/PageHeader";
import { ContactDetails } from "@/components/common/ContactDetails";
import { ContactForm } from "@/components/common/ContactForm";
import { SocialLinks } from "@/components/common/SocialLinks";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Design Essentials to start your architectural or interior design project. Based in Noida, serving clients across India.",
};

export default function ContactPage() {
  return (
    <PageHeader
      eyebrow="GET IN TOUCH"
      title="Start Your Project"
      titleClassName="mb-16"
    >
      <div className="grid grid-cols-1 gap-16 lg:grid-cols-[40%_60%]">
        <div>
          <h2 className="text-card-title mb-6 text-(--text-primary)">
            Contact Information
          </h2>
          <ContactDetails className="space-y-4" />

          <SocialLinks className="mt-8" />

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
    </PageHeader>
  );
}
