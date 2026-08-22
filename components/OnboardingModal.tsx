import React from 'react';
import { X, Check, Clock, User, ArrowRight, FileText } from 'lucide-react';
import { OnboardingStage } from '../types';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  stages: OnboardingStage[];
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose, stages }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 h-[80vh] flex flex-col">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-blue-600 text-white">
          <div className="flex items-center gap-2">
            <User className="text-blue-200" size={20} />
            <div>
              <h3 className="font-bold">Customer Onboarding Workflow</h3>
              <p className="text-xs text-blue-100 opacity-90">Track progress from contract to go-live</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
            <div className="space-y-6">
                {stages.map((client) => (
                    <div key={client.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                            <div>
                                <h4 className="font-bold text-slate-900">{client.customerName}</h4>
                                <p className="text-xs text-slate-500">Started: 2 days ago</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold text-slate-600">Overall Progress:</span>
                                <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-600 rounded-full transition-all duration-500" style={{ width: `${client.progress}%` }}></div>
                                </div>
                                <span className="text-xs font-bold text-blue-600">{client.progress}%</span>
                            </div>
                        </div>
                        
                        <div className="p-6">
                            {/* Workflow Stepper */}
                            <div className="flex items-center justify-between relative">
                                {/* Connector Line */}
                                <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-slate-100 -z-10"></div>
                                
                                {['Discovery', 'Technical Setup', 'Training', 'Go-Live'].map((step, idx) => {
                                    const isCompleted = idx < ['Discovery', 'Technical Setup', 'Training', 'Go-Live'].indexOf(client.stage);
                                    const isCurrent = step === client.stage;
                                    
                                    return (
                                        <div key={step} className="flex flex-col items-center gap-2 bg-white px-2">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                                                isCompleted ? 'bg-green-500 border-green-500 text-white' :
                                                isCurrent ? 'bg-white border-blue-600 text-blue-600 shadow-md ring-4 ring-blue-50' :
                                                'bg-white border-slate-200 text-slate-300'
                                            }`}>
                                                {isCompleted ? <Check size={18} strokeWidth={3} /> : <span className="text-sm font-bold">{idx + 1}</span>}
                                            </div>
                                            <span className={`text-xs font-semibold ${isCurrent ? 'text-blue-700' : isCompleted ? 'text-green-700' : 'text-slate-400'}`}>
                                                {step}
                                            </span>
                                        </div>
                                    )
                                })}
                            </div>

                            <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-100 flex justify-between items-center">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-white rounded shadow-sm border border-slate-100">
                                        <FileText size={18} className="text-blue-500" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase font-semibold">Current Task</p>
                                        <p className="text-sm font-bold text-slate-900">{client.nextTask}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-slate-500 uppercase font-semibold">Due Date</p>
                                    <p className="text-sm font-medium text-red-600 flex items-center gap-1 justify-end">
                                        <Clock size={14} /> {client.dueDate}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="p-3 bg-slate-50 border-t border-slate-100 flex justify-end">
                            <button className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1">
                                View Full Checklist <ArrowRight size={12} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingModal;