// Live grid + calibration to the header's real X.
export type Rect = { id: string; x: number; y: number; w: number; h: number };

export function getGridSpec(canvasEl: HTMLElement) {
  const cs = getComputedStyle(canvasEl);
  const canvasWidth = canvasEl.clientWidth;
  const outer = parseFloat(cs.paddingLeft || "0");  // base fallback
  const gutter = 24;
  const cols = 12;
  const rowHeight = 156;
  return { cols, canvasWidth, outer, gutter, rowHeight };
}

const colWidth = (g: any) =>
  Math.floor((g.canvasWidth - g.outer * 2 - g.gutter * (g.cols - 1)) / g.cols);

// --- NEW: calibrate grid so col 0 == header.x ------------
export function calibrateOuter(g: any, headerX: number) {
  // snap outer to headerX with sane bounds
  const nextOuter = Math.max(0, Math.min(headerX, Math.floor(g.canvasWidth / 3)));
  return { ...g, outer: nextOuter };
}
// ---------------------------------------------------------

// snap to nearest column without offset drift
export function snapX(pxX: number, pxW: number, g: any) {
  const colWidth = (g.canvasWidth - g.outer * 2 - g.gutter * (g.cols - 1)) / g.cols;
  const pitch = colWidth + g.gutter;
  const col = Math.round((pxX - g.outer) / pitch);
  return g.outer + col * pitch;
}

export function overlaps(a: Rect, b: Rect, minGapPx = 8) {
  // require >minGap intrusion to count as overlap; touching within 8px is not allowed
  return !(
    a.x + a.w <= b.x - minGapPx ||
    b.x + b.w <= a.x - minGapPx ||
    a.y + a.h <= b.y - minGapPx ||
    b.y + b.h <= a.y - minGapPx
  );
}

export function compact(rects: Rect[], g: any, headerId?: string) {
  const out: Rect[] = [];
  const byTop = [...rects].sort((a,b)=> a.y===b.y ? a.x-b.x : a.y-b.y);
  const header = headerId ? byTop.find(r=>r.id===headerId) : undefined;
  const headerBottom = header ? header.y + header.h : -Infinity;
  const GAP = 8;

  for (const r of byTop) {
    let p = { ...r };
    if (header && p.id !== header.id && p.y < headerBottom + GAP && p.y + p.h > header.y) {
      p.y = headerBottom + GAP;
    }
    while (out.some(o => overlaps(p, o, GAP))) p.y += 4; // small nudges until >= 8px clear
    out.push(p);
  }

  // return in original order
  const map = new Map(out.map(r => [r.id, r]));
  return rects.map(r => map.get(r.id) ?? r);
}