"use client";

import { useEffect } from "react";

/**
 * Attaches a lightweight, high-performance mousemove listener
 * that only calculates rect for the single active spotlight card under cursor.
 * Disabled on touch/mobile devices to conserve battery and eliminate scroll friction.
 */
export function useSpotlight() {
  useEffect(() => {
    // Completely disable on mobile / touch / coarse pointers
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let activeCard: HTMLElement | null = null;
    let cardRect: DOMRect | null = null;

    const handlePointerOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement | null)?.closest<HTMLElement>(".spotlight");
      if (target) {
        activeCard = target;
        cardRect = target.getBoundingClientRect();
      } else {
        activeCard = null;
        cardRect = null;
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!activeCard) return;
      if (!cardRect) {
        cardRect = activeCard.getBoundingClientRect();
      }
      const x = e.clientX - cardRect.left;
      const y = e.clientY - cardRect.top;
      activeCard.style.setProperty("--mx", `${x}px`);
      activeCard.style.setProperty("--my", `${y}px`);
    };

    const handleScrollOrResize = () => {
      if (activeCard) {
        cardRect = activeCard.getBoundingClientRect();
      }
    };

    window.addEventListener("mouseover", handlePointerOver, { passive: true });
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("scroll", handleScrollOrResize, { passive: true });
    window.addEventListener("resize", handleScrollOrResize, { passive: true });

    return () => {
      window.removeEventListener("mouseover", handlePointerOver);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScrollOrResize);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, []);
}
