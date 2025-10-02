// New memey collectibles pool for DropSource
export type CollectibleType = 'sticker' | 'card' | 'megaphone';
export type RarityType = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'special';

// Image registry - maps item.id to public path
export const imageRegistry: Record<string, string> = {
  'luca': '/stickers/rare/luca/luca.png',
  'pixel-art': '/stickers/legendary/pixel-art/pixel-art.png',
  // add more items here later
};

// Debug: Log all available images
console.log('Available images in registry:', Object.keys(imageRegistry));
console.log('Registry contents:', imageRegistry);

export const buildImagePath = (item: { rarity: string; id: string }): string => {
  // First check if we have a specific image in the registry
  if (imageRegistry[item.id]) {
    console.log('buildImagePath result (registry):', item.id, imageRegistry[item.id]);
    return imageRegistry[item.id];
  }
  
  // Fallback: construct path based on rarity and id
  if (!item || !item.id) {
    console.log('buildImagePath result (invalid item):', item, '/stickers/placeholder.png');
    return '/stickers/placeholder.png';
  }

  const rarity = item.rarity || 'common';
  const constructedPath = `/stickers/${rarity}/${item.id}/${item.id}.png`;
  console.log('buildImagePath result (constructed):', item.id, constructedPath);
  return constructedPath;
};

export interface Collectible {
  id: string;
  name: string;
  serial: string;
  totalSupply: number;
  rarity: RarityType;
  type: CollectibleType;
  priceStars?: number; // in Stars, for shop purchases
  priceDollars?: number; // in dollars, for physical purchases
  imageUrl?: string; // placeholder for collectible images
  description?: string; // description for special items like megaphones
}

export const COLLECTIBLES_POOL: Collectible[] = [
  // Common (Stickers only) - Grey
  {
    id: 'ceiling-fan',
    name: 'Ceiling Fan Enthusiast',
    serial: '#482/1000',
    totalSupply: 1000,
    rarity: 'common',
    type: 'sticker',
    priceStars: 50,
    priceDollars: 3
  },
  {
    id: 'spaghetti-code',
    name: 'Spaghetti Code Sticker',
    serial: '#317/1000',
    totalSupply: 1000,
    rarity: 'common',
    type: 'sticker',
    priceStars: 50,
    priceDollars: 3
  },
  {
    id: 'vape-skeleton',
    name: 'Vape Cloud Skeleton',
    serial: '#999/1000',
    totalSupply: 1000,
    rarity: 'common',
    type: 'sticker',
    priceStars: 50,
    priceDollars: 3
  },
  {
    id: 'leftover-pizza',
    name: 'Leftover Pizza Slice',
    serial: '#128/500',
    totalSupply: 500,
    rarity: 'common',
    type: 'sticker',
    priceStars: 50,
    priceDollars: 3
  },
  {
    id: 'emo-goose',
    name: 'Emo Goose',
    serial: '#42/750',
    totalSupply: 750,
    rarity: 'common',
    type: 'sticker',
    priceStars: 50,
    priceDollars: 3
  },

  // Uncommon (Stickers only) - Green
  {
    id: 'wifi-password',
    name: 'WiFi Password Please',
    serial: '#256/500',
    totalSupply: 500,
    rarity: 'uncommon',
    type: 'sticker',
    priceStars: 100,
    priceDollars: 5
  },
  {
    id: 'monday-mood',
    name: 'Monday Morning Mood',
    serial: '#189/500',
    totalSupply: 500,
    rarity: 'uncommon',
    type: 'sticker',
    priceStars: 100,
    priceDollars: 5
  },
  {
    id: 'coffee-or-death',
    name: 'Coffee or Death',
    serial: '#421/500',
    totalSupply: 500,
    rarity: 'uncommon',
    type: 'sticker',
    priceStars: 100,
    priceDollars: 5
  },
  {
    id: 'left-on-read',
    name: 'Left on Read',
    serial: '#333/500',
    totalSupply: 500,
    rarity: 'uncommon',
    type: 'sticker',
    priceStars: 100,
    priceDollars: 5
  },

  // Rare (Stickers only) - Blue
  {
    id: 'bonk-horny-jail',
    name: 'Bonk! Horny Jail',
    serial: '#69/250',
    totalSupply: 250,
    rarity: 'rare',
    type: 'sticker',
    priceStars: 250,
    priceDollars: 8
  },
  {
    id: 'dumpster-fire-2025',
    name: 'Dumpster Fire 2025',
    serial: '#101/250',
    totalSupply: 250,
    rarity: 'rare',
    type: 'sticker',
    priceStars: 250,
    priceDollars: 8
  },
  {
    id: 'shrek-4k',
    name: 'Shrek in 4K',
    serial: '#177/250',
    totalSupply: 250,
    rarity: 'rare',
    type: 'sticker',
    priceStars: 250,
    priceDollars: 8
  },
  {
    id: 'reverse-uno',
    name: 'Reverse Uno Card Sticker',
    serial: '#88/200',
    totalSupply: 200,
    rarity: 'rare',
    type: 'sticker',
    priceStars: 250,
    priceDollars: 8
  },
  {
    id: 'gamer-chair-collapse',
    name: 'Gamer Chair Collapse',
    serial: '#211/300',
    totalSupply: 300,
    rarity: 'rare',
    type: 'sticker',
    priceStars: 250,
    priceDollars: 8
  },

  // Epic (Cards only) - Purple
  {
    id: 'mega-frog-pack',
    name: 'Mega Frog Pack',
    serial: '#88/150',
    totalSupply: 150,
    rarity: 'epic',
    type: 'card',
    priceStars: 500,
    priceDollars: 15
  },
  {
    id: 'hotdog-usb',
    name: 'Hotdog USB Drive',
    serial: '#23/100',
    totalSupply: 100,
    rarity: 'epic',
    type: 'card',
    priceStars: 500,
    priceDollars: 15
  },
  {
    id: 'cursed-flute',
    name: 'Cursed Flute Solo',
    serial: '#99/100',
    totalSupply: 100,
    rarity: 'epic',
    type: 'card',
    priceStars: 500,
    priceDollars: 15
  },
  {
    id: 'zoom-potato',
    name: 'Zoom Call Potato Filter',
    serial: '#15/100',
    totalSupply: 100,
    rarity: 'epic',
    type: 'card',
    priceStars: 500,
    priceDollars: 15
  },
  {
    id: 'final-boss-toaster',
    name: 'Final Boss Toaster',
    serial: '#45/75',
    totalSupply: 75,
    rarity: 'epic',
    type: 'card',
    priceStars: 500,
    priceDollars: 15
  },

  // Legendary (Cards only) - Gold
  {
    id: 'chair-sniffer',
    name: 'Chair Sniffer 1/1',
    serial: '#1/1',
    totalSupply: 1,
    rarity: 'legendary',
    type: 'card',
    priceStars: 2000,
    priceDollars: 50
  },
  {
    id: 'emotional-damage',
    name: 'Emotional Damage.wav',
    serial: '#3/10',
    totalSupply: 10,
    rarity: 'legendary',
    type: 'card',
    priceStars: 2000,
    priceDollars: 50
  },
  {
    id: 'skibidi-crown',
    name: 'Skibidi Toilet Crown',
    serial: '#5/25',
    totalSupply: 25,
    rarity: 'legendary',
    type: 'card',
    priceStars: 2000,
    priceDollars: 50
  },
  {
    id: '404-fun',
    name: '404 Fun Not Found',
    serial: '#7/20',
    totalSupply: 20,
    rarity: 'legendary',
    type: 'card',
    priceStars: 2000,
    priceDollars: 50
  },
  {
    id: 'ancient-vine',
    name: 'Ancient Vine Compilation',
    serial: '#9/10',
    totalSupply: 10,
    rarity: 'legendary',
    type: 'card',
    priceStars: 2000,
    priceDollars: 50
  },

  // Megaphone Items - Special
  {
    id: 'megaphone-classic',
    name: 'DropSource Megaphone Classic',
    serial: '#1/100',
    totalSupply: 100,
    rarity: 'special',
    type: 'megaphone',
    priceStars: 750,
    description: 'Amplify your voice across the platform with a scrolling ticker message!'
  },
  {
    id: 'megaphone-gold',
    name: 'Golden Megaphone Deluxe',
    serial: '#1/25',
    totalSupply: 25,
    rarity: 'special',
    type: 'megaphone',
    priceStars: 1500,
    description: 'Premium gold-plated amplification - your message shines in style!'
  }
];

// Helper functions - Updated to match new rarity spec
// Common=grey, Uncommon=green, Rare=blue, Epic=purple, Legendary=gold, Special=cyan
export const getRarityColor = (rarity: RarityType): string => {
  switch (rarity) {
    case 'common': return '#9ca3af'; // grey
    case 'uncommon': return '#22c55e'; // green
    case 'rare': return '#3b82f6'; // blue
    case 'epic': return '#a855f7'; // purple
    case 'legendary': return '#fbbf24'; // gold
    case 'special': return '#06b6d4'; // cyan for megaphones
    default: return '#9ca3af'; // grey fallback
  }
};

export const getRarityBgColor = (rarity: RarityType): string => {
  switch (rarity) {
    case 'common': return 'rgba(156, 163, 175, 0.1)';
    case 'uncommon': return 'rgba(34, 197, 94, 0.1)';
    case 'rare': return 'rgba(59, 130, 246, 0.1)';
    case 'epic': return 'rgba(168, 85, 247, 0.1)';
    case 'legendary': return 'rgba(251, 191, 36, 0.1)';
    case 'special': return 'rgba(6, 182, 212, 0.1)';
    default: return 'rgba(156, 163, 175, 0.1)';
  }
};

export const getCollectiblesByRarity = (rarity: RarityType): Collectible[] => {
  return COLLECTIBLES_POOL.filter(item => item.rarity === rarity);
};

export const getCollectiblesByType = (type: CollectibleType): Collectible[] => {
  return COLLECTIBLES_POOL.filter(item => item.type === type);
};

export const getPurchasableCollectibles = (): Collectible[] => {
  return COLLECTIBLES_POOL.filter(item => item.priceStars !== undefined);
};

// Auction: Only Rare/Epic/Legendary
export const getAuctionCollectibles = (): Collectible[] => {
  return COLLECTIBLES_POOL.filter(item => 
    item.rarity === 'rare' || item.rarity === 'epic' || item.rarity === 'legendary'
  );
};

// Scrapbook: Both Stickers (Common/Rare) and Cards (Epic/Legendary) - all with buy buttons
export const getScrapbookCollectibles = (): Collectible[] => {
  return COLLECTIBLES_POOL; // All items can be in user's collection
};

// Stickers only (Common + Rare)
export const getStickerCollectibles = (): Collectible[] => {
  return COLLECTIBLES_POOL.filter(item => item.type === 'sticker');
};

// Cards only (Epic + Legendary)
export const getCardCollectibles = (): Collectible[] => {
  return COLLECTIBLES_POOL.filter(item => item.type === 'card');
};

export const getRandomCollectible = (): Collectible => {
  return COLLECTIBLES_POOL[Math.floor(Math.random() * COLLECTIBLES_POOL.length)];
};

// Get random sticker (for feed when stickers are minted/dropped)
export const getRandomSticker = (): Collectible => {
  const stickers = getStickerCollectibles();
  return stickers[Math.floor(Math.random() * stickers.length)];
};

// Get random card (for feed when cards are shown)
export const getRandomCard = (): Collectible => {
  const cards = getCardCollectibles();
  return cards[Math.floor(Math.random() * cards.length)];
};

export const getRandomCollectiblesByRarity = (rarity: RarityType, count: number = 1): Collectible[] => {
  const rarityPool = getCollectiblesByRarity(rarity);
  const result: Collectible[] = [];
  
  for (let i = 0; i < count; i++) {
    if (rarityPool.length > 0) {
      result.push(rarityPool[Math.floor(Math.random() * rarityPool.length)]);
    }
  }
  
  return result;
};

// Megaphones - special items
export const getMegaphoneCollectibles = (): Collectible[] => {
  return COLLECTIBLES_POOL.filter(item => item.type === 'megaphone');
};

// Shop items - all purchasable items including stickers, cards, and megaphones
export const getShopItems = (): Collectible[] => {
  return COLLECTIBLES_POOL.filter(item => item.priceStars !== undefined);
};