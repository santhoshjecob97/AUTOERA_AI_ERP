import React, { useState, useEffect } from 'react';
import { 
  X, CheckCircle, XCircle, AlertTriangle, ShieldCheck, Clock, 
  Sparkles, Bot, ArrowRight, RefreshCw, Terminal, CheckCircle2 
} from 'lucide-react';
import aiEngineApi, { ActionProposal } from '../services/aiEngineApi';

interface ActionProposalDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onActionCompleted?: () => void;
}

export const ActionProposalDrawer: React.FC<ActionProposalDrawerProps> = ({
  isOpen,
  onClose,
  onActionCompleted,
}) => {
  const [proposals, setProposals] = useState<ActionProposal[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'PENDING_APPROVAL' | 'EXECUTED' | 'ALL'>('PENDING_APPROVAL');
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [expandedParams, setExpandedParams] = useState<Record<string, boolean>>({});

  const fetchProposals = async () => {
    setIsLoading(true);
    try {
      const data = await aiEngineApi.getProposals();
      setProposals(data);
    } catch (err) {
      console.error('Failed to load ActionProposals:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchProposals();
    }
  }, [isOpen]);

  const handleApprove = async (id: string) => {
    setProcessingId(id);
    setNotification(null);
    try {
      const res = await aiEngineApi.approveProposal(id);
      setNotification({
        message: `Proposal authorized & executed successfully! Result: ${res.execution_result?.message || 'Success'}`,
        type: 'success',
      });
      await fetchProposals();
      onActionCompleted?.();
    } catch (err: any) {
      setNotification({
        message: err.message || 'Failed to authorize action proposal',
        type: 'error',
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: string) => {
    const reason = window.prompt('Please enter reason for rejection:', 'Operational policy override');
    if (reason === null) return; // User cancelled

    setProcessingId(id);
    setNotification(null);
    try {
      await aiEngineApi.rejectProposal(id, reason);
      setNotification({
        message: 'Action proposal rejected and logged in managerial audit trail.',
        type: 'success',
      });
      await fetchProposals();
      onActionCompleted?.();
    } catch (err: any) {
      setNotification({
        message: err.message || 'Failed to reject action proposal',
        type: 'error',
      });
    } finally {
      setProcessingId(null);
    }
  };

  const toggleExpandParams = (id: string) => {
    setExpandedParams(prev => ({ ...prev, [id]: !prev[id] }));
  };

  if (!isOpen) return null;

  const filteredProposals = proposals.filter(p => {
    if (activeTab === 'ALL') return true;
    return p.status === activeTab;
  });

  const pendingCount = proposals.filter(p => p.status === 'PENDING_APPROVAL').length;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-white dark:bg-[#0c121e] h-full shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col transform transition-transform duration-300 ease-in-out"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/30">
                <ShieldCheck size={12} />
                Stage 6C Human-in-the-Loop
              </span>
              <span className="text-xs font-mono text-slate-400">
                {pendingCount} Pending Sign-off
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white font-['Outfit'] mt-1 flex items-center gap-2">
              <Bot className="text-orange-500" size={22} />
              AI Agent Action Authorizations
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              High-risk ERP write actions proposed by specialized agents requiring GM / Principal sign-off
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchProposals}
              disabled={isLoading}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Refresh proposals"
            >
              <RefreshCw size={17} className={isLoading ? 'animate-spin' : ''} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Close drawer"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="px-6 pt-3 pb-2 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 text-xs">
          <button
            onClick={() => setActiveTab('PENDING_APPROVAL')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'PENDING_APPROVAL'
                ? 'bg-orange-500 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <span>Pending Authorization</span>
            {pendingCount > 0 && (
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                activeTab === 'PENDING_APPROVAL' ? 'bg-white text-orange-600' : 'bg-orange-500/20 text-orange-400'
              }`}>
                {pendingCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('EXECUTED')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'EXECUTED'
                ? 'bg-orange-500 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Executed History
          </button>
          <button
            onClick={() => setActiveTab('ALL')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'ALL'
                ? 'bg-orange-500 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            All ({proposals.length})
          </button>
        </div>

        {/* Toast / Notification */}
        {notification && (
          <div className={`mx-6 mt-4 p-3 rounded-xl border text-xs flex items-center justify-between animate-fade-in ${
            notification.type === 'success' 
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
          }`}>
            <span className="flex items-center gap-2">
              {notification.type === 'success' ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
              {notification.message}
            </span>
            <button onClick={() => setNotification(null)} className="text-slate-400 hover:text-white">✕</button>
          </div>
        )}

        {/* Proposal List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {isLoading && proposals.length === 0 ? (
            <div className="py-20 text-center space-y-3">
              <RefreshCw className="animate-spin text-orange-500 mx-auto" size={28} />
              <p className="text-xs text-slate-400">Loading AI action proposals...</p>
            </div>
          ) : filteredProposals.length === 0 ? (
            <div className="py-20 text-center space-y-3">
              <CheckCircle className="text-emerald-500 mx-auto" size={36} />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {activeTab === 'PENDING_APPROVAL' ? 'No Actions Pending Approval' : 'No Proposals Found'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                {activeTab === 'PENDING_APPROVAL'
                  ? 'All high-risk autonomous agent operations have been reviewed. Safe autonomous read and recommendation routines continue operating normally.'
                  : 'No proposals match the selected filter.'}
              </p>
            </div>
          ) : (
            filteredProposals.map(proposal => {
              const isProcessing = processingId === proposal.id;
              const isCritical = proposal.risk_level === 'CRITICAL';
              const isHigh = proposal.risk_level === 'HIGH';
              const isPending = proposal.status === 'PENDING_APPROVAL';

              return (
                <div
                  key={proposal.id}
                  className={`rounded-2xl border p-4 sm:p-5 transition-all shadow-xs ${
                    isPending
                      ? isCritical
                        ? 'bg-rose-500/5 border-rose-500/30 dark:bg-rose-950/10'
                        : isHigh
                          ? 'bg-amber-500/5 border-amber-500/30 dark:bg-amber-950/10'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                      : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/80 opacity-80'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Risk Badge */}
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                          isCritical
                            ? 'bg-rose-500 text-white'
                            : isHigh
                              ? 'bg-amber-500 text-white'
                              : 'bg-blue-500 text-white'
                        }`}>
                          {proposal.risk_level} RISK
                        </span>

                        {/* Status Badge */}
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          proposal.status === 'EXECUTED'
                            ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30'
                            : proposal.status === 'REJECTED'
                              ? 'bg-slate-500/10 text-slate-400 border border-slate-500/30'
                              : 'bg-orange-500/10 text-orange-500 border border-orange-500/30'
                        }`}>
                          {proposal.status}
                        </span>

                        <span className="text-[11px] font-mono text-slate-400">
                          by <strong className="text-slate-700 dark:text-slate-300">{proposal.agent_name}</strong>
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-2 flex items-center gap-2">
                        <Terminal size={14} className="text-orange-500" />
                        Tool: <span className="font-mono text-orange-600 dark:text-orange-400">{proposal.tool_name}</span>
                      </h3>
                    </div>

                    <span className="text-[10px] text-slate-400 font-mono shrink-0">
                      {new Date(proposal.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Reason & Expected Effect */}
                  <div className="mt-3 space-y-1.5 text-xs">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Agent Rationale:</span>
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-sans mt-0.5">
                        {proposal.reason}
                      </p>
                    </div>

                    {proposal.expected_effect && (
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Expected Effect:</span>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-sans mt-0.5">
                          {proposal.expected_effect}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Parameters Inspection */}
                  <div className="mt-3">
                    <button
                      onClick={() => toggleExpandParams(proposal.id)}
                      className="text-[11px] font-mono text-orange-500 hover:text-orange-600 underline flex items-center gap-1"
                    >
                      {expandedParams[proposal.id] ? '[-] Hide Parameters' : '[+] View Tool Parameters'}
                    </button>
                    {expandedParams[proposal.id] && (
                      <pre className="mt-2 p-3 bg-slate-100 dark:bg-slate-950 rounded-xl text-[11px] font-mono text-slate-700 dark:text-slate-300 overflow-x-auto border border-slate-200 dark:border-slate-800 max-h-40">
                        {JSON.stringify(proposal.parameters_json, null, 2)}
                      </pre>
                    )}
                  </div>

                  {/* Execution Result (if already executed or failed) */}
                  {proposal.execution_result_json && (
                    <div className="mt-3 p-2.5 bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-[11px] font-mono text-emerald-400">
                      <strong>Execution Output:</strong> {JSON.stringify(proposal.execution_result_json)}
                    </div>
                  )}

                  {/* Action Buttons for Pending items */}
                  {isPending && (
                    <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2.5">
                      <button
                        onClick={() => handleReject(proposal.id)}
                        disabled={isProcessing}
                        className="px-3.5 py-1.5 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl transition-all cursor-pointer disabled:opacity-50"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handleApprove(proposal.id)}
                        disabled={isProcessing}
                        className="px-4 py-1.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white text-xs font-bold rounded-xl shadow-md shadow-orange-500/20 transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                      >
                        {isProcessing ? (
                          <>
                            <RefreshCw size={13} className="animate-spin" />
                            <span>Executing...</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 size={13} />
                            <span>Authorize &amp; Execute</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between text-xs text-slate-500">
          <span>AutoEra Stage 6C Managerial Oversight</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 font-semibold text-slate-700 dark:text-slate-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActionProposalDrawer;
