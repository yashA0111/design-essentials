"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu } from "lucide-react";
import { NAV_LINKS } from "@/lib/constants";
import { services } from "@/lib/data/services";
import { GOLD_BUTTON } from "@/lib/styles";
import { SocialLinks } from "@/components/common/SocialLinks";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

type DesktopNavLinkProps = {
  href: string;
  label: string;
  index: number;
  isActive: boolean;
  scrolled: boolean;
};

function DesktopNavLink({
  href,
  label,
  index,
  isActive,
  scrolled,
}: DesktopNavLinkProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Link
        href={href}
        className={cn(
          "text-nav transition-colors hover:text-(--gold)",
          isActive
            ? "text-(--gold)"
            : scrolled
            ? "text-(--text-secondary)"
            : "text-(--text-primary)"
        )}
      >
        {label}
      </Link>
    </motion.div>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 right-0 left-0 z-50 transition-all duration-(--dur-base)",
        scrolled
          ? "border-b border-border bg-(--surface)/90 backdrop-blur-md"
          : "bg-transparent"
      )}
    >
      <nav className="container flex h-20 items-center justify-between">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Link
            href="/"
            className="font-(family-name:--font-display) text-lg leading-tight font-semibold tracking-wide text-(--text-primary)"
          >
            DESIGN
            <br />
            ESSENTIALS
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
                <DesktopNavLink
                  href={link.href}
                  label={link.label}
                  index={i}
                  isActive={isActive}
                  scrolled={scrolled}
                />
                <AnimatePresence>
                  {megaOpen && (
                    <motion.div
                      initial={{ opacity: 0, scaleY: 0.95 }}
                      animate={{ opacity: 1, scaleY: 1 }}
                      exit={{ opacity: 0, scaleY: 0.95 }}
                      transition={{ duration: 0.25 }}
                      className="absolute top-full left-1/2 w-[720px] origin-top -translate-x-1/2 pt-4"
                    >
                      <div className="grid grid-cols-2 gap-3 rounded-sm border border-border bg-(--surface) p-4">
                        {services.map((service) => (
                          <Link
                            key={service.id}
                            href={`/services/${service.slug}`}
                            className="rounded-sm p-3 transition-colors hover:bg-(--surface-2)"
                            onClick={() => setMegaOpen(false)}
                          >
                            <p className="text-card-title text-sm text-(--text-primary)">
                              {service.name}
                            </p>
                            <p className="text-body mt-1 line-clamp-1 text-xs">
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
              <DesktopNavLink
                key={link.href}
                href={link.href}
                label={link.label}
                index={i}
                isActive={isActive}
                scrolled={scrolled}
              />
            );
          })}
          <Button asChild className={`px-6 ${GOLD_BUTTON}`}>
            <Link href="/contact">Start Project</Link>
          </Button>
        </div>

        <div className="flex items-center gap-3 lg:hidden">
          <Button asChild size="sm" className={GOLD_BUTTON}>
            <Link href="/contact">Start</Link>
          </Button>
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                aria-label="Open menu"
                className="text-(--text-primary)"
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
                  <SocialLinks className="flex-wrap gap-x-6 gap-y-2" />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
