import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Minimize2, MessageCircle, Send, Smile, Paperclip, Plus, Search } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { useChat } from '../contexts/ChatContext';

export function UnifiedChatPopout() {
  const { 
    state, 
    channels, 
    messages, 
    close, 
    switchChannel, 
    setDraft, 
    getDraft, 
    addMessage 
  } = useChat();
  
  const [messageInput, setMessageInput] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  const placeholderHints = [
    "Share a WIP…",
    "Drop a sticker…", 
    "Shout out a creator with @…"
  ];
  const [currentHint, setCurrentHint] = useState(0);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Load draft when channel changes
  useEffect(() => {
    const draft = getDraft(state.channelId);
    setMessageInput(draft);
  }, [state.channelId, getDraft]);

  // Save draft when input changes
  useEffect(() => {
    setDraft(state.channelId, messageInput);
  }, [messageInput, state.channelId, setDraft]);

  // Rotate placeholder hints
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHint((prev) => (prev + 1) % placeholderHints.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [close]);

  // Focus trap - when chat opens, focus should be trapped inside
  useEffect(() => {
    if (state.isOpen) {
      // Focus the input when chat opens
      const input = document.querySelector('.chat-input') as HTMLInputElement;
      if (input) {
        setTimeout(() => input.focus(), 100);
      }
    }
  }, [state.isOpen]);

  // Prevent page scroll when chat is scrolling
  useEffect(() => {
    if (chatRef.current) {
      const chatElement = chatRef.current;
      const preventPageScroll = (e: WheelEvent) => {
        const isScrollingUp = e.deltaY < 0;
        const isScrollingDown = e.deltaY > 0;
        const isAtTop = chatElement.scrollTop === 0;
        const isAtBottom = chatElement.scrollTop + chatElement.clientHeight >= chatElement.scrollHeight - 1;

        if ((isScrollingUp && !isAtTop) || (isScrollingDown && !isAtBottom)) {
          e.stopPropagation();
        }
      };

      chatElement.addEventListener('wheel', preventPageScroll, { passive: false });
      return () => chatElement.removeEventListener('wheel', preventPageScroll);
    }
  }, []);

  const getRarityColor = (rarity: string) => {
    const colors = {
      common: '#22C55E',
      rare: '#FF70A6', 
      epic: '#60A5FA',
      legendary: '#F59E0B'
    };
    return colors[rarity as keyof typeof colors] || '#22C55E';
  };

  const renderMessage = (message: any) => {
    const isSystem = message.type === 'system';
    
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
            {message.content}
          </div>
          
          {message.attachments && (
            <div className="mt-2 flex gap-2">
              {message.attachments.map((attachment: any, idx: number) => (
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
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const sendMessage = () => {
    if (messageInput.trim()) {
      addMessage(state.channelId, {
        username: 'You',
        handle: '@you',
        avatar: '👤',
        content: messageInput,
        type: 'text'
      });
      setMessageInput('');
    }
  };

  // Don't render if chat is not open
  if (!state.isOpen) {
    return null;
  }

  // Create portal root if it doesn't exist
  let portalRoot = document.getElementById('portal-root');
  if (!portalRoot) {
    portalRoot = document.createElement('div');
    portalRoot.id = 'portal-root';
    document.body.appendChild(portalRoot);
  }

  const chatPanel = (
    <div
      className="fixed inset-0 z-[1000] flex"
      style={{
        background: isMobile ? 'rgba(0, 0, 0, 0.5)' : 'transparent',
        pointerEvents: 'none'
      }}
    >
      {/* Chat Panel */}
      <div
        className="bg-gray-900 border-l border-gray-700 flex flex-col"
        style={{
          width: isMobile ? '100%' : '400px',
          height: isMobile ? '85vh' : `calc(100vh - 80px)`,
          top: isMobile ? 'auto' : '80px',
          bottom: isMobile ? '0' : 'auto',
          right: isMobile ? 'auto' : '0',
          position: 'fixed',
          pointerEvents: 'auto',
          transform: 'translateX(0)',
          transition: 'transform 300ms ease-out',
          willChange: 'transform',
          boxShadow: '-4px 0 20px rgba(0, 0, 0, 0.3)',
          zIndex: 1001
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800">
          <div className="flex items-center gap-3">
            <MessageCircle className="w-5 h-5 text-blue-400" />
            <h3 className="font-semibold text-white">Live Chat</h3>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <Search className="w-4 h-4" />
            </Button>
            
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <Plus className="w-4 h-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={close}
              className="text-gray-400 hover:text-red-400"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Channel Tabs */}
        <div className="p-3 border-b border-gray-700 bg-gray-850">
          <div className="flex gap-2 overflow-x-auto scrollbar-thin">
            {channels.map(channel => (
              <button
                key={channel.id}
                onClick={() => switchChannel(channel.id)}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center gap-2 ${
                  state.channelId === channel.id
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {channel.name}
                {channel.unread > 0 && (
                  <Badge 
                    className="px-1 py-0 text-xs"
                    style={{ 
                      backgroundColor: '#EF4444',
                      color: '#FFF',
                      minWidth: '16px',
                      height: '16px',
                      fontSize: '10px'
                    }}
                  >
                    {channel.unread > 99 ? '99+' : channel.unread}
                  </Badge>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div 
          ref={chatRef}
          className="flex-1 overflow-y-auto p-4 space-y-4"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#374151 #1F2937'
          }}
        >
          {messages.map(renderMessage)}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-700 bg-gray-850">
          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <Input
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder={placeholderHints[currentHint]}
                className="pr-16 bg-gray-800 border-gray-600 text-white placeholder-gray-400 chat-input"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    sendMessage();
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
              onClick={sendMessage}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(chatPanel, portalRoot);
}