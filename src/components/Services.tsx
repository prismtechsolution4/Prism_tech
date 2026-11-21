"use client";

import { useState, useEffect } from "react";
import { servicesData } from "@/data/content";
import { scrollToSection, serviceSelectionEvent } from "@/lib/events";
import Services3DNetwork from "./Services3DNetwork";

export default function Services() {
  const [activeService, setActiveService] = useState<number>(0);

  useEffect(() => {
    const unsub = serviceSelectionEvent.subscribe((title) => {
      const idx = servicesData.findIndex((s) => s.title === title);
      if (idx !== -1) {
        setActiveService(idx);
      }
    });
    return unsub;
  }, []);

  const handleSelectService = (idx: number) => {
    setActiveService(idx);
    if (servicesData[idx]) {
      serviceSelectionEvent.emit(servicesData[idx].title);
    }
  };

  return (
    <section
      id="services"
      className="relative z-10 flex min-h-screen items-center px-4 sm:px-6 md:px-10 pt-20 sm:pt-28 pb-16 sm:pb-20 bg-[#101820] overflow-hidden"
    >
      {/* Ambient background glow strictly within Services */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(8,127,245,0.08)_0%,transparent_70%)] blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-10 lg:gap-16">
          {/* Left Column: Heading & Accordion List */}
          <div>
            <p className="eyebrow mb-3 sm:mb-4 text-[11px] sm:text-xs" data-reveal="true">
              What we do
            </p>
            <h2
              className="font-display max-w-md text-3xl font-bold sm:text-4xl md:text-5xl text-white tracking-tight"
              data-reveal="true"
            >
              One team, <span className="text-gradient">many capabilities</span>
            </h2>
            <p className="mt-3 sm:mt-4 max-w-sm text-xs sm:text-sm text-muted" data-reveal="true">
              Choose a service, or click a 3D node in the planetary network.
            </p>

            <ul
              className="pointer-events-auto mt-6 sm:mt-8 border-t border-white/10"
              data-reveal="true"
            >
              {servicesData.map((srv, idx) => {
                const isActive = activeService === idx;
                return (
                  <li key={srv.id} className="border-b border-white/10">
                    <button
                      onClick={() => handleSelectService(idx)}
                      aria-expanded={isActive}
                      className="group flex w-full items-center gap-3 sm:gap-4 py-3 sm:py-3.5 text-left focus:outline-none"
                    >
                      <span
                        className={`font-display w-6 sm:w-7 text-[11px] sm:text-xs tracking-widest transition-colors ${
                          isActive ? "text-brand font-bold" : "text-muted"
                        }`}
                      >
                        {srv.number}
                      </span>
                      <span
                        className={`font-display flex-1 text-base sm:text-lg transition-colors ${
                          isActive
                            ? "font-semibold text-white"
                            : "text-white/65 group-hover:text-white"
                        }`}
                      >
                        {srv.title}
                      </span>
                      <span
                        className={`text-brand text-sm transition-transform duration-300 ${
                          isActive ? "rotate-90" : ""
                        }`}
                        aria-hidden="true"
                      >
                        →
                      </span>
                    </button>

                    <div
                      className={`grid transition-all duration-300 ease-out ${
                        isActive
                          ? "grid-rows-[1fr] pb-4 opacity-100"
                          : "grid-rows-[0fr] opacity-0"
                      }`}
                      aria-live="polite"
                    >
                      <div className="overflow-hidden pl-7 sm:pl-11">
                        <p className="text-xs sm:text-sm text-muted">{srv.blurb}</p>
                        <ul className="mt-2.5 sm:mt-3 space-y-1.5 text-xs text-white/75">
                          {srv.points.map((point) => (
                            <li key={point} className="flex items-center gap-2">
                              <span
                                className="h-1 w-1 rounded-full bg-brand"
                                aria-hidden="true"
                              />
                              {point}
                            </li>
                          ))}
                        </ul>
                        <button
                          onClick={() => scrollToSection("contact", srv.title)}
                          className="pointer-events-auto mt-3 sm:mt-4 text-xs sm:text-sm font-semibold text-brand transition hover:translate-x-0.5 hover:brightness-125 focus:outline-none"
                        >
                          Enquire about {srv.title} →
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Right Column: 3D Planetary Node Network strictly inside Section 3 */}
          <div className="relative w-full flex items-center justify-center">
            <Services3DNetwork
              activeService={activeService}
              onSelectService={handleSelectService}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
