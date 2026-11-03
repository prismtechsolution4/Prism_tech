"use client";

import { useEffect } from "react";

/**
 * Attaches mouse move listener to cards with `.spotlight` class
 * to dynamically update `--mx` and `--my` coordinates for the glow effect.
 */
export function useSpotlight() {
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const cards = document.querySelectorAll<HTMLElement>(".spotlight");
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (x >= -50 && x <= rect.width + 50 && y >= -50 && y <= rect.height + 50) {
          card.style.setProperty("--mx", `${x}px`);
          card.style.setProperty("--my", `${y}px`);
        }
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);
}
