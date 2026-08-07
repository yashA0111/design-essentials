"use client";

import { useEffect } from "react";
import Link from "next/link";
import { SectionLabel } from "@/components/common/SectionLabel";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section
      data-theme="light"
      className="section-padding flex min-h-[70vh] items-center bg-[var(--void)] pt-32"
    >
      <div className="container max-w-2xl">
        <SectionLabel className="mb-6">SOMETHING WENT WRONG</SectionLabel>
        <h1 className="text-section mb-6 text-[var(--text-primary)]">
          This page could not be loaded
        </h1>
        <p className="text-body mb-10">
          An unexpected error interrupted the page. Try again, or head back to
          the homepage and continue exploring.
        </p>
        {error.digest && (
          <p className="text-nav mb-10 text-[var(--text-tertiary)]">
            Reference: {error.digest}
          </p>
        )}
        <div className="flex flex-wrap gap-4">
          <button
            type="button"
            onClick={reset}
            className="text-nav cursor-pointer rounded-full bg-[var(--gold)] px-8 py-3 text-[var(--void)] transition-colors hover:bg-[var(--gold-muted)]"
          >
            Try again
          </button>
          <Link
            href="/"
            className="text-nav rounded-full border border-[var(--border)] px-8 py-3 text-[var(--text-primary)] transition-colors hover:border-[var(--gold)]"
          >
            Back to home
          </Link>
        </div>
      </div>
    </section>
  );
}
