import type { Project } from "@/types/project";
import { getServiceById } from "@/lib/data/services";
import { Badge } from "@/components/ui/badge";
import { OverlayCard } from "@/components/cards/OverlayCard";
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
    <OverlayCard
      href={`/projects/${project.slug}`}
      image={project.heroImage}
      imageFallback={project.heroImageFallback}
      imageAlt={`${project.title} — ${project.location}`}
      title={project.title}
      subtitle={`${project.location} · ${project.year}`}
      sizes={
        size === "large"
          ? "(max-width: 768px) 100vw, 66vw"
          : "(max-width: 768px) 100vw, 33vw"
      }
      corner={
        <Badge className="border-none bg-black/70 text-white backdrop-blur-sm">
          {service?.name ?? project.category}
        </Badge>
      }
      className={cn(
        size === "large" ? "min-h-[520px]" : "min-h-[360px]",
        className
      )}
    />
  );
}
