"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

const PARTICLE_COUNT = 320;
const FIELD_RADIUS = 20;

function runCanvas2dFallback(canvas: HTMLCanvasElement): () => void {
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return () => {};
  }

  const particles = Array.from({ length: 180 }, () => ({
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
    ctx.fillStyle = "rgba(8, 8, 8, 0.12)";
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

    const breath = 0.75 + Math.sin(pulse) * 0.25;
    for (const p of particles) {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      if (p.x < 0 || p.x > 1) p.vx *= -1;
      if (p.y < 0 || p.y > 1) p.vy *= -1;
      p.x = Math.max(0, Math.min(1, p.x));
      p.y = Math.max(0, Math.min(1, p.y));

      const alpha = 0.18 + p.z * 0.45 * breath;
      const size = 1.2 + p.z * 2.8;
      ctx.fillStyle = `rgba(180, 188, 95, ${alpha})`;
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
}

export default function AmbientBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const enableWebgl = useMemo(
    () => process.env.NEXT_PUBLIC_ENABLE_WEBGL_BG !== "false",
    []
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    if (!enableWebgl) {
      return runCanvas2dFallback(canvas);
    }

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
    } catch {
      return runCanvas2dFallback(canvas);
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 120);
    camera.position.set(0, 0, 12);

    const root = new THREE.Group();
    scene.add(root);

    const particlesGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i += 1) {
      const theta = Math.random() * Math.PI * 2;
      const radius = Math.sqrt(Math.random()) * FIELD_RADIUS;
      const x = Math.cos(theta) * radius;
      const y = (Math.random() - 0.5) * FIELD_RADIUS * 1.4;
      const z = (Math.random() - 0.5) * 9;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
    }
    particlesGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      color: 0xb4bc5f,
      size: 0.14,
      transparent: true,
      opacity: 0.72,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    root.add(particles);

    const wireMesh = new THREE.Mesh(
      new THREE.IcosahedronGeometry(2.25, 1),
      new THREE.MeshStandardMaterial({
        color: 0x8b6a55,
        roughness: 0.65,
        metalness: 0.2,
        wireframe: true,
        transparent: true,
        opacity: 0.32,
      })
    );
    root.add(wireMesh);

    const coreMesh = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.3, 0),
      new THREE.MeshBasicMaterial({
        color: 0x8b6a55,
        transparent: true,
        opacity: 0.2,
      })
    );
    root.add(coreMesh);

    scene.add(new THREE.AmbientLight(0xffffff, 0.48));
    const directional = new THREE.DirectionalLight(0x8b6a55, 0.62);
    directional.position.set(4, 6, 6);
    scene.add(directional);

    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    const onPointerMove = (event: PointerEvent) => {
      pointer.tx = (event.clientX / window.innerWidth - 0.5) * 0.35;
      pointer.ty = (event.clientY / window.innerHeight - 0.5) * 0.35;
    };

    const resize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(width, height, false);
      renderer.setClearColor(0x000000, 0);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("resize", resize);
    resize();

    const clock = new THREE.Clock();
    let raf = 0;
    const animate = () => {
      const elapsed = clock.getElapsedTime();

      pointer.x += (pointer.tx - pointer.x) * 0.04;
      pointer.y += (pointer.ty - pointer.y) * 0.04;

      root.rotation.y = elapsed * 0.06 + pointer.x;
      root.rotation.x = Math.sin(elapsed * 0.28) * 0.05 - pointer.y * 0.4;
      particles.rotation.z = elapsed * 0.013;
      wireMesh.rotation.y = -elapsed * 0.08;
      wireMesh.rotation.x = elapsed * 0.05;
      coreMesh.rotation.z = elapsed * 0.09;

      const pulse = 0.85 + Math.sin(elapsed * 0.75) * 0.15;
      particlesMaterial.opacity = 0.45 + pulse * 0.35;
      wireMesh.scale.setScalar(0.96 + Math.sin(elapsed * 0.62) * 0.06);

      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };

    raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", resize);

      particlesGeometry.dispose();
      particlesMaterial.dispose();
      wireMesh.geometry.dispose();
      (wireMesh.material as THREE.Material).dispose();
      coreMesh.geometry.dispose();
      (coreMesh.material as THREE.Material).dispose();
      renderer.dispose();
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
        className="pointer-events-none fixed inset-0 -z-20 bg-[radial-gradient(circle_at_80%_0%,rgba(139,106,85,0.45),transparent_50%),radial-gradient(circle_at_10%_90%,rgba(92,56,34,0.42),transparent_52%),radial-gradient(circle_at_50%_50%,rgba(146,152,82,0.08),transparent_70%)]"
      />
      <canvas
        ref={canvasRef}
        id="bg-canvas"
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 opacity-95"
      />
    </>
  );
}
