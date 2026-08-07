import { SITE } from "@/lib/constants";
import { cn } from "@/lib/utils";

type ContactDetailsProps = {
  className?: string;
  emailClassName?: string;
  phoneClassName?: string;
};

const linkClass = "transition-colors hover:text-(--gold)";

export function ContactDetails({
  className,
  emailClassName,
  phoneClassName,
}: ContactDetailsProps) {
  return (
    <address className={cn("text-body not-italic", className)}>
      <p>{SITE.address.full}</p>
      <p className={emailClassName}>
        <a href={`mailto:${SITE.email}`} className={linkClass}>
          {SITE.email}
        </a>
      </p>
      <p className={phoneClassName}>
        <a href={`tel:${SITE.phone.replace(/\s/g, "")}`} className={linkClass}>
          {SITE.phone}
        </a>
      </p>
    </address>
  );
}
