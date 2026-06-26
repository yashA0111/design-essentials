import { marqueeItems } from "@/lib/data/siteContent";

export function MarqueeSection() {
  const items = [...marqueeItems, ...marqueeItems];

  return (
    <section
      aria-label="Services marquee"
      data-theme="light"
      className="overflow-hidden border-y border-[var(--border)] bg-[var(--surface)] py-5"
    >
      <div className="flex w-max marquee-track">
        {items.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="text-nav shrink-0 px-8 tracking-[0.2em] text-[var(--text-secondary)] uppercase"
          >
            {item} ·
          </span>
        ))}
      </div>
    </section>
  );
}
