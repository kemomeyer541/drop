import React, { useState, useEffect } from 'react';
import { X, Minimize2, Search, Users, UserPlus, MessageCircle, Star, MoreHorizontal } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

interface FriendsListMenuProps {
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

interface Friend {
  id: string;
  username: string;
  handle: string;
  avatar: string;
  online: boolean;
  status: 'online' | 'away' | 'busy' | 'offline';
  activity?: string;
  joinedDate: Date;
  mutualFriends: number;
  trustScore: number;
}

const SAMPLE_FRIENDS: Friend[] = [
  {
    id: '1',
    username: 'CraftyCrow',
    handle: '@CraftyCrow',
    avatar: '🎨',
    online: true,
    status: 'online',
    activity: 'Creating stickers',
    joinedDate: new Date(Date.now() - 86400000 * 30),
    mutualFriends: 12,
    trustScore: 95
  },
  {
    id: '2',
    username: 'PixelSmith',
    handle: '@PixelSmith',
    avatar: '⚒️',
    online: true,
    status: 'busy',
    activity: 'In a collab session',
    joinedDate: new Date(Date.now() - 86400000 * 45),
    mutualFriends: 8,
    trustScore: 92
  },
  {
    id: '3',
    username: 'MemeDealer',
    handle: '@MemeDealer',
    avatar: '😎',
    online: false,
    status: 'offline',
    joinedDate: new Date(Date.now() - 86400000 * 15),
    mutualFriends: 23,
    trustScore: 88
  },
  {
    id: '4',
    username: 'ZineZebra',
    handle: '@ZineZebra',
    avatar: '🦓',
    online: true,
    status: 'away',
    activity: 'Streaming',
    joinedDate: new Date(Date.now() - 86400000 * 60),
    mutualFriends: 15,
    trustScore: 97
  },
  {
    id: '5',
    username: 'BeatBuddy',
    handle: '@BeatBuddy',
    avatar: '🎵',
    online: true,
    status: 'online',
    activity: 'Making beats',
    joinedDate: new Date(Date.now() - 86400000 * 20),
    mutualFriends: 6,
    trustScore: 89
  }
];

const FRIEND_REQUESTS = [
  {
    id: 'r1',
    username: 'SynthMaster',
    handle: '@SynthMaster',
    avatar: '🎹',
    mutualFriends: 3,
    requestDate: new Date(Date.now() - 3600000 * 2)
  },
  {
    id: 'r2', 
    username: 'VectorVoid',
    handle: '@VectorVoid',
    avatar: '🌌',
    mutualFriends: 7,
    requestDate: new Date(Date.now() - 3600000 * 6)
  }
];

export function FriendsListMenu({
  onClose,
  onMinimize,
  initialPosition,
  width,
  height,
  zIndex,
  onPositionChange,
  onSizeChange,
  onFocus
}: FriendsListMenuProps) {
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('friends');

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.friends-content')) return;
    
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return '#22C55E';
      case 'away': return '#EAB308';
      case 'busy': return '#EF4444';
      case 'offline': return '#6B7280';
      default: return '#6B7280';
    }
  };

  const filteredFriends = SAMPLE_FRIENDS.filter(friend => 
    friend.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    friend.handle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const onlineFriends = filteredFriends.filter(f => f.online);
  const offlineFriends = filteredFriends.filter(f => !f.online);

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
        className="h-12 px-4 flex items-center justify-between gap-2 border-b border-white/5 text-zinc-200 bg-transparent cursor-move"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-3">
          <Users className="w-5 h-5 opacity-70 hover:opacity-100" />
          <h3 className="text-sm font-semibold text-zinc-200">
            Friends
          </h3>
          <Badge className="bg-blue-600/20 text-blue-400 border-blue-600/30">
            {SAMPLE_FRIENDS.length}
          </Badge>
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

      {/* Content */}
      <div className="flex-1 overflow-hidden friends-content p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-3 m-0 rounded-none border-b border-white/5 bg-transparent h-12">
            <TabsTrigger 
              value="friends"
              className="data-[state=active]:text-zinc-200 data-[state=active]:bg-transparent text-zinc-500 bg-transparent border-none relative data-[state=active]:after:absolute data-[state=active]:after:left-2 data-[state=active]:after:right-2 data-[state=active]:after:-bottom-[6px] data-[state=active]:after:h-[2px] data-[state=active]:after:rounded-full data-[state=active]:after:bg-[#3BA7FF]"
            >
              Friends
            </TabsTrigger>
            <TabsTrigger 
              value="requests"
              className="data-[state=active]:text-zinc-200 data-[state=active]:bg-transparent text-zinc-500 bg-transparent border-none relative data-[state=active]:after:absolute data-[state=active]:after:left-2 data-[state=active]:after:right-2 data-[state=active]:after:-bottom-[6px] data-[state=active]:after:h-[2px] data-[state=active]:after:rounded-full data-[state=active]:after:bg-[#3BA7FF]"
            >
              Requests
              {FRIEND_REQUESTS.length > 0 && (
                <Badge className="ml-2 px-1 py-0 text-xs bg-rose-600 text-white">
                  {FRIEND_REQUESTS.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger 
              value="blocked"
              className="data-[state=active]:text-zinc-200 data-[state=active]:bg-transparent text-zinc-500 bg-transparent border-none relative data-[state=active]:after:absolute data-[state=active]:after:left-2 data-[state=active]:after:right-2 data-[state=active]:after:-bottom-[6px] data-[state=active]:after:h-[2px] data-[state=active]:after:rounded-full data-[state=active]:after:bg-[#3BA7FF]"
            >
              Blocked
            </TabsTrigger>
          </TabsList>

          <TabsContent value="friends" className="flex-1 overflow-hidden m-0">
            {/* Search */}
            <div className="p-3 border-b border-white/5">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-500 opacity-70" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search friends..."
                  className="pl-9 bg-zinc-800 border-zinc-600 text-zinc-200 placeholder-zinc-500"
                />
              </div>
            </div>

            {/* Friends List */}
            <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgb(255 255 255 / 0.1) transparent' }}>
              {/* Online Friends */}
              {onlineFriends.length > 0 && (
                <div>
                  <div className="px-4 py-2 text-xs font-semibold text-zinc-500 bg-green-600/10">
                    ONLINE — {onlineFriends.length}
                  </div>
                  {onlineFriends.map((friend) => (
                    <div
                      key={friend.id}
                      className="rounded-lg border border-white/5 bg-zinc-900/40 hover:bg-zinc-800/50 transition p-3 mb-2 cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                            style={{ backgroundColor: getStatusColor(friend.status) }}
                          >
                            {friend.avatar}
                          </div>
                          <div 
                            className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2"
                            style={{ 
                              backgroundColor: getStatusColor(friend.status),
                              borderColor: '#0F1520'
                            }}
                          />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium truncate text-zinc-200">
                              {friend.username}
                            </span>
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-yellow-500" />
                              <span className="text-xs text-yellow-500">
                                {friend.trustScore}%
                              </span>
                            </div>
                          </div>
                          
                          <div className="text-sm truncate text-zinc-500">
                            {friend.activity || friend.handle}
                          </div>
                        </div>

                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-8 h-8 p-0 text-gray-400 hover:text-white"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-8 h-8 p-0 text-gray-400 hover:text-white"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Offline Friends */}
              {offlineFriends.length > 0 && (
                <div>
                  <div 
                    className="px-4 py-2 text-xs font-semibold"
                    style={{ 
                      color: '#A9B7C6',
                      backgroundColor: 'rgba(107, 114, 128, 0.1)'
                    }}
                  >
                    OFFLINE — {offlineFriends.length}
                  </div>
                  {offlineFriends.map((friend) => (
                    <div
                      key={friend.id}
                      className="p-3 border-b hover:bg-gray-800/50 cursor-pointer transition-colors duration-150 opacity-60"
                      style={{ borderColor: '#1A2531' }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                            style={{ backgroundColor: '#6B7280' }}
                          >
                            {friend.avatar}
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span 
                              className="font-medium truncate"
                              style={{ color: '#E6ECF3' }}
                            >
                              {friend.username}
                            </span>
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3" style={{ color: '#FFB039' }} />
                              <span 
                                className="text-xs"
                                style={{ color: '#FFB039' }}
                              >
                                {friend.trustScore}%
                              </span>
                            </div>
                          </div>
                          
                          <div 
                            className="text-sm truncate"
                            style={{ color: '#A9B7C6' }}
                          >
                            {friend.handle}
                          </div>
                        </div>

                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-8 h-8 p-0 text-gray-400 hover:text-white"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-8 h-8 p-0 text-gray-400 hover:text-white"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {filteredFriends.length === 0 && (
                <div 
                  className="p-8 text-center"
                  style={{ color: '#A9B7C6' }}
                >
                  <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>No friends found</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="requests" className="flex-1 overflow-hidden m-0">
            <div className="flex-1 overflow-y-auto dropsource-custom-scrollbar" style={{ maxHeight: 'calc(100% - 50px)', overflowY: 'auto' }}>
              {FRIEND_REQUESTS.map((request) => (
                <div
                  key={request.id}
                  className="p-4 border-b"
                  style={{ borderColor: '#1A2531' }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                      style={{ backgroundColor: '#00AEEF' }}
                    >
                      {request.avatar}
                    </div>
                    
                    <div className="flex-1">
                      <div style={{ color: '#E6ECF3', fontWeight: '600' }}>
                        {request.username}
                      </div>
                      <div style={{ color: '#A9B7C6', fontSize: '12px' }}>
                        {request.mutualFriends} mutual friends
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      size="sm"
                      className="flex-1"
                      style={{
                        backgroundColor: '#22C55E',
                        color: '#000'
                      }}
                    >
                      Accept
                    </Button>
                    <Button 
                      variant="ghost"
                      size="sm"
                      className="flex-1 text-gray-400 hover:text-white border border-gray-600"
                    >
                      Decline
                    </Button>
                  </div>
                </div>
              ))}

              {FRIEND_REQUESTS.length === 0 && (
                <div 
                  className="p-8 text-center"
                  style={{ color: '#A9B7C6' }}
                >
                  <UserPlus className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>No pending requests</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="blocked" className="flex-1 overflow-hidden m-0">
            <div 
              className="p-8 text-center"
              style={{ color: '#A9B7C6' }}
            >
              <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No blocked users</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Friend Button */}
      <div className="p-3 border-t" style={{ borderColor: '#1A2531' }}>
        <Button 
          className="w-full flex items-center gap-2"
          style={{
            backgroundColor: '#00AEEF',
            color: '#000'
          }}
        >
          <UserPlus className="w-4 h-4" />
          Add Friend
        </Button>
      </div>
    </div>
  );
}