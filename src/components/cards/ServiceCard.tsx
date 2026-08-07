import Link from "next/link";
import type { Service } from "@/types/service";
import {
  FALLBACK_SERVICE_ICON,
  SERVICE_ICONS,
} from "@/lib/serviceIcons";
import { ImageWithFallback } from "@/components/common/ImageWithFallback";
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
  const Icon = SERVICE_ICONS[service.icon] ?? FALLBACK_SERVICE_ICON;

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
        alt={`${service.name} — Design Essentials service`}
        fill
        sizes="(max-width: 768px) 100vw, 33vw"
        className="transition-transform duration-(--dur-base) ease-(--ease-out-expo) group-hover:scale-[1.02]"
      />
      <div className="absolute inset-0 bg-linear-to-t from-(--void)/85 via-(--void)/40 to-transparent transition-opacity duration-(--dur-base) group-hover:opacity-90" />
      <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
        <Icon className="mb-4 h-7 w-7 text-(--gold)" strokeWidth={1.5} />
        <h3 className="text-card-title mb-2 text-(--text-primary) text-on-image">
          {service.name}
        </h3>
        <p className="text-body mb-4 line-clamp-2 text-sm text-on-image">
          {service.shortDescription}
        </p>
        <span className="text-nav translate-y-4 text-(--gold) opacity-0 transition-all duration-(--dur-base) group-hover:translate-y-0 group-hover:opacity-100 text-on-image">
          Explore →
        </span>
      </div>
    </Link>
  );
}
