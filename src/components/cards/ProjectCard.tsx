import Link from "next/link";
import type { Project } from "@/types/project";
import { getServiceById } from "@/lib/data/services";
import { ImageWithFallback } from "@/components/common/ImageWithFallback";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type ProjectCardProps = {
  project: Project;
  className?: string;
  size?: "default" | "large";
};

export function ProjectCard({
  project,
  className,
  size = "default",
}: ProjectCardProps) {
  const service = getServiceById(project.category);

  return (
    <Link
      href={`/projects/${project.slug}`}
      className={cn(
        "group relative block overflow-hidden rounded-sm",
        size === "large" ? "min-h-[520px]" : "min-h-[360px]",
        className
      )}
    >
      <ImageWithFallback
        src={project.heroImage}
        alt={`${project.title} — ${project.location}`}
        fill
        sizes={
          size === "large"
            ? "(max-width: 768px) 100vw, 66vw"
            : "(max-width: 768px) 100vw, 33vw"
        }
        className="transition-transform duration-[var(--dur-base)] ease-[var(--ease-out-expo)] group-hover:scale-[1.02]"
      />
      <Badge className="absolute top-4 left-4 border-[var(--border)] bg-[var(--void)]/70 text-[var(--text-secondary)] backdrop-blur-sm">
        {service?.name ?? project.category}
      </Badge>
      <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-[var(--void)] via-transparent to-transparent p-6 opacity-0 transition-opacity duration-[var(--dur-base)] group-hover:opacity-100">
        <h3 className="text-card-title text-[var(--text-primary)]">
          {project.title}
        </h3>
        <p className="text-nav mt-1 text-[var(--text-secondary)]">
          {project.year} · {project.location}
        </p>
        <span className="text-nav mt-3 text-[var(--gold)]">View →</span>
      </div>
      <div className="absolute inset-x-0 bottom-0 p-6 transition-opacity duration-[var(--dur-base)] group-hover:opacity-0">
        <h3 className="text-card-title text-[var(--text-primary)]">
          {project.title}
        </h3>
      </div>
    </Link>
  );
}
