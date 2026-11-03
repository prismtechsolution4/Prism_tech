"use client";

import { useState, useEffect } from "react";
import { servicesData } from "@/data/content";
import { scrollToSection, serviceSelectionEvent } from "@/lib/events";

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
      className="flex min-h-screen items-center px-5 pt-28 pb-20 md:px-10"
    >
      <div className="mx-auto w-full max-w-7xl">
        <p className="eyebrow mb-4" data-reveal="true">
          What we do
        </p>
        <h2
          className="font-display max-w-md text-4xl font-bold md:text-5xl"
          data-reveal="true"
        >
          One team, <span className="text-gradient">many capabilities</span>
        </h2>
        <p className="mt-4 max-w-sm text-sm text-muted" data-reveal="true">
          Choose a service, or click a node in the network.
        </p>

        <ul
          className="pointer-events-auto mt-8 max-w-md border-t border-white/10"
          data-reveal="true"
        >
          {servicesData.map((srv, idx) => {
            const isActive = activeService === idx;
            return (
              <li key={srv.id} className="border-b border-white/10">
                <button
                  onClick={() => handleSelectService(idx)}
                  aria-expanded={isActive}
                  className="group flex w-full items-center gap-4 py-3.5 text-left focus:outline-none"
                >
                  <span
                    className={`font-display w-7 text-xs tracking-widest transition-colors ${
                      isActive ? "text-brand" : "text-muted"
                    }`}
                  >
                    {srv.number}
                  </span>
                  <span
                    className={`font-display flex-1 text-lg transition-colors ${
                      isActive
                        ? "font-semibold text-white"
                        : "text-white/65 group-hover:text-white"
                    }`}
                  >
                    {srv.title}
                  </span>
                  <span
                    className={`text-brand transition-transform duration-300 ${
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
                  <div className="overflow-hidden pl-11">
                    <p className="text-sm text-muted">{srv.blurb}</p>
                    <ul className="mt-3 space-y-1.5 text-xs text-white/75">
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
                      className="pointer-events-auto mt-4 text-sm font-semibold text-brand transition hover:translate-x-0.5 hover:brightness-125 focus:outline-none"
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
    </section>
  );
}
