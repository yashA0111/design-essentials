"use client";

import { useState } from "react";
import { projects } from "@/lib/data/projects";
import { PROJECT_FILTERS } from "@/lib/constants";
import { ProjectCard } from "@/components/cards/ProjectCard";
import { cn } from "@/lib/utils";

export function ProjectsGrid() {
  const [filter, setFilter] = useState("all");
  const filtered =
    filter === "all"
      ? projects
      : projects.filter((p) => p.category === filter);

  return (
    <>
      <div className="mb-12 flex flex-wrap gap-3">
        {PROJECT_FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
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

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </>
  );
}
