import { useState, useEffect } from 'react';
import { useWebSocket, WS_CHANNELS } from '../context/WebSocketContext';
import aiEngineApi, { AIModel } from '../services/aiEngineApi';

interface UseAIModelOptions {
  modelId: string;
  enableRealtime?: boolean;
}

interface UseAIModelReturn {
  model: AIModel | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export const useAIModel = ({ modelId, enableRealtime = true }: UseAIModelOptions): UseAIModelReturn => {
  const [model, setModel] = useState<AIModel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { subscribe, isConnected } = useWebSocket();

  // Fetch model data
  const fetchModel = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await aiEngineApi.getModel(modelId);
      setModel(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchModel();
  }, [modelId]);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!enableRealtime || !isConnected) return;

    const unsubscribe = subscribe(WS_CHANNELS.MODEL_STATUS, (data: any) => {
      // Update model if this update is for our model
      if (data.modelId === modelId) {
        setModel((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            accuracy: data.accuracy ?? prev.accuracy,
            totalPredictions: data.totalPredictions ?? prev.totalPredictions,
            predictions24h: data.predictions24h ?? prev.predictions24h,
            status: data.status ?? prev.status,
            lastUpdated: data.lastUpdated ?? prev.lastUpdated,
          };
        });
      }
    });

    return () => {
      unsubscribe();
    };
  }, [modelId, enableRealtime, isConnected, subscribe]);

  return {
    model,
    isLoading,
    error,
    refetch: fetchModel,
  };
};

export default useAIModel;
