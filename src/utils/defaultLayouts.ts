// layout/defaults.ts
type Rect = { id: string; x: number; y: number; w: number; h: number };
type Block =
  | "header" | "newDrops" | "friends" | "yourPosts" | "links" | "comments" | "collection"
  | "shop" | "chalkboard" | "donators" | "monthly" | "pinned" | "photos" | "poll" | "stream";

const COLS=12, OUTER=16, GUTTER=24, ROW=156;
const colW = (W:number)=>Math.floor((W-OUTER*2-GUTTER*(COLS-1))/COLS);
const X=(W:number,c:number)=>OUTER + c*(colW(W)+GUTTER);
const Wp=(W:number,s:number)=>colW(W)*s + GUTTER*(s-1);
const Y=(r:number)=>OUTER + r*(ROW+GUTTER);

// 1) Balanced (good for most)
export function layoutBalanced(W:number): Rect[] {
  return [
    {id:"header",x:X(W,0),y:Y(0),w:Wp(W,12),h:ROW},
    {id:"newDrops",x:X(W,0),y:Y(1),w:Wp(W,7),h:ROW},
    {id:"friends",x:X(W,7),y:Y(1),w:Wp(W,5),h:ROW},
    {id:"comments",x:X(W,0),y:Y(2),w:Wp(W,7),h:ROW},
    {id:"yourPosts",x:X(W,7),y:Y(2),w:Wp(W,5),h:ROW},
    {id:"collection",x:X(W,0),y:Y(3),w:Wp(W,12),h:ROW},
    {id:"chalkboard",x:X(W,0),y:Y(4),w:Wp(W,7),h:ROW},
    {id:"links",x:X(W,7),y:Y(4),w:Wp(W,5),h:ROW},
    {id:"shop",x:X(W,0),y:Y(5),w:Wp(W,7),h:ROW},
    {id:"donators",x:X(W,7),y:Y(5),w:Wp(W,5),h:ROW},
    {id:"monthly",x:X(W,7),y:Y(6),w:Wp(W,5),h:ROW},
  ];
}

// 2) Creator-first (feed dense, tools right)
export function layoutCreator(W:number): Rect[] {
  return [
    {id:"header",x:X(W,0),y:Y(0),w:Wp(W,12),h:ROW},
    {id:"newDrops",x:X(W,0),y:Y(1),w:Wp(W,8),h:ROW},
    {id:"yourPosts",x:X(W,0),y:Y(2),w:Wp(W,8),h:ROW},
    {id:"comments",x:X(W,0),y:Y(3),w:Wp(W,8),h:ROW},
    {id:"collection",x:X(W,0),y:Y(4),w:Wp(W,8),h:ROW},
    {id:"links",x:X(W,8),y:Y(1),w:Wp(W,4),h:ROW},
    {id:"friends",x:X(W,8),y:Y(2),w:Wp(W,4),h:ROW},
    {id:"chalkboard",x:X(W,8),y:Y(3),w:Wp(W,4),h:ROW},
    {id:"shop",x:X(W,8),y:Y(4),w:Wp(W,4),h:ROW},
    {id:"donators",x:X(W,8),y:Y(5),w:Wp(W,4),h:ROW},
  ];
}

// 3) Storefront (commerce up front)
export function layoutStorefront(W:number): Rect[] {
  return [
    {id:"header",x:X(W,0),y:Y(0),w:Wp(W,12),h:ROW},
    {id:"shop",x:X(W,0),y:Y(1),w:Wp(W,8),h:ROW},
    {id:"donators",x:X(W,8),y:Y(1),w:Wp(W,4),h:ROW},
    {id:"monthly",x:X(W,8),y:Y(2),w:Wp(W,4),h:ROW},
    {id:"newDrops",x:X(W,0),y:Y(2),w:Wp(W,8),h:ROW},
    {id:"links",x:X(W,0),y:Y(3),w:Wp(W,6),h:ROW},
    {id:"friends",x:X(W,6),y:Y(3),w:Wp(W,6),h:ROW},
    {id:"collection",x:X(W,0),y:Y(4),w:Wp(W,12),h:ROW},
  ];
}

// Convert layout rects to Block format for the profile system
export function convertLayoutToBlocks(rects: Rect[]): any[] {
  return rects.map(rect => ({
    id: rect.id,
    type: rect.id === 'header' ? 'about' : 
          rect.id === 'newDrops' ? 'new-drops' :
          rect.id === 'yourPosts' ? 'your-posts' :
          rect.id === 'monthly' ? 'monthly-supporters' :
          rect.id,
    x: rect.x,
    y: rect.y,
    w: rect.w,
    h: rect.h,
    style: { bg: 'dark', opacity: 1 }
  }));
}