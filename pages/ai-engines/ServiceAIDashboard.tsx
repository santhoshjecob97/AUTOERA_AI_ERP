import React, { useState, useEffect } from 'react';
import { 
  Bot, BrainCircuit, Cpu, Sparkles, Activity, CheckCircle2, 
  XCircle, AlertTriangle, ArrowRight, ShieldCheck, Search, 
  RefreshCw, Terminal, Layers, Send, FileText, Database, Wrench
} from 'lucide-react';

interface AIAgent {
  id: string;
  name: string;
  role: string;
  model: string;
  status: 'ONLINE' | 'ACTIVE_PROCESSING' | 'STANDBY';
  tasksProcessed24h: number;
  confidenceAvg: number;
  domainTools: string[];
}

interface ActionProposal {
  id: string;
  agentName: string;
  targetEntity: string;
  actionTitle: string;
  reasoning: string;
  confidenceScore: number; // 0-100
  status: 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED';
  timestamp: string;
}

interface ServiceAIDashboardProps {
  activeCopilotRole?: string;
}

const specialistAgents: AIAgent[] = [
  {
    id: 'agent-01',
    name: 'Master Supervisor Agent',
    role: 'Central Intent Router, Context Orchestrator & Event Bus Dispatcher',
    model: 'GPT-4o (Reasoning)',
    status: 'ONLINE',
    tasksProcessed24h: 3410,
    confidenceAvg: 98.4,
    domainTools: ['All Agent APIs', 'Customer Knowledge Graph', 'Session Memory', 'Event Bus']
  },
  {
    id: 'agent-02',
    name: 'Sales Executive Copilot',
    role: 'Real-time Lead Scoring, Margin Guard Floor & WhatsApp Booking Automation',
    model: 'GPT-4o + Sarvam Voice',
    status: 'ACTIVE_PROCESSING',
    tasksProcessed24h: 420,
    confidenceAvg: 94.2,
    domainTools: ['CRM API', 'Inventory Catalog', 'WhatsApp Business', 'Desking Calculator']
  },
  {
    id: 'agent-03',
    name: 'Service Advisor Copilot',
    role: '24/7 Digital Intake, 90-Sec Automated Job Cards & Bay Dispatcher',
    model: 'Claude 3.5 Sonnet',
    status: 'ONLINE',
    tasksProcessed24h: 680,
    confidenceAvg: 96.8,
    domainTools: ['Job Card API', 'Spare Parts DB', 'Bay Control Tower', 'Voice ASR']
  },
  {
    id: 'agent-04',
    name: 'Technician Diagnostic Copilot',
    role: 'Diagnostic DTC Root-Cause Analysis, Wiring Schematics & OEM Technical Bulletins',
    model: 'Claude 3.5 Sonnet',
    status: 'ONLINE',
    tasksProcessed24h: 310,
    confidenceAvg: 92.5,
    domainTools: ['OEM Technical Bulletins', 'TimescaleDB Telemetry', 'Wiring Schematics']
  },
  {
    id: 'agent-05',
    name: 'Insurance Renewal & Claims Copilot',
    role: '90/60/30-Day Renewal Automation, Crash Computer Vision & Payout Estimator',
    model: 'Gemini 1.5 Flash + Vision',
    status: 'ONLINE',
    tasksProcessed24h: 890,
    confidenceAvg: 95.1,
    domainTools: ['Insurer APIs', 'DigiLocker RC', 'NCB Calculator', 'Surveyor API']
  },
  {
    id: 'agent-06',
    name: 'Finance & Credit Advisor Copilot',
    role: '20-Sec Eligibility Pre-Screening, Multi-Bank EMI Optimizer & DigiLocker KYC',
    model: 'Claude 3.5 Sonnet',
    status: 'ONLINE',
    tasksProcessed24h: 245,
    confidenceAvg: 97.0,
    domainTools: ['10+ Bank APIs', 'DigiLocker Gateway', 'CIBIL Bureau', 'NACH Mandate']
  },
  {
    id: 'agent-07',
    name: 'Parts Demand & Reorder Copilot',
    role: 'Workshop Parts Demand Forecast, Min/Max Stock Level Guard & Stockout Mitigation',
    model: 'GPT-4o',
    status: 'ONLINE',
    tasksProcessed24h: 530,
    confidenceAvg: 96.4,
    domainTools: ['DMS Inventory API', 'OEM Replenishment Hub', 'Lead Time Calculator']
  },
  {
    id: 'agent-08',
    name: 'Used-Car Valuation & Aging Copilot',
    role: 'Refurbishment Overrun Detection, Algorithmic Pricing & Aging Stock Action Queue',
    model: 'Gemini 1.5 Flash',
    status: 'ONLINE',
    tasksProcessed24h: 180,
    confidenceAvg: 93.8,
    domainTools: ['Market Comps API', 'Appraisal Engine', 'Holding Cost Calculator']
  },
  {
    id: 'agent-09',
    name: 'EV Battery & Diagnostics Copilot',
    role: 'Daily Battery SOH Scoring, Cell Delta Balancing & Thermal Early Warning',
    model: 'Custom BMS Model + GPT-4o',
    status: 'ONLINE',
    tasksProcessed24h: 240,
    confidenceAvg: 98.1,
    domainTools: ['BMS Telemetry', 'Weibull Degradation', 'Fast Charger API']
  },
  {
    id: 'agent-10',
    name: 'Fleet Telemetry & IoT Copilot',
    role: 'OBD-II Real-time Anomaly Detection, Fuel Theft Alerts & CAN-Bus Telemetry',
    model: 'Custom LSTM + GPT-4o',
    status: 'ONLINE',
    tasksProcessed24h: 28800,
    confidenceAvg: 93.6,
    domainTools: ['TimescaleDB Hypertable', 'AWS IoT Core', 'GPS Geo-fence Engine']
  },
  {
    id: 'agent-11',
    name: 'Workforce Productivity Copilot',
    role: 'Technician Efficiency/Productivity/Utilization Tracking & Skill-Based Job Routing',
    model: 'GPT-4o',
    status: 'ONLINE',
    tasksProcessed24h: 310,
    confidenceAvg: 94.7,
    domainTools: ['Biometric Attendance', 'Skill Matrix API', 'Bay Clocking Engine']
  },
  {
    id: 'agent-12',
    name: 'Executive Forecasting & MIS Copilot',
    role: '8:00 AM Dealer Principal Brief, Revenue Run-Rate Forecasting & Anomaly Synthesis',
    model: 'GPT-4o (Reasoning)',
    status: 'ONLINE',
    tasksProcessed24h: 72,
    confidenceAvg: 99.2,
    domainTools: ['Analytics Service', 'P&L Warehouse', 'WhatsApp Broadcast Engine']
  }
];

const initialProposals: ActionProposal[] = [
  {
    id: 'PROP-101',
    agentName: 'Sales Executive Copilot',
    targetEntity: 'Lead #LD-103 (Senthil Nathan)',
    actionTitle: 'Apply 2.8% Discount Exception on Creta SX(O)',
    reasoning: 'Customer has alternative quote from competing dealer with 2% discount. Margin Guard confirms net dealer gross remains healthy at 8.4%. Closing probability elevates to 89%.',
    confidenceScore: 92,
    status: 'PENDING_APPROVAL',
    timestamp: '10 min ago'
  },
  {
    id: 'PROP-102',
    agentName: 'Service Advisor Copilot',
    targetEntity: 'Inventory SKU #TP-BRK-401',
    actionTitle: 'Autonomous Purchase Order: 40x Front Ceramic Brake Pads',
    reasoning: 'Stock level is at 6 units (Min reorder level: 15). 7 job cards scheduled over the next 4 days require this SKU. Economic Order Quantity is 40 units from Brakes India.',
    confidenceScore: 97,
    status: 'PENDING_APPROVAL',
    timestamp: '25 min ago'
  },
  {
    id: 'PROP-103',
    agentName: 'Insurance Renewal & Claims Copilot',
    targetEntity: 'Policy #HDFC-ERGO-MOT-2026-9901',
    actionTitle: 'Dispatch 30-Day Expiry WhatsApp with 35% NCB Lock',
    reasoning: 'Policy expires in 28 days. Vehicle has zero claims this cycle. Auto-generated comparative quote shows HDFC Ergo provides optimal renewal at ₹14,200 with Zero-Dep.',
    confidenceScore: 95,
    status: 'PENDING_APPROVAL',
    timestamp: '42 min ago'
  }
];

const ServiceAIDashboard: React.FC<ServiceAIDashboardProps> = ({ activeCopilotRole }) => {
  const [agents] = useState<AIAgent[]>(specialistAgents);
  const [selectedFilter, setSelectedFilter] = useState<string>(activeCopilotRole || 'ALL');
  const [proposals, setProposals] = useState<ActionProposal[]>(initialProposals);
  const [ragQuery, setRagQuery] = useState('');
  const [ragResult, setRagResult] = useState<string | null>(null);
  const [isSearchingRag, setIsSearchingRag] = useState(false);

  useEffect(() => {
    if (activeCopilotRole) {
      setSelectedFilter(activeCopilotRole);
    }
  }, [activeCopilotRole]);

  const handleAction = (proposalId: string, status: 'APPROVED' | 'REJECTED') => {
    setProposals(prev => prev.map(p => p.id === proposalId ? { ...p, status } : p));
  };

  const handleRagSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ragQuery.trim()) return;

    setIsSearchingRag(true);
    setTimeout(() => {
      setRagResult(`Found verified procedure in Tata OEM Technical Bulletin TB-2026-08 (Page 42): "For High-Voltage Battery Isolation, ensure Service Disconnect Plug is disengaged for a minimum of 5 minutes prior to cell bank measurement. Maximum allowable cell voltage delta is 30mV before BMS recalibration is triggered."`);
      setIsSearchingRag(false);
    }, 1200);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Platform Title Banner */}
      <div className="bg-[#0D1117] border border-slate-800/90 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles size={13} className="text-cyan-400" />
              Section 11 &bull; 10-Agent Multi-Agent Operating System
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-['Outfit'] flex items-center gap-3">
              AutoEra AI Operating System (AI-OS) Hub
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-3xl">
              Central orchestration console: 10 specialized domain agents, human-in-the-loop ActionProposal verification queue &amp; dealership RAG knowledge retriever.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5">
              <Activity size={14} className="animate-pulse" />
              10/10 Agents Operational
            </span>
          </div>
        </div>
      </div>

      {/* Human-in-the-Loop ActionProposal Review Center */}
      <div className="bg-[#0D1117] border border-slate-800/90 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white font-['Outfit'] flex items-center gap-2">
              <ShieldCheck size={18} className="text-orange-500" />
              Human-in-the-Loop ActionProposal Verification Queue
            </h3>
            <p className="text-xs text-slate-400">High-stakes autonomous agent proposals requiring human managerial sign-off</p>
          </div>
          <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-orange-500/10 text-orange-400 border border-orange-500/30">
            {proposals.filter(p => p.status === 'PENDING_APPROVAL').length} Pending Review
          </span>
        </div>

        <div className="space-y-3">
          {proposals.map(proposal => {
            const isPending = proposal.status === 'PENDING_APPROVAL';

            return (
              <div 
                key={proposal.id}
                className={`p-4 rounded-xl border transition-all ${
                  isPending ? 'bg-slate-900/80 border-slate-800 hover:border-slate-700' :
                  proposal.status === 'APPROVED' ? 'bg-emerald-950/20 border-emerald-500/30' :
                  'bg-rose-950/20 border-rose-500/30'
                }`}
              >
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-orange-400">{proposal.agentName}</span>
                      <span className="text-xs text-slate-500">&bull;</span>
                      <span className="text-xs font-semibold text-slate-300">{proposal.targetEntity}</span>
                      <span className="text-xs text-slate-500">&bull;</span>
                      <span className="text-[11px] text-slate-500">{proposal.timestamp}</span>
                    </div>
                    <h4 className="text-sm font-bold text-white mt-1">{proposal.actionTitle}</h4>
                    <p className="text-xs text-slate-400 mt-1 max-w-4xl">{proposal.reasoning}</p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <span className="text-xs font-bold text-cyan-400">{proposal.confidenceScore}%</span>
                      <span className="text-[10px] text-slate-500 block uppercase font-mono">Confidence</span>
                    </div>

                    {isPending ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleAction(proposal.id, 'APPROVED')}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 transition-all cursor-pointer"
                        >
                          <CheckCircle2 size={14} />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => handleAction(proposal.id, 'REJECTED')}
                          className="px-3 py-1.5 rounded-lg bg-rose-900/50 hover:bg-rose-900/80 text-rose-300 font-bold text-xs flex items-center gap-1 transition-all cursor-pointer"
                        >
                          <XCircle size={14} />
                          <span>Reject</span>
                        </button>
                      </div>
                    ) : (
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                        proposal.status === 'APPROVED' ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'
                      }`}>
                        {proposal.status}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 12 Specialist Agents Grid with Category Filters */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white font-['Outfit'] flex items-center gap-2">
              <BrainCircuit size={18} className="text-cyan-400" />
              12 Specialized Dealership AI Copilots & Engines
            </h3>
            <p className="text-xs text-slate-400">Autonomous multi-agent architecture synchronized with Dealership Event Bus</p>
          </div>

          {/* Interactive Role Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full no-scrollbar">
            {[
              { id: 'ALL', label: 'All Copilots (12)' },
              { id: 'EXECUTIVE', label: 'Executive & MIS' },
              { id: 'SALES', label: 'Sales & Used Cars' },
              { id: 'SERVICE', label: 'Service & Parts' },
              { id: 'FINANCE', label: 'Finance' },
              { id: 'INSURANCE', label: 'Insurance' },
              { id: 'FLEET_EV', label: 'EV & Fleet' },
              { id: 'WORKFORCE', label: 'Workforce' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  selectedFilter === tab.id || (tab.id === 'ALL' && selectedFilter === '')
                    ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {agents
            .filter(agent => {
              if (selectedFilter === 'ALL' || !selectedFilter) return true;
              if (selectedFilter === 'EXECUTIVE') return agent.name.includes('Supervisor') || agent.name.includes('Executive');
              if (selectedFilter === 'SALES' || selectedFilter === 'sales') return agent.name.includes('Sales') || agent.name.includes('Used-Car');
              if (selectedFilter === 'SERVICE' || selectedFilter === 'service') return agent.name.includes('Service') || agent.name.includes('Technician') || agent.name.includes('Parts');
              if (selectedFilter === 'FINANCE' || selectedFilter === 'finance') return agent.name.includes('Finance');
              if (selectedFilter === 'INSURANCE' || selectedFilter === 'insurance') return agent.name.includes('Insurance');
              if (selectedFilter === 'FLEET_EV' || selectedFilter === 'fleet' || selectedFilter === 'ev') return agent.name.includes('EV') || agent.name.includes('Fleet');
              if (selectedFilter === 'WORKFORCE' || selectedFilter === 'workforce') return agent.name.includes('Workforce');
              return true;
            })
            .map(agent => (
            <div 
              key={agent.id}
              className="bg-[#0D1117] border border-slate-800/90 rounded-xl p-5 shadow-lg flex flex-col justify-between hover:border-slate-700 transition-all"
            >
              <div>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="text-sm font-bold text-white font-['Outfit']">{agent.name}</h4>
                    <p className="text-[11px] text-orange-400 font-mono mt-0.5">{agent.model}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                    agent.status === 'ACTIVE_PROCESSING' ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40 animate-pulse' :
                    'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                  }`}>
                    {agent.status.replace('_', ' ')}
                  </span>
                </div>

                <p className="text-xs text-slate-400 my-2">{agent.role}</p>

                <div className="pt-2">
                  <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Assigned Domain Tools</p>
                  <div className="flex flex-wrap gap-1">
                    {agent.domainTools.map((tool, idx) => (
                      <span key={idx} className="px-1.5 py-0.5 rounded text-[10px] bg-slate-900 border border-slate-800 text-slate-300">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex justify-between items-center text-xs text-slate-400">
                <span>24h Tasks: <strong className="text-white font-mono">{agent.tasksProcessed24h.toLocaleString()}</strong></span>
                <span>Avg Conf: <strong className="text-cyan-400 font-mono">{agent.confidenceAvg}%</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dealership RAG Knowledge Query Terminal */}
      <div className="bg-[#0D1117] border border-slate-800/90 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white font-['Outfit'] flex items-center gap-2">
              <Database size={18} className="text-cyan-400" />
              Automotive RAG Knowledge Base Search Terminal
            </h3>
            <p className="text-xs text-slate-400">
              Hybrid Dense Cosine + Sparse BM25 retrieval over OEM manuals, warranty policies &amp; technical service bulletins
            </p>
          </div>
          <span className="text-xs font-mono text-cyan-400">Pinecone &bull; 3,072 Dim</span>
        </div>

        <form onSubmit={handleRagSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Terminal size={15} className="absolute left-3.5 top-3 text-slate-400" />
            <input 
              type="text"
              placeholder="E.g. What is the allowable cell delta threshold for Tata Nexon EV BMS?"
              value={ragQuery}
              onChange={(e) => setRagQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>
          <button
            type="submit"
            disabled={isSearchingRag}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shrink-0 disabled:opacity-50"
          >
            {isSearchingRag ? <RefreshCw size={14} className="animate-spin" /> : <Search size={14} />}
            <span>Query RAG</span>
          </button>
        </form>

        {ragResult && (
          <div className="p-4 rounded-xl bg-slate-900 border border-cyan-500/30 text-xs text-slate-300 font-mono space-y-2 animate-in fade-in">
            <div className="flex items-center gap-2 text-cyan-400 font-bold uppercase text-[10px]">
              <Sparkles size={12} />
              Verified OEM Retrieval Match (Cohere Rerank Score: 0.94)
            </div>
            <p className="text-slate-200 leading-relaxed">{ragResult}</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default ServiceAIDashboard;
