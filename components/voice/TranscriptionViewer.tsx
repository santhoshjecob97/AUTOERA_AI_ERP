import React, { useRef, useEffect } from 'react';
import { MessageSquare } from 'lucide-react';
import { TranscriptionSegment } from '../../types/voice';

interface TranscriptionViewerProps {
  transcription: TranscriptionSegment[];
}

const TranscriptionViewer: React.FC<TranscriptionViewerProps> = ({ transcription }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcription]);

  const formatTimestamp = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-slate-200 bg-slate-50">
        <h3 className="font-bold text-slate-900 flex items-center gap-2">
          <MessageSquare size={20} className="text-blue-600" />
          Live Transcription
        </h3>
      </div>

      <div ref={scrollRef} className="p-4 space-y-3 max-h-96 overflow-y-auto">
        {transcription.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <MessageSquare size={48} className="mx-auto mb-2 opacity-50" />
            <p>Transcription will appear here during the call...</p>
          </div>
        ) : (
          transcription.map((segment, index) => (
            <div
              key={index}
              className={`flex ${segment.speaker === 'agent' ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  segment.speaker === 'agent'
                    ? 'bg-blue-50 border border-blue-200'
                    : 'bg-slate-100 border border-slate-200'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-semibold ${
                    segment.speaker === 'agent' ? 'text-blue-700' : 'text-slate-700'
                  }`}>
                    {segment.speaker === 'agent' ? 'AI Agent' : 'Customer'}
                  </span>
                  <span className="text-xs text-slate-500">
                    {formatTimestamp(segment.timestamp)}
                  </span>
                  <span className="text-xs text-slate-400">
                    {Math.round(segment.confidence * 100)}%
                  </span>
                </div>
                <p className="text-sm text-slate-900">{segment.text}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TranscriptionViewer;
