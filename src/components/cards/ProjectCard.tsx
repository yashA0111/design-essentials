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
      
      {/* Layer 1: Subtle full-card tint — barely visible */}
      <div className="absolute inset-0 bg-black/10" />

      {/* Layer 2: Bottom gradient — ONLY bottom 55%, strong there */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.55) 35%, rgba(0,0,0,0.0) 65%)'
      }} />

      {/* Text content sits above both layers — z-10 */}
      <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
        <h3 className="text-white font-medium text-xl">{project.title}</h3>
        <p className="text-white/75 text-sm mt-1">{project.location} · {project.year}</p>
      </div>

      {/* Badge stays top-left — z-10 */}
      <div className="absolute top-5 left-5 z-10">
        <Badge className="border-none bg-black/70 text-white backdrop-blur-sm">
          {service?.name ?? project.category}
        </Badge>
      </div>
    </Link>
  );
}
