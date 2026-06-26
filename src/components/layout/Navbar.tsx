"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
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

interface NavbarProps {
  darkHero?: boolean;
}

export function Navbar({ darkHero }: NavbarProps = {}) {
  const pathname = usePathname();
  
  // Default darkHero to true for homepage, about, and detail pages. Default to false for others.
  const isDarkHeroDefault = 
    pathname === "/" || 
    pathname === "/about" || 
    (pathname.startsWith("/services/") && pathname !== "/services") || 
    (pathname.startsWith("/projects/") && pathname !== "/projects");
    
  const resolvedDarkHero = darkHero ?? isDarkHeroDefault;
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isLightState = scrolled || !resolvedDarkHero;

  return (
    <header
      className={cn(
        "fixed top-0 right-0 left-0 z-50 transition-all duration-(--dur-base) pt-[2px]",
        scrolled
          ? "border-b border-black/[0.08] bg-white/95 backdrop-blur-md"
          : "bg-transparent"
      )}
    >
      {/* Top 2px gold accent bar */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-[var(--gold)]" />
      <nav className="container flex h-20 items-center justify-between">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Link
              href="/"
              className={cn(
                "font-(family-name:--font-utility) text-[13px] font-medium tracking-[0.14em] uppercase transition-colors",
                isLightState ? "text-[#1a1a1a]" : "text-(--text-primary)"
              )}
            >
              DESIGN ESSENTIALS
            </Link>
          </motion.div>

          <div className="hidden items-center gap-8 lg:flex">
            {NAV_LINKS.map((link, i) => {
              const isActive = pathname === link.href;
              return "hasDropdown" in link && link.hasDropdown ? (
                <div
                  key={link.href}
                  className="relative"
                  onMouseEnter={() => setMegaOpen(true)}
                  onMouseLeave={() => setMegaOpen(false)}
                >
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      className={cn(
                        "text-nav pb-1 border-b border-transparent transition-[border-color,color] duration-200",
                        isLightState ? "hover:text-[#b08d4a]" : "hover:text-(--gold)",
                        isActive
                          ? isLightState ? "text-[#b08d4a] border-[var(--gold)]" : "text-(--gold) border-[var(--gold)]"
                          : isLightState
                          ? "text-[#6b6560] hover:border-[var(--gold)]"
                          : "text-(--text-primary) hover:border-[var(--gold)]"
                      )}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                  <AnimatePresence>
                    {megaOpen && (
                      <motion.div
                        initial={{ opacity: 0, scaleY: 0.95 }}
                        animate={{ opacity: 1, scaleY: 1 }}
                        exit={{ opacity: 0, scaleY: 0.95 }}
                        transition={{ duration: 0.25 }}
                        className="absolute top-full left-1/2 w-[720px] origin-top -translate-x-1/2 pt-4"
                      >
                        <div className={cn(
                          "grid grid-cols-2 gap-3 rounded-sm border p-4",
                          isLightState
                            ? "border-[#e2ded8] bg-white"
                            : "border-border bg-(--surface)"
                        )}>
                          {services.map((service) => (
                            <Link
                              key={service.id}
                              href={`/services/${service.slug}`}
                              className={cn(
                                "rounded-sm p-3 transition-colors",
                                isLightState ? "hover:bg-[#f0ede8]" : "hover:bg-(--surface-2)"
                              )}
                              onClick={() => setMegaOpen(false)}
                            >
                              <p className={cn(
                                "text-card-title text-sm",
                                isLightState ? "text-[#1a1a1a]" : "text-(--text-primary)"
                              )}>
                                {service.name}
                              </p>
                              <p className={cn(
                                "text-body mt-1 line-clamp-1 text-xs",
                                isLightState ? "text-[#6b6560]" : ""
                              )}>
                                {service.shortDescription}
                              </p>
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                >
                  <Link
                    href={link.href}
                    className={cn(
                      "text-nav pb-1 border-b border-transparent transition-[border-color,color] duration-200",
                      isLightState ? "hover:text-[#b08d4a]" : "hover:text-(--gold)",
                      isActive
                        ? isLightState ? "text-[#b08d4a] border-[var(--gold)]" : "text-(--gold) border-[var(--gold)]"
                        : isLightState
                        ? "text-[#6b6560] hover:border-[var(--gold)]"
                        : "text-(--text-primary) hover:border-[var(--gold)]"
                    )}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              );
            })}
            <Button
              asChild
              className="rounded-[2px] bg-[var(--gold)] px-6 text-[#1A1A1A] hover:bg-[var(--gold-muted)] uppercase tracking-[0.08em] text-[12px] font-medium"
            >
              <Link href="/contact">Start Project</Link>
            </Button>
          </div>

          <div className="flex items-center gap-3 lg:hidden">
            <Button
              asChild
              size="sm"
              className="rounded-[2px] bg-[var(--gold)] text-[#1A1A1A] hover:bg-[var(--gold-muted)] uppercase tracking-[0.08em] text-[12px] font-medium"
            >
              <Link href="/contact">Start</Link>
            </Button>
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <button
                  type="button"
                  aria-label="Open menu"
                  className={cn(
                    "transition-colors",
                    isLightState ? "text-[#1a1a1a]" : "text-(--text-primary)"
                  )}
                >
                  <Menu className="h-6 w-6" />
                </button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[85vw] sm:w-[400px] border-l border-border bg-(--surface) p-6 xs:p-8 flex flex-col justify-between h-full"
              >
                <div className="flex flex-col h-full">
                  <SheetHeader className="p-0 border-b border-border pb-4">
                    <SheetTitle className="font-(family-name:--font-display) text-xl tracking-wide uppercase text-(--text-primary) pt-1 text-left">
                      Menu
                    </SheetTitle>
                  </SheetHeader>
                  <div className="mt-8 flex flex-col gap-6">
                    {NAV_LINKS.map((link) => {
                      const isActive = pathname === link.href;
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setMobileOpen(false)}
                          className={cn(
                            "text-nav text-lg transition-colors py-1",
                            isActive
                              ? "text-(--gold) font-medium"
                              : "text-(--text-primary) hover:text-(--gold)"
                          )}
                        >
                          {link.label}
                        </Link>
                      );
                    })}
                  </div>
                  <div className="mt-auto border-t border-border pt-6">
                    <p className="font-(family-name:--font-display) text-xs font-semibold uppercase tracking-wider text-(--text-tertiary) mb-3">
                      Connect
                    </p>
                    <div className="flex flex-wrap gap-x-6 gap-y-2">
                      {Object.entries(SITE.socials).map(([key, href]) => (
                        <a
                          key={key}
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-nav capitalize text-(--text-secondary) transition-colors hover:text-(--gold)"
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
