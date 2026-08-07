import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { projects, getProjectBySlug } from "@/lib/data/projects";
import { getServiceById } from "@/lib/data/services";
import { toSlugParams } from "@/lib/data/query";
import { metadataFromSeo } from "@/lib/seo";
import { GOLD_LINK } from "@/lib/styles";
import type { SlugPageProps } from "@/types/page";
import { SectionLabel } from "@/components/common/SectionLabel";
import { HeroBackdrop } from "@/components/common/HeroBackdrop";
import { GalleryImage } from "@/components/common/GalleryImage";
import { ContactCTASection } from "@/components/sections/ContactCTASection";

export async function generateStaticParams() {
  return toSlugParams(projects);
}

export async function generateMetadata({
  params,
}: SlugPageProps): Promise<Metadata> {
  const { slug } = await params;
  return metadataFromSeo(getProjectBySlug(slug)?.seo);
}

export default async function ProjectDetailPage({ params }: SlugPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const service = getServiceById(project.category);
  const currentIndex = projects.findIndex((p) => p.slug === slug);
  const nextProject = projects[(currentIndex + 1) % projects.length];

  return (
    <>
      <section className="relative min-h-[70vh] pt-20">
        <HeroBackdrop
          src={project.heroImage}
          alt={`${project.title} — ${project.location}`}
          overlayClassName="via-(--void)/40"
        />
        <div className="container relative z-10 flex min-h-[70vh] flex-col justify-end section-padding">
          <p className="text-eyebrow mb-4">{service?.name}</p>
          <h1 className="text-section text-(--text-primary)">
            {project.title}
          </h1>
        </div>
      </section>

      <section className="section-padding">
        <div className="container">
          <div className="mb-12 grid grid-cols-2 gap-6 md:grid-cols-4">
            {[
              { label: "Client", value: project.client },
              { label: "Category", value: service?.name ?? project.category },
              { label: "Year", value: String(project.year) },
              { label: "Location", value: project.location },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-eyebrow mb-1 text-(--text-tertiary)">
                  {item.label}
                </p>
                <p className="text-nav text-(--text-primary)">
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

      <section className="section-padding bg-(--surface)">
        <div className="container">
          <div className="columns-1 gap-4 md:columns-2 lg:columns-3">
            {project.galleryImages.map((img, i) => (
              <GalleryImage
                key={`${project.id}-img-${i}`}
                src={img}
                alt={`${project.title} gallery image ${i + 1}`}
                className="mb-4 break-inside-avoid"
              />
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
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

      <section className="border-t border-border section-padding">
        <div className="container flex items-center justify-between">
          <span className="text-nav text-(--text-tertiary)">
            Next Project
          </span>
          <Link
            href={`/projects/${nextProject.slug}`}
            className={`text-card-title ${GOLD_LINK}`}
          >
            {nextProject.title} →
          </Link>
        </div>
      </section>

      <ContactCTASection />
    </>
  );
}
