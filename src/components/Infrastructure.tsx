"use client";

import { securityServicesData } from "@/data/content";
import { scrollToSection } from "@/lib/events";

export default function Infrastructure() {
  return (
    <section
      id="security"
      className="relative overflow-hidden flex min-h-screen items-center px-5 pt-32 pb-24 md:px-10"
    >
      {/* Ambient Security Background Layer */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
        {/* Soft Electric Blue Aura (Left) */}
        <div className="absolute top-1/4 -left-20 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(8,127,245,0.13)_0%,transparent_70%)] blur-3xl animate-pulse" />

        {/* Soft Cyan Aura (Center-Bottom) */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 h-[450px] w-[450px] rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.08)_0%,transparent_70%)] blur-3xl" />

        {/* Concentric Cyber Radar Rings Watermark */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-20">
          <div className="h-[600px] w-[600px] rounded-full border border-[#087FF5]/20 animate-[spin_60s_linear_infinite]" />
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
        <p className="eyebrow mb-4" data-reveal="true">
          Infrastructure services
        </p>
        <h2
          className="font-display max-w-2xl text-4xl font-bold md:text-5xl"
          data-reveal="true"
        >
          Always watching,{" "}
          <span className="text-gradient">so you don&apos;t have to</span>
        </h2>
        <p className="mt-3 text-sm text-[#A0AEC0] max-w-xl leading-relaxed" data-reveal="true">
          24/7 CCTV surveillance, smart cloud cameras, and enterprise remote security operations ensuring round-the-clock protection.
        </p>

        <div className="mt-10 grid max-w-5xl gap-5 md:grid-cols-3">
          {securityServicesData.map((item, idx) => (
            <div key={item.title} data-reveal="true">
              <div className="spotlight glass pointer-events-auto rounded-2xl h-full p-7 flex flex-col justify-between border border-white/10 bg-[#15202b]/60 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.4)] transition-all duration-300 hover:border-[#087FF5]/50 hover:shadow-[0_12px_36px_rgba(8,127,245,0.2)]">
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono tracking-widest uppercase text-[#087FF5] bg-[#087FF5]/10 px-2.5 py-1 rounded-md border border-[#087FF5]/20 font-semibold">
                      SEC-0{idx + 1}
                    </span>
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#087FF5] opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-[#087FF5]" />
                    </span>
                  </div>

                  <h3 className="font-display mt-5 text-xl font-semibold text-white tracking-tight">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-[#A0AEC0] leading-relaxed">
                    {item.text}
                  </p>
                  <button
                    onClick={() => scrollToSection("contact", item.title)}
                    className="pointer-events-auto mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[#087FF5] transition-all hover:text-[#38bdf8] hover:translate-x-1 focus:outline-none"
                  >
                    <span>Enquire</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
