import { useMemo, useState } from 'react';

type Rect = { id: string; x: number; y: number; w: number; h: number };

const THRESH = 8;

export function useSmartGuides(blocks: Rect[]) {
  const [guides, setGuides] = useState<{ v?: number; h?: number }>({});

  const edges = useMemo(() => blocks.map(b => ({
    id: b.id,
    l: b.x, 
    r: b.x + b.w, 
    t: b.y, 
    b: b.y + b.h,
    cx: b.x + b.w / 2, 
    cy: b.y + b.h / 2
  })), [blocks]);

  function snapRect(activeId: string, draft: Rect) {
    const me = { 
      l: draft.x, 
      r: draft.x + draft.w, 
      t: draft.y, 
      b: draft.y + draft.h,
      cx: draft.x + draft.w / 2, 
      cy: draft.y + draft.h / 2 
    };

    let bestDx = 0, bestDy = 0;
    let vGuide: number | undefined, hGuide: number | undefined;

    for (const e of edges) {
      if (e.id === activeId) continue;

      // vertical alignment (x): left/center/right to left/center/right
      const pairsX = [
        [me.l, e.l], [me.l, e.cx], [me.l, e.r],
        [me.cx, e.l], [me.cx, e.cx], [me.cx, e.r],
        [me.r, e.l], [me.r, e.cx], [me.r, e.r]
      ];
      
      for (const [a, b] of pairsX) {
        const dx = b - a;
        if (Math.abs(dx) <= THRESH && Math.abs(dx) < Math.abs(bestDx) || bestDx === 0) {
          bestDx = dx; 
          vGuide = b;
        }
      }

      // horizontal alignment (y): top/mid/bottom
      const pairsY = [
        [me.t, e.t], [me.t, e.cy], [me.t, e.b],
        [me.cy, e.t], [me.cy, e.cy], [me.cy, e.b],
        [me.b, e.t], [me.b, e.cy], [me.b, e.b]
      ];
      
      for (const [a, b] of pairsY) {
        const dy = b - a;
        if (Math.abs(dy) <= THRESH && Math.abs(dy) < Math.abs(bestDy) || bestDy === 0) {
          bestDy = dy; 
          hGuide = b;
        }
      }
    }

    setGuides({ v: vGuide, h: hGuide });

    // return a snapped rect (only if within threshold)
    const snapped = { ...draft };
    if (Math.abs(bestDx) <= THRESH) snapped.x += bestDx;
    if (Math.abs(bestDy) <= THRESH) snapped.y += bestDy;
    return snapped;
  }

  function clearGuides() { 
    setGuides({}); 
  }

  return { guides, snapRect, clearGuides };
}