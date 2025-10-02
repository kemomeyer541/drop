// src/utils/feed.ts
export type FeedItemRaw = {
  id?: string;        // may be missing/duplicated from server
  type: "site_action" | "community_post";
  ts?: number;        // epoch ms, may be missing
  payload: Record<string, any>;
};

export type FeedItem = FeedItemRaw & { uid: string; ts: number };

function makeUid(r: FeedItemRaw) {
  // composite key: type:id:ts:fingerprint
  const base = r.id ?? cryptoRandom();
  const ts = r.ts ?? Date.now();
  const fp = r.payload?.hash ?? r.payload?.slug ?? cryptoRandom();
  return `${r.type}:${base}:${ts}:${fp}`;
}

function cryptoRandom() {
  return Math.random().toString(36).slice(2);
}

export function normalize(raw: FeedItemRaw): FeedItem {
  const ts = raw.ts ?? Date.now();
  return { ...raw, ts, uid: makeUid({ ...raw, ts }) };
}

export function upsertPrepend(prev: FeedItem[], incoming: FeedItem | FeedItem[], max = 25) {
  const list = Array.isArray(incoming) ? incoming : [incoming];

  // De-dupe by uid (not id!)
  const seen = new Set(prev.map(i => i.uid));
  const fresh: FeedItem[] = [];
  for (const it of list) if (!seen.has(it.uid)) { fresh.push(it); seen.add(it.uid); }

  // newest first
  const next = [...fresh, ...prev].sort((a, b) => b.ts - a.ts);
  return next.slice(0, max);
}