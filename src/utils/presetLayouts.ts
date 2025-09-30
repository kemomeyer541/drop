import { BlockModel } from '../types/profile';

// Header default configuration
export const HEADER_DEFAULT = { x: 24, y: 24, w: 880, h: 180 };
export const CARD_MAX_WIDTH = 960;

// Clean two-column preset layout
export const CLEAN_TWO_COL_PRESET: BlockModel[] = [
  // Header (permanent, movable, resizable)
  {
    id: 'profile-header',
    kind: 'ProfileHeader',
    ...HEADER_DEFAULT,
    z: 1,
    locked: true, // cannot delete but can move/resize
    style: { kind: 'solid', color: 'rgba(18,24,38,.86)', radius: 18, border: '1px solid #223042', shadow: 'var(--elev-1)' }
  },
  // Left column
  {
    id: 'new-drops',
    kind: 'NewDrops',
    x: 24,
    y: HEADER_DEFAULT.y + HEADER_DEFAULT.h + 16,
    w: 600,
    h: 180,
    z: 2,
    style: { kind: 'solid', color: 'rgba(18,24,38,.86)', radius: 18, border: '1px solid #223042', shadow: 'var(--elev-1)' }
  },
  {
    id: 'comments',
    kind: 'UserComments',
    x: 24,
    y: 420,
    w: 600,
    h: 160,
    z: 3,
    style: { kind: 'solid', color: 'rgba(18,24,38,.86)', radius: 18, border: '1px solid #223042', shadow: 'var(--elev-1)' }
  },
  {
    id: 'links',
    kind: 'Links',
    x: 24,
    y: 600,
    w: 600,
    h: 160,
    z: 4,
    style: { kind: 'solid', color: 'rgba(18,24,38,.86)', radius: 18, border: '1px solid #223042', shadow: 'var(--elev-1)' }
  },
  {
    id: 'friends',
    kind: 'Friends',
    x: 24,
    y: 780,
    w: 600,
    h: 140,
    z: 5,
    style: { kind: 'solid', color: 'rgba(18,24,38,.86)', radius: 18, border: '1px solid #223042', shadow: 'var(--elev-1)' }
  },
  // Right column
  {
    id: 'your-posts',
    kind: 'YourPosts',
    x: 648,
    y: HEADER_DEFAULT.y + HEADER_DEFAULT.h + 16,
    w: 600,
    h: 180,
    z: 6,
    style: { kind: 'solid', color: 'rgba(18,24,38,.86)', radius: 18, border: '1px solid #223042', shadow: 'var(--elev-1)' }
  },
  {
    id: 'activity',
    kind: 'Activity',
    x: 648,
    y: 420,
    w: 600,
    h: 160,
    z: 7,
    style: { kind: 'solid', color: 'rgba(18,24,38,.86)', radius: 18, border: '1px solid #223042', shadow: 'var(--elev-1)' }
  },
  {
    id: 'collection',
    kind: 'Collection',
    x: 648,
    y: 600,
    w: 600,
    h: 160,
    z: 8,
    style: { kind: 'solid', color: 'rgba(18,24,38,.86)', radius: 18, border: '1px solid #223042', shadow: 'var(--elev-1)' }
  },
  {
    id: 'media',
    kind: 'OtherMedia',
    x: 648,
    y: 780,
    w: 600,
    h: 140,
    z: 9,
    style: { kind: 'solid', color: 'rgba(18,24,38,.86)', radius: 18, border: '1px solid #223042', shadow: 'var(--elev-1)' }
  },
  // Full width bottom
  {
    id: 'chalkboard',
    kind: 'Chalkboard',
    x: 24,
    y: 940,
    w: 1224,
    h: 150,
    z: 10,
    style: { kind: 'solid', color: 'rgba(18,24,38,.86)', radius: 18, border: '1px solid #223042', shadow: 'var(--elev-1)' }
  }
];

// Helper to clone blocks with new IDs when needed
export function clonePresetLayout(): BlockModel[] {
  return CLEAN_TWO_COL_PRESET.map(block => ({
    ...block,
    id: block.id === 'profile-header' ? block.id : crypto.randomUUID()
  }));
}