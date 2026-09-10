import React, { useState } from 'react';
import {
  Bot, Sparkles, Send, RefreshCw, Cpu, Database, Network,
  Volume2, CheckCircle2, AlertTriangle, ShieldCheck, Layers,
  PhoneCall, Terminal, ArrowRight, BookOpen, Clock, Activity,
  ChevronRight, Mic, PhoneForwarded, Hash, Search, Zap
} from 'lucide-react';

export const Section11AIOSWorkspace: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'AGENTS_NETWORK' | 'RAG_STUDIO' | 'KNOWLEDGE_GRAPH' | 'MODEL_STACK' | 'VOICE_AI'
  >('AGENTS_NETWORK');

  // -------------------------------------------------------------
  // Feature 1: Multi-Agent Network State
  // -------------------------------------------------------------
  const [selectedAgent, setSelectedAgent] = useState<string>('Supervisor Agent');
  const [agentPrompt, setAgentPrompt] = useState<string>('Customer asking for 50,000 km EV service quote and battery health status');
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [agentResponse, setAgentResponse] = useState<any>(null);

  const agentsRoster = [
    {
      name: 'Supervisor Agent',
      role: 'Receives all input, classifies intent, routes to correct agent, manages multi-turn context',
      primaryLlm: 'GPT-4o',
      fallbackLlm: 'Claude Sonnet 4',
      tier: 'REASONING',
      tools: 'All Agent APIs, Customer Knowledge Graph, Intent Classifier',
      training: 'All dealer interaction transcripts & supervisor routing patterns',
      status: 'ONLINE',
      color: 'from-cyan-500 to-blue-600',
      badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30'
    },
    {
      name: 'Sales Agent',
      role: 'Lead qualification, follow-up message generation, objection handling, test drive scheduling',
      primaryLlm: 'GPT-4o',
      fallbackLlm: 'Claude Sonnet 4',
      tier: 'REASONING',
      tools: 'CRM API, Inventory, WhatsApp Business API, Calendar, Margin Guard',
      training: 'Historical lead conversations, conversion outcomes, objection handling corpus',
      status: 'ONLINE',
      color: 'from-blue-500 to-indigo-600',
      badgeColor: 'text-blue-400 bg-blue-500/10 border-blue-500/30'
    },
    {
      name: 'CRM Agent',
      role: 'Customer retention campaigns, re-engagement, lifecycle management, satisfaction follow-up',
      primaryLlm: 'Gemini 1.5 Flash',
      fallbackLlm: 'DeepSeek V3',
      tier: 'FAST',
      tools: 'CRM API, Campaign Engine, WhatsApp Business API, Analytics BI',
      training: 'Campaign performance, churn prediction history, lifecycle feedback pairs',
      status: 'ONLINE',
      color: 'from-purple-500 to-pink-600',
      badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/30'
    },
    {
      name: 'Service Agent',
      role: 'Appointment booking, job card assist, repair status, estimates, upsell — 24/7 Tamil/English',
      primaryLlm: 'Claude Sonnet 4',
      fallbackLlm: 'GPT-4o',
      tier: 'REASONING',
      tools: 'Job Card API, Parts Catalog, Workshop Bay Dispatch, Vehicle History RAG',
      training: 'Workshop service records, complaint-to-diagnosis pairs, bilingual Tamil/English transcripts',
      status: 'ONLINE',
      color: 'from-emerald-500 to-teal-600',
      badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
    },
    {
      name: 'Insurance Agent',
      role: 'Renewal reminders (90/60/30 day), claim assistance, quote comparison, policy queries',
      primaryLlm: 'Gemini 1.5 Flash',
      fallbackLlm: 'DeepSeek V3',
      tier: 'FAST',
      tools: 'Policy API, Insurer API Gateway, WhatsApp Business API, Claim Survey API',
      training: 'Renewal lapse patterns, claim outcomes, surveyor reports, policy clauses',
      status: 'ONLINE',
      color: 'from-amber-500 to-orange-600',
      badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30'
    },
    {
      name: 'Finance Agent',
      role: 'Loan eligibility pre-screening, document collection guidance, bank comparison, application status',
      primaryLlm: 'Claude Sonnet 4',
      fallbackLlm: 'GPT-4o',
      tier: 'REASONING',
      tools: 'DigiLocker API, Bank APIs (10+ Banks), CRM, WhatsApp Business API',
      training: 'Loan approval patterns, bureau credit scoring, document completeness OCR',
      status: 'ONLINE',
      color: 'from-teal-500 to-emerald-600',
      badgeColor: 'text-teal-400 bg-teal-500/10 border-teal-500/30'
    },
    {
      name: 'Fleet Agent',
      role: 'Predictive alerts, driver behaviour coaching, maintenance scheduling, route recommendations',
      primaryLlm: 'Custom LSTM + GPT-4o',
      fallbackLlm: 'Prophet + Claude',
      tier: 'REASONING',
      tools: 'OBD-II Telemetry API, GPS Geofence, Maintenance Calendar, WhatsApp',
      training: 'Fleet IoT telematics (2,880 pts/day), breakdown history, driver telemetry scoring',
      status: 'ONLINE',
      color: 'from-sky-500 to-blue-600',
      badgeColor: 'text-sky-400 bg-sky-500/10 border-sky-500/30'
    },
    {
      name: 'EV Agent',
      role: 'Battery health advisory, range guidance, charging optimisation, replacement planning',
      primaryLlm: 'Custom BMS model + GPT-4o',
      fallbackLlm: 'Claude Sonnet 4',
      tier: 'REASONING',
      tools: 'BMS API Connectors, Charging Session API, Maps API, WhatsApp Business API',
      training: 'BMS cell-level telemetry, Weibull degradation curves, Time-of-Use charging patterns',
      status: 'ONLINE',
      color: 'from-cyan-400 to-teal-500',
      badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30'
    },
    {
      name: 'Customer Support Agent',
      role: 'General queries, complaint capture, escalation, FAQ, document requests',
      primaryLlm: 'Claude Sonnet 4',
      fallbackLlm: 'GPT-4o',
      tier: 'REASONING',
      tools: 'All Platform APIs, WhatsApp Business API, Email Gateway, Helpdesk Sync',
      training: 'Support ticket history, FAQ pairs, escalation matrices, grievance resolution logs',
      status: 'ONLINE',
      color: 'from-rose-500 to-pink-600',
      badgeColor: 'text-rose-400 bg-rose-500/10 border-rose-500/30'
    },
    {
      name: 'Analytics & Executive Agent',
      role: 'Daily DP brief, BI queries, anomaly explanation, forecast narrative, benchmark',
      primaryLlm: 'GPT-4o (complex reasoning)',
      fallbackLlm: 'Claude Sonnet 4',
      tier: 'REASONING',
      tools: 'All Analytics APIs, Benchmark DB, Executive Report Generator, DHI Engine',
      training: 'Dealer financial metrics, industry benchmarks, multi-branch performance history',
      status: 'ONLINE',
      color: 'from-violet-500 to-purple-700',
      badgeColor: 'text-violet-400 bg-violet-500/10 border-violet-500/30'
    }
  ];

  const handleExecuteAgent = () => {
    setIsExecuting(true);
    setTimeout(() => {
      setIsExecuting(false);
      setAgentResponse({
        routedAgent: selectedAgent,
        model: selectedAgent === 'CRM Agent' || selectedAgent === 'Insurance Agent' ? 'Gemini 1.5 Flash' : (selectedAgent === 'Service Agent' || selectedAgent === 'Finance Agent' ? 'Claude Sonnet 4' : 'GPT-4o'),
        tokens: 342,
        latencyMs: 480,
        answer: `AutoEra ${selectedAgent}: Successfully analyzed the inquiry with full grounded ERP and Knowledge Graph context. Service estimate generated for 50,000 km inspection (INR 4,850). Battery health logged at 92.5% SOH (Nominal). WhatsApp digital card dispatched.`,
        citations: [
          'OEM Technical Service Manual v4.2 (Section: Periodic High-Voltage EV Inspection)',
          'Dealership Standard Labour Rate Card 2026'
        ]
      });
    }, 800);
  };

  // -------------------------------------------------------------
  // Feature 2: RAG Pipeline Studio State
  // -------------------------------------------------------------
  const [ragQuery, setRagQuery] = useState<string>('What is the factory warranty coverage on high-voltage EV battery packs?');
  const [ragExecuting, setRagExecuting] = useState<boolean>(false);
  const [ragResult, setRagResult] = useState<any>(null);

  const handleRunRAG = () => {
    setRagExecuting(true);
    setTimeout(() => {
      setRagExecuting(false);
      setRagResult({
        query: ragQuery,
        embeddingModel: 'text-embedding-3-large (3072 dimensions)',
        top20Candidates: 20,
        top5Reranked: 5,
        reranker: 'Cohere Rerank v3',
        groundedPassages: [
          {
            title: 'OEM EV High-Voltage Pack Warranty Guidelines v3.1',
            section: 'Battery Degradation Threshold',
            score: 0.942,
            text: 'The high-voltage lithium battery pack is covered for 8 Years or 160,000 km, whichever occurs earlier. If the State of Health (SOH) degrades below 70.0%, customer is entitled to free factory module replacement under warranty terms.'
          },
          {
            title: 'Standard Dealership Warranty & Service SOP',
            section: 'Warranty Claim Authorization',
            score: 0.885,
            text: 'Claims exceeding ₹50,000 require OEM Area Service Manager (ASM) digital countersignature via AutoEra Warranty Portal within 48 hours of job card generation.'
          }
        ]
      });
    }, 700);
  };

  // -------------------------------------------------------------
  // Feature 3: Customer Knowledge Graph State
  // -------------------------------------------------------------
  const [graphCustomerPhone, setGraphCustomerPhone] = useState<string>('9840123456');

  // -------------------------------------------------------------
  // Feature 4: Model Stack Decision Matrix State
  // -------------------------------------------------------------
  const decisionMatrix = [
    { useCase: 'Complex Reasoning (Diagnosis, Objections)', primary: 'Claude Sonnet 4', fallback: 'GPT-4o', latency: '1200 ms', cost: '₹240 / M' },
    { useCase: 'High-Volume Simple (Renewals, Status)', primary: 'Gemini 1.5 Flash', fallback: 'DeepSeek V3', latency: '350 ms', cost: '₹6 / M' },
    { useCase: 'Vision Tasks (Damage OCR, Estimating)', primary: 'GPT-4o Vision', fallback: 'Gemini 1.5 Pro Vision', latency: '1800 ms', cost: '₹200 / M' },
    { useCase: 'Time-Series (Predictive Maint, Demand)', primary: 'Custom LSTM (self-hosted)', fallback: 'Prophet (Facebook)', latency: '80 ms', cost: '₹0 / M' },
    { useCase: 'NLP Classification (Intent, Entity)', primary: 'Fine-tuned BERT-Tamil', fallback: 'GPT-4o mini', latency: '150 ms', cost: '₹12 / M' },
    { useCase: 'Voice AI (Outbound Calls, Tamil Speech)', primary: 'Sarvam AI (Indian languages)', fallback: 'Whisper + Claude', latency: '450 ms', cost: '₹180 / M' },
    { useCase: 'Batch Document Processing (Bulk OCR)', primary: 'DeepSeek V3', fallback: 'Llama 3.1 (self-hosted)', latency: '900 ms', cost: '₹18 / M' },
    { useCase: 'Code Generation (BI Reports, Scripts)', primary: 'Claude Sonnet 4', fallback: 'GPT-4o', latency: '1400 ms', cost: '₹240 / M' }
  ];

  // -------------------------------------------------------------
  // Feature 5: Voice AI Telephony Simulation State
  // -------------------------------------------------------------
  const [voiceLang, setVoiceLang] = useState<'ta-IN' | 'en-IN'>('ta-IN');
  const [voiceScenario, setVoiceScenario] = useState<string>('SERVICE_REMINDER');
  const [isCalling, setIsCalling] = useState<boolean>(false);

  return (
    <div className="space-y-6 pt-4">
      {/* Top Header & Navigation Banner */}
      <div className="bg-[#0D1117] border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-purple-500/10 via-cyan-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold uppercase tracking-wider mb-2">
              <Bot size={13} className="text-purple-400" />
              Section 11 &bull; Master Architecture 2026
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-['Outfit'] flex items-center gap-3">
              AI Layer &mdash; AI Operating System (AI-OS)
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-3xl">
              Supervisor Agent orchestrating 9 specialist sub-agents with domain RAG, Pinecone/Qdrant vector stores, Customer Knowledge Graph, and Sarvam AI Indian language voice orchestration.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-mono flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              10 Agents Active
            </span>
            <span className="px-3.5 py-1.5 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-bold">
              Multi-Agent Mesh
            </span>
          </div>
        </div>

        {/* Sub-Tabs */}
        <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-slate-800/80">
          {[
            { id: 'AGENTS_NETWORK', label: '1. Multi-Agent Network (10 Agents)', icon: Bot },
            { id: 'RAG_STUDIO', label: '2. RAG Pipeline & Vector Stores', icon: Database },
            { id: 'KNOWLEDGE_GRAPH', label: '3. Customer Knowledge Graph', icon: Network },
            { id: 'MODEL_STACK', label: '4. AI Model Stack Decision Matrix', icon: Cpu },
            { id: 'VOICE_AI', label: '5. Bilingual Voice AI (Sarvam)', icon: Volume2 }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon size={14} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: MULTI-AGENT NETWORK (10 SPECIALIST AGENTS) */}
      {/* ========================================================= */}
      {activeTab === 'AGENTS_NETWORK' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
            {agentsRoster.map((agent) => {
              const isSelected = selectedAgent === agent.name;
              return (
                <div
                  key={agent.name}
                  onClick={() => setSelectedAgent(agent.name)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-slate-800 border-purple-500/80 shadow-xl ring-1 ring-purple-500/40'
                      : 'bg-[#0D1117] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-start">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold border ${agent.badgeColor}`}>
                        {agent.primaryLlm}
                      </span>
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    </div>

                    <h4 className="text-sm font-bold text-white mt-2 font-['Outfit']">{agent.name}</h4>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">{agent.role}</p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex justify-between items-center text-[10px] text-slate-400">
                    <span>Tier: <strong className="text-slate-200">{agent.tier}</strong></span>
                    <span className="text-purple-400 font-bold">{isSelected ? 'Active Console' : 'Select'} &rarr;</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Interactive Agent Console */}
          <div className="bg-[#0D1117] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <Terminal size={18} className="text-purple-400" />
                <h3 className="text-sm font-bold text-white font-['Outfit']">
                  Interactive Agent Console &bull; {selectedAgent}
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                Primary Model: <strong className="text-purple-300">
                  {agentsRoster.find(a => a.name === selectedAgent)?.primaryLlm}
                </strong>
              </span>
            </div>

            {/* Quick Prompt Chips */}
            <div className="flex flex-wrap gap-2">
              {[
                'EV battery degradation curve & 70% threshold',
                'HDFC vs ICICI loan eligibility pre-screening',
                'Send 30-day insurance renewal notice with NCB savings',
                'Diagnose intermittent shudder in dual-clutch gearbox',
                'Daily Dealer Principal KPI & workshop utilization brief'
              ].map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => setAgentPrompt(chip)}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-400 hover:text-white hover:border-slate-700 transition-all"
                >
                  {chip}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <input
                type="text"
                value={agentPrompt}
                onChange={(e) => setAgentPrompt(e.target.value)}
                placeholder="Ask any question across Sales, Service, EV, Fleet, Insurance, or Finance..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
              <button
                onClick={handleExecuteAgent}
                disabled={isExecuting}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {isExecuting ? <RefreshCw size={14} className="animate-spin" /> : <Send size={14} />}
                Dispatch Query
              </button>
            </div>

            {agentResponse && (
              <div className="mt-4 p-5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3 animate-in fade-in">
                <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-800">
                  <span className="font-bold text-purple-400 flex items-center gap-2">
                    <Sparkles size={14} /> Output from {agentResponse.routedAgent} ({agentResponse.model})
                  </span>
                  <div className="flex gap-3 text-slate-400 font-mono text-[11px]">
                    <span>Tokens: {agentResponse.tokens}</span>
                    <span>Latency: {agentResponse.latencyMs} ms</span>
                  </div>
                </div>

                <p className="text-xs text-slate-200 leading-relaxed">{agentResponse.answer}</p>

                {agentResponse.citations && (
                  <div className="pt-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Grounded Citations:
                    </span>
                    <ul className="space-y-1 text-[11px] text-cyan-400">
                      {agentResponse.citations.map((c: string, i: number) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <CheckCircle2 size={12} className="text-emerald-400 shrink-0" />
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: RAG PIPELINE & VECTOR STORES */}
      {/* ========================================================= */}
      {activeTab === 'RAG_STUDIO' && (
        <div className="bg-[#0D1117] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
          <div className="pb-4 border-b border-slate-800">
            <h3 className="text-lg font-bold text-white font-['Outfit'] flex items-center gap-2">
              <Database size={20} className="text-cyan-400" />
              RAG Architecture &amp; Hybrid Vector Retrieval Studio
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Dual embeddings (text-embedding-3-large 3072-dim), Pinecone real-time RAG, Qdrant archive search, and Cohere Rerank v3 cross-encoder scoring.
            </p>
          </div>

          {/* 6-Step Visual Workflow */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-2">
            {[
              { step: 'Step 1', title: 'User Query', desc: 'Semantic extraction', icon: Search },
              { step: 'Step 2', title: 'Embed (3072d)', desc: 'text-embedding-3-large', icon: Cpu },
              { step: 'Step 3', title: 'Hybrid Search', desc: 'Dense + BM25 (Top-20)', icon: Layers },
              { step: 'Step 4', title: 'Cohere Rerank', desc: 'Cross-encoder (Top-5)', icon: Zap },
              { step: 'Step 5', title: 'Context Assembly', desc: 'Citation injection', icon: BookOpen },
              { step: 'Step 6', title: 'LLM Synthesis', desc: 'Claude 4 / GPT-4o', icon: Sparkles }
            ].map((st, i) => {
              const Icon = st.icon;
              return (
                <div key={i} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-center relative">
                  <span className="text-[10px] font-mono text-cyan-400 font-bold">{st.step}</span>
                  <div className="my-2 flex justify-center text-slate-300">
                    <Icon size={20} />
                  </div>
                  <p className="text-xs font-bold text-white">{st.title}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{st.desc}</p>
                </div>
              );
            })}
          </div>

          {/* RAG Query Sandbox */}
          <div className="p-5 rounded-xl bg-slate-900/50 border border-slate-800 space-y-4">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Execute Full RAG Retrieval Pipeline
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={ragQuery}
                onChange={(e) => setRagQuery(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500"
              />
              <button
                onClick={handleRunRAG}
                disabled={ragExecuting}
                className="px-5 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg transition-all flex items-center gap-2"
              >
                {ragExecuting ? <RefreshCw size={14} className="animate-spin" /> : <Search size={14} />}
                Run Pipeline
              </button>
            </div>

            {ragResult && (
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-800">
                  <span className="text-cyan-400 font-bold">RAG Retrieval Output (Top-5 Grounded Passages)</span>
                  <span className="text-slate-400 font-mono text-[11px]">Re-ranked via Cohere Rerank v3</span>
                </div>

                <div className="space-y-2.5">
                  {ragResult.groundedPassages.map((p: any, i: number) => (
                    <div key={i} className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                      <div className="flex justify-between items-center text-cyan-300 font-bold">
                        <span>{p.title} &bull; Section: {p.section}</span>
                        <span className="text-[10px] text-emerald-400 font-mono">Relevance: {(p.score * 100).toFixed(1)}%</span>
                      </div>
                      <p className="text-slate-300 mt-1.5 leading-relaxed">{p.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: CUSTOMER KNOWLEDGE GRAPH */}
      {/* ========================================================= */}
      {activeTab === 'KNOWLEDGE_GRAPH' && (
        <div className="bg-[#0D1117] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
          <div className="pb-4 border-b border-slate-800">
            <h3 className="text-lg font-bold text-white font-['Outfit'] flex items-center gap-2">
              <Network size={20} className="text-purple-400" />
              Customer Knowledge Graph Engine (Customer 360)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Traverses relational graphs linking Customers, Vehicles, Policies, Loans, Invoices, Job Cards, and Telemetry Alerts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 uppercase font-bold">Graph Nodes</span>
              <p className="text-3xl font-black text-white font-['Outfit'] mt-1">5 Entities</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Customer, Vehicle, Policy, JobCard, Lead</p>
            </div>
            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 uppercase font-bold">Relational Edges</span>
              <p className="text-3xl font-black text-purple-400 font-['Outfit'] mt-1">4 Active Edges</p>
              <p className="text-[11px] text-slate-500 mt-0.5">OWNS, INSURED_UNDER, SERVICED_BY</p>
            </div>
            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 uppercase font-bold">Lifetime Service Value</span>
              <p className="text-3xl font-black text-emerald-400 font-['Outfit'] mt-1">₹48,500</p>
              <p className="text-[11px] text-slate-500 mt-0.5">8 Workshop Visits</p>
            </div>
            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 uppercase font-bold">Churn Probability</span>
              <p className="text-3xl font-black text-cyan-400 font-['Outfit'] mt-1">14.2%</p>
              <p className="text-[11px] text-emerald-400 font-semibold mt-0.5">Low Churn Risk &bull; Advocate</p>
            </div>
          </div>

          {/* Visual Graph Nodes */}
          <div className="p-6 rounded-xl bg-slate-950 border border-slate-800 relative overflow-hidden flex flex-col items-center">
            <div className="w-full max-w-2xl space-y-4 text-xs">
              {/* Customer Node */}
              <div className="p-3.5 rounded-xl bg-purple-500/20 border border-purple-500/50 text-center font-bold text-white shadow-lg">
                👤 Customer Node: Rajesh Sundaram (+91-9840123456) &bull; VIP Retail Tier
              </div>

              <div className="flex justify-center text-purple-400 font-mono text-[10px]">&darr; OWNS (1 Active EV) &darr;</div>

              {/* Vehicle Node */}
              <div className="p-3.5 rounded-xl bg-cyan-500/20 border border-cyan-500/50 text-center font-bold text-white shadow-lg">
                🚗 Vehicle Node: Tata Nexon EV Max (TN-09-EV-8421) &bull; 92.5% SOH
              </div>

              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
                  <span className="text-slate-400 block text-[10px]">INSURED_UNDER</span>
                  <p className="font-bold text-amber-400 mt-1">HDFC ERGO</p>
                  <span className="text-[10px] text-slate-500">Exp: 42 Days</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
                  <span className="text-slate-400 block text-[10px]">SERVICED_BY</span>
                  <p className="font-bold text-emerald-400 mt-1">Job Card #8812</p>
                  <span className="text-[10px] text-slate-500">NPS: 10/10</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
                  <span className="text-slate-400 block text-[10px]">INQUIRED_FOR</span>
                  <p className="font-bold text-blue-400 mt-1">Tata Curvv EV</p>
                  <span className="text-[10px] text-slate-500">Score: 88/100</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: AI MODEL STACK DECISION MATRIX */}
      {/* ========================================================= */}
      {activeTab === 'MODEL_STACK' && (
        <div className="bg-[#0D1117] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
          <div className="pb-4 border-b border-slate-800">
            <h3 className="text-lg font-bold text-white font-['Outfit'] flex items-center gap-2">
              <Cpu size={20} className="text-purple-400" />
              AI Model Stack &mdash; Decision Matrix (8 Automotive Use Cases)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Task-specific model assignment balancing latency, accuracy, token cost, and fallback redundancy.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/80 text-slate-400 uppercase text-[10px] font-bold">
                <tr>
                  <th className="p-3">Automotive Use Case</th>
                  <th className="p-3">Primary Model</th>
                  <th className="p-3">Fallback Model</th>
                  <th className="p-3">Target Latency</th>
                  <th className="p-3">Cost / M Tokens</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {decisionMatrix.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-900/40 transition-colors">
                    <td className="p-3 font-bold text-white">{row.useCase}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[11px] font-extrabold bg-purple-500/10 border border-purple-500/30 text-purple-300">
                        {row.primary}
                      </span>
                    </td>
                    <td className="p-3 text-slate-400 font-mono">{row.fallback}</td>
                    <td className="p-3 font-mono text-cyan-400">{row.latency}</td>
                    <td className="p-3 font-mono text-emerald-400 font-bold">{row.cost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 5: BILINGUAL VOICE AI (SARVAM AI) */}
      {/* ========================================================= */}
      {activeTab === 'VOICE_AI' && (
        <div className="bg-[#0D1117] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
          <div className="pb-4 border-b border-slate-800">
            <h3 className="text-lg font-bold text-white font-['Outfit'] flex items-center gap-2">
              <Volume2 size={20} className="text-emerald-400" />
              Voice AI Telephony &mdash; Sarvam AI Indian Languages
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Sub-500ms ASR/TTS conversational agent for outbound customer service reminders and inbound inquiries in Tamil &amp; English.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4 bg-slate-900/60 p-5 rounded-xl border border-slate-800">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Telephony Call Simulator</h4>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Language Mode</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setVoiceLang('ta-IN')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      voiceLang === 'ta-IN'
                        ? 'bg-purple-500/20 border-purple-500/60 text-white font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <p className="text-xs">Tamil (தமிழ்)</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Sarvam AI Tamil ASR/TTS</p>
                  </button>

                  <button
                    onClick={() => setVoiceLang('en-IN')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      voiceLang === 'en-IN'
                        ? 'bg-purple-500/20 border-purple-500/60 text-white font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <p className="text-xs">Indian English</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Natural Indian inflection</p>
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Outbound Campaign Scenario</label>
                <select
                  value={voiceScenario}
                  onChange={(e) => setVoiceScenario(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                >
                  <option value="SERVICE_REMINDER">Periodic Service Due Reminder (30k km)</option>
                  <option value="INSURANCE_RENEWAL">Insurance 30-Day Renewal with NCB Subsidy</option>
                  <option value="EV_RANGE_ANXIETY">EV Battery Low SOC Critical Alert</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div>
                  <span className="text-slate-400">ASR Confidence:</span>
                  <p className="font-bold text-emerald-400 font-mono mt-0.5">96.5%</p>
                </div>
                <div>
                  <span className="text-slate-400">TTS Audio Latency:</span>
                  <p className="font-bold text-cyan-400 font-mono mt-0.5">320 ms</p>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsCalling(true);
                  setTimeout(() => setIsCalling(false), 3000);
                }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <PhoneCall size={14} />
                {isCalling ? 'Call Connected (Speaking...)' : 'Initiate Outbound Call'}
              </button>
            </div>

            {/* Conversation Transcripts Box */}
            <div className="p-5 rounded-xl bg-[#0B141A] border border-slate-800 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex justify-between items-center pb-2 border-b border-slate-800 text-xs">
                  <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                    <Mic size={14} /> Live Telephony Audio Stream ({voiceLang})
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">Sample Rate: 16 kHz</span>
                </div>

                <div className="mt-4 space-y-3">
                  {voiceLang === 'ta-IN' ? (
                    <>
                      <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
                        <span className="text-[10px] font-bold text-purple-400 uppercase">AI Specialist:</span>
                        <p className="text-white mt-1">வணக்கம் சுந்தரம் அவர்களே! AutoEra மோட்டார்ஸ் சர்வீஸ் மையத்திலிருந்து அழைக்கிறோம்.</p>
                        <p className="text-[10px] text-slate-400 mt-0.5 italic font-mono">Vanakkam Sundaram avargale! AutoEra Motors service center-ilirundhu azhaikirom.</p>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800 text-xs">
                        <span className="text-[10px] font-bold text-cyan-400 uppercase">Customer:</span>
                        <p className="text-white mt-1">ஆமாம், என் காரின் 30,000 கி.மீ சர்வீஸ் வரப்போகிறது.</p>
                        <p className="text-[10px] text-slate-400 mt-0.5 italic font-mono">Aamam, en kaarin 30000 km service varapogiradhu.</p>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
                        <span className="text-[10px] font-bold text-purple-400 uppercase">AI Specialist:</span>
                        <p className="text-white mt-1">நாளை காலை 10 மணிக்கு எக்ஸ்பிரஸ் பேயில் ஸ்லாட் முன்பதிவு செய்யலாமா?</p>
                        <p className="text-[10px] text-slate-400 mt-0.5 italic font-mono">Naalai kaalai 10 manikku Express Bay-il slot munpadhivu seyyalaama?</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
                        <span className="text-[10px] font-bold text-purple-400 uppercase">AI Specialist:</span>
                        <p className="text-white mt-1">Good afternoon Mr. Sundaram! Calling from AutoEra Motors regarding your scheduled 30,000 km periodic service.</p>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800 text-xs">
                        <span className="text-[10px] font-bold text-cyan-400 uppercase">Customer:</span>
                        <p className="text-white mt-1">Yes, can we schedule it for this Saturday morning at 9:30 AM?</p>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
                        <span className="text-[10px] font-bold text-purple-400 uppercase">AI Specialist:</span>
                        <p className="text-white mt-1">Confirmed! Reserved Express Bay #2 for Saturday 9:30 AM. Digital appointment card dispatched to your WhatsApp.</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center justify-between">
                <span>Appointment Confirmed &amp; WhatsApp PDF Issued</span>
                <CheckCircle2 size={15} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Section11AIOSWorkspace;
