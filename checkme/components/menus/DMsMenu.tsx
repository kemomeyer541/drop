import React, { useState, useEffect } from 'react';
import { X, Minimize2, Search, MessageCircle, Send, Plus, MoreHorizontal } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';

interface DMsMenuProps {
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

interface DirectMessage {
  id: string;
  username: string;
  handle: string;
  avatar: string;
  lastMessage: string;
  timestamp: Date;
  unread: number;
  online: boolean;
}

const SAMPLE_DMS: DirectMessage[] = [
  {
    id: '1',
    username: 'CraftyCrow',
    handle: '@CraftyCrow',
    avatar: '🎨',
    lastMessage: 'Thanks for the collab! 🔥',
    timestamp: new Date(Date.now() - 300000), // 5 minutes ago
    unread: 2,
    online: true
  },
  {
    id: '2',
    username: 'PixelSmith',
    handle: '@PixelSmith',
    avatar: '⚒️',
    lastMessage: 'Got that sticker you wanted',
    timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
    unread: 0,
    online: true
  },
  {
    id: '3',
    username: 'MemeDealer',
    handle: '@MemeDealer',
    avatar: '😎',
    lastMessage: 'lol that is cursed',
    timestamp: new Date(Date.now() - 7200000), // 2 hours ago
    unread: 1,
    online: false
  },
  {
    id: '4',
    username: 'ZineZebra',
    handle: '@ZineZebra',
    avatar: '🦓',
    lastMessage: 'When are you free for that stream?',
    timestamp: new Date(Date.now() - 86400000), // 1 day ago
    unread: 0,
    online: false
  },
  {
    id: '5',
    username: 'BeatBuddy',
    handle: '@BeatBuddy',
    avatar: '🎵',
    lastMessage: 'Check out this beat I made',
    timestamp: new Date(Date.now() - 172800000), // 2 days ago
    unread: 0,
    online: true
  }
];

export function DMsMenu({
  onClose,
  onMinimize,
  initialPosition,
  width,
  height,
  zIndex,
  onPositionChange,
  onSizeChange,
  onFocus
}: DMsMenuProps) {
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDM, setSelectedDM] = useState<DirectMessage | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    // Only allow dragging from the header bar, not from interactive content
    const target = e.target as HTMLElement;
    if (target.tagName === 'BUTTON' || target.closest('button')) return;
    if (target.closest('.dm-content')) return;
    if (target.closest('[data-no-drag]')) return;
    
    e.preventDefault();
    e.stopPropagation();
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

  const filteredDMs = SAMPLE_DMS.filter(dm => 
    dm.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dm.handle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
  };

  return (
    <div
      className={`fixed rounded-2xl border border-white/8 bg-zinc-950/90 backdrop-blur-md shadow-[0_10px_40px_rgba(0,0,0,0.6)] max-h-[72vh] w-[720px] overflow-hidden flex flex-col ${isDragging ? 'dragging' : ''}`}
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
        className="h-12 px-4 flex items-center justify-between gap-2 border-b border-white/5 text-zinc-200 bg-transparent cursor-move select-none"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-3">
          <MessageCircle className="w-5 h-5 opacity-70 hover:opacity-100" />
          <h3 className="text-sm font-semibold text-zinc-200">
            Direct Messages
          </h3>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMinimize}
            className="text-zinc-400 hover:text-zinc-200 opacity-70 hover:opacity-100"
          >
            <Minimize2 className="w-4 h-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-zinc-400 hover:text-red-400 opacity-70 hover:opacity-100"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex dm-content p-4 overflow-y-auto" style={{ height: 'calc(100% - 48px)' }} data-no-drag>
        {/* DMs List */}
        <div 
          className="border-r border-white/5 flex flex-col"
          style={{ 
            width: selectedDM ? '280px' : '100%',
            height: '100%'
          }}
        >
          {/* Search */}
          <div className="p-3 border-b border-white/5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-500 opacity-70" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations..."
                className="pl-9 bg-zinc-800 border-zinc-600 text-zinc-200 placeholder-zinc-500"
              />
            </div>
          </div>

          {/* DM List */}
          <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgb(255 255 255 / 0.1) transparent' }}>
            {filteredDMs.map((dm) => (
              <div
                key={dm.id}
                className={`rounded-lg border border-white/5 bg-zinc-900/40 hover:bg-zinc-800/50 transition p-3 mb-2 cursor-pointer ${
                  selectedDM?.id === dm.id ? 'bg-blue-600/20 border-blue-500/20' : ''
                }`}
                onClick={() => setSelectedDM(dm)}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                      style={{ backgroundColor: dm.online ? '#22C55E' : '#6B7280' }}
                    >
                      {dm.avatar}
                    </div>
                    {dm.online && (
                      <div 
                        className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2"
                        style={{ 
                          backgroundColor: '#22C55E',
                          borderColor: '#0F1520'
                        }}
                      />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium truncate text-zinc-200">
                        {dm.username}
                      </span>
                      <span className="text-xs text-zinc-500">
                        {formatTime(dm.timestamp)}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm truncate text-zinc-500">
                        {dm.lastMessage}
                      </span>
                      {dm.unread > 0 && (
                        <Badge className="ml-2 px-2 py-1 text-xs bg-[#3BA7FF] text-black">
                          {dm.unread}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredDMs.length === 0 && (
              <div className="p-8 text-center text-zinc-500">
                <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No conversations found</p>
                <p className="text-sm mt-1">Start a new conversation with someone!</p>
              </div>
            )}
          </div>

          {/* New Chat Button */}
          <div className="h-12 px-4 border-t border-white/5 bg-transparent flex items-center">
            <Button className="w-full flex items-center gap-2 bg-[#3BA7FF] text-black hover:bg-[#2F96ED]">
              <Plus className="w-4 h-4" />
              New Message
            </Button>
          </div>
        </div>

        {/* Chat View */}
        {selectedDM && (
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="h-12 px-4 flex items-center justify-between gap-2 border-b border-white/5 text-zinc-200 bg-transparent">
            
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold"
                    style={{ backgroundColor: selectedDM.online ? '#22C55E' : '#6B7280' }}
                  >
                    {selectedDM.avatar}
                  </div>
                  {selectedDM.online && (
                    <div 
                      className="absolute -bottom-1 -right-1 w-2 h-2 rounded-full"
                      style={{ backgroundColor: '#22C55E' }}
                    />
                  )}
                </div>
                <div>
                  <div className="text-sm font-semibold text-zinc-200">
                    {selectedDM.username}
                  </div>
                  <div className="text-xs text-zinc-500">
                    {selectedDM.online ? 'Online' : 'Offline'}
                  </div>
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                className="text-zinc-400 hover:text-zinc-200 opacity-70 hover:opacity-100"
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-4 overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgb(255 255 255 / 0.1) transparent' }}>
              <div className="text-center py-8 text-zinc-500">
              
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-2xl mx-auto mb-3"
                  style={{ backgroundColor: selectedDM.online ? '#22C55E' : '#6B7280' }}
                >
                  {selectedDM.avatar}
                </div>
                <h4 className="text-sm font-semibold text-zinc-200">
                  {selectedDM.username}
                </h4>
                <p className="text-sm mt-1">
                  This is the beginning of your conversation with {selectedDM.username}
                </p>
              </div>
            </div>

            {/* Message Input */}
            <div className="h-12 px-4 border-t border-white/5 bg-transparent flex items-center">
              <div className="flex items-center gap-2 w-full">
                <Input
                  placeholder={`Message ${selectedDM.username}...`}
                  className="flex-1 bg-zinc-800 border-zinc-600 text-zinc-200 placeholder-zinc-500"
                />
                <Button 
                  size="sm"
                  className="bg-[#3BA7FF] text-black hover:bg-[#2F96ED]"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}