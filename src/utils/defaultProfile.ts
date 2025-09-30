// layout/defaultProfile.ts
type BlockId =
  | "header"
  | "newDrops" | "friends" | "yourPosts" | "links" | "comments" | "collection"
  | "shop" | "chalkboard" | "donators" | "monthly" | "pinned" | "photos" | "poll";

type Rect = { id: BlockId; x: number; y: number; w: number; h: number };

// grid spec
const COLS = 12;
const OUTER = 16;
const GUTTER = 24;
const ROW_H = 156;

// convert grid units → px (c = start col, s = span, r = row)
const colWidth = (canvasWidth: number) =>
  Math.floor((canvasWidth - OUTER * 2 - GUTTER * (COLS - 1)) / COLS);
const pxX = (canvasWidth: number, c: number) =>
  OUTER + c * (colWidth(canvasWidth) + GUTTER);
const pxW = (canvasWidth: number, span: number) =>
  colWidth(canvasWidth) * span + GUTTER * (span - 1);
const pxY = (row: number) => OUTER + row * (ROW_H + GUTTER);

// This matches your "works for casuals" screenshot: 3-row hero then tidy grid
export function buildDefaultLayout(canvasWidth: number): Rect[] {
  const X = (c: number) => pxX(canvasWidth, c);
  const W = (s: number) => pxW(canvasWidth, s);
  const Y = (r: number) => pxY(r);

  return [
    { id: "header",     x: X(0),  y: Y(0), w: W(12), h: ROW_H },           // hero
    { id: "newDrops",   x: X(0),  y: Y(1), w: W(7),  h: ROW_H },
    { id: "friends",    x: X(7),  y: Y(1), w: W(5),  h: ROW_H },

    { id: "comments",   x: X(0),  y: Y(2), w: W(7),  h: ROW_H },
    { id: "yourPosts",  x: X(7),  y: Y(2), w: W(5),  h: ROW_H },

    { id: "collection", x: X(0),  y: Y(3), w: W(12), h: ROW_H },

    { id: "chalkboard", x: X(0),  y: Y(4), w: W(7),  h: ROW_H },
    { id: "links",      x: X(7),  y: Y(4), w: W(5),  h: ROW_H },

    { id: "shop",       x: X(0),  y: Y(5), w: W(7),  h: ROW_H },
    { id: "donators",   x: X(7),  y: Y(5), w: W(5),  h: ROW_H },

    { id: "monthly",    x: X(7),  y: Y(6), w: W(5),  h: ROW_H },
    { id: "pinned",     x: X(7),  y: Y(7), w: W(5),  h: ROW_H },
    { id: "photos",     x: X(7),  y: Y(8), w: W(5),  h: ROW_H },
    { id: "poll",       x: X(7),  y: Y(9), w: W(5),  h: ROW_H },
  ];
}

// call this inside your "Apply Default Layout" handler
export function applyDefaultLayout(
  canvasEl: HTMLElement,
  setRects: (next: Rect[]) => void
) {
  const width = canvasEl.clientWidth;
  setRects(buildDefaultLayout(width));
}