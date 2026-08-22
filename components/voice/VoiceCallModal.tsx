import React, { useState, useEffect } from 'react';
import { X, Phone, PhoneOff, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { EngineType, VoiceCallContext, CallStatus, CallIntent } from '../../types/voice';
import { useVoice } from '../../context/VoiceContext';
import CallInitiator from './CallInitiator';
import LiveCallMonitor from './LiveCallMonitor';
import TranscriptionViewer from './TranscriptionViewer';
import SentimentDisplay from './SentimentDisplay';

interface VoiceCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  engineType: EngineType;
  contextData: any;
  customerId?: string;
  customerName: string;
  customerPhone: string;
}

const VoiceCallModal: React.FC<VoiceCallModalProps> = ({
  isOpen,
  onClose,
  engineType,
  contextData,
  customerId,
  customerName,
  customerPhone,
}) => {
  const { currentCall, initiateCall, endCall, isCallActive } = useVoice();
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [callStatus, setCallStatus] = useState<CallStatus>('idle');

  useEffect(() => {
    if (currentCall) {
      setCallStatus(currentCall.status);
    } else {
      setCallStatus('idle');
    }
  }, [currentCall]);

  const handleInitiateCall = async (phoneNumber: string, purpose: string, intent: CallIntent) => {
    const callContext: VoiceCallContext = {
      engineType,
      customer: {
        id: customerId,
        name: customerName,
        phone: phoneNumber,
      },
      context: {
        ...contextData,
        callPurpose: purpose,
      },
      intents: [intent],
    };

    await initiateCall(callContext);
  };

  const handleEndCall = async () => {
    await endCall();
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleSpeaker = () => {
    setIsSpeakerOn(!isSpeakerOn);
  };

  const getEngineColor = () => {
    switch (engineType) {
      case 'service':
        return 'orange';
      case 'sales':
        return 'blue';
      case 'finance':
        return 'emerald';
      case 'insurance':
        return 'rose';
      case 'workforce':
        return 'purple';
      case 'fleet':
        return 'green';
      default:
        return 'blue';
    }
  };

  const getEngineLabel = () => {
    return engineType.charAt(0).toUpperCase() + engineType.slice(1);
  };

  if (!isOpen) return null;

  const color = getEngineColor();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className={`bg-gradient-to-r from-${color}-600 to-${color}-700 p-6 text-white`}>
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Phone size={24} />
                <h2 className="text-2xl font-bold">{getEngineLabel()} Voice AI</h2>
              </div>
              <p className="text-${color}-100 text-sm">Intelligent voice assistant powered by AI</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
              aria-label="Close modal"
            >
              <X size={24} />
            </button>
          </div>

          {/* Customer Info */}
          <div className="mt-4 bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-${color}-100">Calling</p>
                <p className="text-lg font-semibold">{customerName}</p>
                <p className="text-sm text-${color}-200">{customerPhone}</p>
              </div>
              <div className={`px-4 py-2 rounded-full text-sm font-semibold ${
                callStatus === 'active' ? 'bg-green-500' :
                callStatus === 'ringing' ? 'bg-yellow-500 animate-pulse' :
                callStatus === 'initiating' ? 'bg-blue-500 animate-pulse' :
                callStatus === 'ended' ? 'bg-slate-500' :
                'bg-slate-400'
              }`}>
                {callStatus === 'active' ? 'Connected' :
                 callStatus === 'ringing' ? 'Ringing...' :
                 callStatus === 'initiating' ? 'Connecting...' :
                 callStatus === 'ended' ? 'Call Ended' :
                 'Ready'}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {callStatus === 'idle' && (
            <CallInitiator
              engineType={engineType}
              customerName={customerName}
              customerPhone={customerPhone}
              contextData={contextData}
              onInitiateCall={handleInitiateCall}
            />
          )}

          {(callStatus === 'initiating' || callStatus === 'ringing' || callStatus === 'active') && (
            <>
              {/* Live Call Monitor */}
              {currentCall && <LiveCallMonitor call={currentCall} />}

              {/* Transcription and Sentiment */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  {currentCall && <TranscriptionViewer transcription={currentCall.transcription} />}
                </div>
                <div>
                  {currentCall && <SentimentDisplay sentiment={currentCall.sentiment} />}
                </div>
              </div>
            </>
          )}

          {callStatus === 'ended' && (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <PhoneOff size={48} className="text-slate-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Call Ended</h3>
              <p className="text-slate-600 mb-6">
                The call with {customerName} has ended
              </p>
            </div>
          )}
        </div>

        {/* Footer - Call Controls */}
        {isCallActive && (
          <div className="border-t border-slate-200 p-6 bg-slate-50">
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={toggleMute}
                className={`p-4 rounded-full transition-all duration-200 ${
                  isMuted
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border-2 border-slate-300'
                }`}
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
              </button>

              <button
                onClick={handleEndCall}
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-3"
              >
                <PhoneOff size={24} />
                End Call
              </button>

              <button
                onClick={toggleSpeaker}
                className={`p-4 rounded-full transition-all duration-200 ${
                  isSpeakerOn
                    ? 'bg-${color}-600 hover:bg-${color}-700 text-white'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border-2 border-slate-300'
                }`}
                title={isSpeakerOn ? 'Speaker On' : 'Speaker Off'}
              >
                {isSpeakerOn ? <Volume2 size={24} /> : <VolumeX size={24} />}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceCallModal;
