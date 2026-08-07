import { SectionLabel } from "@/components/common/SectionLabel";
import { cn } from "@/lib/utils";

type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
  titleClassName?: string;
  children?: React.ReactNode;
};

export function PageHeader({
  eyebrow,
  title,
  description,
  titleClassName,
  children,
}: PageHeaderProps) {
  return (
    <section className="section-padding pt-32">
      <div className="container">
        <SectionLabel className="mb-6">{eyebrow}</SectionLabel>
        <h1
          className={cn(
            "text-section text-(--text-primary)",
            titleClassName ?? "mb-6"
          )}
        >
          {title}
        </h1>
        {description && (
          <p className="text-body max-w-2xl text-lg">{description}</p>
        )}
        {children}
      </div>
    </section>
  );
}
