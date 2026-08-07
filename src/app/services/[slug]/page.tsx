import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Check } from "lucide-react";
import { services, getServiceBySlug } from "@/lib/data/services";
import { getRelatedProjects } from "@/lib/data/projects";
import { toSlugParams } from "@/lib/data/query";
import {
  FALLBACK_SERVICE_ICON,
  SERVICE_ICONS,
} from "@/lib/serviceIcons";
import { metadataFromSeo } from "@/lib/seo";
import { GOLD_BUTTON } from "@/lib/styles";
import type { SlugPageProps } from "@/types/page";
import { SectionLabel } from "@/components/common/SectionLabel";
import { HeroBackdrop } from "@/components/common/HeroBackdrop";
import { GalleryImage } from "@/components/common/GalleryImage";
import { ProcessStepCard } from "@/components/cards/ProcessStepCard";
import { ProjectCard } from "@/components/cards/ProjectCard";
import { ContactCTASection } from "@/components/sections/ContactCTASection";

export async function generateStaticParams() {
  return toSlugParams(services);
}

export async function generateMetadata({
  params,
}: SlugPageProps): Promise<Metadata> {
  const { slug } = await params;
  return metadataFromSeo(getServiceBySlug(slug)?.seo);
}

export default async function ServiceDetailPage({ params }: SlugPageProps) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  const Icon = SERVICE_ICONS[service.icon] ?? FALLBACK_SERVICE_ICON;
  const relatedProjects = getRelatedProjects(service.id, "", 3);

  return (
    <>
      <section className="relative flex min-h-[60vh] items-end pt-20">
        <HeroBackdrop
          src={service.heroImage}
          alt={`${service.name} — hero image`}
        />
        <div className="container relative z-10 section-padding">
          <Icon className="mb-4 h-8 w-8 text-(--gold)" strokeWidth={1.5} />
          <h1 className="text-section text-(--text-primary)">
            {service.name}
          </h1>
          <p className="text-body mt-4 max-w-2xl text-lg">{service.tagline}</p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container max-w-3xl">
          <SectionLabel className="mb-6">OVERVIEW</SectionLabel>
          <p className="text-body text-lg">{service.description}</p>
        </div>
      </section>

      <section className="section-padding bg-(--surface)">
        <div className="container">
          <SectionLabel className="mb-6">WHAT WE OFFER</SectionLabel>
          <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {service.features.map((feature) => (
              <li
                key={feature}
                className="flex items-start gap-3 text-(--text-secondary)"
              >
                <Check className="mt-1 h-4 w-4 shrink-0 text-(--gold)" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section-padding">
        <div className="container">
          <SectionLabel className="mb-6">OUR PROCESS</SectionLabel>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {service.process.map((step) => (
              <ProcessStepCard key={step.step} step={step} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-(--surface)">
        <div className="container">
          <SectionLabel className="mb-6">GALLERY</SectionLabel>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[service.heroImage, service.cardImage, service.heroImage].map(
              (img, i) => (
                <GalleryImage
                  key={`${service.id}-gallery-${i}`}
                  src={img}
                  alt={`${service.name} gallery image ${i + 1}`}
                />
              )
            )}
          </div>
        </div>
      </section>

      {relatedProjects.length > 0 && (
        <section className="section-padding">
          <div className="container">
            <SectionLabel className="mb-6">RELATED PROJECTS</SectionLabel>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {relatedProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section-padding bg-(--surface)">
        <div className="container text-center">
          <Link
            href="/contact"
            className={`text-nav inline-block px-8 py-3 ${GOLD_BUTTON}`}
          >
            Start Your {service.name} Project
          </Link>
        </div>
      </section>

      <ContactCTASection />
    </>
  );
}
