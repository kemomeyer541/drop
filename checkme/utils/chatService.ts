// ChatService - Single source of truth for chat state
import { CHAT_MESSAGES, STATIC_USERNAMES, MUSIC_GENRES, MUSIC_ADJECTIVES, VIBE_ADJECTIVES, SOFTWARE_NAMES, DECADES } from './contentData';
export interface ChatChannel {
  id: string;
  name: string;
  unread: number;
}

export interface ChatState {
  isOpen: boolean;
  channelId: string;
  isDocked: boolean;
  draftByChannel: Record<string, string>;
  unreadByChannel: Record<string, number>;
  lastActiveChannel: string;
}

export interface ChatMessage {
  id: string;
  username: string;
  handle: string;
  avatar: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'image' | 'sticker' | 'card' | 'system';
  attachments?: {
    type: 'sticker' | 'card' | 'image';
    title?: string;
    creator?: string;
    serial?: string;
    rarity?: 'common' | 'rare' | 'epic' | 'legendary';
    url?: string;
  }[];
}

class ChatService {
  private static instance: ChatService;
  private listeners: Set<(state: ChatState) => void> = new Set();
  private state: ChatState;
  private channels: ChatChannel[] = [
    { id: 'general', name: '#general', unread: 0 },
    { id: 'show-and-tell', name: '#show-and-tell', unread: 3 },
    { id: 'memes', name: '#memes', unread: 12 },
    { id: 'trades', name: '#trades', unread: 5 },
    { id: 'stickers', name: '#stickers', unread: 0 },
  ];
  private messagesByChannel: Record<string, ChatMessage[]> = {};
  private messageInterval: NodeJS.Timeout | null = null;

  private constructor() {
    // Load state from sessionStorage
    const savedState = this.loadFromStorage();
    this.state = {
      isOpen: false,
      channelId: savedState?.lastActiveChannel || 'general',
      isDocked: savedState?.isDocked || false,
      draftByChannel: savedState?.draftByChannel || {},
      unreadByChannel: savedState?.unreadByChannel || {},
      lastActiveChannel: savedState?.lastActiveChannel || 'general',
      ...savedState
    };

    // Initialize messages for each channel
    this.initializeMessages();

    // Start automatic message generation
    this.startMessageGeneration();

    // Handle URL params on load
    this.handleURLParams();

    // Listen for popstate events (back/forward)
    window.addEventListener('popstate', () => {
      this.handleURLParams();
    });
  }

  public static getInstance(): ChatService {
    if (!ChatService.instance) {
      ChatService.instance = new ChatService();
    }
    return ChatService.instance;
  }

  private initializeMessages() {
    // Initialize with some sample messages for each channel
    this.channels.forEach(channel => {
      this.messagesByChannel[channel.id] = this.generateSampleMessages(channel.id);
    });
  }

  private generateSampleMessages(channelId: string): ChatMessage[] {
    // Generate different messages based on channel
    const baseMessages = [
      { content: 'hey everyone! 👋', username: 'beatmaker2023', type: 'text' as const },
      { content: 'working on some fire beats tonight 🔥', username: 'LoFiKing', type: 'text' as const },
      { content: 'anyone up for a collab?', username: 'synthwave_sarah', type: 'text' as const }
    ];

    return baseMessages.map((msg, index) => ({
      id: `${channelId}-${index}`,
      username: msg.username,
      handle: `@${msg.username.toLowerCase()}`,
      avatar: msg.username.slice(0, 2).toUpperCase(),
      content: msg.content,
      timestamp: new Date(Date.now() - (index * 300000)), // 5 minutes apart
      type: msg.type
    }));
  }

  private startMessageGeneration() {
    // Clear any existing interval
    if (this.messageInterval) {
      clearInterval(this.messageInterval);
    }

    // Generate new messages every 3-6 seconds (reduced from 8-15s)
    this.messageInterval = setInterval(() => {
      this.generateRandomMessage();
    }, Math.random() * 3000 + 3000); // 3-6 second intervals
  }

  private generateRandomMessage() {
    // Pick random channel (weighted toward general)
    const channelWeights = [
      { id: 'general', weight: 40 },
      { id: 'show-and-tell', weight: 20 },
      { id: 'memes', weight: 15 },
      { id: 'trades', weight: 15 },
      { id: 'stickers', weight: 10 }
    ];
    
    const totalWeight = channelWeights.reduce((sum, c) => sum + c.weight, 0);
    let random = Math.random() * totalWeight;
    let selectedChannel = 'general';
    
    for (const channel of channelWeights) {
      random -= channel.weight;
      if (random <= 0) {
        selectedChannel = channel.id;
        break;
      }
    }

    // Pick random username and message template
    const username = STATIC_USERNAMES[Math.floor(Math.random() * STATIC_USERNAMES.length)];
    let messageTemplate = CHAT_MESSAGES[Math.floor(Math.random() * CHAT_MESSAGES.length)];
    
    // Replace template variables
    messageTemplate = messageTemplate
      .replace(/{username}/g, STATIC_USERNAMES[Math.floor(Math.random() * STATIC_USERNAMES.length)])
      .replace(/{genre}/g, MUSIC_GENRES[Math.floor(Math.random() * MUSIC_GENRES.length)])
      .replace(/{adjective}/g, [...MUSIC_ADJECTIVES, ...VIBE_ADJECTIVES][Math.floor(Math.random() * (MUSIC_ADJECTIVES.length + VIBE_ADJECTIVES.length))])
      .replace(/{software}/g, SOFTWARE_NAMES[Math.floor(Math.random() * SOFTWARE_NAMES.length)])
      .replace(/{decade}/g, DECADES[Math.floor(Math.random() * DECADES.length)])
      .replace(/{collectible}/g, ['Big Chungus Energy', 'Dumpster Baby', 'Clam Slam', 'GothMommy', 'Horny Jail'][Math.floor(Math.random() * 5)]);

    // Add the message
    this.addMessage(selectedChannel, {
      username,
      handle: `@${username.toLowerCase()}`,
      avatar: username.slice(0, 2).toUpperCase(),
      content: messageTemplate,
      type: 'text'
    });
  }

  private loadFromStorage(): Partial<ChatState> | null {
    try {
      const stored = sessionStorage.getItem('dropsource:chat');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }

  private saveToStorage() {
    try {
      sessionStorage.setItem('dropsource:chat', JSON.stringify({
        channelId: this.state.channelId,
        isDocked: this.state.isDocked,
        draftByChannel: this.state.draftByChannel,
        unreadByChannel: this.state.unreadByChannel,
        lastActiveChannel: this.state.lastActiveChannel
      }));
    } catch {
      // Storage failed, continue silently
    }
  }

  private handleURLParams() {
    const url = new URL(window.location.href);
    const chatParam = url.searchParams.get('chat') || url.hash.replace('#chat/', '');
    
    if (chatParam && this.channels.find(c => c.id === chatParam)) {
      this.open(chatParam);
    }
  }

  private updateURL(channelId?: string) {
    const url = new URL(window.location.href);
    if (this.state.isOpen && channelId) {
      url.searchParams.set('chat', channelId);
    } else {
      url.searchParams.delete('chat');
    }
    
    // Update URL without triggering navigation
    window.history.replaceState({}, '', url.toString());
  }

  private notify() {
    this.listeners.forEach(listener => listener(this.state));
    this.saveToStorage();
  }

  // Public API
  public subscribe(listener: (state: ChatState) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  public getState(): ChatState {
    return { ...this.state };
  }

  public getChannels(): ChatChannel[] {
    return [...this.channels];
  }

  public getMessages(channelId: string): ChatMessage[] {
    return this.messagesByChannel[channelId] || [];
  }

  public open(channelId?: string, options?: { docked?: boolean }) {
    const targetChannel = channelId || this.state.lastActiveChannel || 'general';
    
    this.state = {
      ...this.state,
      isOpen: true,
      channelId: targetChannel,
      lastActiveChannel: targetChannel,
      isDocked: options?.docked ?? this.state.isDocked
    };

    // Clear unread count for opened channel
    this.state.unreadByChannel[targetChannel] = 0;
    
    this.updateURL(targetChannel);
    this.notify();
  }

  public close() {
    this.state = {
      ...this.state,
      isOpen: false
    };
    
    this.updateURL();
    this.notify();
  }

  public toggle(channelId?: string) {
    if (this.state.isOpen) {
      this.close();
    } else {
      this.open(channelId);
    }
  }

  public switchChannel(channelId: string) {
    if (this.channels.find(c => c.id === channelId)) {
      this.state = {
        ...this.state,
        channelId,
        lastActiveChannel: channelId
      };
      
      // Clear unread count
      this.state.unreadByChannel[channelId] = 0;
      
      this.updateURL(channelId);
      this.notify();
    }
  }

  public setDocked(docked: boolean) {
    this.state = {
      ...this.state,
      isDocked: docked
    };
    this.notify();
  }

  public setDraft(channelId: string, draft: string) {
    this.state.draftByChannel[channelId] = draft;
    this.notify();
  }

  public getDraft(channelId: string): string {
    return this.state.draftByChannel[channelId] || '';
  }

  public addMessage(channelId: string, message: Omit<ChatMessage, 'id' | 'timestamp'>) {
    const newMessage: ChatMessage = {
      ...message,
      id: `${channelId}-${Date.now()}`,
      timestamp: new Date()
    };

    if (!this.messagesByChannel[channelId]) {
      this.messagesByChannel[channelId] = [];
    }

    this.messagesByChannel[channelId].push(newMessage);
    
    // Keep only last 50 messages per channel
    if (this.messagesByChannel[channelId].length > 50) {
      this.messagesByChannel[channelId] = this.messagesByChannel[channelId].slice(-50);
    }

    // Increment unread if not current channel or chat is closed
    if (!this.state.isOpen || this.state.channelId !== channelId) {
      this.state.unreadByChannel[channelId] = (this.state.unreadByChannel[channelId] || 0) + 1;
    }

    this.notify();
  }

  public focus() {
    // Bring chat to front if already open
    if (this.state.isOpen) {
      this.notify();
    }
  }

  public destroy() {
    // Clean up intervals when service is destroyed
    if (this.messageInterval) {
      clearInterval(this.messageInterval);
      this.messageInterval = null;
    }
  }
}

export const chatService = ChatService.getInstance();