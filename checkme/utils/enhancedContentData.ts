// Enhanced Content Generation System with Weighted Variety, Cooldowns, and Deduplication
import { 
  ACTION_TEMPLATES, 
  POST_CONTENT, 
  POST_REACTIONS, 
  STATIC_USERNAMES, 
  MUSIC_ADJECTIVES, 
  VIBE_ADJECTIVES, 
  MUSIC_GENRES,
  SOFTWARE_NAMES,
  DECADES,
  CHALLENGE_NAMES,
  BADGE_NAMES,
  COLLECTIBLE_TYPES,
  RARITY_TYPES,
  TIME_PERIODS
} from './contentData';
import { getRandomSticker, getRandomCard } from './collectibles';

// Action Type Weights - Lower = Less Common
const ACTION_TYPE_WEIGHTS = {
  like: 15,        // Most common - people like stuff constantly
  comment: 12,     // Very common - engagement
  follow: 8,       // Common - people discovering others
  stream: 6,       // Regular - people go live
  supporter: 5,    // Less common - requires payment
  tip: 4,          // Less common - requires stars
  collab: 4,       // Less common - requires coordination
  challenge: 3,    // Less common - structured events
  mint: 3,         // Less common - creative work
  collect: 3,      // Less common - marketplace activity
  chalkboard: 2,   // Rare - profile interaction
  auction: 2,      // Rare - high-value transactions
  stream_milestone: 1, // Very rare - milestone events
  join: 1          // Very rare - new users only
};

// Deduplication Memory System
interface EnhancedContentMemory {
  recentEvents: Array<{ template: string; timestamp: number; actionType: string }>;
  actionTypeCooldowns: Map<string, number>;
  userActionCooldowns: Map<string, Map<string, number>>;
  templateUsageCount: Map<string, number>;
  lastActionType: string | null;
}

const enhancedMemory: EnhancedContentMemory = {
  recentEvents: [],
  actionTypeCooldowns: new Map(),
  userActionCooldowns: new Map(),
  templateUsageCount: new Map(),
  lastActionType: null
};

// Weighted Random Selection
function weightedRandomPick<T>(items: T[], weights: number[]): T {
  if (items.length !== weights.length) {
    throw new Error('Items and weights arrays must have the same length');
  }

  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  let randomNum = Math.random() * totalWeight;

  for (let i = 0; i < items.length; i++) {
    randomNum -= weights[i];
    if (randomNum <= 0) {
      return items[i];
    }
  }

  return items[items.length - 1]; // Fallback
}

// Clean up old memory entries (keep last 20 events)
function cleanupMemory() {
  const now = Date.now();
  const maxAge = 20 * 60 * 1000; // 20 minutes
  const maxEvents = 20;

  // Keep only the most recent 20 events
  enhancedMemory.recentEvents = enhancedMemory.recentEvents
    .filter(event => (now - event.timestamp) < maxAge)
    .slice(-maxEvents);

  // Clean up old cooldowns (5 minutes)
  const cooldownAge = 5 * 60 * 1000;
  enhancedMemory.actionTypeCooldowns.forEach((timestamp, actionType) => {
    if ((now - timestamp) > cooldownAge) {
      enhancedMemory.actionTypeCooldowns.delete(actionType);
    }
  });

  // Clean up user action cooldowns (10 minutes)
  const userCooldownAge = 10 * 60 * 1000;
  enhancedMemory.userActionCooldowns.forEach((actionMap, user) => {
    actionMap.forEach((timestamp, actionType) => {
      if ((now - timestamp) > userCooldownAge) {
        actionMap.delete(actionType);
      }
    });
    if (actionMap.size === 0) {
      enhancedMemory.userActionCooldowns.delete(user);
    }
  });
}

// Check if action type can be used (not on cooldown, not same as last)
function canUseActionType(actionType: string): boolean {
  const now = Date.now();
  
  // Don't repeat the same action type back-to-back
  if (enhancedMemory.lastActionType === actionType) {
    return false;
  }

  // Check global action type cooldown (30 seconds minimum between same types)
  const lastUsed = enhancedMemory.actionTypeCooldowns.get(actionType);
  if (lastUsed && (now - lastUsed) < 30000) {
    return false;
  }

  // Special rules for join events - very rare, only once per 5 minutes
  if (actionType === 'join') {
    const joinCooldown = 5 * 60 * 1000; // 5 minutes
    if (lastUsed && (now - lastUsed) < joinCooldown) {
      return false;
    }
  }

  return true;
}

// Check if user can perform action (prevent spam from same user)
function canUserPerformAction(user: string, actionType: string): boolean {
  const now = Date.now();
  const userActions = enhancedMemory.userActionCooldowns.get(user);
  
  if (!userActions) {
    return true;
  }

  const lastAction = userActions.get(actionType);
  if (!lastAction) {
    return true;
  }

  // User-specific cooldowns (2 minutes for same action type)
  const userCooldown = 2 * 60 * 1000;
  return (now - lastAction) > userCooldown;
}

// Check if template was used too recently
function isTemplateOverused(template: string): boolean {
  const recentUse = enhancedMemory.recentEvents.find(event => 
    event.template === template && 
    (Date.now() - event.timestamp) < (10 * 60 * 1000) // 10 minutes
  );
  
  return !!recentUse;
}

// Get available action types with weights
function getAvailableActionTypes(): { types: string[], weights: number[] } {
  cleanupMemory();
  
  const availableTypes: string[] = [];
  const availableWeights: number[] = [];

  Object.entries(ACTION_TYPE_WEIGHTS).forEach(([actionType, weight]) => {
    if (canUseActionType(actionType)) {
      availableTypes.push(actionType);
      
      // Reduce weight for frequently used templates
      const usageCount = enhancedMemory.templateUsageCount.get(actionType) || 0;
      const adjustedWeight = Math.max(1, weight - Math.floor(usageCount / 3));
      availableWeights.push(adjustedWeight);
    }
  });

  // Fallback if no types available (shouldn't happen in practice)
  if (availableTypes.length === 0) {
    return { 
      types: ['like', 'comment'], 
      weights: [10, 8] 
    };
  }

  return { types: availableTypes, weights: availableWeights };
}

// Pick random item from array
function pickRandom<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

// Generate tip amount
function generateTipAmount(): string {
  const amounts = [1, 2, 3, 5, 10, 15, 20, 25, 50, 100, 250, 500];
  const weights = [20, 15, 12, 10, 8, 6, 5, 4, 3, 2, 1, 1];
  return weightedRandomPick(amounts, weights).toString();
}

// Record action usage
function recordActionUsage(actionType: string, template: string, user: string) {
  const now = Date.now();
  
  // Record in recent events
  enhancedMemory.recentEvents.push({
    template,
    timestamp: now,
    actionType
  });

  // Update action type cooldown
  enhancedMemory.actionTypeCooldowns.set(actionType, now);
  
  // Update user action cooldown
  if (!enhancedMemory.userActionCooldowns.has(user)) {
    enhancedMemory.userActionCooldowns.set(user, new Map());
  }
  enhancedMemory.userActionCooldowns.get(user)!.set(actionType, now);
  
  // Update template usage count
  const currentCount = enhancedMemory.templateUsageCount.get(template) || 0;
  enhancedMemory.templateUsageCount.set(template, currentCount + 1);
  
  // Update last action type
  enhancedMemory.lastActionType = actionType;
}

// Enhanced Action Generation with Variety and Cooldowns
export function generateEnhancedActionWithCooldowns(id: string): any {
  cleanupMemory();
  
  const { types: availableTypes, weights: availableWeights } = getAvailableActionTypes();
  const actionType = weightedRandomPick(availableTypes, availableWeights);
  
  const templates = ACTION_TEMPLATES[actionType as keyof typeof ACTION_TEMPLATES];
  if (!templates || templates.length === 0) {
    // Fallback
    return generateFallbackAction(id);
  }

  // Filter out recently used templates
  const availableTemplates = templates.filter(template => !isTemplateOverused(template));
  const selectedTemplate = availableTemplates.length > 0 
    ? pickRandom(availableTemplates) 
    : pickRandom(templates);

  const user = pickRandom(STATIC_USERNAMES);
  
  // Don't use same user if they just performed an action
  let finalUser = user;
  let attempts = 0;
  while (!canUserPerformAction(finalUser, actionType) && attempts < 10) {
    finalUser = pickRandom(STATIC_USERNAMES);
    attempts++;
  }

  let targetUser = null;
  let stickerData = null;
  let challengeName = null;
  let badgeName = null;

  // Generate additional data based on action type
  if (['supporter', 'tip', 'like', 'comment', 'follow', 'collab', 'collect', 'chalkboard'].includes(actionType)) {
    const targetUsername = pickRandom(STATIC_USERNAMES.filter(name => name !== finalUser));
    targetUser = {
      name: targetUsername,
      avatar: targetUsername.slice(0, 2).toUpperCase(),
      color: `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`
    };
  }

  if (actionType === 'mint' || actionType === 'collect' || actionType === 'auction') {
    const collectible = getRandomSticker();
    stickerData = {
      name: collectible.name,
      serial: collectible.serial,
      thumbnail: `https://picsum.photos/80/80?random=${collectible.id}`
    };
  }

  if (actionType === 'challenge') {
    challengeName = pickRandom(CHALLENGE_NAMES);
    badgeName = pickRandom(BADGE_NAMES);
  }

  // Template variable replacement
  let action = selectedTemplate
    .replace('{user}', finalUser)
    .replace('{target}', targetUser?.name || pickRandom(STATIC_USERNAMES))
    .replace('{amount}', generateTipAmount())
    .replace('{challenge}', challengeName || pickRandom(CHALLENGE_NAMES))
    .replace('{badge}', badgeName || pickRandom(BADGE_NAMES))
    .replace('{collectible}', stickerData?.name || 'Mystery Item')
    .replace('{type}', pickRandom(COLLECTIBLE_TYPES))
    .replace('{rarity}', pickRandom(RARITY_TYPES))
    .replace('{genre}', pickRandom(MUSIC_GENRES))
    .replace('{adjective}', pickRandom([...MUSIC_ADJECTIVES, ...VIBE_ADJECTIVES]));

  // Record the usage
  recordActionUsage(actionType, selectedTemplate, finalUser);

  // Generate colors and avatar
  const userColor = `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`;
  const avatar = finalUser.slice(0, 2).toUpperCase();
  
  return {
    id,
    user: finalUser,
    action,
    time: pickRandom(['just now', '1m', '2m', '3m']),
    avatar,
    color: userColor,
    actionType,
    targetUser,
    stickerData,
    challengeName,
    badgeName
  };
}

// Fallback action generation
function generateFallbackAction(id: string): any {
  const user = pickRandom(STATIC_USERNAMES);
  const userColor = `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`;
  const avatar = user.slice(0, 2).toUpperCase();
  
  // More interesting fallback actions instead of just "vibing"
  const fallbackActions = [
    `${user} just joined the community 🎉`,
    `${user} is exploring the marketplace`,
    `${user} updated their profile`,
    `${user} shared a new creation`,
    `${user} is looking for collaborators`,
    `${user} discovered a rare collectible`,
    `${user} completed their first challenge`,
    `${user} earned a new badge`,
    `${user} is browsing the sticker gallery`,
    `${user} joined a live stream`
  ];
  
  return {
    id,
    user,
    action: pickRandom(fallbackActions),
    time: 'just now',
    avatar,
    color: userColor,
    actionType: 'join'
  };
}

// Enhanced Post Generation with Variety
export function generateEnhancedPostWithCooldowns(id: string): any {
  const user = pickRandom(STATIC_USERNAMES);
  const handle = `@${user.toLowerCase()}`;
  const userColor = `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`;
  const avatar = user.slice(0, 2).toUpperCase();

  // Pick content template that hasn't been used recently
  const availableContent = POST_CONTENT.filter(template => !isTemplateOverused(template));
  const selectedContent = availableContent.length > 0 
    ? pickRandom(availableContent) 
    : pickRandom(POST_CONTENT);

  // Replace template variables
  const randomSticker = getRandomSticker();
  let content = selectedContent
    .replace('{collectible}', randomSticker.name)
    .replace('{genre}', pickRandom(MUSIC_GENRES))
    .replace('{other_genre}', pickRandom(MUSIC_GENRES))
    .replace('{adjective}', pickRandom([...MUSIC_ADJECTIVES, ...VIBE_ADJECTIVES]))
    .replace('{software}', pickRandom(SOFTWARE_NAMES))
    .replace('{decade}', pickRandom(DECADES))
    .replace('{username}', pickRandom(STATIC_USERNAMES.filter(name => name !== user)));

  // Generate reactions (2-4 reactions per post)
  const reactionCount = Math.floor(Math.random() * 3) + 2;
  const shuffledReactions = [...POST_REACTIONS].sort(() => Math.random() - 0.5);
  const reactions = shuffledReactions.slice(0, reactionCount).map(reaction => ({
    emoji: reaction.emoji,
    count: Math.floor(Math.random() * 50) + 1
  }));

  // Randomly add sticker data
  const stickerCollectible = Math.random() < 0.3 ? getRandomSticker() : null;
  const cardCollectible = Math.random() < 0.2 ? getRandomCard() : null;
  
  const stickerData = stickerCollectible ? {
    name: stickerCollectible.name,
    serial: stickerCollectible.serial,
    thumbnail: `https://picsum.photos/80/80?random=${stickerCollectible.id}`
  } : null;
  
  const cardData = cardCollectible ? {
    name: cardCollectible.name,
    serial: cardCollectible.serial,
    thumbnail: `https://picsum.photos/80/80?random=${cardCollectible.id}`
  } : null;

  // Random category
  const categories = ['Questions', 'Sticker', 'Collab Req', 'Trade', 'Drop', 'Sale', 'Help', 'Showcase'];
  const category = Math.random() < 0.7 ? pickRandom(categories) : undefined;

  // Record template usage
  const currentCount = enhancedMemory.templateUsageCount.get(selectedContent) || 0;
  enhancedMemory.templateUsageCount.set(selectedContent, currentCount + 1);

  return {
    id,
    user,
    handle,
    content,
    avatar,
    color: userColor,
    category,
    reactions,
    stickerData,
    cardData
  };
}

// Reset the content system (useful for testing or resetting)
export function resetEnhancedContentSystem() {
  enhancedMemory.recentEvents = [];
  enhancedMemory.actionTypeCooldowns.clear();
  enhancedMemory.userActionCooldowns.clear();
  enhancedMemory.templateUsageCount.clear();
  enhancedMemory.lastActionType = null;
}

// Get system statistics (for debugging)
export function getContentSystemStats() {
  return {
    recentEventsCount: enhancedMemory.recentEvents.length,
    activeCooldowns: enhancedMemory.actionTypeCooldowns.size,
    templateUsageCounts: Object.fromEntries(enhancedMemory.templateUsageCount),
    lastActionType: enhancedMemory.lastActionType,
    userCooldowns: enhancedMemory.userActionCooldowns.size
  };
}

// Legacy compatibility functions
export function generateEnhancedAction(id: string): any {
  return generateEnhancedActionWithCooldowns(id);
}

export function generateEnhancedPost(id: string): any {
  return generateEnhancedPostWithCooldowns(id);
}

// Re-export everything else from original contentData for compatibility
export * from './contentData';