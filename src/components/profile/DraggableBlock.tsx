import { useRef, useState } from "react";
import type { ProfileBlock } from "../../types/profile";

interface DraggableBlockProps {
  block: ProfileBlock;
  onChange: (patch: Partial<ProfileBlock>) => void;
  editable: boolean;
  children: React.ReactNode;
}

export default function DraggableBlock({
  block, onChange, editable, children
}: DraggableBlockProps) {
  const dragging = useRef(false);
  const start = useRef<{mx:number; my:number; x:number; y:number} | null>(null);
  const [isHover, setHover] = useState(false);

  const onDown = (e: React.PointerEvent) => {
    if (!editable) return;
    dragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    start.current = { mx: e.clientX, my: e.clientY, x: block.x, y: block.y };
  };
  const onMove = (e: React.PointerEvent) => {
    if (!editable || !dragging.current || !start.current) return;
    const host = (e.currentTarget.parentElement as HTMLElement).getBoundingClientRect();
    const nx = Math.max(0, Math.min(host.width - block.w, start.current.x + (e.clientX - start.current.mx)));
    const ny = Math.max(0, Math.min(host.height - block.h, start.current.y + (e.clientY - start.current.my)));
    onChange({ x: nx, y: ny });
  };
  const onUp = (e: React.PointerEvent) => {
    if (!editable) return;
    dragging.current = false;
    start.current = null;
    try { e.currentTarget.releasePointerCapture(e.pointerId); } catch {}
  };

  return (
    <div
      className="absolute shadow-sm rounded-md"
      style={{
        left: block.x, top: block.y, width: block.w, height: block.h,
        background: block.bg ?? "var(--card-bg-darker)",
        color: block.color ?? "#E6ECF3", border: "1px solid #1A2531",
        userSelect: "none", transition: isHover ? "box-shadow .15s ease" : undefined
      }}
      onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
    >
      {/* Chrome */}
      <div className="flex items-center justify-between text-xs px-2 py-1 border-b border-[#1A2531]" style={{cursor: editable ? "grab" : "default"}}>
        <div className="opacity-80 capitalize">{block.type}</div>
        <div className="flex items-center gap-2">
          {/* color picker (per block) */}
          <input
            type="color" title="Card color"
            value={block.bg ?? "#0f1520"}
            onChange={(e) => onChange({ bg: e.target.value })}
            disabled={!editable}
            className="w-4 h-4 rounded border-0 cursor-pointer"
          />
          {!block.locked && editable && (
            <button 
              title="Remove" 
              onClick={(e)=>{e.stopPropagation(); onChange({ w:0, h:0, x:-9999, y:-9999 } as any);}}
              className="text-red-400 hover:text-red-300 transition-colors w-3 h-3 flex items-center justify-center"
            >
              ✖
            </button>
          )}
        </div>
      </div>
      <div className="p-3 h-[calc(100%-28px)] overflow-auto">{children}</div>
    </div>
  );
}