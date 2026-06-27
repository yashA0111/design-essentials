"use client";

import Image from "next/image";
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

  if (fill) {
    return (
      <Image
        src={error ? fallbackSrc : src}
        alt={alt}
        fill
        sizes={sizes ?? "100vw"}
        className={cn("object-cover", className)}
        priority={priority}
        onError={() => setError(true)}
      />
    );
  }

  return (
    <Image
      src={error ? fallbackSrc : src}
      alt={alt}
      width={width ?? 1200}
      height={height ?? 800}
      sizes={sizes}
      className={cn("object-cover", className)}
      priority={priority}
      onError={() => setError(true)}
    />
  );
}
