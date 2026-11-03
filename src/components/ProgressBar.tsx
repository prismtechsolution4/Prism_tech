"use client";

import { useEffect, useState } from "react";

export default function ProgressBar() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight <= 0) return;
      const progress = Math.min(1, Math.max(0, window.scrollY / totalHeight));
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px]"
      aria-hidden="true"
    >
      <div
        className="h-full origin-left bg-gradient-to-r from-brand to-cyan transition-transform duration-75 ease-out"
        style={{ transform: `scaleX(${scrollProgress})` }}
      />
    </div>
  );
}
