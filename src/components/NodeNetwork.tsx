"use client";

import { useEffect, useRef } from "react";
import { servicesData } from "@/data/content";

interface NodeNetworkProps {
  activeService: number;
  onSelectService: (index: number) => void;
}

export default function NodeNetwork({
  activeService,
  onSelectService,
}: NodeNetworkProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const hoveredNodeRef = useRef<number>(-1);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 500);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 450);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight || 450;
    };

    window.addEventListener("resize", handleResize);

    const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Colors
    const rootStyle = getComputedStyle(document.documentElement);
    const primaryColor = rootStyle.getPropertyValue("--color-primary").trim() || "#7ed33f";
    const accentColor = rootStyle.getPropertyValue("--color-accent").trim() || "#22e5ff";

    const nodeColors = [
      primaryColor,
      accentColor,
      "#a3e635",
      "#facc15",
    ];

    // Mouse coordinates relative to canvas
    let mouse = { x: 0, y: 0 };

    const handlePointerMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(width, height) * 0.35;

      servicesData.forEach((_, idx) => {
        const angle = -Math.PI / 2 + (idx / servicesData.length) * Math.PI * 2;
        const nx = centerX + radius * Math.cos(angle);
        const ny = centerY + radius * Math.sin(angle);
        const dist = Math.sqrt((clickX - nx) ** 2 + (clickY - ny) ** 2);

        if (dist < 35) {
          onSelectService(idx);
        }
      });
    };

    canvas.addEventListener("mousemove", handlePointerMove);
    canvas.addEventListener("click", handleClick);

    let startTime = performance.now();

    const draw = (currentTime: number) => {
      const elapsed = (currentTime - startTime) / 1000;
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(width, height) * 0.35;

      // Outer ring connecting nodes
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(34, 229, 255, 0.15)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Ambient rotating particles inside orbit
      const dustCount = 14;
      for (let i = 0; i < dustCount; i++) {
        const dustAngle = elapsed * 0.2 + (i / dustCount) * Math.PI * 2;
        const dustRadius = radius * (0.55 + 0.35 * Math.sin(i * 1.5 + elapsed * 0.5));
        const dx = centerX + dustRadius * Math.cos(dustAngle);
        const dy = centerY + dustRadius * Math.sin(dustAngle);

        ctx.beginPath();
        ctx.arc(dx, dy, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = i % 2 === 0 ? primaryColor : accentColor;
        ctx.globalAlpha = 0.35;
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      // Calculate node positions
      const nodePositions: { x: number; y: number; title: string; color: string }[] = [];
      let hoveredIndex = -1;

      servicesData.forEach((srv, idx) => {
        const angle = -Math.PI / 2 + (idx / servicesData.length) * Math.PI * 2;
        const nx = centerX + radius * Math.cos(angle);
        const ny = centerY + radius * Math.sin(angle);
        const distToMouse = Math.sqrt((mouse.x - nx) ** 2 + (mouse.y - ny) ** 2);

        if (distToMouse < 35) {
          hoveredIndex = idx;
        }

        nodePositions.push({
          x: nx,
          y: ny,
          title: srv.title,
          color: nodeColors[idx % nodeColors.length],
        });
      });

      hoveredNodeRef.current = hoveredIndex;
      canvas.style.cursor = hoveredIndex !== -1 ? "pointer" : "default";

      // Draw connecting lines from center to nodes
      nodePositions.forEach((pos, idx) => {
        const isActive = activeService === idx;
        const isHovered = hoveredIndex === idx;

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(pos.x, pos.y);
        ctx.strokeStyle = isActive || isHovered ? pos.color : "rgba(34, 229, 255, 0.25)";
        ctx.lineWidth = isActive ? 2.5 : isHovered ? 2 : 1;
        ctx.globalAlpha = isActive ? 0.95 : isHovered ? 0.8 : 0.3;
        ctx.stroke();
        ctx.globalAlpha = 1;
      });

      // Draw Center Hub
      ctx.save();
      ctx.translate(centerX, centerY);
      if (!isReducedMotion) {
        ctx.rotate(elapsed * 0.25);
      }

      // Center outer pulse ring
      const centerPulse = 1 + 0.08 * Math.sin(elapsed * 2);
      ctx.beginPath();
      ctx.arc(0, 0, 26 * centerPulse, 0, Math.PI * 2);
      ctx.strokeStyle = primaryColor;
      ctx.globalAlpha = 0.4;
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.globalAlpha = 1;

      // Center core
      ctx.beginPath();
      ctx.arc(0, 0, 14, 0, Math.PI * 2);
      ctx.fillStyle = primaryColor;
      ctx.shadowColor = primaryColor;
      ctx.shadowBlur = 16;
      ctx.fill();
      ctx.restore();

      // Draw Outer Nodes
      nodePositions.forEach((pos, idx) => {
        const isActive = activeService === idx;
        const isHovered = hoveredIndex === idx;
        const scale = isActive ? 1.3 : isHovered ? 1.15 : 1;

        ctx.save();
        ctx.translate(pos.x, pos.y);

        // Node orbital halo ring
        ctx.beginPath();
        ctx.arc(0, 0, 18 * scale, 0, Math.PI * 2);
        ctx.strokeStyle = pos.color;
        ctx.globalAlpha = isActive ? 0.9 : 0.35;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Node solid sphere
        ctx.beginPath();
        ctx.arc(0, 0, 10 * scale, 0, Math.PI * 2);
        ctx.fillStyle = pos.color;
        ctx.shadowColor = pos.color;
        ctx.shadowBlur = isActive ? 20 : isHovered ? 14 : 6;
        ctx.globalAlpha = 1;
        ctx.fill();

        ctx.restore();

        // Node label
        ctx.save();
        ctx.font = `${isActive ? "600" : "500"} 11px var(--font-display), sans-serif`;
        ctx.fillStyle = isActive ? "#ffffff" : "rgba(255, 255, 255, 0.65)";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        // Offset label depending on node position
        const labelY = pos.y + (pos.y < centerY ? -24 : 26);
        ctx.fillText(pos.title.toUpperCase(), pos.x, labelY);
        ctx.restore();
      });

      if (!isReducedMotion) {
        animId = requestAnimationFrame(draw);
      }
    };

    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mousemove", handlePointerMove);
      canvas.removeEventListener("click", handleClick);
    };
  }, [activeService, onSelectService]);

  return (
    <div className="relative flex h-[380px] w-full items-center justify-center md:h-[480px]">
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}
