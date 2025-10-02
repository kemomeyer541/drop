import { ParticleEffect } from '../types/profile';

export const PARTICLE_CATALOG: ParticleEffect[] = [
  // Calm vibes
  { id: 'starfield',        name: 'Starfield Drift',  rarity: 'Common',    previewEmoji: '✨', description: '3-layer parallax stars with streaks' },
  { id: 'snow',             name: 'Cozy Snow',        rarity: 'Common',    previewEmoji: '❄️', description: 'Soft drifting snowflakes with sway' },
  { id: 'bubbles',          name: 'Floating Bubbles', rarity: 'Common',    previewEmoji: '🫧', description: 'Transparent bubbles rising slowly' },
  
  // Nature vibes
  { id: 'sakura',           name: 'Sakura Petals',    rarity: 'Uncommon',  previewEmoji: '🌸', description: 'Multi-shape petals with wind & depth' },
  { id: 'rain',             name: 'Gentle Rain',      rarity: 'Uncommon',  previewEmoji: '🌧️', description: 'Fast layered raindrops' },
  { id: 'butterflies',      name: 'Butterflies',      rarity: 'Uncommon',  previewEmoji: '🦋', description: 'Colorful wings drifting slowly' },
  { id: 'fireflies',        name: 'Fireflies',        rarity: 'Uncommon',  previewEmoji: '🪄', description: 'Large pulsing glow wanderers' },
  
  // Playful vibes
  { id: 'confetti',         name: 'Celebration',      rarity: 'Rare',      previewEmoji: '🎉', description: 'Colorful spinning confetti shower' },
  { id: 'emojiRain',        name: 'Emoji Rain',       rarity: 'Rare',      previewEmoji: '🌈', description: 'Musical emoji cascade' },
  { id: 'musicNotes',       name: 'Music Notes',      rarity: 'Rare',      previewEmoji: '♪', description: 'Floating musical symbols' },
  { id: 'sparkles',         name: 'Sparkles',         rarity: 'Rare',      previewEmoji: '✨', description: 'Twinkling star bursts' },
  { id: 'paperPlanes',      name: 'Paper Planes',     rarity: 'Rare',      previewEmoji: '✈️', description: 'White paper planes flying across' },
  
  // Sci-Fi vibes  
  { id: 'matrixDigits',     name: 'Matrix Rain',      rarity: 'Epic',      previewEmoji: '🟢', description: 'Numeric columns with glow trails' },
  { id: 'neonTriangles',    name: 'Neon Triangles',   rarity: 'Epic',      previewEmoji: '🔺', description: 'Rotating neon geometric shapes' },
  { id: 'electric',         name: 'Electric Sparks',  rarity: 'Epic',      previewEmoji: '⚡', description: 'Crackling lightning bolts' },
  
  // Atmospheric vibes
  { id: 'aurora',           name: 'Aurora Fog',       rarity: 'Legendary', previewEmoji: '🌌', description: 'Night sky with glowing ribbons' },
  { id: 'smoke',            name: 'Mystic Smoke',     rarity: 'Legendary', previewEmoji: '💨', description: 'Layered smoke wisps with trails' },
  { id: 'meteors',          name: 'Shooting Stars',   rarity: 'Legendary', previewEmoji: '☄️', description: 'Bright gradient meteor trails' },
];