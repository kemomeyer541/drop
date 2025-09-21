import React, { useEffect, useRef } from "react";

type Props = {
  /** Optional: hue shift 0-360 */
  hue?: number;
  /** Optional: opacity 0-1 */
  opacity?: number;
};

/**
 * GPU-friendly aurora using two blurred radial gradients on a fixed canvas.
 * Pointer moves gently influence the gradient center.
 * pointer-events:none ensures it never interferes with UI.
 */
const AuroraEffect: React.FC<Props> = ({ hue = 210, opacity = 0.35 }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const raf = useRef<number | null>(null);
  const mouse = useRef({ x: 0.5, y: 0.3 });
  const target = useRef({ x: 0.5, y: 0.3 });
  const dpr = Math.min(2, typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1);

  useEffect(() => {
    const cvs = canvasRef.current!;
    const ctx = cvs.getContext("2d", { alpha: true })!;
    let w = 0, h = 0;

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      cvs.width = Math.floor(w * dpr);
      cvs.height = Math.floor(h * dpr);
      cvs.style.width = `${w}px`;
      cvs.style.height = `${h}px`;
      ctx.resetTransform?.();
      ctx.scale(dpr, dpr);
    };

    const onMove = (e: MouseEvent) => {
      target.current.x = e.clientX / (w || 1);
      target.current.y = e.clientY / (h || 1);
    };

    const onTouch = (e: TouchEvent) => {
      if (!e.touches[0]) return;
      target.current.x = e.touches[0].clientX / (w || 1);
      target.current.y = e.touches[0].clientY / (h || 1);
    };

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const loop = () => {
      mouse.current.x = lerp(mouse.current.x, target.current.x, 0.08);
      mouse.current.y = lerp(mouse.current.y, target.current.y, 0.08);

      ctx.clearRect(0, 0, w, h);

      // Blob 1
      const x1 = mouse.current.x * w;
      const y1 = mouse.current.y * h;
      const grd1 = ctx.createRadialGradient(x1, y1, 0, x1, y1, Math.max(w, h) * 0.6);
      grd1.addColorStop(0, `hsla(${hue}, 95%, 70%, ${opacity})`);
      grd1.addColorStop(1, "hsla(0,0%,0%,0)");
      ctx.fillStyle = grd1;
      ctx.beginPath();
      ctx.arc(x1, y1, Math.max(w, h) * 0.65, 0, Math.PI * 2);
      ctx.fill();

      // Blob 2 (complementary)
      const x2 = (1 - mouse.current.x) * w;
      const y2 = (mouse.current.y * 0.6 + 0.2) * h;
      const grd2 = ctx.createRadialGradient(x2, y2, 0, x2, y2, Math.max(w, h) * 0.7);
      grd2.addColorStop(0, `hsla(${(hue + 120) % 360}, 90%, 65%, ${opacity * 0.9})`);
      grd2.addColorStop(1, "hsla(0,0%,0%,0)");
      ctx.fillStyle = grd2;
      ctx.beginPath();
      ctx.arc(x2, y2, Math.max(w, h) * 0.7, 0, Math.PI * 2);
      ctx.fill();

      raf.current = requestAnimationFrame(loop);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onTouch, { passive: true });

    raf.current = requestAnimationFrame(loop);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onTouch);
    };
  }, [dpr, hue, opacity]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[60] mix-blend-screen"
      aria-hidden
    />
  );
};

export default AuroraEffect;

