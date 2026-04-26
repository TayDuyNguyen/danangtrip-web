"use client";

import { useEffect, useMemo, useRef } from "react";

const PARTICLE_COUNT = 180;

export default function AmbientBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const enableWebgl = useMemo(
    () => process.env.NEXT_PUBLIC_ENABLE_WEBGL_BG === "true",
    []
  );

  useEffect(() => {
    if (!enableWebgl || !canvasRef.current) {
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random(),
      y: Math.random(),
      z: 0.2 + Math.random() * 0.8,
      vx: (Math.random() - 0.5) * 0.0004,
      vy: (Math.random() - 0.5) * 0.0004,
    }));

    let raf = 0;
    let lastTs = performance.now();
    let pulse = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (ts: number) => {
      const dt = Math.min(32, ts - lastTs);
      lastTs = ts;
      pulse += dt * 0.00035;

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      ctx.fillStyle = "rgba(8, 8, 8, 0.35)";
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

      const breath = 0.75 + Math.sin(pulse) * 0.25;
      for (const p of particles) {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        if (p.x < 0 || p.x > 1) p.vx *= -1;
        if (p.y < 0 || p.y > 1) p.vy *= -1;
        p.x = Math.max(0, Math.min(1, p.x));
        p.y = Math.max(0, Math.min(1, p.y));

        const alpha = 0.08 + p.z * 0.22 * breath;
        const size = 0.8 + p.z * 1.7;
        ctx.fillStyle = `rgba(146, 152, 82, ${alpha})`;
        ctx.beginPath();
        ctx.arc(p.x * window.innerWidth, p.y * window.innerHeight, size, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    raf = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
    };
  }, [enableWebgl]);

  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-20 bg-[#080808]"
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-20 bg-[radial-gradient(circle_at_80%_0%,rgba(139,106,85,0.22),transparent_40%),radial-gradient(circle_at_10%_90%,rgba(92,56,34,0.2),transparent_45%)]"
      />
      {enableWebgl ? (
        <canvas
          ref={canvasRef}
          id="bg-canvas"
          aria-hidden
          className="pointer-events-none fixed inset-0 -z-10 opacity-50"
        />
      ) : null}
    </>
  );
}
