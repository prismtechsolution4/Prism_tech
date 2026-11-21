"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { navLinks, company } from "@/data/content";
import { scrollToSection } from "@/lib/events";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);

  // 1. Detect scroll position for floating glass island styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 2. Active section detection using IntersectionObserver
  useEffect(() => {
    const sectionIds = ["services", "process", "products", "security", "faq"];
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(`#${entry.target.id}`);
          }
        });
      },
      {
        rootMargin: "-25% 0px -45% 0px",
        threshold: 0.1,
      }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    scrollToSection(href);
  };

  return (
    <header
      className={`pointer-events-auto fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "py-2 sm:py-3 bg-obsidian/75 backdrop-blur-xl border-b border-brand/20 shadow-[0_12px_40px_-15px_rgba(0,0,0,0.8),0_0_25px_rgba(8,127,245,0.12)]"
          : "py-4 sm:py-5 bg-gradient-to-b from-obsidian/80 to-transparent border-b border-transparent"
      }`}
    >
      {/* Top subtle animated neon accent line when scrolled */}
      {isScrolled && (
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-cyan/40 to-transparent animate-pulse" />
      )}

      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 md:px-10">
        {/* Brand Logo with interactive hover tilt & aura */}
        <motion.button
          onClick={() => handleNavClick("#hero")}
          aria-label="PrismTech Solutions — home"
          className="group relative flex items-center gap-2 focus:outline-none"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
        >
          <div className="relative">
            {/* Ambient Logo Glow */}
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-brand/0 via-brand/30 to-cyan/30 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100" />
            <Image
              src="/brand/logo-transparent.png"
              alt="PrismTech Solutions"
              width={640}
              height={160}
              priority
              className="relative h-12 w-auto sm:h-14 md:h-15 lg:h-16 transition-all duration-300 group-hover:brightness-110 drop-shadow-[0_2px_12px_rgba(8,127,245,0.25)]"
            />
          </div>
        </motion.button>

        {/* ------------------------------------------------------------- */}
        {/* ANIMATED CENTER FLOATING CAPSULE WITH GLIDING INDICATOR PILL */}
        {/* ------------------------------------------------------------- */}
        <nav
          className="relative hidden md:flex items-center rounded-full border border-white/10 bg-[#0d1520]/80 p-1.5 backdrop-blur-xl shadow-[0_4px_25px_-5px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.1)]"
          aria-label="Main Navigation"
          onMouseLeave={() => setHoveredSection(null)}
        >
          {/* Subtle animated moving neon perimeter glow */}
          <div className="pointer-events-none absolute -inset-px rounded-full bg-gradient-to-r from-brand/20 via-cyan/20 to-brand/20 opacity-50 blur-[2px]" />

          {navLinks.map((link) => {
            const isActive = activeSection === link.href;
            const isHovered = hoveredSection === link.href;

            return (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.href)}
                onMouseEnter={() => setHoveredSection(link.href)}
                className={`relative z-10 flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs lg:text-sm font-medium transition-colors duration-200 focus:outline-none ${
                  isActive || isHovered
                    ? "text-white"
                    : "text-muted hover:text-white/90"
                }`}
              >
                {/* Smooth sliding capsule backdrop (Framer Motion layoutId) */}
                {(isHovered || (!hoveredSection && isActive)) && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 30,
                    }}
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-brand/25 to-cyan/20 border border-brand/50 shadow-[0_0_15px_rgba(8,127,245,0.35)]"
                  />
                )}

                {/* Pulsing indicator dot on active section */}
                {isActive && (
                  <motion.span
                    layoutId="activeNavDot"
                    className="relative z-10 h-1.5 w-1.5 rounded-full bg-cyan shadow-[0_0_6px_#38bdf8]"
                  />
                )}

                <span className="relative z-10">{link.label}</span>
              </button>
            );
          })}
        </nav>

        {/* ------------------------------------------------------------- */}
        {/* RIGHT CTA: ANIMATED GLOWING BUTTON + MOBILE BURGER            */}
        {/* ------------------------------------------------------------- */}
        <div className="flex items-center gap-3">
          {/* Animated "Book a free consultation" Button */}
          <motion.button
            onClick={() => handleNavClick("#contact")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            className="group relative hidden sm:inline-flex items-center gap-2.5 overflow-hidden rounded-full bg-gradient-to-r from-brand via-[#0770db] to-brand bg-[length:200%_auto] px-5 py-2.5 text-xs lg:text-sm font-semibold text-white shadow-[0_4px_20px_-2px_rgba(8,127,245,0.55)] transition-all duration-300 hover:shadow-[0_6px_28px_rgba(8,127,245,0.75)] focus:outline-none"
          >
            {/* Continuous Shimmer Light Streak passing across button */}
            <div
              className="pointer-events-none absolute inset-0 -translate-x-full animate-[shimmer_3.5s_infinite] bg-gradient-to-r from-transparent via-white/25 to-transparent"
              aria-hidden="true"
            />

            {/* Live Green Pulsing Beacon Dot */}
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>

            <span className="relative tracking-wide">Book a free consultation</span>

            {/* Animated Arrow Icon */}
            <svg
              className="relative h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </motion.button>

          {/* Animated Hamburger Menu Button */}
          <motion.button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
            whileTap={{ scale: 0.9 }}
            className="relative flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md md:hidden focus:outline-none"
          >
            <motion.span
              animate={
                mobileMenuOpen
                  ? { rotate: 45, y: 7 }
                  : { rotate: 0, y: 0 }
              }
              transition={{ duration: 0.25 }}
              className="h-0.5 w-5 rounded-full bg-white origin-center"
            />
            <motion.span
              animate={mobileMenuOpen ? { opacity: 0, scale: 0 } : { opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="h-0.5 w-5 rounded-full bg-white"
            />
            <motion.span
              animate={
                mobileMenuOpen
                  ? { rotate: -45, y: -7 }
                  : { rotate: 0, y: 0 }
              }
              transition={{ duration: 0.25 }}
              className="h-0.5 w-5 rounded-full bg-white origin-center"
            />
          </motion.button>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* ANIMATED MOBILE DRAWER WITH STAGGERED LINKS                    */}
      {/* ------------------------------------------------------------- */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-brand/20 bg-obsidian/95 px-5 py-5 backdrop-blur-2xl md:hidden shadow-[0_20px_40px_rgba(0,0,0,0.8)]"
            aria-label="Mobile Navigation"
          >
            <div className="flex flex-col space-y-1">
              {navLinks.map((link, idx) => {
                const isActive = activeSection === link.href;

                return (
                  <motion.button
                    key={link.label}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 + 0.05, duration: 0.25 }}
                    onClick={() => handleNavClick(link.href)}
                    className={`group flex w-full items-center justify-between rounded-xl px-4 py-3 text-left font-medium transition-all ${
                      isActive
                        ? "bg-brand/15 text-white border border-brand/30 shadow-[0_0_15px_rgba(8,127,245,0.2)]"
                        : "text-white/80 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`h-1.5 w-1.5 rounded-full transition-colors ${
                          isActive ? "bg-cyan shadow-[0_0_8px_#38bdf8]" : "bg-white/30 group-hover:bg-brand"
                        }`}
                      />
                      <span className="text-sm">{link.label}</span>
                    </div>

                    <span className="text-xs text-muted transition-transform group-hover:translate-x-1 group-hover:text-cyan">
                      →
                    </span>
                  </motion.button>
                );
              })}
            </div>

            {/* Mobile CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.25 }}
              className="mt-5 flex flex-col gap-3 border-t border-white/10 pt-4"
            >
              <a
                href={company.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2.5 rounded-xl border border-[#25D366]/40 bg-[#25D366]/10 py-3 text-xs font-semibold text-[#25D366] transition hover:bg-[#25D366]/20"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.23 8.23 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.64c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.03-1.24-.75-.67-1.26-1.5-1.41-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.38-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.34-.76-1.84-.2-.49-.4-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.78 2.71 4.3 3.8.6.26 1.07.42 1.44.54.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.23-.17-.48-.3z" />
                </svg>
                <span>WhatsApp (+92 319 8669833)</span>
              </a>

              <button
                onClick={() => handleNavClick("#contact")}
                className="relative flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-brand to-[#0770db] py-3 text-center text-xs font-bold text-white shadow-[0_0_20px_rgba(8,127,245,0.45)] transition hover:brightness-110"
              >
                <span>Book a free consultation</span>
                <span>→</span>
              </button>
            </motion.div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
