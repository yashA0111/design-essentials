"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useScrollReveal(stagger = 0.08) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const ctx = gsap.context(() => {
      const targets = ref.current!.querySelectorAll("[data-reveal]");
      
      targets.forEach((el) => {
        if (el instanceof HTMLElement) {
          el.setAttribute("data-reveal-initialized", "true");
          el.style.opacity = "0";
          el.style.transform = "translateY(32px)";
        }
      });

      gsap.fromTo(
        targets,
        { opacity: 0, y: 32 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger,
          immediateRender: false,
          scrollTrigger: {
            trigger: ref.current,
            start: "top 95%",
            toggleActions: "play none none none",
          },
        }
      );
    }, ref);

    return () => ctx.revert();
  }, [stagger]);

  return ref;
}
