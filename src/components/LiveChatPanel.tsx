import React, { useState, useEffect, useRef } from 'react';
import { X, Minimize2, Search, Plus, MessageCircle, Smile, Paperclip, Send, Hash } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

interface Message {
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
    rarity?: 'common' | 'rare' | 'premium' | 'elite' | 'legendary';
    url?: string;
  }[];
  channel?: string;
  mentions?: string[];
}

interface LiveChatPanelProps {
  onClose: () => void;
  onMinimize: () => void;
  initialPosition: { x: number; y: number };
  width: number;
  height: number;
  zIndex: number;
  onPositionChange: (position: { x: number; y: number }) => void;
  onSizeChange: (size: { width: number; height: number }) => void;
  onFocus: () => void;
}

const CHANNELS = [
  { id: 'general', name: '#general', active: true, description: 'General discussion' },
  { id: 'show-and-tell', name: '#show-and-tell', active: false, description: 'Share your creations' },
  { id: 'memes', name: '#memes', active: false, description: 'Memes and fun content' },
  { id: 'trades', name: '#trades', active: false, description: 'Trading collectibles' },
  { id: 'stickers', name: '#stickers', active: false, description: 'Sticker discussion' },
  { id: 'auctions', name: '#auctions', active: false, description: 'Live auctions' },
  { id: 'help', name: '#help', active: false, description: 'Get help and support' },
  { id: 'offtopic', name: '#offtopic', active: false, description: 'Off-topic chat' },
];

// Mock user list for @mentions
const ACTIVE_USERS = [
  'CraftyCrow', 'CodeWizard', 'PixelSmith', 'MidnightCoder', 'ZineZebra', 
  'AuctionBot', 'MemeQueen', 'DevLife', 'PixelPal', 'CoffeeCreator',
  'SnackAttack', 'ReactiveRaven', 'FireStarter', 'LinkSeeker', 'SerialHunter',
  'BeatHarderThnMyMeat', 'tax_evasion_420', 'GothGF', 'SynthMaster'
];

const SAMPLE_MESSAGES: Message[] = [
  {
    id: '1',
    username: 'CraftyCrow',
    handle: '@CraftyCrow',
    avatar: '🎨',
    content: 'just dropped \'Retro Sunflower\' [Sticker] — Serial 88/250',
    timestamp: new Date(Date.now() - 5000),
    type: 'sticker',
    channel: 'general',
    attachments: [{
      type: 'sticker',
      title: 'Retro Sunflower',
      creator: 'CraftyCrow',
      serial: '88/250',
      rarity: 'rare'
    }]
  },
  {
    id: '2',
    username: 'CodeWizard',
    handle: '@CodeWizard',
    avatar: '🧙‍♂️',
    content: 'brb exporting a \'Mega Frog Pack\'',
    timestamp: new Date(Date.now() - 15000),
    type: 'text',
    channel: 'general'
  },
  {
    id: '3',
    username: 'PixelSmith',
    handle: '@PixelSmith',
    avatar: '⚒️',
    content: 'anyone trading Cheese God 3000? #ISO @CraftyCrow might have one',
    timestamp: new Date(Date.now() - 25000),
    type: 'text',
    channel: 'trades',
    mentions: ['CraftyCrow']
  },
  {
    id: '4',
    username: 'MidnightCoder',
    handle: '@MidnightCoder',
    avatar: '🌙',
    content: 'mood: debugging at 2am 💀',
    timestamp: new Date(Date.now() - 35000),
    type: 'text',
    channel: 'general'
  },
  {
    id: '5',
    username: 'ZineZebra',
    handle: '@ZineZebra',
    avatar: '🦓',
    content: 'thanks @PixelSmith for the collab! preview👇',
    timestamp: new Date(Date.now() - 45000),
    type: 'image',
    channel: 'show-and-tell',
    mentions: ['PixelSmith'],
    attachments: [{
      type: 'image',
      title: 'Collab Preview',
      url: 'https://picsum.photos/200/120?random=1'
    }]
  },
  {
    id: '6',
    username: 'AuctionBot',
    handle: '@AuctionBot',
    avatar: '🤖',
    content: 'auction in 10: Bonk Horny Jail (Card) — current ⭐ 45',
    timestamp: new Date(Date.now() - 55000),
    type: 'card',
    channel: 'auctions',
    attachments: [{
      type: 'card',
      title: 'Bonk Horny Jail',
      serial: '12/100',
      rarity: 'elite'
    }]
  },
  {
    id: '7',
    username: 'MemeQueen',
    handle: '@MemeQueen',
    avatar: '👑',
    content: 'ship it or skip it',
    timestamp: new Date(Date.now() - 65000),
    type: 'text',
    channel: 'memes'
  },
  {
    id: '8',
    username: 'DevLife',
    handle: '@DevLife',
    avatar: '💻',
    content: 'ctrl+s your feelings',
    timestamp: new Date(Date.now() - 75000),
    type: 'text',
    channel: 'general'
  },
  {
    id: '9',
    username: 'PixelPal',
    handle: '@PixelPal',
    avatar: '🎮',
    content: 'pixels > sleep',
    timestamp: new Date(Date.now() - 85000),
    type: 'text',
    channel: 'general'
  },
  {
    id: '10',
    username: 'CoffeeCreator',
    handle: '@CoffeeCreator',
    avatar: '☕',
    content: 'gm gm',
    timestamp: new Date(Date.now() - 95000),
    type: 'text',
    channel: 'general'
  }
];

const MORE_MESSAGES: Message[] = [
  {
    id: '11',
    username: 'SnackAttack',
    handle: '@SnackAttack',
    avatar: '🍿',
    content: 'back from snack run',
    timestamp: new Date(Date.now() - 105000),
    type: 'text',
    channel: 'general'
  },
  {
    id: '12',
    username: 'ReactiveRaven',
    handle: '@ReactiveRaven',
    avatar: '🐦‍⬛',
    content: 'W',
    timestamp: new Date(Date.now() - 115000),
    type: 'text',
    channel: 'general'
  },
  {
    id: '13',
    username: 'FireStarter',
    handle: '@FireStarter',
    avatar: '🔥',
    content: 'fire',
    timestamp: new Date(Date.now() - 125000),
    type: 'text',
    channel: 'general'
  },
  {
    id: '14',
    username: 'LinkSeeker',
    handle: '@LinkSeeker',
    avatar: '🔗',
    content: 'send link?',
    timestamp: new Date(Date.now() - 135000),
    type: 'text',
    channel: 'general'
  },
  {
    id: '15',
    username: 'SerialHunter',
    handle: '@SerialHunter',
    avatar: '🔍',
    content: 'serial pls',
    timestamp: new Date(Date.now() - 145000),
    type: 'text',
    channel: 'general'
  }
];

export function LiveChatPanel({
  onClose,
  onMinimize,
  initialPosition,
  width,
  height,
  zIndex,
  onPositionChange,
  onSizeChange,
  onFocus
}: LiveChatPanelProps) {
  const [activeChannel, setActiveChannel] = useState('general');
  const [messages, setMessages] = useState<Message[]>(SAMPLE_MESSAGES);
  const [messageInput, setMessageInput] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState(initialPosition);
  const [showMentionSuggestions, setShowMentionSuggestions] = useState(false);
  const [mentionFilter, setMentionFilter] = useState('');
  const [hoveredSticker, setHoveredSticker] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const placeholderHints = [
    "Share a WIP…",
    "Drop a sticker…",
    "Shout out a creator with @…"
  ];
  const [currentHint, setCurrentHint] = useState(0);

  // Rotate placeholder hints
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHint((prev) => (prev + 1) % placeholderHints.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Add new messages periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance every 3 seconds
        const randomMessage = MORE_MESSAGES[Math.floor(Math.random() * MORE_MESSAGES.length)];
        const newMessage = {
          ...randomMessage,
          id: `${Date.now()}-${Math.random()}`,
          timestamp: new Date(),
          channel: Math.random() > 0.7 ? activeChannel : randomMessage.channel || 'general'
        };
        setMessages(prev => [...prev.slice(-20), newMessage]); // Keep last 20 messages
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [activeChannel]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle @mention detection
  useEffect(() => {
    const lastAtIndex = messageInput.lastIndexOf('@');
    if (lastAtIndex !== -1) {
      const afterAt = messageInput.slice(lastAtIndex + 1);
      if (afterAt.length > 0 && !afterAt.includes(' ')) {
        setMentionFilter(afterAt.toLowerCase());
        setShowMentionSuggestions(true);
      } else if (afterAt.length === 0) {
        setMentionFilter('');
        setShowMentionSuggestions(true);
      } else {
        setShowMentionSuggestions(false);
      }
    } else {
      setShowMentionSuggestions(false);
    }
  }, [messageInput]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.chat-content')) return;
    
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
    onFocus();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    
    const newPosition = {
      x: e.clientX - dragOffset.x,
      y: e.clientY - dragOffset.y
    };
    setPosition(newPosition);
    onPositionChange(newPosition);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  const getRarityColor = (rarity: string) => {
    const colors = {
      common: '#22C55E',
      rare: '#FF70A6',
      premium: '#60A5FA',
      elite: '#3D94FF',
      legendary: '#F59E0B'
    };
    return colors[rarity as keyof typeof colors] || '#22C55E';
  };

  const filteredMessages = messages.filter(msg => msg.channel === activeChannel || !msg.channel);
  
  const filteredMentionUsers = ACTIVE_USERS.filter(user => 
    user.toLowerCase().includes(mentionFilter)
  );

  const insertMention = (username: string) => {
    const lastAtIndex = messageInput.lastIndexOf('@');
    const beforeAt = messageInput.slice(0, lastAtIndex);
    const afterMention = messageInput.slice(lastAtIndex).replace(/@\w*/, `@${username} `);
    setMessageInput(beforeAt + afterMention);
    setShowMentionSuggestions(false);
  };

  const renderMessage = (message: Message) => {
    const isSystem = message.type === 'system';
    
    // Parse content for @mentions and sticker references
    const parseContent = (content: string) => {
      const parts = [];
      const mentionRegex = /@(\w+)/g;
      const stickerRegex = /'([^']+)'/g;
      let lastIndex = 0;
      
      // Find mentions
      let match;
      while ((match = mentionRegex.exec(content)) !== null) {
        if (match.index > lastIndex) {
          parts.push(content.slice(lastIndex, match.index));
        }
        parts.push(
          <span key={`mention-${match.index}`} className="text-blue-400 font-medium hover:text-blue-300 cursor-pointer">
            {match[0]}
          </span>
        );
        lastIndex = match.index + match[0].length;
      }
      
      if (lastIndex < content.length) {
        let remainingContent = content.slice(lastIndex);
        
        // Find sticker references in remaining content
        const stickerParts = [];
        let stickerLastIndex = 0;
        while ((match = stickerRegex.exec(remainingContent)) !== null) {
          if (match.index > stickerLastIndex) {
            stickerParts.push(remainingContent.slice(stickerLastIndex, match.index));
          }
          stickerParts.push(
            <span 
              key={`sticker-${match.index}`} 
              className="text-purple-400 font-medium hover:text-purple-300 cursor-pointer"
              onMouseEnter={() => setHoveredSticker({
                name: match[1],
                x: 0, y: 0 // In real implementation, you'd get mouse position
              })}
              onMouseLeave={() => setHoveredSticker(null)}
            >
              '{match[1]}'
            </span>
          );
          stickerLastIndex = match.index + match[0].length;
        }
        
        if (stickerLastIndex < remainingContent.length) {
          stickerParts.push(remainingContent.slice(stickerLastIndex));
        }
        
        parts.push(...stickerParts);
      }
      
      return parts.length > 1 ? parts : content;
    };
    
    return (
      <div key={message.id} className={`flex gap-3 ${isSystem ? 'justify-center' : ''} group`}>
        {!isSystem && (
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-semibold text-white flex-shrink-0">
            {message.avatar}
          </div>
        )}
        
        <div className={`flex-1 ${isSystem ? 'text-center' : ''}`}>
          {!isSystem && (
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-white">{message.username}</span>
              <span className="text-xs text-gray-400">{message.handle}</span>
              <span className="text-xs text-gray-500">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          )}
          
          <div className={`text-sm ${isSystem ? 'text-gray-400 italic' : 'text-gray-200'}`}>
            {parseContent(message.content)}
          </div>
          
          {message.attachments && (
            <div className="mt-2 flex gap-2">
              {message.attachments.map((attachment, idx) => (
                <div key={idx} className="relative group/attachment">
                  {attachment.type === 'sticker' && (
                    <div 
                      className="w-24 h-24 rounded border-2 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold hover:scale-105 transition-transform cursor-pointer"
                      style={{ borderColor: getRarityColor(attachment.rarity || 'common') }}
                    >
                      🌻
                    </div>
                  )}
                  
                  {attachment.type === 'card' && (
                    <div 
                      className="w-32 h-20 rounded border-2 bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white font-bold hover:scale-105 transition-transform cursor-pointer"
                      style={{ borderColor: getRarityColor(attachment.rarity || 'common') }}
                    >
                      🃏
                    </div>
                  )}
                  
                  {attachment.type === 'image' && (
                    <img 
                      src={attachment.url} 
                      alt={attachment.title}
                      className="max-w-xs rounded hover:scale-105 transition-transform cursor-pointer"
                    />
                  )}
                  
                  {/* Enhanced Tooltip on hover */}
                  <div className="absolute -top-24 left-1/2 transform -translate-x-1/2 bg-black/95 text-white text-xs rounded-lg px-4 py-3 opacity-0 group-hover/attachment:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap border border-gray-600">
                    <div className="font-semibold text-center mb-2">{attachment.title}</div>
                    {attachment.creator && <div className="text-gray-300">Creator: {attachment.creator}</div>}
                    {attachment.serial && <div className="text-gray-300">Serial {attachment.serial}</div>}
                    {attachment.rarity && (
                      <div className="flex items-center justify-center gap-2 mt-2 mb-2">
                        <span 
                          className="px-3 py-1 rounded-full text-xs font-bold text-black"
                          style={{ backgroundColor: getRarityColor(attachment.rarity) }}
                        >
                          {attachment.rarity.charAt(0).toUpperCase() + attachment.rarity.slice(1)}
                        </span>
                      </div>
                    )}
                    <div className="flex gap-1 mt-2 text-xs justify-center">
                      <button className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-500 transition-colors">View</button>
                      <button className="bg-green-600 px-3 py-1 rounded hover:bg-green-500 transition-colors">Gift</button>
                      <button className="bg-yellow-600 px-3 py-1 rounded hover:bg-yellow-500 transition-colors">Trade</button>
                      <button className="bg-purple-600 px-3 py-1 rounded hover:bg-purple-500 transition-colors">Auction</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div
      className={`fixed rounded-2xl border border-white/8 bg-zinc-950/90 backdrop-blur-md shadow-[0_10px_40px_rgba(0,0,0,0.6)] w-[820px] max-h-[72vh] overflow-hidden flex flex-col ${isDragging ? 'dragging' : ''}`}
      style={{
        left: position.x,
        top: position.y,
        zIndex,
        cursor: isDragging ? 'grabbing' : 'default'
      }}
      onClick={onFocus}
    >
      {/* Header */}
      <div 
        className="h-12 px-4 flex items-center justify-between border-b border-white/5 cursor-move"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-3">
          <MessageCircle className="w-5 h-5 text-blue-400" />
          <h3 className="font-semibold text-white">Live Chats</h3>
          <Badge className="bg-green-600/20 text-green-400 border-green-600/30">
            {filteredMessages.length} msgs
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <Search className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Search Messages</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <Plus className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Create/Join Channel</TooltipContent>
          </Tooltip>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onMinimize}
            className="text-gray-400 hover:text-white"
          >
            <Minimize2 className="w-4 h-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-red-400"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="h-10 px-3 flex items-center gap-2 border-b border-white/5 bg-gray-900/50">
        <div className="flex gap-2 overflow-x-auto scrollbar-thin">
          {CHANNELS.map(channel => {
            const channelMessages = messages.filter(msg => msg.channel === channel.id || (!msg.channel && channel.id === 'general'));
            const hasUnread = channelMessages.some(msg => msg.timestamp > new Date(Date.now() - 30000));
            
            return (
              <Tooltip key={channel.id}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setActiveChannel(channel.id)}
                    className={`px-4 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all relative flex items-center gap-2 ${
                      activeChannel === channel.id
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 border border-blue-500'
                        : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 border border-gray-600/50'
                    }`}
                  >
                    <Hash className="w-3 h-3" />
                    {channel.name.replace('#', '')}
                    {hasUnread && activeChannel !== channel.id && (
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-center">
                    <div className="font-medium">{channel.name}</div>
                    <div className="text-xs text-gray-400">{channel.description}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {channelMessages.length} messages
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </div>

      {/* Messages List Wrapper */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="p-4 space-y-4 chat-content dropsource-custom-scrollbar">
          {filteredMessages.map(renderMessage)}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Composer */}
      <div className="h-12 px-3 border-t border-white/5 flex items-center gap-2 relative">
        {/* @mention suggestions */}
        {showMentionSuggestions && filteredMentionUsers.length > 0 && (
          <div className="absolute bottom-full left-3 right-3 mb-2 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-10 max-h-32 overflow-y-auto">
            {filteredMentionUsers.slice(0, 5).map(user => (
              <button
                key={user}
                onClick={() => insertMention(user)}
                className="w-full px-3 py-2 text-left text-gray-200 hover:bg-gray-700 transition-colors flex items-center gap-2"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-semibold text-white">
                  {user.charAt(0)}
                </div>
                <span>@{user}</span>
              </button>
            ))}
          </div>
        )}
        
        <div className="flex-1 relative">
          <Input
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder={placeholderHints[currentHint]}
            className="pr-16 bg-gray-800 border-gray-600 text-white placeholder-gray-400"
            onKeyPress={(e) => {
              if (e.key === 'Enter' && messageInput.trim() && !showMentionSuggestions) {
                const mentions = (messageInput.match(/@(\w+)/g) || []).map(m => m.slice(1));
                const newMessage: Message = {
                  id: Date.now().toString(),
                  username: 'You',
                  handle: '@you',
                  avatar: '👤',
                  content: messageInput,
                  timestamp: new Date(),
                  type: 'text',
                  channel: activeChannel,
                  mentions
                };
                setMessages(prev => [...prev, newMessage]);
                setMessageInput('');
              }
            }}
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
            <Button variant="ghost" size="sm" className="w-6 h-6 p-0 text-gray-400 hover:text-white">
              <Smile className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="w-6 h-6 p-0 text-gray-400 hover:text-white">
              <Paperclip className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <Button 
          size="sm" 
          className="bg-blue-600 hover:bg-blue-500"
          disabled={!messageInput.trim()}
          onClick={() => {
            if (messageInput.trim()) {
              const mentions = (messageInput.match(/@(\w+)/g) || []).map(m => m.slice(1));
              const newMessage: Message = {
                id: Date.now().toString(),
                username: 'You',
                handle: '@you',
                avatar: '👤',
                content: messageInput,
                timestamp: new Date(),
                type: 'text',
                channel: activeChannel,
                mentions
              };
              setMessages(prev => [...prev, newMessage]);
              setMessageInput('');
            }
          }}
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}