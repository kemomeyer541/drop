export const GRID = 16;

export const snap = (n: number) => Math.round(n / GRID) * GRID;

export const clamp = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(max, n));

export const nextZ = (z: number | undefined, maxZ: number) =>
  typeof z === 'number' ? Math.max(z, maxZ + 1) : maxZ + 1;