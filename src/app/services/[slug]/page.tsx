import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Building2,
  Container,
  Check,
  House,
  Landmark,
  Layers,
  Presentation,
  type LucideIcon,
} from "lucide-react";
import { services, getServiceBySlug } from "@/lib/data/services";
import { getRelatedProjects } from "@/lib/data/projects";
import { SectionLabel } from "@/components/common/SectionLabel";
import { ImageWithFallback } from "@/components/common/ImageWithFallback";
import { ProjectCard } from "@/components/cards/ProjectCard";
import { ContactCTASection } from "@/components/sections/ContactCTASection";

const iconMap: Record<string, LucideIcon> = {
  House,
  Container,
  Landmark,
  Presentation,
  Layers,
  Building2,
};

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return {};
  return {
    title: service.seo.metaTitle,
    description: service.seo.metaDescription,
    keywords: service.seo.keywords,
  };
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  const Icon = iconMap[service.icon] ?? House;
  const relatedProjects = getRelatedProjects(service.id, "", 3);

  return (
    <>
      <section className="relative flex min-h-[60vh] items-end pt-20">
        <div className="absolute inset-0">
          <ImageWithFallback
            src={service.heroImage}
            fallbackSrc={service.heroImageFallback}
            alt={`${service.name} — hero image`}
            fill
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--void)] via-[var(--void)]/50 to-transparent" />
        </div>
        <div className="container relative z-10 section-padding">
          <Icon className="mb-4 h-8 w-8 text-[var(--gold)]" strokeWidth={1.5} />
          <h1 className="text-section text-[var(--text-primary)]">
            {service.name}
          </h1>
          <p className="text-body mt-4 max-w-2xl text-lg">{service.tagline}</p>
        </div>
      </section>

      <section data-theme="light" className="section-padding bg-[var(--void)]">
        <div className="container max-w-3xl">
          <SectionLabel className="mb-6">OVERVIEW</SectionLabel>
          <p className="text-body text-lg">{service.description}</p>
        </div>
      </section>

      <section data-theme="light" className="section-padding bg-[var(--surface)]">
        <div className="container">
          <SectionLabel className="mb-6">WHAT WE OFFER</SectionLabel>
          <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {service.features.map((feature) => (
              <li
                key={feature}
                className="flex items-start gap-3 text-[var(--text-secondary)]"
              >
                <Check className="mt-1 h-4 w-4 shrink-0 text-[var(--gold)]" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section data-theme="light" className="section-padding bg-[var(--void)]">
        <div className="container">
          <SectionLabel className="mb-6">OUR PROCESS</SectionLabel>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {service.process.map((step) => (
              <div
                key={step.step}
                className="border border-[var(--border)] p-6"
              >
                <span className="font-[family-name:var(--font-display)] text-3xl text-[var(--gold)]">
                  {String(step.step).padStart(2, "0")}
                </span>
                <h3 className="text-card-title mt-3 text-[var(--text-primary)]">
                  {step.title}
                </h3>
                <p className="text-body mt-2 text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section data-theme="light" className="section-padding bg-[var(--surface)]">
        <div className="container">
          <SectionLabel className="mb-6">GALLERY</SectionLabel>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[service.heroImage, service.cardImage, service.heroImage].map(
              (img, i) => (
                <div
                  key={`${service.id}-gallery-${i}`}
                  className="relative aspect-[4/3] overflow-hidden rounded-sm"
                >
                  <ImageWithFallback
                    src={img}
                    fallbackSrc={i === 1 ? service.cardImageFallback : service.heroImageFallback}
                    alt={`${service.name} gallery image ${i + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {relatedProjects.length > 0 && (
        <section data-theme="light" className="section-padding bg-[var(--void)]">
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

      <section data-theme="light" className="section-padding bg-[var(--surface)]">
        <div className="container text-center">
          <Link
            href="/contact"
            className="text-nav inline-block rounded-full bg-[var(--gold)] px-8 py-3 text-[var(--void)] transition-colors hover:bg-[var(--gold-muted)]"
          >
            Start Your {service.name} Project
          </Link>
        </div>
      </section>

      <ContactCTASection />
    </>
  );
}
