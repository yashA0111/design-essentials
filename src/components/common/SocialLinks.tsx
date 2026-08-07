import { SITE } from "@/lib/constants";
import { cn } from "@/lib/utils";

type SocialLinksProps = {
  className?: string;
  linkClassName?: string;
  limit?: number;
};

export function SocialLinks({
  className,
  linkClassName,
  limit,
}: SocialLinksProps) {
  const socials = Object.entries(SITE.socials).slice(0, limit);

  return (
    <div className={cn("flex gap-4", className)}>
      {socials.map(([key, href]) => (
        <a
          key={key}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "text-nav capitalize text-(--text-secondary) transition-colors hover:text-(--gold)",
            linkClassName
          )}
        >
          {key}
        </a>
      ))}
    </div>
  );
}
