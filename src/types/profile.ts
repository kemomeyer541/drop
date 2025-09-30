export type BlockKind =
  | 'ProfileHeader' | 'About' | 'Collection' | 'NewDrops' | 'UserComments' | 'YourPosts'
  | 'Activity' | 'Photos' | 'Videos' | 'Links' | 'OtherMedia'
  | 'Shop' | 'Friends' | 'Chalkboard' | 'AudioPlayer';

export type BlockStyle =
  | { kind:'solid'; color:string; radius?:number; border?:string; shadow?:string }
  | { kind:'linear'; from:string; to:string; angle?:number; radius?:number; border?:string; shadow?:string }
  | { kind:'radial'; inner:string; outer:string; radius?:number; border?:string; shadow?:string };

export type Gradient =
  | { type: 'solid'; color: string }
  | { type: 'linear'; from: string; to: string; angle?: number }
  | { type: 'radial'; inner: string; outer: string };

export type BlockModel = {
  id: string;
  kind: BlockKind;
  x: number; y: number; w: number; h: number; // grid pixels
  z?: number;
  locked?: boolean;          // Chalkboard stays true
  hidden?: boolean;          // disable/enable
  style?: {
    radius?: number;         // px
    bg?: Gradient;
    border?: string;         // e.g. '1px solid #243041'
    shadow?: string;         // e.g. '0 8px 28px rgba(0,0,0,.25)'
  };
  audioUrl?: string; // for audio player blocks
};

export type Rarity = 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary';

export type ParticleEffect = {
  id: string;
  name: string;
  rarity: Rarity;
  previewEmoji: string;
  description: string;
  locked?: boolean;
};

// Legacy compatibility types
export type BlockType = 
  | "about" | "collection" | "chalkboard" | "newDrops" | "userComments"
  | "yourPosts" | "yourActivity" | "photos" | "videos" | "links"
  | "otherMedia" | "shop" | "friends" | "shoutouts" | "audioPlayer";

// New Block type definition for comprehensive canvas system
export type Block = {
  id: string;
  type: 'header'|'chalkboard'|'new-drops'|'your-posts'|'links'|'collection'|'comments'|'friends'|'shop'|'donators'|'monthly-supporters'|'photos'|'videos'|'music-player'|'pinned-note'|'stats'|'events'|'poll'|'mini-games'|'custom';
  x: number; 
  y: number; 
  w: number; 
  h: number;
  locked?: boolean;          // cannot delete
  movable?: boolean;         // can drag (default true)
  resizable?: boolean;       // can resize (default true)
  visible?: boolean;         // visibility toggle (default true)
  style?: {
    kind?: 'solid'|'linear';
    color?: string;
    from?: string; 
    to?: string; 
    angle?: number;
    radius?: number; 
    shadow?: string; 
    border?: string;
  };
};

export type BackgroundType = 'solid' | 'gradient';

export type ProfileBlock = {
  id: string;
  type: BlockType;
  x: number;   // px
  y: number;   // px
  w: number;   // px
  h: number;   // px
  bg?: string; // css color
  color?: string; // text color
  locked?: boolean; // true for Chalkboard so it can't be removed
  enabled?: boolean; // can be toggled on/off
  pinned?: boolean; // pinned blocks stay in place
  zIndex?: number; // layer order
  opacity?: number; // 0-1
  backgroundType?: BackgroundType;
  gradientAngle?: number; // degrees for gradient
  gradientColors?: [string, string]; // start and end colors for gradient
  audioUrl?: string; // for audio player blocks
};