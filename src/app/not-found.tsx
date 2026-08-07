import Link from "next/link";
import { SectionLabel } from "@/components/common/SectionLabel";

export default function NotFound() {
  return (
    <section
      data-theme="light"
      className="section-padding flex min-h-[70vh] items-center bg-[var(--void)] pt-32"
    >
      <div className="container max-w-2xl">
        <SectionLabel className="mb-6">404</SectionLabel>
        <h1 className="text-section mb-6 text-[var(--text-primary)]">
          This page doesn&apos;t exist
        </h1>
        <p className="text-body mb-10">
          The page you were looking for may have moved. Explore our projects and
          services, or get in touch with the studio.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/projects"
            className="text-nav rounded-full bg-[var(--gold)] px-8 py-3 text-[var(--void)] transition-colors hover:bg-[var(--gold-muted)]"
          >
            View projects
          </Link>
          <Link
            href="/contact"
            className="text-nav rounded-full border border-[var(--border)] px-8 py-3 text-[var(--text-primary)] transition-colors hover:border-[var(--gold)]"
          >
            Contact us
          </Link>
        </div>
      </div>
    </section>
  );
}
