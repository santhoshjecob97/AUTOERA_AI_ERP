import React, { useState } from 'react';
import { X, ClipboardCheck, AlertTriangle, Check, Camera, PenTool } from 'lucide-react';

interface QualityChecklistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const QualityChecklistModal: React.FC<QualityChecklistModalProps> = ({ isOpen, onClose }) => {
  const [items, setItems] = useState([
      { id: 1, text: 'Engine Oil Level & Quality Check', status: 'pending' },
      { id: 2, text: 'Brake Fluid & Coolant Levels', status: 'pending' },
      { id: 3, text: 'Tire Pressure & Tread Depth', status: 'pending' },
      { id: 4, text: 'Battery Voltage Test', status: 'pending' },
      { id: 5, text: 'Cleanliness (Interior/Exterior)', status: 'pending' },
      { id: 6, text: 'Test Drive Performance', status: 'pending' },
  ]);

  if (!isOpen) return null;

  const toggleStatus = (id: number, status: 'pass' | 'fail') => {
      setItems(items.map(i => i.id === id ? { ...i, status } : i));
  };

  const progress = Math.round((items.filter(i => i.status !== 'pending').length / items.length) * 100);
  const passed = items.filter(i => i.status === 'pass').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-teal-600 text-white">
          <div className="flex items-center gap-2">
            <ClipboardCheck className="text-teal-100" size={20} />
            <div>
              <h3 className="font-bold">Quality Assurance Audit</h3>
              <p className="text-xs text-teal-100 opacity-90">Job #JC-12345 • Final Inspection</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
            <div className="mb-6 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-end mb-2">
                    <span className="text-xs font-bold text-slate-500 uppercase">Audit Progress</span>
                    <span className="text-sm font-bold text-teal-700">{progress}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="h-full bg-teal-500 transition-all duration-300" style={{width: `${progress}%`}}></div>
                </div>
            </div>

            <div className="space-y-3">
                {items.map(item => (
                    <div key={item.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                        <span className={`text-sm font-medium ${item.status === 'pass' ? 'text-slate-900' : item.status === 'fail' ? 'text-red-700' : 'text-slate-600'}`}>
                            {item.text}
                        </span>
                        <div className="flex gap-2">
                            <button 
                                onClick={() => toggleStatus(item.id, 'fail')}
                                className={`p-2 rounded-lg transition-colors ${item.status === 'fail' ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-400 hover:bg-red-100 hover:text-red-600'}`}
                            >
                                <AlertTriangle size={16} />
                            </button>
                            <button 
                                onClick={() => toggleStatus(item.id, 'pass')}
                                className={`p-2 rounded-lg transition-colors ${item.status === 'pass' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-400 hover:bg-teal-100 hover:text-teal-600'}`}
                            >
                                <Check size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6 p-4 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50/50 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer">
                <Camera size={24} className="mb-2"/>
                <span className="text-xs font-bold">Add Proof Photos</span>
            </div>
        </div>

        <div className="p-4 border-t border-slate-100 bg-white flex gap-3">
             <button className="flex-1 py-3 border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors">
                Save Draft
             </button>
             <button 
                disabled={progress < 100}
                onClick={onClose}
                className="flex-1 py-3 bg-teal-600 text-white font-bold rounded-xl hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
             >
                <PenTool size={16} /> Sign & Approve
             </button>
        </div>
      </div>
    </div>
  );
};

export default QualityChecklistModal;
