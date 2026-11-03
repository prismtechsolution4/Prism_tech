"use client";

import { useState } from "react";
import { faqsData } from "@/data/content";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section id="faq" className="panel px-5 py-28 md:px-10">
      <div className="mx-auto w-full max-w-3xl">
        <p className="eyebrow mb-4" data-reveal="true">
          FAQ
        </p>
        <h2
          className="font-display text-4xl font-bold md:text-5xl"
          data-reveal="true"
        >
          Questions, <span className="text-gradient">answered</span>
        </h2>

        <div
          className="mt-10 divide-y divide-white/10 border-y border-white/10"
          data-reveal="true"
        >
          {faqsData.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={faq.q} className="pointer-events-auto">
                <button
                  onClick={() => toggle(index)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-6 py-5 text-left focus:outline-none"
                >
                  <span className="font-display text-lg font-medium text-white">
                    {faq.q}
                  </span>
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/20 text-brand transition-transform duration-300 ${
                      isOpen ? "rotate-45" : ""
                    }`}
                    aria-hidden="true"
                  >
                    +
                  </span>
                </button>

                <div
                  className={`grid transition-all duration-300 ease-out ${
                    isOpen
                      ? "grid-rows-[1fr] pb-5 opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                  aria-live="polite"
                >
                  <p className="overflow-hidden text-muted leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
