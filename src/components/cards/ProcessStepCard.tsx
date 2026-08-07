import { formatStepNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

type ProcessStepCardProps = {
  step: { step: number; title: string; description: string };
  variant?: "compact" | "wide";
  className?: string;
};

export function ProcessStepCard({
  step,
  variant = "compact",
  className,
}: ProcessStepCardProps) {
  const wide = variant === "wide";

  return (
    <div
      className={cn(
        "border border-border",
        wide ? "bg-(--void) p-8" : "p-6",
        className
      )}
    >
      <span
        className={cn(
          "font-(family-name:--font-display) text-(--gold)",
          wide ? "text-5xl" : "text-3xl"
        )}
      >
        {formatStepNumber(step.step)}
      </span>
      <h3
        className={cn(
          "text-card-title text-(--text-primary)",
          wide ? "mt-4" : "mt-3"
        )}
      >
        {step.title}
      </h3>
      <p className={cn("text-body", wide ? "mt-3" : "mt-2 text-sm")}>
        {step.description}
      </p>
    </div>
  );
}
