"use client";

import { useState, useEffect } from "react";
import LeadPopup from "./LeadPopup";

export default function FloatingTalk() {
  const [isVisible, setIsVisible] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    let triggeredAutoPopup = false;

    try {
      if (localStorage.getItem("prismtech-lead-popup") === "submitted") {
        triggeredAutoPopup = true;
      }
    } catch {
      // Ignore localStorage errors
    }

    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsVisible(scrollY > 200);

      // Auto trigger once after scrolling down if not submitted
      if (!triggeredAutoPopup && scrollY > 750) {
        triggeredAutoPopup = true;
        setIsPopupOpen(true);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <button
        onClick={() => setIsPopupOpen(true)}
        aria-label="Contact us"
        className={`pulse-ring pointer-events-auto fixed right-5 bottom-5 z-40 flex items-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-semibold text-black shadow-lg transition-all duration-300 hover:brightness-110 md:right-8 md:bottom-8 focus:outline-none ${
          isVisible
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-6 opacity-0"
        }`}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          aria-hidden="true"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        <span>Let&apos;s talk</span>
      </button>

      <LeadPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
      />
    </>
  );
}
