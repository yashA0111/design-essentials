import { ImageWithFallback } from "@/components/common/ImageWithFallback";
import { cn } from "@/lib/utils";

type HeroBackdropProps = {
  src: string;
  alt: string;
  overlayClassName?: string;
  className?: string;
};

export function HeroBackdrop({
  src,
  alt,
  overlayClassName,
  className,
}: HeroBackdropProps) {
  return (
    <div className={cn("absolute inset-0", className)}>
      <ImageWithFallback src={src} alt={alt} fill priority sizes="100vw" />
      <div
        className={cn(
          "absolute inset-0 bg-linear-to-t from-(--void) to-transparent",
          overlayClassName ?? "via-(--void)/50"
        )}
      />
    </div>
  );
}
