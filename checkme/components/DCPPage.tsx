import React, { useState } from 'react';
import { ArrowLeft, Search, Send, MoreHorizontal } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

interface DCPPageProps {
  onNavigate: (page: string) => void;
}

export function DCPPage({ onNavigate }: DCPPageProps) {
  const [selectedChat, setSelectedChat] = useState('drop-source-admin');
  const [messageText, setMessageText] = useState('');

  // Mock chat data - Updated per spec with Drop Source admin conversation
  const conversations = [
    {
      id: 'drop-source-admin',
      name: 'Drop Source (Admin)',
      avatar: '🚀',
      lastMessage: 'So glad you love it! Have you checked out the Kickstarter?',
      time: '1h ago',
      unread: 0,
      online: true
    }
  ];

  const messages = [
    {
      id: 1,
      sender: 'me',
      text: 'Great Site! I\'ve been looking for a spot to connect with a community and share/sell my works! I also love the sticker/card system! So creative!',
      time: '1h ago',
      isOwn: true
    },
    {
      id: 2,
      sender: 'drop-source-admin',
      text: 'So glad you love it! Have you checked out the Kickstarter?',
      time: '1h ago',
      isOwn: false
    },
    {
      id: 3,
      sender: 'me',
      text: 'Yep! I\'m backing right now, I can\'t wait to see it when it\'s finished!',
      time: '1h ago',
      isOwn: true
    }
  ];

  const selectedConversation = conversations.find(c => c.id === selectedChat);

  const handleSendMessage = () => {
    if (messageText.trim()) {
      // In a real app, this would send the message
      console.log('Sending message:', messageText);
      setMessageText('');
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden" style={{
      background: 'linear-gradient(180deg, #0A0F1C 0%, #111827 100%)', // Clean dark background as specified
      color: 'var(--dropsource-primary)'
    }}>
      {/* Header */}
      <header className="flex items-center justify-between" style={{ 
        background: 'rgba(18, 23, 35, 0.95)',
        borderBottom: '1px solid rgba(0, 174, 239, 0.2)', // DropSource blue border
        padding: 'calc(var(--spacing-unit) * 2) calc(var(--spacing-unit) * 3)',
        backdropFilter: 'blur(12px)',
        zIndex: 20
      }}>
        {/* Left: Back Button */}
        <div className="flex items-center dropsource-spacing-md">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => onNavigate('community')}
                className="dropsource-nav-pill dropsource-focus-visible flex items-center gap-2"
                style={{ 
                  padding: 'calc(var(--spacing-unit) * 1) calc(var(--spacing-unit) * 2)'
                }}
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Home</span>
              </button>
            </TooltipTrigger>
            <TooltipContent>Back to Community Hub</TooltipContent>
          </Tooltip>
        </div>

        {/* Center: Page Title */}
        <div className="flex-1 text-center">
          <h1 style={{ 
            color: '#00AEEF', // More vibrant DropSource blue as specified
            fontSize: 'var(--text-lg)',
            fontWeight: '600'
          }}>
            Direct Contact Portal
          </h1>
          <p style={{ 
            color: 'var(--dropsource-tertiary)',
            fontSize: 'var(--text-sm)',
            marginTop: '2px'
          }}>
            Connect with creators
          </p>
        </div>

        {/* Right: Search */}
        <div className="flex items-center dropsource-spacing-sm">
          <div className="relative">
            <Input
              placeholder="Search conversations..."
              className="dropsource-input pr-10"
              style={{ 
                width: '200px',
                paddingLeft: 'calc(var(--spacing-unit) * 2)' // Fixed: move placeholder text so it's visible and not hidden under search icon
              }}
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 dropsource-text-tertiary" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Conversations List */}
        <div className="w-80 flex flex-col" style={{
          background: 'rgba(17, 24, 39, 0.8)', // Clean dark panel background
          borderRight: '1px solid rgba(0, 174, 239, 0.2)' // DropSource blue border
        }}>
          {/* Conversations Header */}
          <div className="p-4" style={{
            borderBottom: '1px solid rgba(0, 174, 239, 0.2)' // DropSource blue border
          }}>
            <div className="flex items-center justify-between">
              <h2 style={{ 
                fontSize: 'var(--text-md)',
                fontWeight: '600',
                color: 'var(--dropsource-primary)'
              }}>
                Messages
              </h2>
              <button className="dropsource-toolbar-button">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto dropsource-custom-scrollbar">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => setSelectedChat(conv.id)}
                className="p-4 cursor-pointer transition-all duration-150"
                style={{
                  borderBottom: '1px solid rgba(0, 174, 239, 0.1)',
                  background: selectedChat === conv.id 
                    ? 'rgba(0, 174, 239, 0.1)' 
                    : 'transparent',
                  borderLeft: selectedChat === conv.id 
                    ? '2px solid #00AEEF' 
                    : '2px solid transparent'
                }}
                onMouseEnter={(e) => {
                  if (selectedChat !== conv.id) {
                    e.currentTarget.style.background = 'rgba(0, 174, 239, 0.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedChat !== conv.id) {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-dropsource-surface flex items-center justify-center text-lg">
                      {conv.avatar}
                    </div>
                    {conv.online && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-dropsource-panel"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 style={{ 
                        fontSize: 'var(--text-sm)',
                        fontWeight: '500',
                        color: 'var(--dropsource-primary)'
                      }}>
                        {conv.name}
                      </h3>
                      <span style={{ 
                        fontSize: 'var(--text-xs)',
                        color: 'var(--dropsource-tertiary)'
                      }}>
                        {conv.time}
                      </span>
                    </div>
                    <p style={{ 
                      fontSize: 'var(--text-xs)',
                      color: 'var(--dropsource-secondary)',
                      marginTop: '2px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {conv.lastMessage}
                    </p>
                  </div>
                  {conv.unread > 0 && (
                    <div className="w-5 h-5 bg-dropsource-brand rounded-full flex items-center justify-center text-xs font-semibold text-black">
                      {conv.unread}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          {selectedConversation && (
            <div className="p-4 flex items-center justify-between" style={{
              borderBottom: '1px solid rgba(0, 174, 239, 0.2)', // DropSource blue border
              background: 'rgba(17, 24, 39, 0.6)' // Clean dark background
            }}>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-dropsource-surface flex items-center justify-center">
                    {selectedConversation.avatar}
                  </div>
                  {selectedConversation.online && (
                    <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full border border-dropsource-surface"></div>
                  )}
                </div>
                <div>
                  <h3 style={{ 
                    fontSize: 'var(--text-sm)',
                    fontWeight: '500',
                    color: 'var(--dropsource-primary)'
                  }}>
                    {selectedConversation.name}
                  </h3>
                  <p style={{ 
                    fontSize: 'var(--text-xs)',
                    color: 'var(--dropsource-tertiary)'
                  }}>
                    {selectedConversation.online ? 'Online' : 'Last seen 1h ago'}
                  </p>
                </div>
              </div>
              <div className="flex items-center dropsource-spacing-sm">
                {/* Removed Call, Video, Buddy (Users), and Settings icons as specified */}
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 dropsource-custom-scrollbar">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'} gap-3`}
                >
                  {/* Avatar for received messages (left side) */}
                  {!message.isOwn && (
                    <div className="dcp-message-avatar">
                      🚀
                    </div>
                  )}
                  
                  <div
                    className="max-w-xs lg:max-w-md px-4 py-2 rounded-lg"
                    style={{
                      background: message.isOwn
                        ? '#00AEEF' // DropSource blue for user messages
                        : 'rgba(17, 24, 39, 0.8)', // Clean dark for received messages
                      color: message.isOwn
                        ? '#000' // Black text on blue background
                        : 'var(--dropsource-primary)', // White text on dark background
                      borderRadius: 'var(--radius-sharp)'
                    }}

                  >
                    <p style={{ fontSize: 'var(--text-sm)' }}>{message.text}</p>
                    <p style={{ 
                      fontSize: 'var(--text-xs)',
                      marginTop: '4px',
                      opacity: 0.7
                    }}>
                      {message.time}
                    </p>
                  </div>
                  
                  {/* Avatar for user messages (right side) */}
                  {message.isOwn && (
                    <div className="dcp-message-avatar">
                      🙂
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Message Input */}
          <div className="p-4" style={{
            borderTop: '1px solid rgba(0, 174, 239, 0.2)', // DropSource blue border
            background: 'rgba(17, 24, 39, 0.6)' // Clean dark background
          }}>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <Input
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type a message..."
                  className="dropsource-input"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
              </div>
              <Button
                onClick={handleSendMessage}
                disabled={!messageText.trim()}
                className="px-4"
                style={{
                  background: '#00AEEF', // DropSource blue
                  color: '#000',
                  border: 'none',
                  borderRadius: 'var(--radius-sharp)'
                }}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}