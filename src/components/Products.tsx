"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { productsData } from "@/data/content";
import { scrollToSection } from "@/lib/events";

export default function Products() {
  const [activeProductIndex, setActiveProductIndex] = useState(0);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const product = productsData[activeProductIndex];

  // Auto-rotating image carousel
  useEffect(() => {
    if (isPaused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const interval = setInterval(() => {
      setActiveImageIndex((prev) => (prev + 1) % product.gallery.length);
    }, 3800);

    return () => clearInterval(interval);
  }, [product.gallery.length, isPaused]);

  // Reset image index when switching product
  const handleSelectProduct = (index: number) => {
    setActiveProductIndex(index);
    setActiveImageIndex(0);
  };

  return (
    <section id="products" className="relative panel px-5 py-28 md:px-10">
      <div className="mx-auto w-full max-w-7xl">
        <p className="eyebrow mb-4" data-reveal="true">
          Our products
        </p>
        <h2
          className="font-display max-w-xl text-4xl font-bold md:text-5xl"
          data-reveal="true"
        >
          Ready-made platforms, <span className="text-gradient">built to grow</span>
        </h2>

        {/* Product Showcase Card */}
        <div
          className="glass mt-8 grid max-w-xl gap-6 rounded-2xl p-5 md:grid-cols-[260px_1fr]"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Left Column: Image Carousel + Thumbnails */}
          <div>
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-white/10 bg-bg">
              {product.gallery.map((imgSrc, idx) => (
                <Image
                  key={imgSrc}
                  src={imgSrc}
                  alt={`${product.name} screenshot ${idx + 1}`}
                  fill
                  sizes="(min-width: 768px) 260px, 90vw"
                  className={`object-contain transition-opacity duration-700 ${
                    idx === activeImageIndex ? "opacity-100" : "opacity-0"
                  }`}
                />
              ))}
            </div>

            {/* Clickable Thumbnails */}
            <div className="pointer-events-auto mt-2 flex gap-2">
              {product.gallery.map((imgSrc, idx) => (
                <button
                  key={imgSrc}
                  onClick={() => setActiveImageIndex(idx)}
                  aria-label={`Show ${product.name} photo ${idx + 1}`}
                  className={`relative aspect-[4/3] flex-1 overflow-hidden rounded-md border transition ${
                    idx === activeImageIndex
                      ? "border-brand ring-1 ring-brand"
                      : "border-white/10 opacity-70 hover:opacity-100"
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
            <p className="text-xs tracking-[0.25em] uppercase text-brand font-semibold">
              {product.tag}
            </p>
            <h3 className="font-display mt-2 text-3xl font-semibold text-white">
              {product.name}
            </h3>
            <p className="mt-3 text-sm text-muted leading-relaxed">
              {product.blurb}
            </p>
            <button
              onClick={() => scrollToSection("contact", product.name)}
              className="pointer-events-auto mt-5 self-start rounded-full border border-white/20 px-5 py-2 text-sm text-white transition hover:bg-white/10 focus:outline-none"
            >
              Request a demo
            </button>
          </div>
        </div>

        {/* Product Selection Indicator Pills */}
        <div
          className="mt-6 flex flex-wrap gap-2"
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
                  isSelected ? "w-12 bg-brand" : "w-6 bg-white/15 hover:bg-white/30"
                }`}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
