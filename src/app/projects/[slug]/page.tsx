import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { projects, getProjectBySlug } from "@/lib/data/projects";
import { getServiceById } from "@/lib/data/services";
import { SectionLabel } from "@/components/common/SectionLabel";
import { ImageWithFallback } from "@/components/common/ImageWithFallback";
import { ContactCTASection } from "@/components/sections/ContactCTASection";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: project.seo.metaTitle,
    description: project.seo.metaDescription,
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const service = getServiceById(project.category);
  const currentIndex = projects.findIndex((p) => p.slug === slug);
  const nextProject = projects[(currentIndex + 1) % projects.length];

  return (
    <>
      <section className="relative min-h-[70vh] pt-20">
        <div className="absolute inset-0">
          <ImageWithFallback
            src={project.heroImage}
            alt={`${project.title} — ${project.location}`}
            fill
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--void)] via-[var(--void)]/40 to-transparent" />
        </div>
        <div className="container relative z-10 flex min-h-[70vh] flex-col justify-end section-padding">
          <p className="text-eyebrow mb-4">{service?.name}</p>
          <h1 className="text-section text-[var(--text-primary)]">
            {project.title}
          </h1>
        </div>
      </section>

      <section data-theme="light" className="section-padding bg-[var(--void)]">
        <div className="container">
          <div className="mb-12 grid grid-cols-2 gap-6 md:grid-cols-4">
            {[
              { label: "Client", value: project.client },
              { label: "Category", value: service?.name ?? project.category },
              { label: "Year", value: String(project.year) },
              { label: "Location", value: project.location },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-eyebrow mb-1 text-[var(--text-tertiary)]">
                  {item.label}
                </p>
                <p className="text-nav text-[var(--text-primary)]">
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          <div className="max-w-3xl">
            <SectionLabel className="mb-6">OVERVIEW</SectionLabel>
            <p className="text-body text-lg">{project.description}</p>
          </div>
        </div>
      </section>

      <section data-theme="light" className="section-padding bg-[var(--surface)]">
        <div className="container">
          <div className="columns-1 gap-4 md:columns-2 lg:columns-3">
            {project.galleryImages.map((img, i) => (
              <div
                key={`${project.id}-img-${i}`}
                className="relative mb-4 aspect-[4/3] break-inside-avoid overflow-hidden rounded-sm"
              >
                <ImageWithFallback
                  src={img}
                  alt={`${project.title} gallery image ${i + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section data-theme="light" className="section-padding bg-[var(--void)]">
        <div className="container grid grid-cols-1 gap-12 md:grid-cols-2">
          <div>
            <SectionLabel className="mb-6">THE CHALLENGE</SectionLabel>
            <p className="text-body text-lg">{project.challenge}</p>
          </div>
          <div>
            <SectionLabel className="mb-6">THE SOLUTION</SectionLabel>
            <p className="text-body text-lg">{project.solution}</p>
          </div>
        </div>
      </section>

      <section data-theme="light" className="border-t border-[var(--border)] bg-[var(--void)] section-padding">
        <div className="container flex items-center justify-between">
          <span className="text-nav text-[var(--text-tertiary)]">
            Next Project
          </span>
          <Link
            href={`/projects/${nextProject.slug}`}
            className="text-card-title text-[var(--gold)] transition-colors hover:text-[var(--gold-muted)]"
          >
            {nextProject.title} →
          </Link>
        </div>
      </section>

      <ContactCTASection />
    </>
  );
}
