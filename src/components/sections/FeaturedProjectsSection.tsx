"use client";

import Link from "next/link";
import { getFeaturedProjects } from "@/lib/data/projects";
import { SectionLabel } from "@/components/common/SectionLabel";
import { SplitTitle } from "@/components/common/SplitTitle";
import { ProjectCard } from "@/components/cards/ProjectCard";
import { useScrollReveal } from "@/components/animations/useScrollReveal";

export function FeaturedProjectsSection() {
  const ref = useScrollReveal();
  const featured = getFeaturedProjects();

  return (
    <section ref={ref} data-theme="light" className="section-padding bg-[var(--surface)]">
      <div className="container">
        <div className="mb-16 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div data-reveal>
            <SectionLabel className="mb-6">SELECTED WORK</SectionLabel>
            <SplitTitle rest="Projects That" italicWord="Define Excellence" />
          </div>
          <Link
            data-reveal
            href="/projects"
            className="text-nav text-[var(--gold)] transition-colors hover:text-[var(--gold-muted)]"
          >
            All Projects →
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {featured[0] && (
            <div data-reveal className="md:col-span-2 md:row-span-1">
              <ProjectCard project={featured[0]} size="large" />
            </div>
          )}
          {featured.slice(1).map((project) => (
            <div key={project.id} data-reveal>
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
