"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function Preloader() {
  const [percent, setPercent] = useState<number>(0);
  const [isDone, setIsDone] = useState<boolean>(false);
  const [isRemoved, setIsRemoved] = useState<boolean>(false);

  useEffect(() => {
    // If reduced motion is requested, complete instantly
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPercent(100);
      setIsDone(true);
      setIsRemoved(true);
      return;
    }

    let current = 0;
    const interval = setInterval(() => {
      // Non-linear realistic progress ramp
      const increment = Math.max(1, Math.floor((100 - current) * 0.12) + Math.floor(Math.random() * 4));
      current = Math.min(100, current + increment);
      setPercent(current);

      if (current >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsDone(true);
          setTimeout(() => {
            setIsRemoved(true);
          }, 600);
        }, 300);
      }
    }, 40);

    return () => clearInterval(interval);
  }, []);

  if (isRemoved) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center gap-8 bg-obsidian transition-opacity duration-600 ${
        isDone ? "pointer-events-none opacity-0" : "pointer-events-auto opacity-100"
      }`}
      aria-hidden={isDone}
    >
      <Image
        src="/brand/logo-transparent.png"
        alt="Intechtive Solutions"
        width={889}
        height={354}
        priority
        className="h-20 w-auto"
      />

      {/* Progress bar container */}
      <div className="h-px w-56 origin-left bg-white/10 overflow-hidden">
        <div
          className="h-full origin-left bg-gradient-to-r from-brand to-cyan transition-transform duration-100 ease-out"
          style={{ transform: `scaleX(${percent / 100})` }}
        />
      </div>

      <span className="font-display text-sm tracking-[0.3em] text-muted uppercase">
        <span className="font-semibold text-text">{percent}</span> %
      </span>
    </div>
  );
}
