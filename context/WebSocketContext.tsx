import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import websocketService, { WS_CHANNELS } from '../services/websocket';

interface WebSocketContextType {
  isConnected: boolean;
  subscribe: (channel: string, callback: (data: any) => void) => () => void;
  unsubscribe: (channel: string, callback?: (data: any) => void) => void;
  emit: (event: string, data: any) => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

interface WebSocketProviderProps {
  children: ReactNode;
  userId?: string;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children, userId }) => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Connect to WebSocket
    websocketService.connect(userId);

    // Listen for connection status changes
    const unsubscribe = websocketService.onConnectionChange((connected) => {
      setIsConnected(connected);
    });

    // Cleanup on unmount
    return () => {
      unsubscribe();
    };
  }, [userId]);

  const value: WebSocketContextType = {
    isConnected,
    subscribe: websocketService.subscribe.bind(websocketService),
    unsubscribe: websocketService.unsubscribe.bind(websocketService),
    emit: websocketService.emit.bind(websocketService),
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};

const fallbackWebSocketContext: WebSocketContextType = {
  isConnected: false,
  subscribe: () => () => {},
  unsubscribe: () => {},
  emit: () => {},
};

// Custom hook to use WebSocket context with safe fallback
export const useWebSocket = (): WebSocketContextType => {
  const context = useContext(WebSocketContext);
  return context || fallbackWebSocketContext;
};

// Export channel constants for convenience
export { WS_CHANNELS };
