import type { Metadata } from "next";
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
      <section className="section-padding pt-32">
        <div className="container">
          <SectionLabel className="mb-6">PORTFOLIO</SectionLabel>
          <h1 className="text-section mb-6 text-(--text-primary)">
            Our Projects
          </h1>
          <p className="text-body max-w-2xl text-lg">
            A selection of completed work across our six design domains —
            each project a testament to precision, innovation, and craft.
          </p>
        </div>
      </section>

      <section className="section-padding pt-0">
        <div className="container">
          <ProjectsGrid />
        </div>
      </section>
    </>
  );
}
