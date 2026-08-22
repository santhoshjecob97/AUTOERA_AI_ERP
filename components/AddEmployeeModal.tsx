import React, { useState } from 'react';
import { X, Save, User, Briefcase, Mail, Calendar } from 'lucide-react';
import { Employee } from '../types';

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (employee: Omit<Employee, 'id' | 'efficiencyScore' | 'currentLoad' | 'skills' | 'recommendedTraining' | 'attendance'>) => void;
}

const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    role: 'Technician' as const,
    department: 'Service' as const,
    email: '',
    status: 'Active' as const
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
    setFormData({ name: '', role: 'Technician', department: 'Service', email: '', status: 'Active' });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-purple-50">
          <div className="flex items-center gap-2">
            <Briefcase className="text-purple-600" size={20} />
            <h3 className="font-bold text-slate-900">Onboard New Employee</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-purple-100 rounded-full transition-colors text-slate-500">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
            <div className="relative">
              <User size={16} className="absolute left-3 top-3 text-slate-400" />
              <input 
                required
                type="text" 
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all text-sm"
                placeholder="John Doe"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
            <select
                value={formData.role}
                onChange={e => setFormData({...formData, role: e.target.value as any})}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm bg-white"
            >
                <option value="Technician">Technician</option>
                <option value="Sales Executive">Sales Executive</option>
                <option value="Service Advisor">Service Advisor</option>
                <option value="Manager">Manager</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
            <select
                value={formData.department}
                onChange={e => setFormData({...formData, department: e.target.value as any})}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm bg-white"
            >
                <option value="Service">Service</option>
                <option value="Sales">Sales</option>
                <option value="Finance">Finance</option>
                <option value="Operations">Operations</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-3 text-slate-400" />
              <input 
                required
                type="email" 
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all text-sm"
                placeholder="john@autoera.com"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>
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
              className="flex-1 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium transition-colors flex items-center justify-center gap-2 shadow-sm shadow-purple-200 text-sm"
            >
              <Save size={16} />
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployeeModal;