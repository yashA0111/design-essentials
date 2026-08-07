import Link from "next/link";
import { NAV_LINKS, SITE } from "@/lib/constants";
import { services } from "@/lib/data/services";
import { GOLD_BUTTON } from "@/lib/styles";
import { ContactDetails } from "@/components/common/ContactDetails";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="border-t border-(--gold) bg-(--surface)">
      <div className="container section-padding">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-(family-name:--font-display) text-xl font-semibold text-(--text-primary)">
              DESIGN
              <br />
              ESSENTIALS
            </p>
            <p className="text-body mt-4 text-sm">{SITE.tagline}</p>
            <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2">
              {Object.entries(SITE.socials).map(([key, href], i, arr) => (
                <div key={key} className="flex items-center gap-4">
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative py-1 text-[11px] font-medium uppercase tracking-wider text-(--text-secondary) transition-colors hover:text-(--gold)"
                  >
                    {key}
                    <span className="absolute bottom-0 left-0 h-[1.5px] w-full scale-x-0 bg-(--gold) transition-transform duration-300 group-hover:scale-x-100" />
                  </a>
                  {i < arr.length - 1 && (
                    <span className="h-3 w-px bg-[#2a2a2a]" aria-hidden="true" />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-eyebrow mb-6 text-(--text-secondary)">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-nav text-(--text-secondary) transition-colors hover:text-(--gold)"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-eyebrow mb-6 text-(--text-secondary)">
              Services
            </h3>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service.id}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="text-nav text-(--text-secondary) transition-colors hover:text-(--gold)"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-eyebrow mb-6 text-(--text-secondary)">
              Contact
            </h3>
            <ContactDetails emailClassName="mt-2" phoneClassName="mt-1" />
            <Button asChild className={`mt-6 ${GOLD_BUTTON}`}>
              <Link href="/contact">Get a Quote</Link>
            </Button>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
          <p className="text-nav text-(--text-tertiary)">
            © {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link
              href="/contact"
              className="text-nav text-(--text-tertiary) hover:text-(--text-secondary)"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
