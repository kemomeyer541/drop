import React, { createContext, useContext, useEffect, useState } from 'react';
import { chatService, ChatState, ChatChannel, ChatMessage } from '../utils/chatService';

interface ChatContextValue {
  state: ChatState;
  channels: ChatChannel[];
  messages: ChatMessage[];
  open: (channelId?: string, options?: { docked?: boolean }) => void;
  close: () => void;
  toggle: (channelId?: string) => void;
  switchChannel: (channelId: string) => void;
  setDocked: (docked: boolean) => void;
  setDraft: (channelId: string, draft: string) => void;
  getDraft: (channelId: string) => string;
  addMessage: (channelId: string, message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  focus: () => void;
}

const ChatContext = createContext<ChatContextValue | null>(null);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ChatState>(chatService.getState());
  const [channels] = useState<ChatChannel[]>(chatService.getChannels());
  const [messages, setMessages] = useState<ChatMessage[]>(
    chatService.getMessages(state.channelId)
  );

  useEffect(() => {
    const unsubscribe = chatService.subscribe((newState) => {
      setState(newState);
      setMessages(chatService.getMessages(newState.channelId));
    });

    return unsubscribe;
  }, []);

  const contextValue: ChatContextValue = {
    state,
    channels,
    messages,
    open: chatService.open.bind(chatService),
    close: chatService.close.bind(chatService),
    toggle: chatService.toggle.bind(chatService),
    switchChannel: chatService.switchChannel.bind(chatService),
    setDocked: chatService.setDocked.bind(chatService),
    setDraft: chatService.setDraft.bind(chatService),
    getDraft: chatService.getDraft.bind(chatService),
    addMessage: chatService.addMessage.bind(chatService),
    focus: chatService.focus.bind(chatService)
  };

  return (
    <ChatContext.Provider value={contextValue}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}