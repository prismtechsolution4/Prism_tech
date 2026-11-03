"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { navLinks } from "@/data/content";
import { scrollToSection } from "@/lib/events";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    scrollToSection(href);
  };

  return (
    <header
      className={`pointer-events-auto fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300 ${
        isScrolled
          ? "border-white/10 bg-obsidian/85 backdrop-blur-md"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-2 md:px-10">
        {/* Brand Logo */}
        <button
          onClick={() => handleNavClick("#hero")}
          aria-label="PrismTech Solutions — home"
          className="focus:outline-none"
        >
          <Image
            src="/brand/logo-transparent.png"
            alt="PrismTech Solutions"
            width={640}
            height={160}
            priority
            className="h-10 w-auto md:h-12"
          />
        </button>

        {/* Desktop Navigation */}
        <nav className="glass hidden rounded-full px-2 py-1 md:flex" aria-label="Main Navigation">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => handleNavClick(link.href)}
              className="rounded-full px-4 py-2 text-sm text-muted transition hover:text-white focus:outline-none"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Right CTA + Mobile Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleNavClick("#contact")}
            className="rounded-full bg-brand px-5 py-2 text-sm font-semibold text-black transition hover:brightness-110 focus:outline-none"
          >
            Get in touch
          </button>

          {/* Hamburger Menu Button */}
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Menu"
            aria-expanded={mobileMenuOpen}
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden focus:outline-none"
          >
            <span
              className={`h-0.5 w-5 bg-white transition duration-300 ${
                mobileMenuOpen ? "translate-y-2 rotate-45" : ""
              }`}
            />
            <span
              className={`h-0.5 w-5 bg-white transition duration-300 ${
                mobileMenuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`h-0.5 w-5 bg-white transition duration-300 ${
                mobileMenuOpen ? "-translate-y-2 -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <nav
          className="border-t border-white/10 bg-obsidian/95 px-5 py-4 backdrop-blur-xl md:hidden"
          aria-label="Mobile Navigation"
        >
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => handleNavClick(link.href)}
              className="block w-full py-3 text-left text-lg font-medium text-white/90 hover:text-brand"
            >
              {link.label}
            </button>
          ))}
        </nav>
      )}
    </header>
  );
}
