"use client";

import { useEffect, useRef, useState } from "react";
import { processSteps } from "@/data/content";
import { scrollToSection } from "@/lib/events";

export default function Process() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [activeStep, setActiveStep] = useState<number>(1);

  useEffect(() => {
    const handleScroll = () => {
      const items = document.querySelectorAll<HTMLElement>("[data-process-step]");
      items.forEach((item) => {
        const rect = item.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.65) {
          const step = parseInt(item.getAttribute("data-process-step") || "1", 10);
          setActiveStep((prev) => Math.max(prev, step));
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      id="process"
      ref={sectionRef}
      className="panel px-5 py-28 md:px-10"
    >
      <div className="mx-auto w-full max-w-4xl">
        <p className="eyebrow mb-4" data-reveal="true">
          How we work
        </p>
        <h2
          className="font-display max-w-2xl text-4xl font-bold md:text-5xl"
          data-reveal="true"
        >
          From first conversation to <span className="text-gradient">scale</span>
        </h2>

        <div className="relative mt-14 pl-10 md:pl-14">
          {/* Vertical progress line */}
          <div className="absolute top-0 bottom-0 left-3 w-px bg-white/10 md:left-4">
            <div
              className="h-full origin-top bg-gradient-to-b from-brand to-cyan transition-transform duration-500 ease-out"
              style={{
                transform: `scaleY(${Math.min(1, activeStep / processSteps.length)})`,
              }}
            />
          </div>

          <ol className="space-y-8">
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
                    className={`absolute top-6 -left-[2.35rem] flex h-6 w-6 items-center justify-center rounded-full border bg-obsidian text-[10px] transition-all duration-500 md:-left-[3.35rem] ${
                      isOn
                        ? "border-brand bg-brand font-semibold text-black shadow-glow"
                        : "border-white/20 text-muted"
                    }`}
                  >
                    {step.step}
                  </span>

                  <div className="spotlight glass pointer-events-auto rounded-2xl p-6">
                    <div className="relative">
                      <h3 className="font-display text-xl font-semibold text-white">
                        {step.title}
                      </h3>
                      <p className="mt-2 text-muted leading-relaxed">
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
            className="rounded-full bg-brand px-7 py-3 font-semibold text-black transition hover:brightness-110 focus:outline-none"
          >
            Book a discovery call
          </button>
        </div>
      </div>
    </section>
  );
}
