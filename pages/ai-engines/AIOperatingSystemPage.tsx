import React from 'react';
import Section11AIOSWorkspace from '../../components/ai/Section11AIOSWorkspace';

const AIOperatingSystemPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#07090F] text-slate-100 p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Breadcrumb and Top Tag */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
              <span>PLATFORM SPECIFICATION 11</span>
              <span>/</span>
              <span>AI OPERATING SYSTEM</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-['Outfit'] tracking-tight flex items-center gap-3">
              Multi-Agent AI-OS Network
              <span className="text-xs px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-mono font-medium">
                10 Autonomous Specialists · 2026 Core
              </span>
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-3xl">
              Central orchestration network connecting Supervisor, Sales, CRM, Service, Insurance, Finance, Fleet, EV, Support, and Analytics agents with Pinecone/Qdrant RAG, Cohere v3 reranking, and Sarvam AI voice telephony.
            </p>
          </div>
        </div>

        {/* Section 11 Interactive Studio Component */}
        <Section11AIOSWorkspace />
      </div>
    </div>
  );
};

export default AIOperatingSystemPage;
