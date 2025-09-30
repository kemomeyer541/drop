import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Send, Bot, User, Sparkles } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export function AIAssistPanel() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Hello! I\'m your AI songwriting assistant. I can help you with lyrics, chord progressions, song structure, rhymes, and creative inspiration. What would you like to work on today?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const mockAIResponses = [
    "Here are some rhymes for that word: {word}. Try incorporating them into your verse!",
    "For a song in that mood, I'd suggest using minor chords like Am, Dm, and Em. They create a melancholic feeling.",
    "That's a great lyrical concept! Consider exploring the emotions from different angles - maybe add a bridge that shows hope?",
    "Try this chord progression: C - Am - F - G. It's versatile and works well for both verses and choruses.",
    "Your lyrics have a nice flow! You might want to vary the syllable count in some lines to create more rhythmic interest.",
    "That theme reminds me of classic songs like 'Hotel California' - you could use similar storytelling techniques.",
  ];

  useEffect(() => {
    // Auto-scroll to bottom when new messages are added
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Simulate AI response delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: mockAIResponses[Math.floor(Math.random() * mockAIResponses.length)],
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1000 + Math.random() * 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const MessageBubble = ({ message }: { message: Message }) => (
    <div className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
      {message.type === 'ai' && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full dropsource-gradient flex items-center justify-center dropsource-glow-blue">
          <Bot className="w-4 h-4 text-white" />
        </div>
      )}
      
      <div className={`max-w-[80%] ${message.type === 'user' ? 'order-first' : ''}`}>
        <div
          className={`
            p-3 rounded-2xl
            ${message.type === 'ai' 
              ? 'bg-gray-900/70 dropsource-text-primary border border-cyan-500/30 dropsource-glow-cyan' 
              : 'bg-gray-800 dropsource-text-primary border border-gray-600'
            }
          `}
        >
          {message.content}
        </div>
        <div className="dropsource-text-secondary text-xs mt-1 px-3">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      {message.type === 'user' && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
          <User className="w-4 h-4 dropsource-text-secondary" />
        </div>
      )}
    </div>
  );

  return (
    <div className="h-full overflow-hidden flex flex-col">
      {/* Chat Header */}
      <div className="flex items-center gap-2 mb-4 p-3 bg-gray-900/50 rounded-lg border border-gray-700 flex-shrink-0">
        <Sparkles className="w-5 h-5 text-cyan-400 dropsource-glow-cyan" />
        <h4 className="dropsource-text-primary font-medium">AI Songwriting Assistant</h4>
        <div className="ml-auto">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-hidden mb-4">
        <ScrollArea className="h-full p-4 bg-gray-900/30 rounded-lg border border-gray-700" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="flex-shrink-0 w-8 h-8 rounded-full dropsource-gradient flex items-center justify-center dropsource-glow-blue">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-gray-900/70 p-3 rounded-2xl border border-cyan-500/30">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>
        </ScrollArea>
      </div>

      {/* Input */}
      <div className="flex gap-2 flex-shrink-0">
        <Input
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask me about lyrics, chords, song structure..."
          className="flex-1 bg-gray-900/50 border-gray-700 dropsource-text-primary focus:dropsource-glow-cyan focus:border-cyan-500"
          disabled={isLoading}
        />
        <Button
          onClick={sendMessage}
          disabled={!inputMessage.trim() || isLoading}
          className="dropsource-gradient hover:dropsource-glow-blue disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>

      {/* Quick Suggestions */}
      <div className="mt-4 flex-shrink-0">
        <div className="dropsource-text-secondary text-sm mb-2">Quick suggestions:</div>
        <div className="flex flex-wrap gap-2">
          {[
            'Help me write a chorus',
            'Suggest chord progressions',
            'Find rhymes for "love"',
            'Song structure ideas'
          ].map((suggestion) => (
            <Button
              key={suggestion}
              variant="outline"
              size="sm"
              onClick={() => setInputMessage(suggestion)}
              className="dropsource-border-glow hover:dropsource-glow-cyan text-xs"
            >
              {suggestion}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}