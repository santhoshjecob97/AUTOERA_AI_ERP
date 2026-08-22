import React, { useState } from 'react';
import { X, Save, User, FileText, Camera, Calendar, AlertTriangle, UploadCloud } from 'lucide-react';
import { InsuranceClaim } from '../types';

interface AddClaimModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (claim: Omit<InsuranceClaim, 'id' | 'status' | 'aiAssessment'>) => void;
}

const AddClaimModal: React.FC<AddClaimModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    policyId: '',
    policyHolder: '',
    incidentDate: '',
    type: 'Accident' as const,
    claimedAmount: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
    setFormData({ policyId: '', policyHolder: '', incidentDate: '', type: 'Accident', claimedAmount: '' });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-rose-50">
          <div className="flex items-center gap-2">
            <FileText className="text-rose-600" size={20} />
            <h3 className="font-bold text-slate-900">File New Claim</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-rose-100 rounded-full transition-colors text-slate-500">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Policy Number</label>
            <div className="relative">
              <FileText size={16} className="absolute left-3 top-3 text-slate-400" />
              <input 
                required
                type="text" 
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all text-sm"
                placeholder="e.g. POL-882910"
                value={formData.policyId}
                onChange={e => setFormData({...formData, policyId: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Policy Holder Name</label>
            <div className="relative">
              <User size={16} className="absolute left-3 top-3 text-slate-400" />
              <input 
                required
                type="text" 
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all text-sm"
                placeholder="Enter full name"
                value={formData.policyHolder}
                onChange={e => setFormData({...formData, policyHolder: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Incident Date</label>
                <div className="relative">
                  <Calendar size={16} className="absolute left-3 top-3 text-slate-400" />
                  <input 
                    required
                    type="date" 
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none text-sm"
                    value={formData.incidentDate}
                    onChange={e => setFormData({...formData, incidentDate: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Incident Type</label>
                <select
                    value={formData.type}
                    onChange={e => setFormData({...formData, type: e.target.value as any})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none text-sm bg-white"
                >
                    <option value="Accident">Accident</option>
                    <option value="Theft">Theft</option>
                    <option value="Natural Calamity">Natural Calamity</option>
                </select>
              </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Estimated Claim Amount (₹)</label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-400 font-bold">₹</span>
              <input 
                required
                type="text" 
                className="w-full pl-8 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all text-sm"
                placeholder="50,000"
                value={formData.claimedAmount}
                onChange={e => setFormData({...formData, claimedAmount: e.target.value})}
              />
            </div>
          </div>

          <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center hover:bg-slate-50 transition-colors cursor-pointer bg-slate-50/50">
             <Camera className="text-slate-400 mb-2" size={24} />
             <p className="text-xs font-medium text-slate-600">Upload Damage Photos</p>
             <p className="text-[10px] text-slate-400">AI will auto-assess severity</p>
          </div>

          <div className="pt-2 flex gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 py-2.5 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors text-sm"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="flex-1 py-2.5 bg-rose-600 text-white rounded-lg hover:bg-rose-700 font-medium transition-colors flex items-center justify-center gap-2 shadow-sm shadow-rose-200 text-sm"
            >
              <Save size={16} />
              Submit Claim
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddClaimModal;