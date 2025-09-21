import React, { forwardRef, useImperativeHandle, useState } from "react";
import type { FlairType } from "../../contexts/ProfileFlair";

type Burst = { id: number; x: number; y: number; icon: string };
const ICONS: Record<FlairType, string> = {
  paw: "🐾", heart: "💖", fire: "🔥", sparkles: "✨", skull: "💀"
};

export type FlairBurstHandle = { burst: (x: number, y: number, flair: FlairType) => void };

export const FlairBurst = forwardRef<FlairBurstHandle, {}>((_, ref) => {
  const [bursts, setBursts] = useState<Burst[]>([]);
  useImperativeHandle(ref, () => ({
    burst(x, y, flair) {
      const id = Date.now() + Math.random();
      setBursts((b) => [...b, { id, x, y, icon: ICONS[flair] }]);
      setTimeout(() => setBursts((b) => b.filter((i) => i.id !== id)), 650);
    },
  }));
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {bursts.map((b) => (
        <div
          key={b.id}
          className="select-none"
          style={{
            position: "absolute",
            left: b.x - 12,
            top: b.y - 12,
            animation: "profile-burst 600ms ease-out forwards",
            fontSize: 24,
            filter: "drop-shadow(0 2px 6px rgba(0,0,0,.35))",
          }}
        >
          {b.icon}
        </div>
      ))}
    </div>
  );
});