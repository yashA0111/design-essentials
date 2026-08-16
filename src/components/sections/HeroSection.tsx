import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { heroContent } from "@/lib/data/siteContent";
import { SITE } from "@/lib/constants";
import { ImageWithFallback } from "@/components/common/ImageWithFallback";
import { Button } from "@/components/ui/button";

gsap.registerPlugin(ScrollTrigger);

export function HeroSection({
  content = heroContent,
  socials: propSocials,
}: {
  content?: typeof heroContent;
  socials?: Record<string, string>;
} = {}) {
  const socials = propSocials || SITE.socials;
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !imageRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(imageRef.current, {
        yPercent: 15,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-dvh items-center overflow-hidden"
    >
      <div
        ref={imageRef}
        className="absolute inset-0 scale-100"
        style={{ willChange: "transform", transform: "translate3d(0, 0, 0)" }}
      >
        <ImageWithFallback
          src={content.backgroundImage}
          fallbackSrc={content.fallbackImage}
          alt={content.backgroundAlt}
          fill
          priority
          sizes="100vw"
          className="scale-[1.04] transition-transform duration-[var(--dur-crawl)] ease-[var(--ease-out-expo)]"
        />
        {/* Heavy vignette overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--void)] via-[var(--void)]/70 to-[var(--void)]/50" />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--void)]/60 via-transparent to-transparent" />
      </div>

      <div className="container relative z-10 py-32">
        <div className="mx-auto max-w-4xl text-center animate-in fade-in slide-in-from-bottom-6 duration-700">
          <p className="text-eyebrow mb-6">
            {content.eyebrow}
          </p>
          <h1 className="text-hero mb-6 text-[var(--text-primary)]">
            {content.titleBefore}
            <br />
            <em className="font-light italic text-[var(--gold)]">
              {content.titleItalic}
            </em>{" "}
            {content.titleAfter}
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-[var(--text-primary)]/80 font-[family-name:var(--font-body)]">
            {content.subtitle}
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="rounded-full bg-[var(--gold)] px-8 text-[var(--void)] hover:bg-[var(--gold-muted)] font-medium"
            >
              <a href="/contact">{content.ctaPrimary}</a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full border-[var(--border)] bg-transparent text-[var(--text-primary)] hover:bg-[var(--surface)]"
            >
              <a href="/projects">{content.ctaSecondary}</a>
            </Button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-[clamp(20px,5vw,100px)] z-20 hidden items-center gap-6 lg:flex">
        {Object.entries(socials).slice(0, 3).map(([key, href]) => (
          <a
            key={key}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-nav capitalize text-[var(--text-secondary)] transition-colors hover:text-[var(--gold)] pointer-events-auto"
          >
            {key}
          </a>
        ))}
      </div>

      <div className="absolute right-[clamp(20px,5vw,100px)] bottom-8 hidden flex-col items-end gap-2 md:flex">
        <span className="text-nav text-[var(--text-secondary)]">Scroll</span>
        <span className="block h-12 w-px bg-[var(--gold)]" />
      </div>
    </section>
  );
}
