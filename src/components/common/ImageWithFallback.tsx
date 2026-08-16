import { useState } from "react";
import { cn } from "@/lib/utils";

type ImageWithFallbackProps = {
  src: string;
  alt: string;
  fallbackSrc?: string;
  width?: number;
  height?: number;
  fill?: boolean;
  sizes?: string;
  className?: string;
  priority?: boolean;
};

export function ImageWithFallback({
  src,
  alt,
  fallbackSrc = "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&q=80",
  width,
  height,
  fill,
  sizes,
  className,
  priority,
}: ImageWithFallbackProps) {
  const [error, setError] = useState(false);

  const activeSrc = (!src || typeof src !== "string" || src.trim() === "" || error)
    ? (fallbackSrc || "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&q=80")
    : src;

  if (fill) {
    return (
      <img
        src={activeSrc}
        alt={alt}
        sizes={sizes}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className={cn("absolute inset-0 h-full w-full object-cover", className)}
        onError={() => setError(true)}
      />
    );
  }

  return (
    <img
      src={activeSrc}
      alt={alt}
      width={width ?? 1200}
      height={height ?? 800}
      sizes={sizes}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      className={cn("object-cover", className)}
      onError={() => setError(true)}
    />
  );
}
