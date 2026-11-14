"use client";

import { useState, useRef } from "react";
import { faqsData } from "@/data/content";
import { useVideoVisibility } from "@/lib/useVideoVisibility";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  useVideoVisibility(videoRef);

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section id="faq" className="relative z-10 panel overflow-hidden px-5 py-28 md:px-10 bg-[#101820]">
      {/* 1. Ambient Background Layer: Looping Tech Video + Cyber Grid + Aurora Glow Orbs */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
        {/* Looping Abstract Tech Background Video */}
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-35 filter brightness-110 contrast-115"
        >
          <source src="/videos/faq-tech.mp4" type="video/mp4" />
        </video>

        {/* Deep Gradient Overlay for Perfect Text Contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#101820] via-[#101820]/65 to-[#101820]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(8,127,245,0.08)_0%,rgba(16,24,32,0.85)_80%)]" />

        {/* Soft Electric Blue Aurora Orb (Top Left) */}
        <div className="absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(8,127,245,0.14)_0%,transparent_70%)] blur-3xl animate-pulse" />
        
        {/* Soft Cyan Aurora Orb (Bottom Right) */}
        <div className="absolute -bottom-32 -right-32 h-[550px] w-[550px] rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.1)_0%,transparent_70%)] blur-3xl" />

        {/* Subtle Cyber Grid Pattern with Radial Vignette Fade */}
        <div
          className="absolute inset-0 opacity-[0.2]"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(8, 127, 245, 0.12) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(8, 127, 245, 0.12) 1px, transparent 1px)
            `,
            backgroundSize: "44px 44px",
            maskImage: "radial-gradient(ellipse at center, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 80%)",
            WebkitMaskImage: "radial-gradient(ellipse at center, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 80%)",
          }}
        />

        {/* Decorative Technical Crosshairs */}
        <span className="absolute top-12 left-10 text-xs font-mono text-[#087FF5]/30">+</span>
        <span className="absolute top-12 right-10 text-xs font-mono text-[#087FF5]/30">+</span>
        <span className="absolute bottom-12 left-10 text-xs font-mono text-[#087FF5]/30">+</span>
        <span className="absolute bottom-12 right-10 text-xs font-mono text-[#087FF5]/30">+</span>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-3xl">
        <p className="eyebrow mb-4" data-reveal="true">
          FAQ
        </p>
        <h2
          className="font-display text-4xl font-bold md:text-5xl"
          data-reveal="true"
        >
          Questions, <span className="text-gradient">answered</span>
        </h2>
        <p className="mt-3 text-sm text-[#A0AEC0] max-w-lg leading-relaxed" data-reveal="true">
          Everything you need to know about our engineering approach, engagement models, and technology delivery.
        </p>

        {/* FAQ Accordion with Glass Cards & Glow */}
        <div className="mt-10 space-y-4" data-reveal="true">
          {faqsData.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.q}
                className={`pointer-events-auto rounded-2xl border transition-all duration-300 backdrop-blur-md ${
                  isOpen
                    ? "border-[#087FF5]/50 bg-gradient-to-b from-[#15202b]/90 to-[#101820]/90 shadow-[0_8px_30px_rgba(8,127,245,0.18)]"
                    : "border-white/10 bg-[#15202b]/40 hover:border-[#087FF5]/30 hover:bg-[#15202b]/60 hover:shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
                }`}
              >
                <button
                  onClick={() => toggle(index)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-6 p-5 md:p-6 text-left focus:outline-none"
                >
                  <span className="font-display text-base md:text-lg font-medium text-white tracking-tight">
                    {faq.q}
                  </span>
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                      isOpen
                        ? "rotate-45 border-[#087FF5] bg-[#087FF5] text-white shadow-[0_0_12px_rgba(8,127,245,0.5)]"
                        : "border-white/20 bg-white/5 text-[#087FF5] hover:border-[#087FF5]/50"
                    }`}
                    aria-hidden="true"
                  >
                    +
                  </span>
                </button>

                <div
                  className={`grid transition-all duration-300 ease-out px-5 md:px-6 ${
                    isOpen
                      ? "grid-rows-[1fr] pb-6 opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                  aria-live="polite"
                >
                  <p className="overflow-hidden text-sm text-[#A0AEC0] leading-relaxed border-t border-white/5 pt-4">
                    {faq.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
