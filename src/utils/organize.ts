import { GRID } from './layout';
import { BlockModel } from '../types/profile';

export function organizeGrid(blocks: BlockModel[], canvasW: number) {
  const gap = 16, colW = 420;
  const cols = Math.max(1, Math.floor((canvasW + gap) / (colW + gap)));
  const heights = Array(cols).fill(0);

  return blocks.map(b => {
    if (b.locked) return b;
    const ci = heights.indexOf(Math.min(...heights));
    const x = ci * (colW + gap);
    const y = heights[ci];
    const w = Math.min(b.w || colW, colW);
    const h = b.h || 160;
    heights[ci] = y + h + gap;
    return { ...b, x, y, w, h };
  });
}