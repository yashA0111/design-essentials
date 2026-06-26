import Link from "next/link";
import { NAV_LINKS, SITE } from "@/lib/constants";
import { services } from "@/lib/data/services";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="border-t border-[var(--gold)] bg-[var(--surface)]">
      <div className="container section-padding">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--text-primary)]">
              DESIGN
              <br />
              ESSENTIALS
            </p>
            <p className="text-body mt-4 text-sm">{SITE.tagline}</p>
            <div className="mt-6 flex gap-4">
              {Object.entries(SITE.socials).map(([key, href]) => (
                <a
                  key={key}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-nav capitalize text-[var(--text-secondary)] transition-colors hover:text-[var(--gold)]"
                >
                  {key}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-eyebrow mb-6 text-[var(--text-secondary)]">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-nav text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-eyebrow mb-6 text-[var(--text-secondary)]">
              Services
            </h3>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service.id}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="text-nav text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-eyebrow mb-6 text-[var(--text-secondary)]">
              Contact
            </h3>
            <address className="text-body not-italic">
              <p>{SITE.address.full}</p>
              <p className="mt-2">
                <a
                  href={`mailto:${SITE.email}`}
                  className="transition-colors hover:text-[var(--gold)]"
                >
                  {SITE.email}
                </a>
              </p>
              <p className="mt-1">
                <a
                  href={`tel:${SITE.phone.replace(/\s/g, "")}`}
                  className="transition-colors hover:text-[var(--gold)]"
                >
                  {SITE.phone}
                </a>
              </p>
            </address>
            <Button
              asChild
              className="mt-6 rounded-full bg-[var(--gold)] text-[var(--void)] hover:bg-[var(--gold-muted)]"
            >
              <Link href="/contact">Get a Quote</Link>
            </Button>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-[var(--border)] pt-8 md:flex-row">
          <p className="text-nav text-[var(--text-tertiary)]">
            © {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link
              href="/contact"
              className="text-nav text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
