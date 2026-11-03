"use client";

import { useEffect, useState, useRef } from "react";
import { statsData } from "@/data/content";
import Marquee from "./Marquee";

function CountUpCard({
  target,
  isCustomDisplay,
  displayValue,
  label,
}: {
  target: number | string;
  isCustomDisplay?: boolean;
  displayValue?: string;
  label: string;
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
      <div className="spotlight glass pointer-events-auto rounded-2xl p-6">
        <div className="relative">
          <div className="font-display text-4xl font-bold text-brand md:text-5xl">
            <span>{count}</span>
            {isCustomDisplay && displayValue}
          </div>
          <p className="mt-2 text-sm text-muted">{label}</p>
        </div>
      </div>
    </div>
  );
}

export default function WhyIntechtive() {
  return (
    <section id="intro" className="panel flex min-h-[90vh] flex-col justify-center gap-16 py-24">
      {/* Infinite marquee ticker */}
      <Marquee />

      {/* Why Intechtive content & stats */}
      <div className="mx-auto w-full max-w-7xl px-5 md:px-10">
        <p className="eyebrow mb-4" data-reveal="true">
          Why Intechtive
        </p>
        <h2
          className="font-display max-w-3xl text-3xl font-bold md:text-5xl"
          data-reveal="true"
        >
          One partner for software, AI{" "}
          <span className="text-gradient">and security</span>
        </h2>

        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
          {statsData.map((stat) => (
            <CountUpCard
              key={stat.label}
              target={stat.target}
              isCustomDisplay={stat.isCustomDisplay}
              displayValue={stat.displayValue}
              label={stat.label}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
