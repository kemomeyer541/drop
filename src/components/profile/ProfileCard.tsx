import React, { useRef, useState } from "react";
import { ColorPopover } from "../ui/ColorPopover";

export const ProfileCard: React.FC<{
  style: React.CSSProperties;
  color: string;
  onColor: (hex: string) => void;
  bind: any; // from DragBoard
  children?: React.ReactNode;
}> = ({ style, color, onColor, bind, children }) => {
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState(false);

  return (
    <div
      {...bind}
      className="rounded-2xl border border-white/10 shadow-lg overflow-hidden"
      style={{ ...style, background: color }}
    >
      <div className="p-3 flex items-center justify-between">
        <div className="text-white/90 text-sm">Card</div>
        <button
          ref={btnRef}
          className="text-xs px-2 py-1 rounded-lg bg-white/10 hover:bg-white/15"
          onClick={(e) => { e.stopPropagation(); setOpen(true); }}
        >
          Change Color
        </button>
      </div>
      <div className="p-3">{children}</div>

      <ColorPopover
        anchorEl={btnRef.current}
        open={open}
        initial={color}
        onClose={() => setOpen(false)}
        onChange={(hex) => onColor(hex)}
      />
    </div>
  );
};

