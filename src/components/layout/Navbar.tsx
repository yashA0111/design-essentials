import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu } from "lucide-react";
import { NAV_LINKS, SITE } from "@/lib/constants";
import { services } from "@/lib/data/services";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

import type { Service } from "@/types/service";

interface NavbarProps {
  darkHero?: boolean;
  pathname?: string;
  services?: Service[];
  settings?: {
    instagramUrl?: string;
    linkedinUrl?: string;
    behanceUrl?: string;
    pinterestUrl?: string;
  } | null;
}

export function Navbar({
  darkHero,
  pathname: initialPathname,
  services: propServices = services,
  settings,
}: NavbarProps = {}) {
  const allServices = propServices.length > 0 ? propServices : services;
  const socials = {
    instagram: settings?.instagramUrl || SITE.socials.instagram,
    linkedin: settings?.linkedinUrl || SITE.socials.linkedin,
    behance: settings?.behanceUrl || SITE.socials.behance,
    pinterest: settings?.pinterestUrl || SITE.socials.pinterest,
  };
  const headerRef = useRef<HTMLElement>(null);
  const [currentPath, setCurrentPath] = useState(initialPathname || "/");
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentPath(window.location.pathname);
    }
  }, []);

  const pathname = initialPathname || currentPath;

  // Default darkHero to true for homepage, about, and detail pages. Default to false for others.
  const isDarkHeroDefault =
    pathname === "/" ||
    pathname === "/about" ||
    (pathname.startsWith("/services/") && pathname !== "/services") ||
    (pathname.startsWith("/projects/") && pathname !== "/projects");

  const resolvedDarkHero = darkHero ?? isDarkHeroDefault;

  useEffect(() => {
    let wasScrolled = false;

    const checkScroll = (customOffset?: number) => {
      const scrollY =
        typeof customOffset === "number"
          ? customOffset
          : window.scrollY ||
            document.documentElement.scrollTop ||
            0;
      const isPastThreshold = scrollY > 30;

      if (isPastThreshold !== wasScrolled) {
        wasScrolled = isPastThreshold;
        setScrolled(isPastThreshold);

        if (headerRef.current) {
          if (isPastThreshold) {
            headerRef.current.classList.add("is-scrolled");
            headerRef.current.setAttribute("data-scrolled", "true");
          } else {
            headerRef.current.classList.remove("is-scrolled");
            headerRef.current.setAttribute("data-scrolled", "false");
          }
        }
      }
    };

    checkScroll();

    const onScroll = () => checkScroll();
    const onPageScroll = (e: Event) => {
      const customEvent = e as CustomEvent<{ scrollY: number }>;
      checkScroll(customEvent.detail?.scrollY);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("page-scroll", onPageScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("page-scroll", onPageScroll);
    };
  }, []);

  const isLightState = scrolled || !resolvedDarkHero;

  return (
    <header
      id="site-header"
      ref={headerRef}
      data-scrolled={scrolled ? "true" : "false"}
      className={cn(
        "fixed top-0 right-0 left-0 z-50 transition-all duration-300 pt-[2px]",
        scrolled
          ? "is-scrolled bg-white/84 backdrop-blur-xl backdrop-saturate-180 border-b border-black/[0.08] shadow-[0_10px_35px_-5px_rgba(0,0,0,0.08),inset_0_1px_0_0_rgba(255,255,255,0.9)]"
          : "bg-transparent"
      )}
    >
      {/* Top 2px gold accent bar */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-[var(--gold)]" />
      <nav className="container flex h-20 items-center justify-between">
        <div>
          <a
            href="/"
            className={cn(
              "nav-brand-text font-[family-name:var(--font-utility)] text-[13px] font-medium tracking-[0.14em] uppercase transition-colors duration-200",
              isLightState ? "text-[#1a1a1a]" : "text-[var(--text-primary)]"
            )}
          >
            DESIGN ESSENTIALS
          </a>
        </div>

        <div className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return "hasDropdown" in link && link.hasDropdown ? (
              <div
                key={link.href}
                className="relative"
                onMouseEnter={() => setMegaOpen(true)}
                onMouseLeave={() => setMegaOpen(false)}
                onFocus={() => setMegaOpen(true)}
                onBlur={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget)) {
                    setMegaOpen(false);
                  }
                }}
                onKeyDown={(event) => {
                  if (event.key === "Escape") setMegaOpen(false);
                }}
              >
                <div>
                  <a
                    href={link.href}
                    aria-expanded={megaOpen}
                    className={cn(
                      "nav-link-item text-nav pb-1 border-b transition-[border-color,color] duration-200",
                      isActive
                        ? isLightState
                          ? "is-active text-[#b08d4a] border-[var(--gold)] font-medium"
                          : "is-active text-[var(--gold)] border-[var(--gold)] font-medium"
                        : isLightState
                        ? "text-[#4a4540] border-transparent hover:text-[#b08d4a] hover:border-[var(--gold)]"
                        : "text-[var(--text-primary)] border-transparent hover:text-[var(--gold)] hover:border-[var(--gold)]"
                    )}
                  >
                    {link.label}
                  </a>
                </div>
                <AnimatePresence>
                  {megaOpen && (
                    <motion.div
                      initial={{ opacity: 0, scaleY: 0.95 }}
                      animate={{ opacity: 1, scaleY: 1 }}
                      exit={{ opacity: 0, scaleY: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-1/2 w-[720px] origin-top -translate-x-1/2 pt-4"
                    >
                      <div
                        className={cn(
                          "grid grid-cols-2 gap-3 rounded-sm border p-4 shadow-[0_20px_40px_rgba(0,0,0,0.12),inset_0_1px_0_0_rgba(255,255,255,0.8)] backdrop-blur-2xl",
                          isLightState
                            ? "border-black/[0.08] bg-white/95"
                            : "border-[var(--border)] bg-[var(--surface)]/95"
                        )}
                      >
                        {services.map((service) => (
                          <a
                            key={service.id}
                            href={`/services/${service.slug}`}
                            className={cn(
                              "rounded-sm p-3 transition-colors",
                              isLightState ? "hover:bg-[#f0ede8]" : "hover:bg-[var(--surface-2)]"
                            )}
                            onClick={() => setMegaOpen(false)}
                          >
                            <p
                              className={cn(
                                "text-card-title text-sm font-medium",
                                isLightState ? "text-[#1a1a1a]" : "text-[var(--text-primary)]"
                              )}
                            >
                              {service.name}
                            </p>
                            <p
                              className={cn(
                                "text-body mt-1 line-clamp-1 text-xs",
                                isLightState ? "text-[#6b6560]" : "text-[var(--text-secondary)]"
                              )}
                            >
                              {service.shortDescription}
                            </p>
                          </a>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div key={link.href}>
                <a
                  href={link.href}
                  className={cn(
                    "nav-link-item text-nav pb-1 border-b transition-[border-color,color] duration-200",
                    isActive
                      ? isLightState
                        ? "is-active text-[#b08d4a] border-[var(--gold)] font-medium"
                        : "is-active text-[var(--gold)] border-[var(--gold)] font-medium"
                      : isLightState
                      ? "text-[#4a4540] border-transparent hover:text-[#b08d4a] hover:border-[var(--gold)]"
                      : "text-[var(--text-primary)] border-transparent hover:text-[var(--gold)] hover:border-[var(--gold)]"
                  )}
                >
                  {link.label}
                </a>
              </div>
            );
          })}
          <Button
            asChild
            className="rounded-[2px] bg-[var(--gold)] px-6 text-[#1A1A1A] hover:bg-[var(--gold-muted)] uppercase tracking-[0.08em] text-[12px] font-medium cursor-pointer shadow-xs"
          >
            <a href="/contact">Start Project</a>
          </Button>
        </div>

        <div className="flex items-center gap-3 lg:hidden">
          <Button
            asChild
            size="sm"
            className="rounded-[2px] bg-[var(--gold)] text-[#1A1A1A] hover:bg-[var(--gold-muted)] uppercase tracking-[0.08em] text-[12px] font-medium cursor-pointer shadow-xs"
          >
            <a href="/contact">Start Project</a>
          </Button>
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                aria-label="Open menu"
                className={cn(
                  "mobile-menu-btn transition-colors cursor-pointer",
                  isLightState ? "text-[#1a1a1a]" : "text-[var(--text-primary)]"
                )}
              >
                <Menu className="h-6 w-6" />
              </button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[85vw] sm:w-[400px] border-l border-[var(--border)] bg-[var(--surface)] p-6 xs:p-8 flex flex-col justify-between h-full"
            >
              <div className="flex flex-col h-full">
                <SheetHeader className="p-0 border-b border-[var(--border)] pb-4">
                  <SheetTitle className="font-[family-name:var(--font-display)] text-xl tracking-wide uppercase text-[var(--text-primary)] pt-1 text-left">
                    Menu
                  </SheetTitle>
                </SheetHeader>
                <div className="mt-8 flex flex-col gap-6">
                  {NAV_LINKS.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                      <a
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "text-nav text-lg transition-colors py-1",
                          isActive
                            ? "text-[var(--gold)] font-medium"
                            : "text-[var(--text-primary)] hover:text-[var(--gold)]"
                        )}
                      >
                        {link.label}
                      </a>
                    );
                  })}
                </div>
                <div className="mt-auto border-t border-[var(--border)] pt-6">
                  <p className="font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-wider text-[var(--text-tertiary)] mb-3">
                    Connect
                  </p>
                  <div className="flex flex-wrap gap-x-6 gap-y-2">
                    {Object.entries(socials).map(([key, href]) => (
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
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
