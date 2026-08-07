"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "@/lib/gsap";
import { heroContent } from "@/lib/data/siteContent";
import { GOLD_BUTTON } from "@/lib/styles";
import { ImageWithFallback } from "@/components/common/ImageWithFallback";
import { SocialLinks } from "@/components/common/SocialLinks";
import { Button } from "@/components/ui/button";
import { fadeInUpItem, staggerContainer } from "@/components/animations/pageVariants";

export function HeroSection() {
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
      <div ref={imageRef} className="absolute inset-0 scale-100">
        <ImageWithFallback
          src={heroContent.backgroundImage}
          alt={heroContent.backgroundAlt}
          fill
          priority
          sizes="100vw"
          className="scale-[1.04] transition-transform duration-(--dur-crawl) ease-(--ease-out-expo)"
        />
        {/* Heavy vignette overlay for text readability */}
        <div className="absolute inset-0 bg-linear-to-t from-(--void) via-(--void)/70 to-(--void)/50" />
        <div className="absolute inset-0 bg-linear-to-b from-(--void)/60 via-transparent to-transparent" />
      </div>

      <div className="container relative z-10 py-32">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="mx-auto max-w-4xl text-center"
        >
          <motion.p
            variants={fadeInUpItem}
            className="text-eyebrow mb-6"
          >
            {heroContent.eyebrow}
          </motion.p>
          <motion.h1
            variants={fadeInUpItem}
            className="text-hero mb-6 text-(--text-primary) drop-shadow-lg"
          >
            {heroContent.titleBefore}
            <br />
            <em className="font-light italic text-(--gold)">
              {heroContent.titleItalic}
            </em>{" "}
            {heroContent.titleAfter}
          </motion.h1>
          <motion.p
            variants={fadeInUpItem}
            className="mx-auto mb-10 max-w-2xl text-lg text-(--text-primary)/80 font-(family-name:--font-body)"
          >
            {heroContent.subtitle}
          </motion.p>
          <motion.div
            variants={fadeInUpItem}
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Button
              asChild
              size="lg"
              className={`px-8 ${GOLD_BUTTON}`}
            >
              <Link href="/contact">{heroContent.ctaPrimary}</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full border-border bg-transparent text-(--text-primary) hover:bg-(--surface)"
            >
              <Link href="/projects">{heroContent.ctaSecondary}</Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>

      <SocialLinks
        limit={3}
        className="absolute bottom-8 left-[clamp(20px,5vw,100px)] hidden items-center gap-6 lg:flex"
      />

      <div className="absolute right-[clamp(20px,5vw,100px)] bottom-8 hidden flex-col items-end gap-2 md:flex">
        <span className="text-nav text-(--text-secondary)">Scroll</span>
        <span className="block h-12 w-px bg-(--gold)" />
      </div>
    </section>
  );
}
