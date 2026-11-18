"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { productsData, company } from "@/data/content";
import { scrollToSection, productProgressEvent, productSelectionEvent } from "@/lib/events";
import { useVideoVisibility } from "@/lib/useVideoVisibility";

// High-tech SVG Product Icons for the Interactive Dock
function ProductIcon({ id }: { id: string }) {
  if (id === "hrms") {
    // Users & Organization
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    );
  }
  if (id === "pos") {
    // POS Register / Barcode
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="2" y1="10" x2="22" y2="10" />
        <line x1="6" y1="14" x2="6" y2="14.01" />
        <line x1="10" y1="14" x2="10" y2="14.01" />
        <line x1="14" y1="14" x2="14" y2="14.01" />
        <path d="M8 21h8" />
        <path d="M12 17v4" />
      </svg>
    );
  }
  if (id === "reward") {
    // Reward Trophy / Gift
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    );
  }
  if (id === "crm") {
    // Sales Pipeline / Kanban
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    );
  }
  // E-commerce Shopping Bag / Cart
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

export default function Products() {
  const [activeProductIndex, setActiveProductIndex] = useState(0);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useVideoVisibility(videoRef);

  const product = productsData[activeProductIndex];

  // Helper to switch active product
  const handleSelectProduct = useCallback((index: number) => {
    setActiveProductIndex(index);
    setActiveImageIndex(0);
    const progress = index / Math.max(1, productsData.length - 1);
    productProgressEvent.emit(progress);
    productSelectionEvent.emit(index);
  }, []);

  // 1. Smooth auto-cycle between products (pauses when user hovers to read)
  useEffect(() => {
    if (isPaused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const interval = setInterval(() => {
      setActiveProductIndex((prev) => {
        const next = (prev + 1) % productsData.length;
        setActiveImageIndex(0);
        const progress = next / Math.max(1, productsData.length - 1);
        productProgressEvent.emit(progress);
        productSelectionEvent.emit(next);
        return next;
      });
    }, 5500);

    return () => clearInterval(interval);
  }, [isPaused]);

  // WhatsApp demo message link (unused in this section)
  // const whatsappUrl = ...

  return (
    <section id="products" className="relative z-10 overflow-hidden px-5 py-28 md:px-10 bg-[#101820]">
      {/* ------------------------------------------------------------- */}
      {/* AMBIENT TECH BACKGROUND: VIDEO + ELECTRIC BLUE AURORA + GRID */}
      {/* ------------------------------------------------------------- */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
        {/* Subtle Looping Product Background Video */}
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-25 filter brightness-105 contrast-110"
        >
          <source src="/videos/products-platform.mp4" type="video/mp4" />
        </video>

        {/* Deep Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#101820] via-[#101820]/70 to-[#101820]" />

        {/* Electric Blue Radial Spotlights (Pure theme colors, zero greenish tints) */}
        <div className="absolute -top-24 right-1/4 h-[550px] w-[550px] rounded-full bg-[radial-gradient(circle,rgba(8,127,245,0.12)_0%,transparent_70%)] blur-3xl" />
        <div className="absolute -bottom-24 left-1/4 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.08)_0%,transparent_70%)] blur-3xl" />

        {/* Cyber Metric Grid */}
        <div
          className="absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(8, 127, 245, 0.12) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(8, 127, 245, 0.12) 1px, transparent 1px)
            `,
            backgroundSize: "52px 52px",
            maskImage: "radial-gradient(ellipse 80% 60% at 50% 50%, #000 30%, transparent 85%)",
            WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 50% 50%, #000 30%, transparent 85%)",
          }}
        />
      </div>

      {/* ------------------------------------------------------------- */}
      {/* SECTION HEADER & INTERACTIVE DOCK                             */}
      {/* ------------------------------------------------------------- */}
      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <p className="eyebrow mb-3" data-reveal="true">
              Enterprise Ready-Made Software
            </p>
            <h2 className="font-display text-3xl font-bold tracking-tight text-white md:text-5xl" data-reveal="true">
              Ready-made platforms, <span className="text-gradient">engineered to scale</span>
            </h2>
            <p className="mt-3 max-w-2xl text-sm md:text-base text-[#94A3B8] leading-relaxed" data-reveal="true">
              Deploy battle-tested software suites built for rapid adoption, deep customisation, and high-performance operations.
            </p>
          </div>

          {/* Live System Beacon */}
          <div className="hidden lg:flex items-center gap-3 rounded-full border border-white/10 bg-[#15202b]/70 px-4 py-2 backdrop-blur-md">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#087FF5] opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#087FF5]" />
            </span>
            <span className="text-xs font-mono font-medium text-white/90">
              5 Enterprise Suites Active
            </span>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* INTERACTIVE PRODUCT DOCK (HORIZONTAL TABS WITH ICONS)         */}
        {/* ------------------------------------------------------------- */}
        <div className="mt-8 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {productsData.map((p, idx) => {
            const isSelected = idx === activeProductIndex;
            return (
              <button
                key={p.id}
                onClick={() => handleSelectProduct(idx)}
                className={`group relative flex shrink-0 items-center gap-2.5 rounded-xl px-4 py-2.5 text-xs md:text-sm font-semibold transition-all duration-300 focus:outline-none ${
                  isSelected
                    ? "border border-[#087FF5]/60 bg-gradient-to-r from-[#087FF5]/25 via-[#087FF5]/15 to-[#38bdf8]/20 text-white shadow-[0_0_24px_rgba(8,127,245,0.35)] backdrop-blur-md"
                    : "border border-white/10 bg-[#15202b]/50 text-[#94A3B8] hover:border-white/25 hover:bg-[#15202b]/80 hover:text-white"
                }`}
              >
                <span className={`transition-colors duration-200 ${isSelected ? "text-[#38bdf8]" : "text-[#94A3B8] group-hover:text-white"}`}>
                  <ProductIcon id={p.id} />
                </span>
                <span>{p.name}</span>
                {isSelected && (
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#38bdf8] opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#38bdf8]" />
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ------------------------------------------------------------- */}
        {/* MAIN PRODUCT SHOWCASE CONSOLE (12-COL DUAL PANE)              */}
        {/* ------------------------------------------------------------- */}
        <div
          className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center rounded-3xl border border-white/10 bg-[#121c27]/75 p-6 md:p-8 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* ----------------------------------------------------------- */}
          {/* LEFT COLUMN: SLEEK STUDIO DEVICE FRAME (7 COLS)             */}
          {/* ----------------------------------------------------------- */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* Device Frame Window */}
            <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-[#090f17] shadow-[0_16px_40px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.15)]">
              {/* Studio Display Bezel Header */}
              <div className="flex items-center justify-between border-b border-white/10 bg-[#0d1622] px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                  <span className="ml-2 font-mono text-[11px] text-[#94A3B8] tracking-wider">
                    {product.id.toUpperCase()}://v3.4-live
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#087FF5] bg-[#087FF5]/10 px-2 py-0.5 rounded border border-[#087FF5]/25">
                    Cloud Node
                  </span>
                </div>
              </div>

              {/* Main Screen Preview — Crops out outer background/green desk elements */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#070c14]">
                {product.gallery.map((imgSrc, idx) => (
                  <div
                    key={`${product.id}-${imgSrc}-${idx}`}
                    className={`absolute inset-0 transition-opacity duration-500 ${
                      idx === activeImageIndex ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                    }`}
                  >
                    <Image
                      src={imgSrc}
                      alt={`${product.name} dashboard screenshot ${idx + 1}`}
                      fill
                      sizes="(min-width: 1024px) 680px, 95vw"
                      priority={idx === 0}
                      className="object-cover object-top transition-transform duration-700 hover:scale-[1.02]"
                    />
                    {/* Subtle bottom vignette to blend into bezel footer */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#070c14]/50 via-transparent to-transparent" />
                  </div>
                ))}

                {/* Floating Interactive Telemetry Badge */}
                <div className="absolute top-4 right-4 z-20 flex items-center gap-2 rounded-lg border border-white/15 bg-[#101820]/90 px-3 py-1.5 backdrop-blur-md shadow-lg">
                  <span className="h-2 w-2 rounded-full bg-[#087FF5] shadow-[0_0_8px_#087FF5]" />
                  <span className="font-mono text-xs font-semibold text-white">
                    {product.name} Live
                  </span>
                </div>
              </div>

              {/* Bottom Live Metrics Bar inside Device Frame */}
              {product.metrics && (
                <div className="grid grid-cols-3 divide-x divide-white/10 border-t border-white/10 bg-[#0d1622]/90 px-2 py-3 text-center">
                  {product.metrics.map((metric, mIdx) => (
                    <div key={mIdx} className="px-2">
                      <div className="font-display text-base md:text-lg font-bold text-white tracking-tight">
                        {metric.value}
                      </div>
                      <div className="text-[10px] md:text-xs text-[#94A3B8] uppercase font-mono tracking-wider mt-0.5">
                        {metric.label}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Interactive Switcher / Verified Build Row */}
            {product.gallery.length > 1 ? (
              <div className="flex items-center justify-between gap-3 px-1">
                <span className="text-xs font-mono text-[#94A3B8]">
                  Screenshots ({activeImageIndex + 1}/{product.gallery.length}):
                </span>
                <div className="flex gap-2">
                  {product.gallery.map((imgSrc, idx) => (
                    <button
                      key={`${product.id}-thumb-${idx}`}
                      onClick={() => setActiveImageIndex(idx)}
                      aria-label={`View ${product.name} screen ${idx + 1}`}
                      className={`relative h-12 w-20 overflow-hidden rounded-lg border transition-all duration-200 ${
                        idx === activeImageIndex
                          ? "border-[#087FF5] ring-2 ring-[#087FF5]/50 shadow-[0_0_12px_rgba(8,127,245,0.5)] scale-105"
                          : "border-white/15 opacity-60 hover:opacity-100"
                      }`}
                    >
                      <Image
                        src={imgSrc}
                        alt=""
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-3 px-2 py-1 text-xs font-mono text-[#94A3B8]">
                <span className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#087FF5] opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-[#087FF5]" />
                  </span>
                  Enterprise Edition • 99.9% Uptime SLA
                </span>
                <span className="text-white/50">Next.js Cloud Ready</span>
              </div>
            )}
          </div>

          {/* ----------------------------------------------------------- */}
          {/* RIGHT COLUMN: ARCHITECTURE, MODULES & CTAS (5 COLS)         */}
          {/* ----------------------------------------------------------- */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full">
            <div>
              {/* Category Eyebrow Tag */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-semibold tracking-[0.25em] uppercase text-[#38bdf8]">
                  {product.tag}
                </span>
                <span className="h-1 w-1 rounded-full bg-white/30" />
                <span className="text-[11px] font-mono text-[#94A3B8]">Ready to Deploy</span>
              </div>

              {/* Product Headline & Title */}
              <h3 className="font-display mt-2 text-3xl md:text-4xl font-bold text-white tracking-tight">
                {product.name}
              </h3>

              <p className="mt-3 text-sm text-[#CBD5E1] leading-relaxed">
                {product.blurb}
              </p>

              {/* Key Modular Capabilities Cards */}
              <div className="mt-6 flex flex-col gap-3">
                {product.features?.map((feature, fIdx) => (
                  <div
                    key={fIdx}
                    className="flex items-start gap-3 rounded-xl border border-white/10 bg-[#162230]/60 p-3.5 backdrop-blur-md transition-all duration-200 hover:border-[#087FF5]/40 hover:bg-[#162230]/90"
                  >
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#087FF5]/15 border border-[#087FF5]/30 text-[#087FF5] text-xs font-bold">
                      ✓
                    </div>
                    <div>
                      <h4 className="text-xs md:text-sm font-semibold text-white tracking-tight">
                        {feature.title}
                      </h4>
                      <p className="mt-0.5 text-xs text-[#94A3B8] leading-relaxed">
                        {feature.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Deployment / Technical Specs Badges */}
              {product.badges && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {product.badges.map((badge, bIdx) => (
                    <span
                      key={bIdx}
                      className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-mono text-[#CBD5E1]"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Action CTA Buttons */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <button
                onClick={() => scrollToSection("contact", product.name)}
                className="w-full rounded-full bg-gradient-to-r from-[#087FF5] to-[#0770db] px-6 py-4 text-center text-sm font-semibold text-white shadow-[0_4px_20px_rgba(8,127,245,0.4)] transition-all duration-300 hover:shadow-[0_6px_28px_rgba(8,127,245,0.65)] hover:brightness-110 focus:outline-none"
              >
                Request a live demo →
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Pagination Micro-Pills */}
        <div className="mt-6 flex items-center justify-center gap-2" aria-label="Product pagination">
          {productsData.map((p, idx) => {
            const isSelected = idx === activeProductIndex;
            return (
              <button
                key={`p-pill-${p.id}`}
                onClick={() => handleSelectProduct(idx)}
                aria-label={`Jump to ${p.name}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  isSelected
                    ? "w-10 bg-gradient-to-r from-[#087FF5] to-[#38bdf8] shadow-[0_0_12px_rgba(8,127,245,0.65)]"
                    : "w-4 bg-white/20 hover:bg-white/40"
                }`}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
