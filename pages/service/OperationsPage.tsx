import React, { useState } from 'react';
import { Wrench, Plus, LayoutGrid, List, Sparkles, User, Car, ClipboardList, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StatCard from '../../components/StatCard';
import { ServiceJob } from '../../types';
import AddServiceModal from '../../components/AddServiceModal';
import ServiceAnalysisModal from '../../components/ServiceAnalysisModal';
import SkillMatchingModal from '../../components/SkillMatchingModal';
import CsvImportModal, { CsvColumn } from '../../components/common/CsvImportModal';
import VoiceCallButton from '../../components/voice/VoiceCallButton';
import VoiceCallModal from '../../components/voice/VoiceCallModal';

const initialJobs: ServiceJob[] = [
  { 
    id: 'SV-001', 
    customer: 'Rohan Gupta', 
    vehicle: 'Honda City', 
    issue: 'Brake Pad Noise', 
    status: 'In Progress', 
    predictedCompletion: '14:30 Today', 
    bay: 'Bay 3', 
    technician: 'Amit K.', 
    priority: 'High',
    phone: '+91-98765-43210',
    email: 'rohan.gupta@example.com',
    aiInsights: { diagnosisConfidence: 92, partsRequired: ['Front Brake Pads', 'Brake Fluid'], partsAvailability: 'In Stock', estimatedCost: '4500' }
  },
  { 
    id: 'SV-002', 
    customer: 'Meera Reddy', 
    vehicle: 'Tata Harrier', 
    issue: 'Regular Service (20k)', 
    status: 'Pending', 
    predictedCompletion: '17:00 Today', 
    bay: 'Unassigned', 
    technician: 'Unassigned', 
    priority: 'Medium',
    phone: '+91-98765-43211',
    email: 'meera.reddy@example.com',
    aiInsights: { diagnosisConfidence: 99, partsRequired: ['Engine Oil', 'Oil Filter', 'Air Filter'], partsAvailability: 'In Stock', estimatedCost: '8200' }
  },
  { 
    id: 'SV-003', 
    customer: 'Vikram Singh', 
    vehicle: 'Hyundai i20', 
    issue: 'AC Cooling Low', 
    status: 'Delayed', 
    predictedCompletion: '10:00 Tomorrow', 
    bay: 'Bay 1', 
    technician: 'Rajesh S.', 
    priority: 'Medium',
    phone: '+91-98765-43212',
    email: 'vikram.singh@example.com',
    aiInsights: { diagnosisConfidence: 78, partsRequired: ['AC Compressor', 'Refrigerant'], partsAvailability: 'Low Stock', estimatedCost: '12000' }
  },
  { 
    id: 'SV-004', 
    customer: 'Anjali Desai', 
    vehicle: 'Maruti Swift', 
    issue: 'Wheel Alignment', 
    status: 'Completed', 
    predictedCompletion: 'Done', 
    bay: 'Bay 5', 
    technician: 'Suresh M.', 
    priority: 'Low',
    phone: '+91-98765-43213',
    email: 'anjali.desai@example.com',
    aiInsights: { diagnosisConfidence: 95, partsRequired: [], partsAvailability: 'In Stock', estimatedCost: '800' }
  },
];

const OperationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<ServiceJob[]>(initialJobs);
  const [viewMode, setViewMode] = useState<'list' | 'bay'>('list');
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<ServiceJob | null>(null);
  const [isAnalysisOpen, setIsAnalysisOpen] = useState(false);
  const [isTechAssignModalOpen, setIsTechAssignModalOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [selectedCustomerForCall, setSelectedCustomerForCall] = useState<ServiceJob | null>(null);

  const handleAddJob = (newJobData: Omit<ServiceJob, 'id' | 'status' | 'aiInsights'>) => {
    const newJob: ServiceJob = {
        ...newJobData,
        id: `SV-00${jobs.length + 1}`,
        status: 'Pending',
        aiInsights: { diagnosisConfidence: 85, partsRequired: ['Diagnostic Scan'], partsAvailability: 'In Stock', estimatedCost: 'TBD' }
    };
    setJobs([newJob, ...jobs]);
  };

  const handleAnalyze = (job: ServiceJob) => {
    setSelectedJob(job);
    setIsAnalysisOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/service')}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} className="text-slate-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Wrench className="text-orange-600" /> Service Operations
            </h1>
            <p className="text-slate-500">Live Job Board & Bay Management</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-orange-100 text-orange-700' : 'text-slate-400 hover:bg-slate-50'}`}
            >
              <List size={20} />
            </button>
            <button 
              onClick={() => setViewMode('bay')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'bay' ? 'bg-orange-100 text-orange-700' : 'text-slate-400 hover:bg-slate-50'}`}
            >
              <LayoutGrid size={20} />
            </button>
            <span className="text-sm font-semibold text-slate-600 ml-2">Live Job Board</span>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setIsImportOpen(true)}
              className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-2"
            >
              <ClipboardList size={16} /> Import Jobs
            </button>
            <button 
              onClick={() => setIsTechAssignModalOpen(true)}
              className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-2"
            >
              <User size={16} /> AI Tech Assignment
            </button>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              <Plus size={16} /> New Job Card
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          {viewMode === 'list' ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-6 py-4 font-medium">Vehicle & Customer</th>
                    <th className="px-6 py-4 font-medium">Issue & Priority</th>
                    <th className="px-6 py-4 font-medium">Status & Stage</th>
                    <th className="px-6 py-4 font-medium">Technician</th>
                    <th className="px-6 py-4 font-medium">AI Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {jobs.map((job) => (
                    <tr key={job.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-slate-100 rounded-lg">
                            <Car size={16} className="text-slate-500"/>
                          </div>
                          <div>
                            <div>{job.vehicle}</div>
                            <div className="text-xs text-slate-400 font-normal">{job.customer}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        <div>{job.issue}</div>
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${
                          job.priority === 'Critical' ? 'text-red-600' :
                          job.priority === 'High' ? 'text-orange-600' : 'text-slate-500'
                        }`}>
                          {job.priority} Priority
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium w-fit
                            ${job.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 
                            job.status === 'Delayed' ? 'bg-red-100 text-red-800' : 
                            job.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                            'bg-gray-100 text-gray-800'}`}>
                            {job.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <User size={14} className="text-slate-400"/>
                          {job.technician || 'Unassigned'}
                        </div>
                        <div className="text-xs text-slate-400 pl-5">{job.bay}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleAnalyze(job)}
                            className="text-orange-600 hover:text-orange-800 font-medium text-xs flex items-center gap-1.5 px-2 py-1 hover:bg-orange-50 rounded transition-colors"
                          >
                            <Sparkles size={14} />
                            Predictive Diag
                          </button>
                          <VoiceCallButton
                            engineType="service"
                            contextData={job}
                            customerName={job.customer}
                            customerPhone={job.phone || '+91-9876543210'}
                            onClick={() => {
                              setSelectedCustomerForCall(job);
                              setIsVoiceModalOpen(true);
                            }}
                            variant="icon"
                            size="sm"
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {['Bay 1', 'Bay 2', 'Bay 3', 'Bay 4', 'Bay 5', 'Bay 6', 'Express 1', 'Express 2'].map((bay) => {
                const job = jobs.find(j => j.bay === bay);
                return (
                  <div key={bay} className={`border rounded-xl p-4 flex flex-col justify-between h-44 relative overflow-hidden ${job ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-50 border-slate-200 border-dashed'}`}>
                    <div className="flex justify-between items-start z-10">
                      <span className="font-bold text-slate-700">{bay}</span>
                      {job ? (
                        <span className={`w-2 h-2 rounded-full ${job.status === 'In Progress' ? 'bg-blue-500 animate-pulse' : job.status === 'Delayed' ? 'bg-red-500' : 'bg-green-500'}`}></span>
                      ) : (
                        <span className="text-xs text-slate-400 bg-slate-200 px-2 py-0.5 rounded">Free</span>
                      )}
                    </div>
                    {job ? (
                      <div className="z-10">
                        <div className="font-bold text-sm text-slate-900 line-clamp-1">{job.vehicle}</div>
                        <div className="text-xs text-slate-500 mb-2">{job.technician}</div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleAnalyze(job)}
                            className="flex-1 py-1 text-[10px] bg-orange-50 text-orange-700 rounded border border-orange-100 hover:bg-orange-100"
                          >
                            View
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center flex-1 z-10">
                        <span className="text-xs text-slate-400">Available</span>
                      </div>
                    )}
                    {job && <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500"></div>}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <AddServiceModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddJob}
      />

      <ServiceAnalysisModal 
        isOpen={isAnalysisOpen}
        onClose={() => setIsAnalysisOpen(false)}
        job={selectedJob}
      />

      <SkillMatchingModal 
        isOpen={isTechAssignModalOpen}
        onClose={() => setIsTechAssignModalOpen(false)}
        employees={[]} 
      />

      {selectedCustomerForCall && (
        <VoiceCallModal
          isOpen={isVoiceModalOpen}
          onClose={() => {
            setIsVoiceModalOpen(false);
            setSelectedCustomerForCall(null);
          }}
          engineType="service"
          contextData={selectedCustomerForCall}
          customerId={selectedCustomerForCall.id}
          customerName={selectedCustomerForCall.customer}
          customerPhone={selectedCustomerForCall.phone || '+91-9876543210'}
        />
      )}
    </div>
  );
};

export default OperationsPage;
