"use client";

import { securityServicesData } from "@/data/content";
import { scrollToSection } from "@/lib/events";

export default function Infrastructure() {
  return (
    <section
      id="security"
      className="flex min-h-screen items-center px-5 pt-32 pb-24 md:px-10"
    >
      <div className="mx-auto w-full max-w-7xl">
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

        <div className="mt-10 grid max-w-5xl gap-5 md:grid-cols-3">
          {securityServicesData.map((item) => (
            <div key={item.title} data-reveal="true">
              <div className="spotlight glass pointer-events-auto rounded-2xl h-full p-6 flex flex-col justify-between">
                <div className="relative">
                  <h3 className="font-display text-xl font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted leading-relaxed">
                    {item.text}
                  </p>
                  <button
                    onClick={() => scrollToSection("contact", item.title)}
                    className="pointer-events-auto mt-4 inline-flex items-center text-sm font-semibold text-brand transition hover:translate-x-0.5 hover:brightness-125 focus:outline-none"
                  >
                    Enquire →
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
