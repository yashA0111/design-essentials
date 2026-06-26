import Link from "next/link";
import {
  Building2,
  Container,
  House,
  Landmark,
  Layers,
  Presentation,
  type LucideIcon,
} from "lucide-react";
import type { Service } from "@/types/service";
import { ImageWithFallback } from "@/components/common/ImageWithFallback";
import { cn } from "@/lib/utils";

const iconMap: Record<string, LucideIcon> = {
  House,
  Container,
  Landmark,
  Presentation,
  Layers,
  Building2,
};

type ServiceCardProps = {
  service: Service;
  className?: string;
  variant?: "grid" | "detailed";
};

export function ServiceCard({
  service,
  className,
  variant = "grid",
}: ServiceCardProps) {
  const Icon = iconMap[service.icon] ?? House;

  return (
    <Link
      href={`/services/${service.slug}`}
      data-theme="dark"
      className={cn(
        "group relative block min-h-[380px] overflow-hidden rounded-sm",
        variant === "detailed" && "min-h-[420px]",
        className
      )}
    >
      <ImageWithFallback
        src={service.cardImage}
        alt={`${service.name} — Design Essentials service`}
        fill
        sizes="(max-width: 768px) 100vw, 33vw"
        className="transition-transform duration-[var(--dur-base)] ease-[var(--ease-out-expo)] group-hover:scale-[1.02]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--void)]/85 via-[var(--void)]/40 to-transparent transition-opacity duration-[var(--dur-base)] group-hover:opacity-90" />
      <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
        <Icon className="mb-4 h-7 w-7 text-[var(--gold)]" strokeWidth={1.5} />
        <h3 className="text-card-title mb-2 text-[var(--text-primary)]">
          {service.name}
        </h3>
        <p className="text-body mb-4 line-clamp-2 text-sm">
          {service.shortDescription}
        </p>
        <span className="text-nav translate-y-4 text-[var(--gold)] opacity-0 transition-all duration-[var(--dur-base)] group-hover:translate-y-0 group-hover:opacity-100">
          Explore →
        </span>
      </div>
    </Link>
  );
}
