import { useMemo } from "react";

export type Rect = { id: string; x: number; y: number; w: number; h: number };

type Opts = {
  grid?: number;
  threshold?: number;
};

export default function useSmartGuides({ grid = 8, threshold = 10 }: Opts = {}) {
  const snapToGrid = (v: number) => Math.round(v / grid) * grid;

  const compute = useMemo(() => {
    return (moving: Rect, others: Rect[], proposedX: number, proposedY: number) => {
      let x = snapToGrid(proposedX);
      let y = snapToGrid(proposedY);

      const left = () => x;
      const right = () => x + moving.w;
      const top = () => y;
      const bottom = () => y + moving.h;

      for (const c of others) {
        if (c.id === moving.id) continue;

        // Horizontal: snap sides flush
        if (Math.abs(right() - c.x) <= threshold) x = c.x - moving.w;                    // moving.right -> c.left
        if (Math.abs(left() - (c.x + c.w)) <= threshold) x = c.x + c.w;                  // moving.left -> c.right

        // Vertical: snap sides flush
        if (Math.abs(bottom() - c.y) <= threshold) y = c.y - moving.h;                   // moving.bottom -> c.top
        if (Math.abs(top() - (c.y + c.h)) <= threshold) y = c.y + c.h;                   // moving.top -> c.bottom

        // Co-linear alignment (edge-on-edge line-up)
        if (Math.abs(left() - c.x) <= threshold) x = c.x;                                // left-left
        if (Math.abs(right() - (c.x + c.w)) <= threshold) x = c.x + c.w - moving.w;      // right-right
        if (Math.abs(top() - c.y) <= threshold) y = c.y;                                 // top-top
        if (Math.abs(bottom() - (c.y + c.h)) <= threshold) y = c.y + c.h - moving.h;     // bottom-bottom
      }

      return { x, y };
    };
  }, [grid, threshold]);

  return { snapToGrid, compute };
}