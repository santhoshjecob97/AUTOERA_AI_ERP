import React, { useState } from 'react';
import { X, Save, User, Wrench, Calendar, AlertTriangle } from 'lucide-react';
import { ServiceJob } from '../types';

interface AddServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (job: Omit<ServiceJob, 'id' | 'status' | 'aiInsights'>) => void;
}

const AddServiceModal: React.FC<AddServiceModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    customer: '',
    vehicle: '',
    issue: '',
    bay: 'Unassigned',
    predictedCompletion: 'Calculating...',
    priority: 'Medium' as const,
    technician: 'Auto-Assign'
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
    setFormData({ 
        customer: '', 
        vehicle: '', 
        issue: '', 
        bay: 'Unassigned', 
        predictedCompletion: 'Calculating...', 
        priority: 'Medium',
        technician: 'Auto-Assign'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-orange-50">
          <div className="flex items-center gap-2">
            <Wrench className="text-orange-600" size={20} />
            <h3 className="font-bold text-slate-900">New Service Job Card</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-orange-100 rounded-full transition-colors text-slate-500">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Customer Name</label>
            <div className="relative">
              <User size={16} className="absolute left-3 top-3 text-slate-400" />
              <input 
                required
                type="text" 
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all text-sm"
                placeholder="Enter customer name"
                value={formData.customer}
                onChange={e => setFormData({...formData, customer: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Vehicle Details</label>
            <div className="relative">
              <Calendar size={16} className="absolute left-3 top-3 text-slate-400" />
              <input 
                required
                type="text" 
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all text-sm"
                placeholder="e.g. Honda City (MH-12-AB-1234)"
                value={formData.vehicle}
                onChange={e => setFormData({...formData, vehicle: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Reported Issue</label>
            <div className="relative">
              <AlertTriangle size={16} className="absolute left-3 top-3 text-slate-400" />
              <input 
                required
                type="text" 
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all text-sm"
                placeholder="e.g. Brake noise, AC not cooling"
                value={formData.issue}
                onChange={e => setFormData({...formData, issue: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Priority Level</label>
            <select
                value={formData.priority}
                onChange={e => setFormData({...formData, priority: e.target.value as any})}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-sm bg-white"
            >
                <option value="Low">Low (Routine)</option>
                <option value="Medium">Medium (Standard)</option>
                <option value="High">High (Urgent)</option>
                <option value="Critical">Critical (Breakdown)</option>
            </select>
          </div>

          <div className="pt-4 flex gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 py-2.5 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors text-sm"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="flex-1 py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium transition-colors flex items-center justify-center gap-2 shadow-sm shadow-orange-200 text-sm"
            >
              <Save size={16} />
              Create Job Card
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddServiceModal;