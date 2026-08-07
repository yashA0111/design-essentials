import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type CategoryBadgeProps = {
  children: React.ReactNode;
  className?: string;
};

export function CategoryBadge({ children, className }: CategoryBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn("border-border text-(--text-secondary)", className)}
    >
      {children}
    </Badge>
  );
}
