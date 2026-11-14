"use client";

import { useEffect, type RefObject } from "react";

/**
 * Optimizes video background performance by playing only when in viewport,
 * saving mobile GPU, battery, and eliminating scroll lag.
 */
export function useVideoVisibility(videoRef: RefObject<HTMLVideoElement | null>) {
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Initially pause until confirmed visible
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.05 }
    );

    observer.observe(video);

    return () => {
      observer.disconnect();
    };
  }, [videoRef]);
}
