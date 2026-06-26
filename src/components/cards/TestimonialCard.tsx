import Image from "next/image";
import type { Testimonial } from "@/types/testimonial";
import { cn } from "@/lib/utils";

type TestimonialCardProps = {
  testimonial: Testimonial;
  className?: string;
};

export function TestimonialCard({
  testimonial,
  className,
}: TestimonialCardProps) {
  return (
    <div className={cn("mx-auto max-w-3xl text-center", className)}>
      <blockquote className="font-[family-name:var(--font-display)] text-2xl leading-relaxed font-light italic text-[var(--text-primary)] md:text-3xl">
        &ldquo;{testimonial.quote}&rdquo;
      </blockquote>
      <div className="mt-8 flex flex-col items-center gap-3">
        <Image
          src={testimonial.avatar}
          alt={testimonial.clientName}
          width={56}
          height={56}
          className="rounded-full object-cover"
          sizes="56px"
        />
        <div>
          <p className="text-card-title text-[var(--text-primary)]">
            {testimonial.clientName}
          </p>
          <p className="text-nav text-[var(--text-secondary)]">
            {testimonial.company}
          </p>
        </div>
      </div>
    </div>
  );
}
