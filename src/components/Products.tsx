"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { productsData } from "@/data/content";
import { scrollToSection, productProgressEvent, productSelectionEvent } from "@/lib/events";
import { useVideoVisibility } from "@/lib/useVideoVisibility";

export default function Products() {
  const [activeProductIndex, setActiveProductIndex] = useState(0);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useVideoVisibility(videoRef);

  const product = productsData[activeProductIndex];

  // Select product helper that notifies 3D canvas
  const handleSelectProduct = useCallback((index: number) => {
    setActiveProductIndex(index);
    setActiveImageIndex(0);
    const progress = index / Math.max(1, productsData.length - 1);
    productProgressEvent.emit(progress);
    productSelectionEvent.emit(index);
  }, []);

  // 1. Auto-rotation between products when viewing (pauses on hover)
  useEffect(() => {
    if (isPaused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const interval = setInterval(() => {
      if (isScrollingRef.current) return;
      setActiveProductIndex((prev) => {
        const next = (prev + 1) % productsData.length;
        setActiveImageIndex(0);
        const progress = next / Math.max(1, productsData.length - 1);
        productProgressEvent.emit(progress);
        productSelectionEvent.emit(next);
        return next;
      });
    }, 4200);

    return () => clearInterval(interval);
  }, [isPaused]);

  // 2. Auto-cycle inner gallery thumbnails within active product
  useEffect(() => {
    if (isPaused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const interval = setInterval(() => {
      setActiveImageIndex((prev) => (prev + 1) % product.gallery.length);
    }, 2800);

    return () => clearInterval(interval);
  }, [product.gallery.length, isPaused]);

  // 3. Scroll past interaction: auto-rotates cards and changes perspective as user scrolls past (Throttled with rAF)
  useEffect(() => {
    let ticking = false;

    const checkScroll = () => {
      const el = document.getElementById("products");
      if (!el) {
        ticking = false;
        return;
      }

      const rect = el.getBoundingClientRect();
      const windowH = window.innerHeight;

      // When the section is actively in the viewport
      if (rect.top <= windowH * 0.6 && rect.bottom >= windowH * 0.3) {
        const totalTravel = windowH + rect.height;
        const currentTravel = windowH - rect.top;
        const progress = Math.max(0, Math.min(1, currentTravel / totalTravel));

        const newIdx = Math.min(
          productsData.length - 1,
          Math.floor(progress * productsData.length)
        );

        isScrollingRef.current = true;
        if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
        scrollTimeoutRef.current = setTimeout(() => {
          isScrollingRef.current = false;
        }, 1200);

        setActiveProductIndex(newIdx);
        productProgressEvent.emit(progress);
      }
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(checkScroll);
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  return (
    <section id="products" className="relative z-10 overflow-hidden px-5 py-28 md:px-10 bg-[#101820]">
      {/* Ambient Tech Background Layer: Looping Platform Video + Aurora + Cyber Grid */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
        {/* Looping Digital Product & Platform Interface Background Video */}
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-35 filter brightness-105 contrast-115"
          style={{
            maskImage: "linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 45%, rgba(0,0,0,0.2) 75%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 45%, rgba(0,0,0,0.2) 75%, transparent 100%)",
          }}
        >
          <source src="/videos/products-platform.mp4" type="video/mp4" />
        </video>

        {/* Deep Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#101820] via-[#101820]/60 to-[#101820]" />

        {/* Soft Electric Blue Aurora Spotlight behind Left Showcase Card */}
        <div className="absolute top-1/4 -left-20 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(8,127,245,0.14)_0%,transparent_70%)] blur-3xl animate-pulse" />
        
        {/* Subtle Cyan Accent Glow in bottom-center */}
        <div className="absolute bottom-10 left-1/3 h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.08)_0%,transparent_70%)] blur-3xl" />

        {/* Fine Technical Grid Pattern (Fading towards 3D canvas on the right) */}
        <div
          className="absolute inset-0 opacity-[0.2]"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(8, 127, 245, 0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(8, 127, 245, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "48px 48px",
            maskImage: "linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 45%, rgba(0,0,0,0.2) 75%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 45%, rgba(0,0,0,0.2) 75%, transparent 100%)",
          }}
        />

        {/* Corner Technical Crosshairs */}
        <span className="absolute top-12 left-10 text-xs font-mono text-[#087FF5]/30">+</span>
        <span className="absolute bottom-12 left-10 text-xs font-mono text-[#087FF5]/30">+</span>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <p className="eyebrow mb-4" data-reveal="true">
          Our products
        </p>
        <h2
          className="font-display max-w-xl text-4xl font-bold md:text-5xl"
          data-reveal="true"
        >
          Ready-made platforms, <span className="text-gradient">built to grow</span>
        </h2>

        {/* Product Showcase Card with PrismTech Design System */}
        <div
          className="glass mt-8 grid max-w-xl gap-6 rounded-2xl p-5 border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.45)] backdrop-blur-md transition-all duration-300 hover:border-[#087FF5]/40 md:grid-cols-[260px_1fr]"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Left Column: Image Carousel + Thumbnails */}
          <div>
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-white/10 bg-[#101820] shadow-inner">
              {product.gallery.map((imgSrc, idx) => (
                <Image
                  key={`${product.id}-${imgSrc}-${idx}`}
                  src={imgSrc}
                  alt={`${product.name} screenshot ${idx + 1}`}
                  fill
                  sizes="(min-width: 768px) 260px, 90vw"
                  className={`object-contain transition-opacity duration-500 ${
                    idx === activeImageIndex ? "opacity-100 scale-100" : "opacity-0 scale-95"
                  }`}
                />
              ))}
            </div>

            {/* Clickable Thumbnails */}
            <div className="pointer-events-auto mt-2 flex gap-2">
              {product.gallery.map((imgSrc, idx) => (
                <button
                  key={`${product.id}-thumb-${idx}`}
                  onClick={() => setActiveImageIndex(idx)}
                  aria-label={`Show ${product.name} photo ${idx + 1}`}
                  className={`relative aspect-[4/3] flex-1 overflow-hidden rounded-md border transition-all duration-200 ${
                    idx === activeImageIndex
                      ? "border-[#087FF5] ring-2 ring-[#087FF5]/50 shadow-[0_0_12px_rgba(8,127,245,0.45)]"
                      : "border-white/10 opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={imgSrc}
                    alt=""
                    fill
                    sizes="90px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Product Details */}
          <div className="flex flex-col justify-center">
            <p className="text-xs tracking-[0.25em] uppercase text-[#087FF5] font-semibold">
              {product.tag}
            </p>
            <h3 className="font-display mt-2 text-3xl font-semibold text-white tracking-tight">
              {product.name}
            </h3>
            <p className="mt-3 text-sm text-[#A0AEC0] leading-relaxed min-h-[48px]">
              {product.blurb}
            </p>
            <button
              onClick={() => scrollToSection("contact", product.name)}
              className="pointer-events-auto mt-5 self-start rounded-full border border-[#087FF5]/40 bg-[#087FF5]/10 px-5 py-2 text-sm font-medium text-white transition-all duration-300 hover:border-[#087FF5] hover:bg-[#087FF5] hover:shadow-[0_0_18px_rgba(8,127,245,0.4)] focus:outline-none"
            >
              Request a demo
            </button>
          </div>
        </div>

        {/* Product Selection Indicator Pills */}
        <div
          className="mt-6 flex flex-wrap gap-2 items-center"
          aria-label="Select product"
        >
          {productsData.map((p, idx) => {
            const isSelected = idx === activeProductIndex;
            return (
              <button
                key={p.id}
                onClick={() => handleSelectProduct(idx)}
                aria-label={`Select product ${p.name}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  isSelected
                    ? "w-12 bg-gradient-to-r from-[#087FF5] to-[#38bdf8] shadow-[0_0_12px_rgba(8,127,245,0.65)]"
                    : "w-6 bg-white/15 hover:bg-white/35"
                }`}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
