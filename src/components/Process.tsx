"use client";

import { useEffect, useRef, useState } from "react";
import { processSteps } from "@/data/content";
import { scrollToSection } from "@/lib/events";
import { useVideoVisibility } from "@/lib/useVideoVisibility";

export default function Process() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [activeStep, setActiveStep] = useState<number>(1);

  useVideoVisibility(videoRef);

  useEffect(() => {
    const items = document.querySelectorAll<HTMLElement>("[data-process-step]");
    if (items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const step = parseInt(entry.target.getAttribute("data-process-step") || "1", 10);
            setActiveStep((prev) => Math.max(prev, step));
          }
        });
      },
      {
        rootMargin: "0px 0px -30% 0px",
        threshold: 0.1,
      }
    );

    items.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="process"
      ref={sectionRef}
      className="relative z-10 panel overflow-hidden px-4 sm:px-6 md:px-10 py-20 sm:py-28 bg-[#101820]"
    >
      {/* Ambient Process Background Layer: Looping Workflow Video + Blueprints */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
        {/* Looping Engineering Workflow Background Video */}
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-35 filter brightness-105 contrast-110"
        >
          <source src="/videos/process-workflow.mp4" type="video/mp4" />
        </video>

        {/* Deep Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#101820] via-[#101820]/65 to-[#101820]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(8,127,245,0.08)_0%,rgba(16,24,32,0.85)_80%)]" />

        {/* Soft Electric Blue Aurora (Behind Timeline) */}
        <div className="absolute top-1/4 -left-24 h-[550px] w-[550px] rounded-full bg-[radial-gradient(circle,rgba(8,127,245,0.12)_0%,transparent_70%)] blur-3xl animate-pulse" />

        {/* Soft Cyan Aurora (Bottom Right) */}
        <div className="absolute bottom-20 -right-20 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.08)_0%,transparent_70%)] blur-3xl" />

        {/* Fine Technical Blueprint Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.2]"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(8, 127, 245, 0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(8, 127, 245, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "46px 46px",
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

      <div className="relative z-10 mx-auto w-full max-w-4xl">
        <p className="eyebrow mb-3 sm:mb-4 text-[11px] sm:text-xs" data-reveal="true">
          How we work
        </p>
        <h2
          className="font-display max-w-2xl text-3xl font-bold sm:text-4xl md:text-5xl text-white tracking-tight"
          data-reveal="true"
        >
          From first conversation to <span className="text-gradient">scale</span>
        </h2>
        <p className="mt-3 text-xs sm:text-sm text-[#A0AEC0] max-w-xl leading-relaxed" data-reveal="true">
          A disciplined end-to-end delivery framework tailored for certainty, agile collaboration, and measurable business outcomes.
        </p>

        <div className="relative mt-10 sm:mt-14 pl-8 sm:pl-10 md:pl-14">
          {/* Vertical progress line */}
          <div className="absolute top-0 bottom-0 left-2.5 w-px bg-white/10 sm:left-3 md:left-4">
            <div
              className="h-full origin-top bg-gradient-to-b from-[#087FF5] to-[#38bdf8] shadow-[0_0_12px_rgba(8,127,245,0.7)] transition-transform duration-500 ease-out"
              style={{
                transform: `scaleY(${Math.min(1, activeStep / processSteps.length)})`,
              }}
            />
          </div>

          <ol className="space-y-6 sm:space-y-8">
            {processSteps.map((step) => {
              const isOn = activeStep >= step.step;
              return (
                <li
                  key={step.step}
                  data-process-step={step.step}
                  className="relative"
                  data-reveal="true"
                >
                  <span
                    data-dot="true"
                    className={`absolute top-5 sm:top-6 -left-[2.1rem] sm:-left-[2.35rem] md:-left-[3.35rem] flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full border text-[10px] sm:text-[11px] font-mono transition-all duration-500 ${
                      isOn
                        ? "border-[#087FF5] bg-[#087FF5] font-semibold text-white shadow-[0_0_15px_rgba(8,127,245,0.6)]"
                        : "border-white/20 bg-[#101820] text-muted"
                    }`}
                  >
                    {step.step}
                  </span>

                  <div className={`spotlight glass pointer-events-auto rounded-2xl p-4 sm:p-6 border transition-all duration-300 ${
                    isOn
                      ? "border-[#087FF5]/40 bg-[#15202b]/70 shadow-[0_8px_30px_rgba(8,127,245,0.12)]"
                      : "border-white/10 bg-[#15202b]/40 hover:border-white/20"
                  }`}>
                    <div className="relative">
                      <h3 className="font-display text-lg sm:text-xl font-semibold text-white tracking-tight">
                        {step.title}
                      </h3>
                      <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-[#A0AEC0] leading-relaxed">
                        {step.text}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="pointer-events-auto mt-12" data-reveal="true">
          <button
            onClick={() => scrollToSection("contact")}
            className="rounded-full bg-gradient-to-r from-[#087FF5] to-[#0770db] px-7 py-3 font-semibold text-white transition-all duration-300 hover:brightness-110 shadow-[0_4px_20px_rgba(8,127,245,0.4)] hover:shadow-[0_6px_28px_rgba(8,127,245,0.6)] focus:outline-none"
          >
            Book a discovery call
          </button>
        </div>
      </div>
    </section>
  );
}
