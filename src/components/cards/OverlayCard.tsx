import { ImageWithFallback } from "@/components/common/ImageWithFallback";
import { cn } from "@/lib/utils";

type OverlayCardProps = {
  href: string;
  image: string;
  imageFallback?: string;
  imageAlt: string;
  title: string;
  subtitle: string;
  /** Rendered in the top-left corner above the overlay (badge, icon…). */
  corner?: React.ReactNode;
  sizes?: string;
  className?: string;
};

/**
 * Image tile with a bottom gradient scrim, shared by project and service cards.
 */
export function OverlayCard({
  href,
  image,
  imageFallback,
  imageAlt,
  title,
  subtitle,
  corner,
  sizes = "(max-width: 768px) 100vw, 33vw",
  className,
}: OverlayCardProps) {
  return (
    <a
      href={href}
      className={cn(
        "group relative block overflow-hidden rounded-sm",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold)]",
        className
      )}
    >
      <ImageWithFallback
        src={image}
        fallbackSrc={imageFallback}
        alt={imageAlt}
        fill
        sizes={sizes}
        className="transition-transform duration-[var(--dur-base)] ease-[var(--ease-out-expo)] group-hover:scale-[1.02]"
      />

      <div className="absolute inset-0 bg-black/10" />
      <div className="absolute inset-0 bg-linear-to-t from-black/[0.88] from-0% via-black/55 via-35% to-transparent to-65%" />

      <div className="absolute right-0 bottom-0 left-0 z-10 p-5">
        <h3 className="text-xl font-medium text-white">{title}</h3>
        <p className="mt-1 text-sm text-white/75">{subtitle}</p>
      </div>

      {corner && <div className="absolute top-5 left-5 z-10">{corner}</div>}
    </a>
  );
}
