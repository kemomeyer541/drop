// utils/rhyme.ts
export type Token = { start: number; end: number; text: string; norm: string };
export type RhymeMark = { start: number; end: number; color: string; key: string };

const SUFFIXES = ["'s","'s","ing","ed","es","s"]; // strip once, longest first

export function tokenize(src: string): Token[] {
  const out: Token[] = [];
  const re = /[A-Za-z'']+/g; // keep apostrophes
  let m: RegExpExecArray | null;
  while ((m = re.exec(src))) {
    const text = m[0];
    const norm0 = text.toLowerCase();
    const norm = stripSuffix(norm0);
    out.push({ start: m.index, end: m.index + text.length, text, norm });
  }
  return out;
}

function stripSuffix(w: string): string {
  for (const s of SUFFIXES) {
    if (w.length > s.length + 1 && w.endsWith(s)) return w.slice(0, -s.length);
  }
  return w;
}

// rhyme key = last 3 letters (>=4 chars) else last 2 letters; min length 2
export function rhymeKey(norm: string): string | null {
  if (norm.length < 2) return null;
  return norm.length >= 4 ? norm.slice(-3) : norm.slice(-2);
}

// deterministic color from key via djb2
function djb2(str: string): number {
  let h = 5381;
  for (let i = 0; i < str.length; i++) h = ((h << 5) + h) + str.charCodeAt(i);
  return h >>> 0;
}

const PALETTE = [
  "var(--rhyme-1)", "var(--rhyme-2)", "var(--rhyme-3)", "var(--rhyme-4)",
  "var(--rhyme-5)", "var(--rhyme-6)", "var(--rhyme-7)", "var(--rhyme-8)",
  "var(--rhyme-9)", "var(--rhyme-10)", "var(--rhyme-11)", "var(--rhyme-12)"
];

export function computeRhymeMarks(src: string): RhymeMark[] {
  const toks = tokenize(src);
  const groups = new Map<string, Token[]>();
  for (const t of toks) {
    const key = rhymeKey(t.norm);
    if (!key) continue;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(t);
  }
  const marks: RhymeMark[] = [];
  for (const [key, arr] of groups) {
    if (arr.length < 2) continue; // only highlight if there's a rhyme pair or more
    const idx = djb2(key) % PALETTE.length;
    const color = PALETTE[idx];
    for (const t of arr) marks.push({ start: t.start, end: t.end, color, key });
  }
  return marks.sort((a,b)=>a.start-b.start);
}