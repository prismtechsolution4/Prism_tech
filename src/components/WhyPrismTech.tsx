"use client";

import { useEffect, useState, useRef } from "react";
import { statsData } from "@/data/content";
import Marquee from "./Marquee";

// Stat icons representing each capability
function StatIcon({ index }: { index: number }) {
  if (index === 0) {
    // Core service lines -> Layers / Stack
    return (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <polygon points="12 2 2 7 12 12 22 7 12 2" />
        <polyline points="2 17 12 22 22 17" />
        <polyline points="2 12 12 17 22 12" />
      </svg>
    );
  }
  if (index === 1) {
    // Ready-made products -> 3D Box / Package
    return (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    );
  }
  if (index === 2) {
    // Platforms -> Monitor & Devices
    return (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    );
  }
  // 24/7 Security -> Shield Check
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  );
}

function CountUpCard({
  target,
  isCustomDisplay,
  displayValue,
  label,
  index,
}: {
  target: number | string;
  isCustomDisplay?: boolean;
  displayValue?: string;
  label: string;
  index: number;
}) {
  const [count, setCount] = useState(0);
  const targetNum = typeof target === "number" ? target : parseInt(target, 10);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCount(targetNum);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 1500;
          const startTime = performance.now();

          const step = (now: number) => {
            const progress = Math.min((now - startTime) / duration, 1);
            const current = Math.floor(progress * (2 - progress) * targetNum);
            setCount(current);

            if (progress < 1) {
              requestAnimationFrame(step);
            } else {
              setCount(targetNum);
            }
          };

          requestAnimationFrame(step);
        }
      },
      { threshold: 0.25 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [targetNum]);

  return (
    <div data-reveal="true" ref={cardRef}>
      <div className="group relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-[#16202b]/90 to-[#101820]/95 p-3.5 sm:p-5 md:p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-brand/50 hover:shadow-[0_16px_36px_-10px_rgba(0,0,0,0.6),0_0_24px_-4px_rgba(8,127,245,0.3)]">
        {/* Top subtle specular highlight */}
        <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-cyan/60 to-transparent opacity-60 transition-all duration-300 group-hover:inset-x-3 group-hover:opacity-100" />

        {/* Ambient bottom glow on hover */}
        <div className="pointer-events-none absolute -bottom-10 left-1/2 h-20 w-36 -translate-x-1/2 rounded-full bg-brand/20 blur-2xl transition-opacity duration-300 opacity-0 group-hover:opacity-100" />

        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="inline-flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg border border-brand/25 bg-brand/10 text-brand shadow-inner transition-transform duration-300 group-hover:scale-110">
              <StatIcon index={index} />
            </div>

            {/* Live pulsing radar tag for 24/7 Security */}
            {isCustomDisplay && (
              <span className="inline-flex items-center gap-1 sm:gap-1.5 rounded-full border border-cyan/30 bg-cyan/10 px-2 sm:px-2.5 py-0.5 text-[10px] sm:text-[11px] font-semibold text-cyan">
                <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-cyan" />
                </span>
                LIVE
              </span>
            )}
          </div>

          <div className="font-display mt-3 sm:mt-5 text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-brand">
            <span>{count}</span>
            {isCustomDisplay && displayValue}
          </div>

          <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm font-medium text-muted transition-colors group-hover:text-text-secondary leading-snug">
            {label}
          </p>
        </div>
      </div>
    </div>
  );
}

// Background Interactive Cyber Particle & Grid Canvas
function CyberBackgroundCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let isVisible = true;
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0;
    let h = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize);

    // Particle nodes
    const nodeCount = 38;
    const nodes: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
      alpha: number;
    }[] = [];

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * (w || 400),
        y: Math.random() * (h || 400),
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.8 + 1,
        alpha: Math.random() * 0.45 + 0.25,
      });
    }

    const mouse = { x: -999, y: -999 };
    const handleMouseMove = (e: MouseEvent) => {
      const b = canvas.getBoundingClientRect();
      mouse.x = e.clientX - b.left;
      mouse.y = e.clientY - b.top;
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // Intersection observer to only animate when in viewport (0% battery drain when scrolled)
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible && !isReduced && !animId) {
        animId = requestAnimationFrame(render);
      }
    }, { threshold: 0.05 });
    observer.observe(canvas);

    const render = () => {
      if (!isVisible) {
        animId = 0;
        return;
      }

      ctx.clearRect(0, 0, w, h);

      // Connect nearby nodes with subtle electric blue vectors
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            const lineAlpha = (1 - dist / 130) * 0.16;
            ctx.strokeStyle = `rgba(8, 127, 245, ${lineAlpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw and update nodes
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.x += n.vx;
        n.y += n.vy;

        // Mouse gentle interaction
        const mdx = n.x - mouse.x;
        const mdy = n.y - mouse.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < 100 && mdist > 0) {
          const force = (1 - mdist / 100) * 0.4;
          n.x += (mdx / mdist) * force;
          n.y += (mdy / mdist) * force;
        }

        if (n.x < 0) n.x = w;
        if (n.x > w) n.x = 0;
        if (n.y < 0) n.y = h;
        if (n.y > h) n.y = 0;

        ctx.fillStyle = `rgba(56, 189, 248, ${n.alpha})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }

      if (!isReduced) {
        animId = requestAnimationFrame(render);
      }
    };

    if (!isReduced) {
      animId = requestAnimationFrame(render);
    } else {
      render();
    }

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      observer.disconnect();
      if (animId) cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full opacity-60"
      aria-hidden="true"
    />
  );
}

export default function WhyPrismTech() {
  return (
    <section id="intro" className="relative z-10 flex min-h-[80vh] flex-col justify-center gap-10 sm:gap-16 overflow-hidden py-16 sm:py-24 bg-[#101820]">
      {/* Dynamic Background Animation: Cyber Aurora + Perspective Grid + Particles */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
        {/* Subtle Perspective Cyber Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(226,232,240,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(226,232,240,0.03)_1px,transparent_1px)] bg-[size:52px_52px] [mask-image:radial-gradient(ellipse_75%_65%_at_50%_50%,#000_25%,transparent_85%)]" />

        {/* Ambient Floating Luminous Aurora Mesh Blobs */}
        <div className="absolute -top-[10%] left-[15%] h-[480px] w-[540px] animate-[pulse_10s_ease-in-out_infinite_alternate] rounded-full bg-brand/[0.14] blur-[100px]" />
        <div className="absolute -bottom-[15%] right-[10%] h-[520px] w-[580px] animate-[pulse_14s_ease-in-out_infinite_alternate] rounded-full bg-cyan/[0.12] blur-[110px]" />
        <div className="absolute top-[35%] right-[35%] h-[360px] w-[360px] rounded-full bg-[#1e40af]/[0.15] blur-[90px]" />

        {/* Interactive Floating Particle Grid */}
        <CyberBackgroundCanvas />
      </div>

      {/* Infinite marquee ticker */}
      <div className="relative z-10">
        <Marquee />
      </div>

      {/* Why PrismTech content & stats */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 md:px-10">
        <p className="eyebrow mb-3 sm:mb-4 text-[11px] sm:text-xs" data-reveal="true">
          Why PrismTech
        </p>
        <h2
          className="font-display max-w-3xl text-2xl sm:text-3xl font-bold tracking-tight md:text-5xl text-white"
          data-reveal="true"
        >
          One partner for software, AI{" "}
          <span className="text-gradient">and enterprise scale</span>
        </h2>

        <div className="mt-8 sm:mt-12 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 md:gap-6">
          {statsData.map((stat, idx) => (
            <CountUpCard
              key={stat.label}
              target={stat.target}
              isCustomDisplay={stat.isCustomDisplay}
              displayValue={stat.displayValue}
              label={stat.label}
              index={idx}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
