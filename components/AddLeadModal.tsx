import React, { useState } from 'react';
import { X, Save, User, Car, Wallet, FileText } from 'lucide-react';
import { Lead } from '../types';

interface AddLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (lead: Omit<Lead, 'id' | 'aiScore' | 'lastAction'>) => void;
}

const AddLeadModal: React.FC<AddLeadModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    vehicleInterest: '',
    vehicleDetails: '',
    budget: '',
    status: 'New' as const
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
    setFormData({ name: '', vehicleInterest: '', vehicleDetails: '', budget: '', status: 'New' });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-slate-900">Add New Customer</h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
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
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
                placeholder="Enter full name"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Vehicle Interest (Category)</label>
            <div className="relative">
              <Car size={16} className="absolute left-3 top-3 text-slate-400" />
              <input 
                required
                type="text" 
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
                placeholder="e.g. SUV, Sedan, EV"
                value={formData.vehicleInterest}
                onChange={e => setFormData({...formData, vehicleInterest: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Vehicle Details</label>
            <div className="relative">
              <FileText size={16} className="absolute left-3 top-3 text-slate-400" />
              <input 
                type="text" 
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
                placeholder="Make, Model, Year (e.g. 2024 Tata Nexon)"
                value={formData.vehicleDetails}
                onChange={e => setFormData({...formData, vehicleDetails: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Budget Range</label>
            <div className="relative">
              <Wallet size={16} className="absolute left-3 top-3 text-slate-400" />
              <input 
                required
                type="text" 
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
                placeholder="e.g. ₹15L - ₹20L"
                value={formData.budget}
                onChange={e => setFormData({...formData, budget: e.target.value})}
              />
            </div>
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
              className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors flex items-center justify-center gap-2 shadow-sm shadow-blue-200 text-sm"
            >
              <Save size={16} />
              Save Customer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLeadModal;