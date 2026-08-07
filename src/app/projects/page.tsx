import type { Metadata } from "next";
import { PageHeader } from "@/components/common/PageHeader";
import { ProjectsGrid } from "@/components/sections/ProjectsGrid";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Explore Design Essentials portfolio — pre-engineered homes, container architecture, museum interiors, exhibitions, experience centers, and office spaces.",
};

export default function ProjectsPage() {
  return (
    <>
      <PageHeader
        eyebrow="PORTFOLIO"
        title="Our Projects"
        description="A selection of completed work across our six design domains — each project a testament to precision, innovation, and craft."
      />

      <section className="section-padding pt-0">
        <div className="container">
          <ProjectsGrid />
        </div>
      </section>
    </>
  );
}
