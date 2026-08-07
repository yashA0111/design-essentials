import type { Metadata } from "next";
import { projectsPageContent } from "@/lib/data/siteContent";
import { SectionLabel } from "@/components/common/SectionLabel";
import { ProjectsGrid } from "@/components/sections/ProjectsGrid";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Explore Design Essentials portfolio — pre-engineered homes, container architecture, museum interiors, exhibitions, experience centers, and office spaces.",
};

export default function ProjectsPage() {
  return (
    <>
      <section data-theme="light" className="section-padding bg-[var(--void)] pt-32">
        <div className="container">
          <SectionLabel className="mb-6">{projectsPageContent.eyebrow}</SectionLabel>
          <h1 className="text-section mb-6 text-[var(--text-primary)]">
            {projectsPageContent.title}
          </h1>
          <p className="text-body max-w-2xl text-lg">
            {projectsPageContent.intro}
          </p>
        </div>
      </section>

      <section data-theme="light" className="section-padding bg-[var(--void)] pt-0">
        <div className="container">
          <ProjectsGrid />
        </div>
      </section>
    </>
  );
}
