import { NAV_LINKS, SITE } from "@/lib/constants";
import { services as staticServices } from "@/lib/data/services";
import { Button } from "@/components/ui/button";
import type { Service } from "@/types/service";

export function Footer({
  services = staticServices,
  settings,
}: {
  services?: Service[];
  settings?: {
    phone?: string;
    email?: string;
    address?: string;
    instagramUrl?: string;
    linkedinUrl?: string;
  } | null;
} = {}) {
  const allServices = services.length > 0 ? services : staticServices;
  const email = settings?.email || SITE.email;
  const phone = settings?.phone || SITE.phone;
  const address = settings?.address || SITE.address.full;

  const socials = {
    instagram: settings?.instagramUrl || SITE.socials.instagram,
    linkedin: settings?.linkedinUrl || SITE.socials.linkedin,
    behance: SITE.socials.behance,
    pinterest: SITE.socials.pinterest,
  };

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
            <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2">
              {Object.entries(socials).map(([key, href], i, arr) => (
                <div key={key} className="flex items-center gap-4">
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative py-1 text-[11px] font-medium uppercase tracking-wider text-[var(--text-secondary)] transition-colors hover:text-[var(--gold)]"
                  >
                    {key}
                    <span className="absolute bottom-0 left-0 h-[1.5px] w-full scale-x-0 bg-[var(--gold)] transition-transform duration-300 group-hover:scale-x-100" />
                  </a>
                  {i < arr.length - 1 && (
                    <span className="h-3 w-px bg-[#2a2a2a]" aria-hidden="true" />
                  )}
                </div>
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
                  <a
                    href={link.href}
                    className="text-nav text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-eyebrow mb-6 text-[var(--text-secondary)]">
              Services
            </h3>
            <ul className="space-y-3">
              {allServices.map((service) => (
                <li key={service.id}>
                  <a
                    href={`/services/${service.slug}`}
                    className="text-nav text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
                  >
                    {service.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-eyebrow mb-6 text-[var(--text-secondary)]">
              Contact
            </h3>
            <address className="text-body not-italic min-w-0">
              <p>{address}</p>
              <p className="mt-2 min-w-0">
                <a
                  href={`mailto:${email}`}
                  className="transition-colors hover:text-[var(--gold)] break-words [overflow-wrap:anywhere]"
                >
                  {email}
                </a>
              </p>
              <p className="mt-1">
                <a
                  href={`tel:${phone.replace(/\s/g, "")}`}
                  className="transition-colors hover:text-[var(--gold)]"
                >
                  {phone}
                </a>
              </p>
            </address>
            <Button
              asChild
              className="mt-6 rounded-full bg-[var(--gold)] text-[var(--void)] hover:bg-[var(--gold-muted)] uppercase tracking-[0.08em] text-[12px] font-medium cursor-pointer"
            >
              <a href="/contact">Start Your Project</a>
            </Button>
          </div>
        </div>

        <div className="mt-16 border-t border-[var(--border)] pt-8">
          <p className="text-nav text-center text-[var(--text-tertiary)] md:text-left">
            © {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
