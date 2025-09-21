import React, { useEffect, useRef } from "react";

/** Fixed, GPU-friendly aurora overlay. Pointer-safe (no click blocking). */
export default function AuroraOverlay({
  hue = 205,
  opacity = 0.32,
}: { hue?: number; opacity?: number }) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const raf = useRef<number | null>(null);
  const mouse = useRef({ x: 0.5, y: 0.3 });
  const target = useRef({ x: 0.55, y: 0.35 });

  useEffect(() => {
    const cvs = ref.current!;
    const ctx = cvs.getContext("2d", { alpha: true })!;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    let w = 0, h = 0;

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      cvs.width = Math.floor(w * dpr);
      cvs.height = Math.floor(h * dpr);
      cvs.style.width = `${w}px`;
      cvs.style.height = `${h}px`;
      // @ts-ignore: older browsers
      ctx.resetTransform?.();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const onMove = (x: number, y: number) => {
      target.current.x = x / (w || 1);
      target.current.y = y / (h || 1);
    };

    const onMouse = (e: MouseEvent) => onMove(e.clientX, e.clientY);
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) onMove(t.clientX, t.clientY);
    };

    const loop = () => {
      mouse.current.x = lerp(mouse.current.x, target.current.x, 0.08);
      mouse.current.y = lerp(mouse.current.y, target.current.y, 0.08);

      ctx.clearRect(0, 0, w, h);

      // Blob A
      const x1 = mouse.current.x * w;
      const y1 = mouse.current.y * h;
      const r1 = Math.max(w, h) * 0.65;
      const g1 = ctx.createRadialGradient(x1, y1, 0, x1, y1, r1);
      g1.addColorStop(0, `hsla(${hue},95%,70%,${opacity})`);
      g1.addColorStop(1, "hsla(0,0%,0%,0)");
      ctx.fillStyle = g1;
      ctx.beginPath();
      ctx.arc(x1, y1, r1, 0, Math.PI * 2);
      ctx.fill();

      // Blob B
      const x2 = (1 - mouse.current.x) * w;
      const y2 = (mouse.current.y * 0.6 + 0.2) * h;
      const r2 = Math.max(w, h) * 0.75;
      const g2 = ctx.createRadialGradient(x2, y2, 0, x2, y2, r2);
      g2.addColorStop(0, `hsla(${(hue + 120) % 360},90%,65%,${opacity * 0.9})`);
      g2.addColorStop(1, "hsla(0,0%,0%,0)");
      ctx.fillStyle = g2;
      ctx.beginPath();
      ctx.arc(x2, y2, r2, 0, Math.PI * 2);
      ctx.fill();

      raf.current = requestAnimationFrame(loop);
    };

    resize();
    window.addEventListener("resize", resize);
    // Disabled mousemove on Profile to prevent hover trails
    // window.addEventListener("mousemove", onMouse);
    // window.addEventListener("touchmove", onTouch, { passive: true });
    raf.current = requestAnimationFrame(loop);

    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
      window.removeEventListener("resize", resize);
      // window.removeEventListener("mousemove", onMouse);
      // window.removeEventListener("touchmove", onTouch);
    };
  }, [hue, opacity]);

  return (
    <canvas
      ref={ref}
      className="fixed inset-0 z-[60] pointer-events-none mix-blend-screen"
      aria-hidden
    />
  );
}

