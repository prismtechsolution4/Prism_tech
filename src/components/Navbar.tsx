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

      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 md:px-10">
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
                href={`tel:${company.phone}`}
                className="flex items-center justify-center gap-2.5 rounded-xl border border-brand/40 bg-brand/10 py-3 text-xs font-semibold text-white transition hover:bg-brand/20 shadow-[0_0_15px_rgba(8,127,245,0.2)]"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-brand shrink-0"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <span>Call {company.phone}</span>
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
