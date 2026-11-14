"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { techStackData } from "@/data/content";
import type { TechCategory } from "@/types";
import { useVideoVisibility } from "@/lib/useVideoVisibility";

// Microscopic Tech Particle Field for Futuristic Environment
function TechParticleCanvas() {
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

    // Microscopic data particle nodes
    const particleCount = 38;
    const particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
      alpha: number;
    }[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * (w || 400),
        y: Math.random() * (h || 400),
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.5 + 0.8,
        alpha: Math.random() * 0.45 + 0.2,
      });
    }

    // Pause canvas animation when scrolled offscreen to conserve 100% CPU
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible && !isReduced && !animId) {
          animId = requestAnimationFrame(render);
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);

    const render = () => {
      if (!isVisible) {
        animId = 0;
        return;
      }

      ctx.clearRect(0, 0, w, h);

      // Microscopic particle connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            const lineAlpha = (1 - dist / 110) * 0.14;
            ctx.strokeStyle = `rgba(8, 127, 245, ${lineAlpha})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        ctx.fillStyle = `rgba(56, 189, 248, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
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

// Interactive 3D Tilt Card with Cursor-following Spotlight & Border Beam
function InteractiveTechCard({
  category,
  index,
}: {
  category: TechCategory;
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [coords, setCoords] = useState({ x: -999, y: -999 });
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Entrance animation trigger once visible
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(card);
    return () => observer.disconnect();
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCoords({ x, y });

    // 3D Tilt calculation (subtle, elegant enterprise curve capped at ±5deg)
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rx = ((y - centerY) / centerY) * -5;
    const ry = ((x - centerX) / centerX) * 5;
    setTilt({ rx, ry });
  };

  const handleMouseEnter = () => setIsHovered(true);

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ rx: 0, ry: 0 });
    setCoords({ x: -999, y: -999 });
  };

  return (
    <div
      ref={cardRef}
      data-reveal="true"
      style={{
        transitionDelay: `${index * 140}ms`,
      }}
      className={`transition-all duration-700 ease-out ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}
    >
      <div
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: isHovered
            ? `perspective(1000px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) translateY(-6px)`
            : "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)",
          transition: isHovered
            ? "transform 0.1s ease-out, border-color 0.3s ease, box-shadow 0.3s ease"
            : "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s ease, box-shadow 0.3s ease",
        }}
        className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#162230]/90 to-[#101820]/95 p-7 backdrop-blur-xl transition-all duration-300 hover:border-brand/50 hover:shadow-[0_20px_45px_-12px_rgba(0,0,0,0.7),0_0_28px_-4px_rgba(8,127,245,0.35)]"
      >
        {/* Animated Moving Gradient Border Highlight */}
        <div
          className={`pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-500 ${
            isHovered ? "opacity-100" : "opacity-30"
          }`}
          style={{
            padding: "1px",
            background:
              "linear-gradient(135deg, rgba(8, 127, 245, 0.7) 0%, rgba(56, 189, 248, 0.5) 30%, transparent 60%)",
            WebkitMask:
              "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
          }}
          aria-hidden="true"
        />

        {/* Cursor-Following Blue Spotlight Light inside Card */}
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-300"
          style={{
            opacity: isHovered ? 1 : 0,
            background: `radial-gradient(320px circle at ${coords.x}px ${coords.y}px, rgba(8, 127, 245, 0.18), transparent 70%)`,
          }}
          aria-hidden="true"
        />

        {/* Top Specular Reflection Line */}
        <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-cyan/60 to-transparent opacity-60 transition-all duration-300 group-hover:inset-x-3 group-hover:opacity-100" />

        {/* Ambient Under-Glow on Card Hover */}
        <div className="pointer-events-none absolute -bottom-10 left-1/2 h-20 w-44 -translate-x-1/2 rounded-full bg-brand/20 blur-2xl transition-opacity duration-300 opacity-0 group-hover:opacity-100" />

        <div className="relative z-10">
          <h3 className="font-display text-xl font-semibold tracking-tight text-white transition-colors group-hover:text-white">
            {category.title}
          </h3>
          <p className="mt-2 text-sm text-muted leading-relaxed">
            {category.description}
          </p>

          <ul className="mt-7 grid grid-cols-2 gap-3">
            {category.items.map((tech) => (
              <li
                key={tech.name}
                className="group/item relative flex items-center gap-3 overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-3 text-sm text-white/90 transition-all duration-300 hover:-translate-y-1 hover:border-brand/70 hover:bg-brand/[0.08] hover:shadow-[0_4px_16px_-2px_rgba(8,127,245,0.3)]"
              >
                {/* Micro Hover Gradient Wave */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-brand/15 to-transparent opacity-0 transition-opacity duration-300 group-hover/item:opacity-100" />

                {/* Tech Icon Container with Scale & Glow */}
                <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-black/40 p-1 transition-all duration-300 group-hover/item:scale-110 group-hover/item:border-brand/60 group-hover/item:shadow-[0_0_12px_rgba(8,127,245,0.45)]">
                  <Image
                    src={tech.icon}
                    alt={tech.name}
                    width={26}
                    height={26}
                    className="h-6 w-6 object-contain transition-transform duration-300"
                  />
                </div>

                <span className="relative z-10 font-medium tracking-wide transition-colors duration-200 group-hover/item:text-white">
                  {tech.name}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function TechStack() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  useVideoVisibility(videoRef);

  return (
    <section id="tech" className="relative z-10 overflow-hidden px-5 py-28 md:px-10 bg-[#101820]">
      {/* ------------------------------------------------------------- */}
      {/* SOPHISTICATED FUTURISTIC TECHNOLOGY ENVIRONMENT BACKGROUND     */}
      {/* ------------------------------------------------------------- */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
        {/* Subtle Tech Office / Developer Looping Background Video */}
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-45 filter brightness-100 contrast-110"
        >
          <source src="/videos/tech-office.mp4" type="video/mp4" />
          <source src="/videos/tech-coding.mp4" type="video/mp4" />
        </video>

        {/* Deep Gradient Vignette: guarantees crystal-clear readability while keeping video active */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#101820] via-[#101820]/50 to-[#101820]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(8,127,245,0.1)_0%,rgba(16,24,32,0.85)_85%)]" />

        {/* Subtle Perspective Circuit / Cyber Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(226,232,240,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(226,232,240,0.03)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_80%_70%_at_50%_50%,#000_30%,transparent_85%)]" />

        {/* Slowly Moving Blue Light Beams */}
        <div className="absolute -top-1/4 -left-1/4 h-[2px] w-[900px] -rotate-[35deg] bg-gradient-to-r from-transparent via-brand/40 to-transparent blur-[1px] animate-[pulse_12s_ease-in-out_infinite_alternate]" />
        <div className="absolute -bottom-1/4 -right-1/4 h-[2px] w-[900px] -rotate-[35deg] bg-gradient-to-r from-transparent via-cyan/40 to-transparent blur-[1px] animate-[pulse_15s_ease-in-out_infinite_alternate]" />

        {/* Microscopic Particle Constellation Network */}
        <TechParticleCanvas />
      </div>

      {/* ------------------------------------------------------------- */}
      {/* SECTION CONTENT                                               */}
      {/* ------------------------------------------------------------- */}
      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <p className="eyebrow mb-4" data-reveal="true">
          Tech stack
        </p>
        <h2
          className="font-display max-w-2xl text-4xl font-bold tracking-tight md:text-5xl"
          data-reveal="true"
        >
          The right tools for <span className="text-gradient">every build</span>
        </h2>
        <p className="mt-4 max-w-xl text-muted leading-relaxed" data-reveal="true">
          Our team works across modern web, backend and mobile technologies, so
          we choose what fits your product, not what fits our habits.
        </p>

        {/* Three-Column Interactive Cards Grid */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {techStackData.map((category, idx) => (
            <InteractiveTechCard
              key={category.title}
              category={category}
              index={idx}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
