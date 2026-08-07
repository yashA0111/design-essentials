import { ImageWithFallback } from "@/components/common/ImageWithFallback";
import { cn } from "@/lib/utils";

type GalleryImageProps = {
  src: string;
  alt: string;
  className?: string;
};

export function GalleryImage({ src, alt, className }: GalleryImageProps) {
  return (
    <div
      className={cn(
        "relative aspect-4/3 overflow-hidden rounded-sm",
        className
      )}
    >
      <ImageWithFallback
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, 33vw"
      />
    </div>
  );
}
