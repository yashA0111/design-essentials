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
      className={cn(
        "group relative block min-h-[380px] overflow-hidden rounded-sm",
        variant === "detailed" && "min-h-[420px]",
        className
      )}
    >
      <ImageWithFallback
        src={service.cardImage}
        fallbackSrc={service.cardImageFallback}
        alt={`${service.name} — Design Essentials service`}
        fill
        sizes="(max-width: 768px) 100vw, 33vw"
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
        <h3 className="text-white font-medium text-xl">{service.name}</h3>
        <p className="text-white/75 text-sm mt-1">{service.tagline}</p>
      </div>

      {/* Icon stays top-left — z-10 */}
      <div className="absolute top-5 left-5 z-10">
        <Icon className="text-[var(--gold)] w-7 h-7" />
      </div>
    </Link>
  );
}
