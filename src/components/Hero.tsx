"use client";

import { scrollToSection } from "@/lib/events";
import { company } from "@/data/content";
import Hero3DCanvas from "./Hero3DCanvas";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative flex h-svh min-h-[560px] items-center px-5 pt-24 pb-14 md:px-10 overflow-hidden"
    >
      {/* 3D Geodesic Globe & Particle Galaxy (strictly self-contained within Hero) */}
      <Hero3DCanvas />

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <p className="eyebrow mb-5" data-reveal="true">
          {company.name}
        </p>

        <h1
          className="font-display max-w-4xl text-[clamp(2rem,min(6vw,9vh),4.5rem)] leading-[1.05] font-bold"
          data-reveal="true"
        >
          Intelligence <span className="text-gradient">+</span> Technology,
          <br />
          engineered for what&apos;s next.
        </h1>

        <p
          className="mt-4 max-w-xl text-base text-muted md:text-lg"
          data-reveal="true"
        >
          {company.tagline}
        </p>

        <div
          className="pointer-events-auto mt-6 flex flex-wrap gap-4"
          data-reveal="true"
        >
          <button
            onClick={() => scrollToSection("services")}
            className="rounded-full bg-brand px-7 py-3 font-semibold text-white transition hover:bg-brand-hover shadow-md hover:shadow-brand/25 focus:outline-none"
          >
            Explore what we do
          </button>
          <button
            onClick={() => scrollToSection("contact")}
            className="glass rounded-full border border-white/15 px-7 py-3 font-semibold text-white transition hover:bg-white/10 hover:border-brand/50 focus:outline-none"
          >
            Book a free consultation
          </button>
        </div>
      </div>

      {/* Subtle Scroll Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs tracking-[0.3em] text-muted uppercase">
        Scroll
      </div>
    </section>
  );
}
