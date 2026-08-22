import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CallSession, CallStatus, VoiceCallContext, TranscriptionSegment, SentimentAnalysis, EngineType } from '../types/voice';

interface VoiceContextType {
  currentCall: CallSession | null;
  isCallActive: boolean;
  initiateCall: (context: VoiceCallContext) => Promise<void>;
  endCall: () => Promise<void>;
  updateTranscription: (segment: TranscriptionSegment) => void;
  updateSentiment: (sentiment: SentimentAnalysis) => void;
  callHistory: CallSession[];
}

const VoiceContext = createContext<VoiceContextType | undefined>(undefined);

export const useVoice = () => {
  const context = useContext(VoiceContext);
  if (!context) {
    throw new Error('useVoice must be used within a VoiceProvider');
  }
  return context;
};

interface VoiceProviderProps {
  children: ReactNode;
}

export const VoiceProvider: React.FC<VoiceProviderProps> = ({ children }) => {
  const [currentCall, setCurrentCall] = useState<CallSession | null>(null);
  const [callHistory, setCallHistory] = useState<CallSession[]>([]);

  const initiateCall = useCallback(async (context: VoiceCallContext) => {
    try {
      // Generate unique call ID
      const callId = `CALL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      const newCall: CallSession = {
        callId,
        sessionId: `SESSION-${Date.now()}`,
        status: 'initiating',
        startTime: new Date(),
        duration: 0,
        engineType: context.engineType,
        customerId: context.customer.id,
        customerName: context.customer.name,
        customerPhone: context.customer.phone,
        transcription: [],
        sentiment: {
          overall: 'neutral',
          score: 0,
          timeline: [],
          emotions: [],
        },
      };

      setCurrentCall(newCall);

      // Simulate call connection (in real implementation, this would call Twilio/Retell AI)
      setTimeout(() => {
        setCurrentCall(prev => prev ? { ...prev, status: 'ringing' } : null);
      }, 1000);

      setTimeout(() => {
        setCurrentCall(prev => prev ? { ...prev, status: 'active' } : null);
      }, 3000);

    } catch (error) {
      console.error('Failed to initiate call:', error);
      setCurrentCall(prev => prev ? { ...prev, status: 'failed' } : null);
    }
  }, []);

  const endCall = useCallback(async () => {
    if (!currentCall) return;

    const endedCall: CallSession = {
      ...currentCall,
      status: 'ended',
      endTime: new Date(),
      duration: Math.floor((new Date().getTime() - currentCall.startTime.getTime()) / 1000),
    };

    setCallHistory(prev => [endedCall, ...prev]);
    setCurrentCall(null);
  }, [currentCall]);

  const updateTranscription = useCallback((segment: TranscriptionSegment) => {
    setCurrentCall(prev => {
      if (!prev) return null;
      return {
        ...prev,
        transcription: [...prev.transcription, segment],
      };
    });
  }, []);

  const updateSentiment = useCallback((sentiment: SentimentAnalysis) => {
    setCurrentCall(prev => {
      if (!prev) return null;
      return {
        ...prev,
        sentiment,
      };
    });
  }, []);

  const isCallActive = currentCall?.status === 'active' || currentCall?.status === 'ringing';

  return (
    <VoiceContext.Provider
      value={{
        currentCall,
        isCallActive,
        initiateCall,
        endCall,
        updateTranscription,
        updateSentiment,
        callHistory,
      }}
    >
      {children}
    </VoiceContext.Provider>
  );
};
