"use client";

import React, { createContext, useContext } from 'react';
import useWebSocket from '@/services/websocket';

interface WebSocketContextType {
  data: any;
  isConnected: boolean;
  error: string | null;
  pollId: string;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const WebSocketProvider = ({ children, pollId = "datos-home" }: { children: React.ReactNode, pollId?: string }) => {
  const { data, isConnected, error } = useWebSocket(pollId);

  return (
    <WebSocketContext.Provider value={{ data, isConnected, error, pollId }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export function useWebSocketContext(customPollId?: string) {
  const context = useContext(WebSocketContext);
  
  if (!context) {
    throw new Error('useWebSocketContext debe ser usado dentro de un WebSocketProvider');
  }

  if (customPollId) {
    const { data, isConnected, error } = useWebSocket(customPollId);
    return { data, isConnected, error, pollId: customPollId };
  }

  return context;
}