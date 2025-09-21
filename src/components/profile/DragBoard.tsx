import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

export type CardData = {
  id: string;
  x: number; // px
  y: number; // px
  w: number; // px
  h: number; // px
  color?: string;
  z?: number;
};

type Props = {
  cards: CardData[];
  onChange(cards: CardData[]): void;
  grid?: number; // pixels
  snapThreshold?: number; // pixels
  children: (args: { card: CardData; style: React.CSSProperties; bind: any }) => React.ReactNode;
};

/**
 * DragBoard only used on Profile; improves snapping significantly:
 * - Grid snap (default 8px)
 * - Edge snap to neighbors within threshold (default 10px)
 */
const DragBoard: React.FC<Props> = ({ cards, onChange, grid = 8, snapThreshold = 10, children }) => {
  const [local, setLocal] = useState<CardData[]>(cards);
  useEffect(() => setLocal(cards), [cards]);

  const boardRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef<{ id: string; dx: number; dy: number; startX: number; startY: number } | null>(null);

  const indexById = useMemo(() => new Map(local.map((c, i) => [c.id, i])), [local]);

  const snapToGrid = (v: number) => Math.round(v / grid) * grid;

  const snapToNeighbors = (moving: CardData, nextX: number, nextY: number) => {
    let x = snapToGrid(nextX);
    let y = snapToGrid(nextY);

    const left = x;
    const right = x + moving.w;
    const top = y;
    const bottom = y + moving.h;

    for (const c of local) {
      if (c.id === moving.id) continue;

      // Snap X: left-to-right, right-to-left
      if (Math.abs(right - c.x) <= snapThreshold) x = c.x - moving.w;                 // align moving.right to c.left
      if (Math.abs(left - (c.x + c.w)) <= snapThreshold) x = c.x + c.w;               // align moving.left to c.right

      // Snap Y: top-to-bottom, bottom-to-top
      if (Math.abs(bottom - c.y) <= snapThreshold) y = c.y - moving.h;                // align bottom to c.top
      if (Math.abs(top - (c.y + c.h)) <= snapThreshold) y = c.y + c.h;                // align top to c.bottom

      // Flush alignments (within threshold): same x or same y
      if (Math.abs(left - c.x) <= snapThreshold) x = c.x;                              // left edges line up
      if (Math.abs(right - (c.x + c.w)) <= snapThreshold) x = c.x + c.w - moving.w;   // right edges line up
      if (Math.abs(top - c.y) <= snapThreshold) y = c.y;                               // top edges line up
      if (Math.abs(bottom - (c.y + c.h)) <= snapThreshold) y = c.y + c.h - moving.h;   // bottom edges line up
    }
    return { x, y };
  };

  const onPointerDown = useCallback((e: React.PointerEvent, id: string) => {
    const idx = indexById.get(id);
    if (idx == null) return;
    const el = (e.currentTarget as HTMLElement);
    el.setPointerCapture(e.pointerId);

    dragRef.current = { id, dx: e.clientX, dy: e.clientY, startX: local[idx].x, startY: local[idx].y };
  }, [indexById, local]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragRef.current) return;
    const { id, dx, dy, startX, startY } = dragRef.current;
    const idx = indexById.get(id);
    if (idx == null) return;

    const deltaX = e.clientX - dx;
    const deltaY = e.clientY - dy;

    const moving = local[idx];
    const proposedX = startX + deltaX;
    const proposedY = startY + deltaY;

    const { x, y } = snapToNeighbors(moving, proposedX, proposedY);

    const next = [...local];
    next[idx] = { ...moving, x, y };
    setLocal(next);
  }, [indexById, local]);

  const onPointerUp = useCallback(() => {
    if (!dragRef.current) return;
    dragRef.current = null;
    onChange(local);
  }, [local, onChange]);

  return (
    <div
      ref={boardRef}
      className="relative w-full h-full select-none"
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      {local.map(card => {
        const style: React.CSSProperties = {
          position: "absolute",
          left: card.x,
          top: card.y,
          width: card.w,
          height: card.h,
          zIndex: card.z ?? 1,
        };
        const bind = {
          onPointerDown: (e: React.PointerEvent) => onPointerDown(e, card.id),
          onPointerMove,
        };
        return <React.Fragment key={card.id}>{children({ card, style, bind })}</React.Fragment>;
      })}
    </div>
  );
};

export default DragBoard;

