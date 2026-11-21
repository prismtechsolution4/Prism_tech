"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { securityServicesData } from "@/data/content";
import { scrollToSection } from "@/lib/events";

export default function Infrastructure() {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");

  const totalCards = securityServicesData.length;

  // Scroll to a specific card index
  const scrollToIndex = useCallback((index: number) => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const cards = container.querySelectorAll<HTMLElement>("[data-card-index]");
    if (cards[index]) {
      const card = cards[index];
      const scrollLeft = card.offsetLeft - container.offsetLeft - 16;
      container.scrollTo({ left: Math.max(0, scrollLeft), behavior: "smooth" });
      setActiveIndex(index);
    }
  }, []);

  // Previous button handler
  const handlePrev = () => {
    const nextIdx = activeIndex === 0 ? totalCards - 1 : activeIndex - 1;
    scrollToIndex(nextIdx);
  };

  // Next button handler
  const handleNext = () => {
    const nextIdx = (activeIndex + 1) % totalCards;
    scrollToIndex(nextIdx);
  };

  // Continuous "back and forth" auto-gliding effect
  useEffect(() => {
    if (isPaused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => {
        let next: number;
        let nextDir = direction;

        if (direction === "forward") {
          if (prev >= totalCards - 1) {
            nextDir = "backward";
            next = prev - 1;
          } else {
            next = prev + 1;
          }
        } else {
          if (prev <= 0) {
            nextDir = "forward";
            next = 1;
          } else {
            next = prev - 1;
          }
        }

        setDirection(nextDir);
        scrollToIndex(next);
        return next;
      });
    }, 3800);

    return () => clearInterval(interval);
  }, [isPaused, direction, totalCards, scrollToIndex]);

  // Update active index on user manual scroll
  const handleScroll = () => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const cards = container.querySelectorAll<HTMLElement>("[data-card-index]");
    const scrollCenter = container.scrollLeft + container.clientWidth / 2;

    let closestIdx = 0;
    let minDistance = Infinity;

    cards.forEach((card, idx) => {
      const cardCenter = card.offsetLeft + card.clientWidth / 2;
      const dist = Math.abs(scrollCenter - cardCenter);
      if (dist < minDistance) {
        minDistance = dist;
        closestIdx = idx;
      }
    });

    setActiveIndex(closestIdx);
  };

  return (
    <section
      id="security"
      className="relative z-10 overflow-hidden flex min-h-screen flex-col justify-center px-4 sm:px-6 md:px-10 pt-20 sm:pt-32 pb-16 sm:pb-24 bg-[#101820]"
    >
      {/* Ambient Tech Background Layer */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
        {/* Soft Electric Blue Aura (Left) */}
        <div className="absolute top-1/4 -left-20 h-[550px] w-[550px] rounded-full bg-[radial-gradient(circle,rgba(8,127,245,0.13)_0%,transparent_70%)] blur-3xl animate-pulse" />

        {/* Soft Cyan Aura (Center-Bottom) */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 h-[450px] w-[450px] rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.08)_0%,transparent_70%)] blur-3xl" />

        {/* Concentric Cyber Radar Rings Watermark */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-20">
          <div className="h-[650px] w-[650px] rounded-full border border-[#087FF5]/20 animate-[spin_60s_linear_infinite]" />
          <div className="absolute inset-16 rounded-full border border-dashed border-[#38bdf8]/20" />
          <div className="absolute inset-32 rounded-full border border-[#087FF5]/15" />
        </div>

        {/* Fine Technical Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.2]"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(8, 127, 245, 0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(8, 127, 245, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "44px 44px",
            maskImage: "radial-gradient(ellipse at center, rgba(0,0,0,1) 30%, transparent 80%)",
            WebkitMaskImage: "radial-gradient(ellipse at center, rgba(0,0,0,1) 30%, transparent 80%)",
          }}
        />

        {/* Technical Corner Markers */}
        <span className="absolute top-12 left-10 text-xs font-mono text-[#087FF5]/30">+</span>
        <span className="absolute top-12 right-10 text-xs font-mono text-[#087FF5]/30">+</span>
        <span className="absolute bottom-12 left-10 text-xs font-mono text-[#087FF5]/30">+</span>
        <span className="absolute bottom-12 right-10 text-xs font-mono text-[#087FF5]/30">+</span>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        {/* Section Header with Carousel Navigation Arrows */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <p className="eyebrow mb-2 sm:mb-3 text-[11px] sm:text-xs" data-reveal="true">
              Enterprise Services & Solutions
            </p>
            <h2
              className="font-display max-w-2xl text-2xl sm:text-3xl font-bold md:text-5xl text-white tracking-tight"
              data-reveal="true"
            >
              Engineered for scale,{" "}
              <span className="text-gradient">crafted for impact</span>
            </h2>
            <p className="mt-2.5 sm:mt-3 text-xs sm:text-sm text-[#A0AEC0] max-w-xl leading-relaxed" data-reveal="true">
              Explore our core capabilities across software development, AI automation, cloud infrastructure, and enterprise architecture.
            </p>
          </div>

          {/* Interactive Navigation Controller (Back and Forth Controls) */}
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-[#94A3B8] mr-2">
              <strong className="text-white font-semibold">
                {String(activeIndex + 1).padStart(2, "0")}
              </strong>{" "}
              / {String(totalCards).padStart(2, "0")}
            </span>

            <button
              onClick={handlePrev}
              aria-label="Previous service"
              className="group flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-[#15202b]/80 text-white backdrop-blur-md transition-all duration-200 hover:border-[#087FF5] hover:bg-[#087FF5]/15 hover:shadow-[0_0_15px_rgba(8,127,245,0.4)] active:scale-95 focus:outline-none"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:-translate-x-0.5">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            <button
              onClick={handleNext}
              aria-label="Next service"
              className="group flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-[#15202b]/80 text-white backdrop-blur-md transition-all duration-200 hover:border-[#087FF5] hover:bg-[#087FF5]/15 hover:shadow-[0_0_15px_rgba(8,127,245,0.4)] active:scale-95 focus:outline-none"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-0.5">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* BACK & FORTH HORIZONTAL CAROUSEL TRACK                         */}
        {/* ------------------------------------------------------------- */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="mt-10 flex gap-5 overflow-x-auto pb-4 pt-2 scrollbar-none snap-x snap-mandatory"
          style={{ scrollBehavior: "smooth" }}
        >
          {securityServicesData.map((item, idx) => {
            const isCurrent = idx === activeIndex;

            return (
              <div
                key={item.title}
                data-card-index={idx}
                className="snap-start shrink-0 w-[84vw] sm:w-[350px] md:w-[380px] max-w-[380px]"
              >
                <div
                  className={`group relative flex h-full flex-col justify-between rounded-2xl border p-5 sm:p-7 backdrop-blur-xl transition-all duration-300 ${
                    isCurrent
                      ? "border-[#087FF5]/70 bg-[#162434]/85 shadow-[0_16px_40px_rgba(8,127,245,0.22)] scale-[1.02]"
                      : "border-white/10 bg-[#121c27]/70 hover:border-white/25 hover:bg-[#152230]/85"
                  }`}
                >
                  {/* Top Tag & Active Beacon */}
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono tracking-widest uppercase text-[#087FF5] bg-[#087FF5]/10 px-2.5 py-1 rounded-md border border-[#087FF5]/25 font-semibold">
                        {item.tag || `SRV-0${idx + 1}`}
                      </span>

                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#087FF5] opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-[#087FF5]" />
                      </span>
                    </div>

                    {/* Service Title */}
                    <h3 className="font-display mt-5 text-xl font-bold text-white tracking-tight">
                      {item.title}
                    </h3>

                    {/* Service Blurb */}
                    <p className="mt-2.5 text-sm text-[#94A3B8] leading-relaxed">
                      {item.text}
                    </p>

                    {/* Feature Points Bullet List */}
                    {item.points && (
                      <div className="mt-5 space-y-2 border-t border-white/10 pt-4">
                        {item.points.map((pt, pIdx) => (
                          <div key={pIdx} className="flex items-center gap-2 text-xs text-[#CBD5E1]">
                            <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#087FF5]/20 text-[#38bdf8] text-[10px] font-bold">
                              ✓
                            </span>
                            <span>{pt}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Enquire CTA Action */}
                  <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                    <button
                      onClick={() => scrollToSection("contact", item.title)}
                      className="group/btn inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#087FF5] transition-all hover:text-[#38bdf8] focus:outline-none"
                    >
                      <span>Enquire Now</span>
                      <span className="transition-transform duration-200 group-hover/btn:translate-x-1">→</span>
                    </button>

                    <span className="text-[10px] font-mono text-white/30">
                      PrismTech Solution
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ------------------------------------------------------------- */}
        {/* BOTTOM PAGINATION MICRO-PILLS                                 */}
        {/* ------------------------------------------------------------- */}
        <div className="mt-8 flex items-center justify-center gap-2" aria-label="Services pagination">
          {securityServicesData.map((_, idx) => {
            const isCurrent = idx === activeIndex;

            return (
              <button
                key={`srv-pill-${idx}`}
                onClick={() => scrollToIndex(idx)}
                aria-label={`Jump to slide ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 focus:outline-none ${
                  isCurrent
                    ? "w-8 bg-gradient-to-r from-[#087FF5] to-[#38bdf8] shadow-[0_0_10px_rgba(8,127,245,0.6)]"
                    : "w-3 bg-white/20 hover:bg-white/40"
                }`}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
