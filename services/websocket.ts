import { io, Socket } from 'socket.io-client';

type MessageCallback = (data: any) => void;

interface SubscriptionMap {
  [channel: string]: MessageCallback[];
}

class WebSocketService {
  private socket: Socket | null = null;
  private subscriptions: SubscriptionMap = {};
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private isConnecting = false;
  private connectionListeners: Array<(connected: boolean) => void> = [];

  constructor() {
    // Initialize connection on instantiation
    this.connect();
  }

  // Connect to WebSocket server
  connect(userId?: string): void {
    if (this.socket?.connected || this.isConnecting) {
      return;
    }

    this.isConnecting = true;
    const token = localStorage.getItem('authToken');
    const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
    const wsUrl = import.meta.env.VITE_WS_URL || apiBase.replace(/^http/, 'ws');

    this.socket = io(wsUrl, {
      auth: {
        token,
        userId,
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: this.reconnectDelay,
    });

    // Connection event handlers
    this.socket.on('connect', () => {
      console.log('WebSocket connected');
      this.isConnecting = false;
      this.reconnectAttempts = 0;
      this.notifyConnectionListeners(true);
      
      // Resubscribe to all channels
      Object.keys(this.subscriptions).forEach((channel) => {
        this.socket?.emit('subscribe', channel);
      });
    });

    this.socket.on('disconnect', (reason) => {
      console.log('WebSocket disconnected:', reason);
      this.isConnecting = false;
      this.notifyConnectionListeners(false);
    });

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      this.isConnecting = false;
      this.handleReconnect();
    });

    // Set up message routing
    this.setupMessageRouting();
  }

  // Disconnect from WebSocket server
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.subscriptions = {};
      this.reconnectAttempts = 0;
      this.notifyConnectionListeners(false);
    }
  }

  // Subscribe to a channel
  subscribe(channel: string, callback: MessageCallback): () => void {
    if (!this.subscriptions[channel]) {
      this.subscriptions[channel] = [];
      // Tell server we want to subscribe to this channel
      this.socket?.emit('subscribe', channel);
    }

    this.subscriptions[channel].push(callback);

    // Return unsubscribe function
    return () => this.unsubscribe(channel, callback);
  }

  // Unsubscribe from a channel
  unsubscribe(channel: string, callback?: MessageCallback): void {
    if (!this.subscriptions[channel]) return;

    if (callback) {
      // Remove specific callback
      this.subscriptions[channel] = this.subscriptions[channel].filter(
        (cb) => cb !== callback
      );

      // If no more callbacks, unsubscribe from channel
      if (this.subscriptions[channel].length === 0) {
        delete this.subscriptions[channel];
        this.socket?.emit('unsubscribe', channel);
      }
    } else {
      // Remove all callbacks for this channel
      delete this.subscriptions[channel];
      this.socket?.emit('unsubscribe', channel);
    }
  }

  // Emit event to server
  emit(event: string, data: any): void {
    this.socket?.emit(event, data);
  }

  // Check if connected
  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  // Add connection status listener
  onConnectionChange(listener: (connected: boolean) => void): () => void {
    this.connectionListeners.push(listener);
    // Immediately notify of current status
    listener(this.isConnected());
    
    // Return cleanup function
    return () => {
      this.connectionListeners = this.connectionListeners.filter(l => l !== listener);
    };
  }

  // Private: Setup message routing
  private setupMessageRouting(): void {
    if (!this.socket) return;

    // Listen for messages on all subscribed channels
    this.socket.onAny((eventName: string, data: any) => {
      // Route message to appropriate subscribers
      if (this.subscriptions[eventName]) {
        this.subscriptions[eventName].forEach((callback) => {
          try {
            callback(data);
          } catch (error) {
            console.error(`Error in ${eventName} callback:`, error);
          }
        });
      }
    });
  }

  // Private: Handle reconnection with exponential backoff
  private handleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

    console.log(`Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);

    setTimeout(() => {
      if (!this.isConnected()) {
        this.connect();
      }
    }, delay);
  }

  // Private: Notify all connection listeners
  private notifyConnectionListeners(connected: boolean): void {
    this.connectionListeners.forEach((listener) => {
      try {
        listener(connected);
      } catch (error) {
        console.error('Error in connection listener:', error);
      }
    });
  }
}

// Export singleton instance
export const websocketService = new WebSocketService();
export default websocketService;

// Channel constants for type safety
export const WS_CHANNELS = {
  AI_PREDICTIONS: 'ai-predictions',
  NOTIFICATIONS: 'notifications',
  VOICE_CALLS: 'voice-calls',
  ANALYTICS_UPDATES: 'analytics-updates',
  MODEL_STATUS: 'model-status',
} as const;
