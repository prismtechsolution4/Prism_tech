"use client";

import { useRef } from "react";
import { engagementModelsData } from "@/data/content";
import { useVideoVisibility } from "@/lib/useVideoVisibility";

export default function EngagementModels() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  useVideoVisibility(videoRef);

  return (
    <section id="engagement" className="relative z-10 panel overflow-hidden px-5 py-28 md:px-10 bg-[#101820]">
      {/* Ambient Background Layer: Looping Collaboration Video + Blueprints */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
        {/* Looping Team Collaboration & Engineering Video */}
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-35 filter brightness-105 contrast-110"
        >
          <source src="/videos/engagement-collab.mp4" type="video/mp4" />
        </video>

        {/* Deep Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#101820] via-[#101820]/65 to-[#101820]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(8,127,245,0.09)_0%,rgba(16,24,32,0.85)_80%)]" />

        {/* Soft Electric Blue Aurora (Behind Left Model) */}
        <div className="absolute top-1/3 left-10 h-[480px] w-[480px] rounded-full bg-[radial-gradient(circle,rgba(8,127,245,0.13)_0%,transparent_70%)] blur-3xl animate-pulse" />

        {/* Soft Cyan Aurora (Behind Right Model) */}
        <div className="absolute bottom-10 right-10 h-[480px] w-[480px] rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.1)_0%,transparent_70%)] blur-3xl" />

        {/* Cyber Blueprint Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.2]"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(8, 127, 245, 0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(8, 127, 245, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "46px 46px",
            maskImage: "radial-gradient(ellipse at center, rgba(0,0,0,1) 25%, transparent 75%)",
            WebkitMaskImage: "radial-gradient(ellipse at center, rgba(0,0,0,1) 25%, transparent 75%)",
          }}
        />

        {/* Technical Corner Markers */}
        <span className="absolute top-12 left-10 text-xs font-mono text-[#087FF5]/30">+</span>
        <span className="absolute top-12 right-10 text-xs font-mono text-[#087FF5]/30">+</span>
        <span className="absolute bottom-12 left-10 text-xs font-mono text-[#087FF5]/30">+</span>
        <span className="absolute bottom-12 right-10 text-xs font-mono text-[#087FF5]/30">+</span>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <p className="eyebrow mb-4" data-reveal="true">
          Engagement models
        </p>
        <h2
          className="font-display max-w-2xl text-4xl font-bold md:text-5xl"
          data-reveal="true"
        >
          Work with us the way that <span className="text-gradient">fits you</span>
        </h2>
        <p className="mt-3 text-sm text-[#A0AEC0] max-w-xl leading-relaxed" data-reveal="true">
          Choose a fixed-deliverable engagement or dedicated technical resources integrated directly into your engineering roadmap.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {engagementModelsData.map((model, idx) => (
            <div key={model.title} data-reveal="true">
              <div className="spotlight glass pointer-events-auto rounded-2xl h-full p-8 flex flex-col justify-between border border-white/10 bg-[#15202b]/60 backdrop-blur-md shadow-[0_10px_35px_rgba(0,0,0,0.4)] transition-all duration-300 hover:border-[#087FF5]/50 hover:shadow-[0_12px_40px_rgba(8,127,245,0.18)]">
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-semibold tracking-widest uppercase text-[#087FF5] bg-[#087FF5]/10 px-3 py-1 rounded-full border border-[#087FF5]/20">
                      Option 0{idx + 1}
                    </span>
                    <span className="h-2 w-2 rounded-full bg-[#087FF5] shadow-[0_0_8px_#087FF5]" />
                  </div>

                  <h3 className="font-display mt-5 text-2xl font-semibold text-white tracking-tight">
                    {model.title}
                  </h3>
                  <p className="mt-3 text-sm text-[#A0AEC0] leading-relaxed">
                    {model.description}
                  </p>

                  <ul className="mt-6 space-y-3 text-sm text-white/90">
                    {model.points.map((point) => (
                      <li key={point} className="flex items-center gap-3">
                        <span
                          className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#087FF5]/15 border border-[#087FF5]/30 text-[#087FF5] text-xs font-bold"
                          aria-hidden="true"
                        >
                          ✓
                        </span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>

                  <p className="mt-8 border-t border-white/10 pt-4 text-xs font-semibold uppercase tracking-wider text-[#38bdf8]">
                    {model.footer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
