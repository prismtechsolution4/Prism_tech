"use client";

import { scrollToSection } from "@/lib/events";
import { company } from "@/data/content";
import Hero3DCanvas from "./Hero3DCanvas";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative z-10 flex min-h-[520px] sm:min-h-[580px] h-svh items-center px-4 sm:px-6 md:px-10 pt-20 pb-12 sm:pt-24 sm:pb-14 overflow-hidden bg-[#101820]"
    >
      {/* 3D Geodesic Globe & Particle Galaxy (strictly self-contained within Hero) */}
      <Hero3DCanvas />

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <p className="eyebrow mb-3 sm:mb-5 text-[11px] sm:text-xs" data-reveal="true">
          {company.name}
        </p>

        <h1
          className="font-display max-w-4xl text-[clamp(1.85rem,6.5vw,4.5rem)] leading-[1.08] font-bold tracking-tight text-white"
          data-reveal="true"
        >
          Intelligence <span className="text-gradient">+</span> Technology,
          <br />
          engineered for what&apos;s next.
        </h1>

        <p
          className="mt-3 sm:mt-4 max-w-xl text-sm sm:text-base md:text-lg text-muted leading-relaxed"
          data-reveal="true"
        >
          {company.tagline}
        </p>

        <div
          className="pointer-events-auto mt-6 flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4"
          data-reveal="true"
        >
          <button
            onClick={() => scrollToSection("services")}
            className="w-full sm:w-auto text-center rounded-full bg-gradient-to-r from-[#087FF5] to-[#0770db] px-5 sm:px-7 py-3 text-sm sm:text-base font-semibold text-white shadow-[0_4px_20px_rgba(8,127,245,0.4)] transition-all duration-300 hover:shadow-[0_6px_28px_rgba(8,127,245,0.65)] hover:brightness-110 focus:outline-none"
          >
            Explore what we do
          </button>
          <button
            onClick={() => scrollToSection("contact")}
            className="glass w-full sm:w-auto text-center rounded-full border border-white/15 px-5 sm:px-7 py-3 text-sm sm:text-base font-semibold text-white transition-all duration-300 hover:bg-white/10 hover:border-[#087FF5]/60 hover:shadow-[0_0_20px_rgba(8,127,245,0.25)] focus:outline-none"
          >
            Book a free consultation
          </button>
        </div>
      </div>

      {/* Subtle Scroll Indicator */}
      <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 text-[10px] sm:text-xs tracking-[0.3em] text-muted uppercase">
        Scroll
      </div>
    </section>
  );
}
