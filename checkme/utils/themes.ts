import { BlockModel, BlockStyle } from '../types/profile';

export type ThemeName = 'calm' | 'vibrant' | 'cosmic' | 'minimal';

// Pure helper function for applying theme to individual blocks
function withTheme(b: BlockModel, theme: ThemeName): BlockModel {
  if (b.locked) return b; // Skip locked blocks like header
  const base = { radius: 18, border:'1px solid #223042', shadow:'var(--elev-1)' } as const;

  switch (theme) {
    case 'calm':
      return { ...b, style: { kind:'solid', color:'rgba(18,24,38,.86)', ...base } };
    case 'vibrant':
      return { ...b, style: { kind:'linear', from:'#6DC7FF', to:'#E6ABFF', angle:135, ...base } };
    case 'cosmic':
      return { ...b, style: { kind:'radial', inner:'rgba(110,80,255,.28)', outer:'rgba(10,14,24,.96)', ...base } };
    case 'minimal':
      return { ...b, style: { kind:'solid', color:'#0B1220', border:'1px solid #1b2a3b', radius:14, shadow:'none' } };
  }
}

export function applyTheme(theme: ThemeName, blocks: BlockModel[]): BlockModel[] {
  // Immutable mapping ensures React re-renders
  return blocks.map(b => withTheme(b, theme));
}

export const THEME_DESCRIPTIONS = {
  calm: 'Soft, muted colors for a peaceful profile',
  vibrant: 'Bright gradients that pop and shine',
  cosmic: 'Deep space vibes with radial gradients',
  minimal: 'Clean, sharp edges with minimal styling'
} as const;