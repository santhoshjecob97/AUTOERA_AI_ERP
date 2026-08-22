import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, Sparkles, Loader2 } from 'lucide-react';
import { generateAIInsight } from '../services/geminiService';

interface AIChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  context: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const AIChatModal: React.FC<AIChatModalProps> = ({ isOpen, onClose, context }) => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: `Hello! I am AUTOERA AI. I see you are viewing the ${context} dashboard. How can I assist you with data analysis or predictions today?` }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 1) {
       setMessages([{ role: 'assistant', content: `Hello! I am AUTOERA AI. I see you are viewing the ${context}. How can I assist you?` }]);
    }
  }, [context, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userMsg = query;
    setQuery('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    const response = await generateAIInsight(context, userMsg);

    setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    setIsLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl flex flex-col max-h-[80vh] overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-indigo-600 text-white">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-white/20 rounded-lg">
              <Bot size={20} />
            </div>
            <div>
              <h3 className="font-semibold">AUTOERA Assistant</h3>
              <p className="text-xs text-indigo-100 opacity-90">Powered by Gemini 2.5</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-br-none' 
                  : 'bg-white text-slate-700 shadow-sm border border-slate-100 rounded-bl-none'
              }`}>
                {msg.role === 'assistant' && (
                  <div className="flex items-center gap-1.5 mb-1 text-xs font-semibold text-indigo-600">
                    <Sparkles size={12} />
                    AI Insight
                  </div>
                )}
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
               <div className="bg-white p-4 rounded-2xl rounded-bl-none shadow-sm border border-slate-100 flex items-center gap-2">
                 <Loader2 size={16} className="animate-spin text-indigo-600" />
                 <span className="text-sm text-slate-500">Processing with 6 AI Engines...</span>
               </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-slate-100">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask about leads, inventory, or revenue..."
              className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm"
            />
            <button 
              type="submit" 
              disabled={isLoading || !query.trim()}
              className="absolute right-2 top-2 p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-colors"
            >
              <Send size={16} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AIChatModal;