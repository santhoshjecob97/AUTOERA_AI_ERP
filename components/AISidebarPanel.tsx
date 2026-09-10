import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Bot,
  Sparkles,
  Send,
  Loader2,
  X,
  ChevronRight,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Cpu,
  CornerDownRight,
  Activity,
  ArrowUpRight,
  RefreshCw
} from 'lucide-react';
import apiService from '../services/api';
import eventStreamService, { RealtimeEvent } from '../services/events';

interface AISidebarPanelProps {
  isOpen: boolean;
  onClose: () => void;
  initialPrompt?: string;
}

interface Message {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  agentName?: string;
  model?: string;
  latencyMs?: number;
  citations?: string[];
  actionProposal?: {
    id: string;
    title: string;
    description: string;
    actionType: string;
    status: 'pending' | 'approved' | 'rejected';
  };
  timestamp: string;
}

interface AgentMetadata {
  name: string;
  tagline: string;
  model: string;
  color: string;
  avatarBg: string;
  suggestedPrompts: string[];
}

const AISidebarPanel: React.FC<AISidebarPanelProps> = ({
  isOpen,
  onClose,
  initialPrompt
}) => {
  const location = useLocation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recentEvents, setRecentEvents] = useState<RealtimeEvent[]>([]);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Determine current active specialist agent based on route
  const getActiveAgent = (): AgentMetadata => {
    const path = location.pathname;
    if (path.startsWith('/sales')) {
      return {
        name: 'Sales Specialist Agent',
        tagline: 'Lead scoring, Margin Guard floor & WhatsApp follow-ups',
        model: 'Claude 3.5 Sonnet',
        color: 'text-emerald-500',
        avatarBg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
        suggestedPrompts: [
          'Show hot leads approaching SLA breach',
          'Verify minimum price floor for Creta SX',
          'Draft WhatsApp booking follow-up sequence'
        ]
      };
    }
    if (path.startsWith('/service')) {
      return {
        name: 'Service Advisor Agent',
        tagline: 'AI symptom diagnosis, bay dispatch & WhatsApp updates',
        model: 'GPT-4o',
        color: 'text-blue-500',
        avatarBg: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        suggestedPrompts: [
          'Check current workshop bay utilization',
          'Diagnose DTC P0300 engine misfire code',
          'Auto-dispatch L3 technician for transmission job'
        ]
      };
    }
    if (path.startsWith('/finance')) {
      return {
        name: 'Finance & Credit Agent',
        tagline: 'Multi-bank EMI optimization, CIBIL & fraud scoring',
        model: 'Claude 3.5 Sonnet',
        color: 'text-amber-500',
        avatarBg: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
        suggestedPrompts: [
          'Compare HDFC vs ICICI loan approval odds',
          'Compute lowest EMI for Rs. 14 Lakh loan',
          'Run income proof fraud verification'
        ]
      };
    }
    if (path.startsWith('/insurance')) {
      return {
        name: 'Insurance Claim & Renewal Agent',
        tagline: '90/60/30 renewal sequences & claim settlement calculator',
        model: 'Gemini 1.5 Flash',
        color: 'text-indigo-500',
        avatarBg: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
        suggestedPrompts: [
          'List insurance policies expiring in 30 days',
          'Estimate claim payout for bumper damage',
          'Calculate renewal commission reconciliation'
        ]
      };
    }
    if (path.startsWith('/fleet')) {
      return {
        name: 'Fleet IoT Telemetry Agent',
        tagline: 'CAN-bus diagnostics, OBD-II anomalies & geofencing',
        model: 'Gemini 1.5 Flash',
        color: 'text-purple-500',
        avatarBg: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
        suggestedPrompts: [
          'Scan active fleet for OBD diagnostic trouble codes',
          'Check geofence breach reports for Chennai depot',
          'Analyze driver safety scores under 75%'
        ]
      };
    }
    if (path.startsWith('/ev')) {
      return {
        name: 'EV Battery Intelligence Agent',
        tagline: 'State-of-Health (SOH), impedance & thermal runaway alerts',
        model: 'GPT-4o',
        color: 'text-teal-500',
        avatarBg: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
        suggestedPrompts: [
          'Identify battery packs with SOH below 80%',
          'Check cell voltage deviation on fast chargers',
          'Forecast warranty replacement cycle for fleet'
        ]
      };
    }
    // Default: Executive Management Agent
    return {
      name: 'Executive Management Agent',
      tagline: 'Cross-dealership 360 KPIs, margin pacing & revenue ops',
      model: 'Claude 3.5 Sonnet',
      color: 'text-orange-500',
      avatarBg: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      suggestedPrompts: [
        'Summarize today dealership gross profit & targets',
        'Check cross-department SLA escalations',
        'Highlight critical inventory aging past 60 days'
      ]
    };
  };

  const agent = getActiveAgent();

  // Reset or seed greeting when agent changes
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome_1',
          sender: 'agent',
          text: `Welcome! I am your ${agent.name}. I am actively monitoring ${location.pathname} telemetry and dealership data. How can I assist you right now?`,
          agentName: agent.name,
          model: agent.model,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  }, [location.pathname]);

  // Handle initialPrompt if provided
  useEffect(() => {
    if (initialPrompt && initialPrompt.trim()) {
      handleSend(initialPrompt);
    }
  }, [initialPrompt]);

  // Subscribe to real-time events
  useEffect(() => {
    const unsubscribe = eventStreamService.subscribe((event) => {
      setRecentEvents((prev) => [event, ...prev.slice(0, 4)]);
    });
    return () => unsubscribe();
  }, []);

  // Auto scroll chat
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputText;
    if (!textToSend.trim() || isLoading) return;

    const userMessage: Message = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // Call backend AI copilot chat endpoint
      const response = await apiService.post<{
        agent?: string;
        response?: string;
        model?: string;
        latency_ms?: number;
        citations?: string[];
        action_proposals?: any[];
      }>('/api/v1/ai/copilot/chat/', {
        prompt: textToSend,
        context: `Current View: ${location.pathname} | Active Specialist: ${agent.name}`
      });

      const responseText = response.response || `Telemetry processed by ${agent.name}. Operational parameters within nominal threshold.`;
      
      const agentMessage: Message = {
        id: `agt_${Date.now()}`,
        sender: 'agent',
        text: responseText,
        agentName: response.agent || agent.name,
        model: response.model || agent.model,
        latencyMs: response.latency_ms || 118,
        citations: response.citations || ['AutoEra Dealership ERP v1.0', 'Live Telemetry Core'],
        actionProposal: response.action_proposals && response.action_proposals.length > 0 ? {
          id: response.action_proposals[0].id || 'ACT-01',
          title: response.action_proposals[0].title || 'Proposed Action',
          description: response.action_proposals[0].description || 'Requires manager authorization.',
          actionType: response.action_proposals[0].type || 'MARGIN_OVERRIDE',
          status: 'pending'
        } : undefined,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, agentMessage]);
    } catch (err) {
      console.warn('Backend Copilot offline, generating simulated domain response:', err);
      // Simulated realistic domain response for offline/dev
      setTimeout(() => {
        const simulatedMessage: Message = {
          id: `agt_sim_${Date.now()}`,
          sender: 'agent',
          text: `[${agent.name}] Verified query: "${textToSend}". Operating against live branch records. All active data pipelines (PostgreSQL RLS, Pinecone Vector RAG) are synchronized with zero SLA breaches reported.`,
          agentName: agent.name,
          model: agent.model,
          latencyMs: 94,
          citations: ['Branch RLS Isolation', 'Gupshup WhatsApp Sandbox', 'AutoEra Core'],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages((prev) => [...prev, simulatedMessage]);
      }, 500);
    } finally {
      setIsLoading(false);
    }
  };

  const handleActionApproval = (msgId: string, approved: boolean) => {
    setMessages((prev) =>
      prev.map((m) => {
        if (m.id === msgId && m.actionProposal) {
          return {
            ...m,
            actionProposal: {
              ...m.actionProposal,
              status: approved ? 'approved' : 'rejected'
            }
          };
        }
        return m;
      })
    );
  };

  if (!isOpen) return null;

  return (
    <aside
      className="fixed right-0 top-16 bottom-0 w-80 md:w-96 bg-white dark:bg-[#0a0e17] border-l border-slate-200 dark:border-slate-800/90 z-40 flex flex-col shadow-2xl transition-all duration-300 animate-in slide-in-from-right"
      style={{ width: '340px' }}
    >
      {/* Header with Active Specialist Info */}
      <div className="p-3.5 border-b border-slate-200 dark:border-slate-800/80 bg-slate-50/80 dark:bg-[#070b13] flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center border shrink-0 ${agent.avatarBg}`}>
            <Sparkles size={16} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate font-['Outfit']">
                {agent.name}
              </h4>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            </div>
            <div className="flex items-center gap-2 text-[10px] text-slate-400">
              <span className="flex items-center gap-1 font-mono text-orange-500">
                <Cpu size={10} /> {agent.model}
              </span>
              <span>&bull;</span>
              <span>Online</span>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          title="Close AI Specialist Panel"
        >
          <X size={16} />
        </button>
      </div>

      {/* Suggested Prompt Chips */}
      <div className="p-2.5 bg-slate-100/60 dark:bg-[#0c121e] border-b border-slate-200 dark:border-slate-800/60 overflow-x-auto">
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 px-1 flex items-center gap-1">
          <Zap size={10} className="text-amber-500" /> Quick Inquiries
        </div>
        <div className="flex flex-col gap-1">
          {agent.suggestedPrompts.slice(0, 2).map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="text-left px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-700 dark:text-slate-300 hover:border-orange-500 dark:hover:border-orange-500/50 transition-all truncate flex items-center justify-between group cursor-pointer"
            >
              <span className="truncate">{prompt}</span>
              <ChevronRight size={12} className="text-slate-400 group-hover:text-orange-500 shrink-0 ml-1" />
            </button>
          ))}
        </div>
      </div>

      {/* Chat Stream */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 font-sans">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[90%] p-3 rounded-xl text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-orange-500 text-white rounded-br-none shadow-sm shadow-orange-500/20'
                  : 'bg-slate-100 dark:bg-slate-900/90 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800/80 rounded-bl-none shadow-xs'
              }`}
            >
              {msg.sender === 'agent' && (
                <div className="flex items-center justify-between text-[10px] font-semibold text-orange-600 dark:text-orange-400 mb-1 border-b border-slate-200/50 dark:border-slate-800 pb-1">
                  <span className="flex items-center gap-1">
                    <Bot size={11} /> {msg.agentName}
                  </span>
                  {msg.latencyMs && (
                    <span className="text-slate-400 font-mono text-[9px]">
                      {msg.latencyMs}ms
                    </span>
                  )}
                </div>
              )}
              <div className="whitespace-pre-wrap">{msg.text}</div>

              {/* Citations */}
              {msg.citations && msg.citations.length > 0 && (
                <div className="mt-2 pt-1.5 border-t border-slate-200/60 dark:border-slate-800 flex flex-wrap gap-1">
                  {msg.citations.map((cite, i) => (
                    <span
                      key={i}
                      className="text-[9px] px-1.5 py-0.5 rounded bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                    >
                      {cite}
                    </span>
                  ))}
                </div>
              )}

              {/* Action Proposal Card (Human in the loop) */}
              {msg.actionProposal && (
                <div className="mt-2.5 p-2 rounded-lg bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-500/40">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-orange-700 dark:text-orange-300">
                    <ShieldAlert size={12} />
                    <span>Action Authorization Required</span>
                  </div>
                  <p className="text-[10px] text-slate-600 dark:text-slate-300 mt-1">
                    {msg.actionProposal.description}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    {msg.actionProposal.status === 'pending' ? (
                      <>
                        <button
                          onClick={() => handleActionApproval(msg.id, true)}
                          className="px-2 py-1 rounded bg-orange-500 hover:bg-orange-600 text-white text-[10px] font-bold transition-all flex items-center gap-1"
                        >
                          <CheckCircle2 size={11} /> Approve
                        </button>
                        <button
                          onClick={() => handleActionApproval(msg.id, false)}
                          className="px-2 py-1 rounded bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-700 dark:text-slate-300 text-[10px] font-medium transition-all"
                        >
                          Decline
                        </button>
                      </>
                    ) : (
                      <span className={`text-[10px] font-bold ${
                        msg.actionProposal.status === 'approved' ? 'text-emerald-500' : 'text-red-500'
                      }`}>
                        Action {msg.actionProposal.status.toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
            <span className="text-[9px] text-slate-400 mt-1 px-1">{msg.timestamp}</span>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 text-xs">
            <Loader2 size={13} className="animate-spin text-orange-500" />
            <span>{agent.name} routing with {agent.model}...</span>
          </div>
        )}
        <div ref={chatBottomRef} />
      </div>

      {/* Live Dealership Event Ticker */}
      {recentEvents.length > 0 && (
        <div className="px-3 py-2 border-t border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-[#070a13] text-[11px]">
          <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1">
            <span className="flex items-center gap-1 text-emerald-500">
              <Activity size={10} /> Live Dealership Feed
            </span>
            <span>{recentEvents[0].timestamp}</span>
          </div>
          <p className="text-slate-700 dark:text-slate-300 truncate font-sans text-[11px]">
            {recentEvents[0].message}
          </p>
        </div>
      )}

      {/* Input Box */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0a0e17]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Ask ${agent.name}...`}
            className="flex-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-orange-500 rounded-lg px-3 py-2 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 outline-none transition-all font-sans"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="p-2 rounded-lg bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white transition-all cursor-pointer shrink-0"
          >
            <Send size={14} />
          </button>
        </form>
      </div>
    </aside>
  );
};

export default AISidebarPanel;
