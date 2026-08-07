import type { Service } from "@/types/service";
import { ServiceIcon } from "@/components/common/ServiceIcon";
import { OverlayCard } from "@/components/cards/OverlayCard";
import { cn } from "@/lib/utils";

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
  return (
    <OverlayCard
      href={`/services/${service.slug}`}
      image={service.cardImage}
      imageFallback={service.cardImageFallback}
      imageAlt={`${service.name} — Design Essentials service`}
      title={service.name}
      subtitle={service.tagline}
      corner={
        <ServiceIcon icon={service.icon} className="h-7 w-7 text-[var(--gold)]" />
      }
      className={cn(
        variant === "detailed" ? "min-h-[420px]" : "min-h-[380px]",
        className
      )}
    />
  );
}
