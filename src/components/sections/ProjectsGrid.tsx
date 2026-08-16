"use client";

import { useState } from "react";
import { projects } from "@/lib/data/projects";
import { services } from "@/lib/data/services";
import { ProjectCard } from "@/components/cards/ProjectCard";
import { cn } from "@/lib/utils";
import type { Project } from "@/types/project";
import type { Service } from "@/types/service";

export function ProjectsGrid({
  initialProjects = projects,
  initialServices = services,
}: {
  initialProjects?: Project[];
  initialServices?: Service[];
} = {}) {
  const [filter, setFilter] = useState("all");

  const filters = [
    { value: "all", label: "All" },
    ...initialServices
      .filter((service) => initialProjects.some((p) => p.category === service.id))
      .map((service) => ({ value: service.id, label: service.name })),
  ];

  const filtered =
    filter === "all"
      ? initialProjects
      : initialProjects.filter((p) => p.category === filter);

  return (
    <>
      <div className="mb-12 flex flex-wrap gap-3">
        {filters.map((f) => (
          <button
            key={f.value}
            type="button"
            aria-pressed={filter === f.value}
            onClick={() => setFilter(f.value)}
            className={cn(
              "text-nav rounded-full border px-5 py-2 transition-colors",
              filter === f.value
                ? "border-[var(--gold)] bg-[var(--gold)] text-[var(--void)]"
                : "border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--gold-muted)]"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-body py-16 text-center">
          No projects in this category yet — explore the full portfolio.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </>
  );
}
