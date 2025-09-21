import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type Props = {
  anchorEl: HTMLElement | null;
  open: boolean;
  initial: string;
  onClose: () => void;
  onChange: (hex: string) => void;
};

const swatches = ["#111827","#0ea5e9","#22d3ee","#10b981","#f59e0b","#f43f5e","#a78bfa","#f472b6","#38bdf8","#94a3b8"];

export const ColorPopover: React.FC<Props> = ({ anchorEl, open, initial, onClose, onChange }) => {
  const [hex, setHex] = useState(initial);
  const popRef = useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = useState<{top:number;left:number}>({ top: 0, left: 0 });

  useLayoutEffect(() => {
    if (!open || !anchorEl) return;
    const rect = anchorEl.getBoundingClientRect();
    const popW = 260, popH = 196, gap = 8;
    let left = rect.left;
    let top = rect.bottom + gap;

    // Flip vertically if no space below
    if (top + popH > window.innerHeight) top = rect.top - popH - gap;
    // Clamp horizontally
    if (left + popW > window.innerWidth) left = window.innerWidth - popW - 8;
    if (left < 8) left = 8;

    setPos({ top, left });
  }, [open, anchorEl]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const onClick = (e: MouseEvent) => {
      if (!popRef.current) return;
      if (e.target instanceof Node && !popRef.current.contains(e.target) && anchorEl && !anchorEl.contains(e.target)) {
        onClose();
      }
    };
    if (open) {
      window.addEventListener("keydown", onKey);
      window.addEventListener("mousedown", onClick);
    }
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onClick);
    };
  }, [open, onClose, anchorEl]);

  if (!open) return null;

  return createPortal(
    <>
      <div className="fixed inset-0 z-[80]" style={{ pointerEvents: "none" }} />
      <div
        ref={popRef}
        className="fixed z-[90] rounded-2xl shadow-2xl border border-white/10 bg-neutral-900 p-3"
        style={{ top: pos.top, left: pos.left, width: 260 }}
      >
        <div className="mb-2 text-sm text-white/80">Card Color</div>
        <div className="grid grid-cols-5 gap-2 mb-3">
          {swatches.map(s => (
            <button
              key={s}
              onClick={() => { setHex(s); onChange(s); }}
              className="h-8 rounded-lg border border-white/10"
              style={{ background: s }}
              aria-label={`Set ${s}`}
            />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <input
            value={hex}
            onChange={(e) => setHex(e.target.value)}
            onBlur={() => onChange(hex)}
            className="flex-1 bg-neutral-800 rounded-lg px-3 py-2 text-white/90 outline-none border border-white/10"
            placeholder="#0ea5e9"
          />
          <div className="w-8 h-8 rounded-lg border border-white/10" style={{ background: hex }} />
        </div>
      </div>
    </>,
    document.body
  );
};

