import React, { useState } from 'react';
import { X, Sparkles, Check, Wrench, Briefcase, ChevronRight, Star, BrainCircuit, Activity } from 'lucide-react';
import { Employee, ServiceJob } from '../types';

interface SkillMatchingModalProps {
  isOpen: boolean;
  onClose: () => void;
  employees: Employee[];
}

// Mock pending jobs specifically for the matching engine demo
const mockPendingJobs: ServiceJob[] = [
    {
        id: 'JOB-101', customer: 'Arun V.', vehicle: 'Tata Nexon EV', issue: 'Battery Calibration', status: 'Pending',
        predictedCompletion: '2h', bay: 'Unassigned', priority: 'High',
        requiredSkills: ['EV Diagnostics', 'Software Systems']
    },
    {
        id: 'JOB-102', customer: 'David S.', vehicle: 'Mahindra Thar', issue: 'Engine Knocking', status: 'Pending',
        predictedCompletion: '4h', bay: 'Unassigned', priority: 'Critical',
        requiredSkills: ['Engine Repair', 'Sound Diagnostics']
    },
    {
        id: 'JOB-103', customer: 'Elena G.', vehicle: 'Honda City', issue: 'Brake Pad Replacement', status: 'Pending',
        predictedCompletion: '1.5h', bay: 'Unassigned', priority: 'Medium',
        requiredSkills: ['Brake Systems']
    }
];

interface Assignment {
    jobId: string;
    technicianId: string;
    technicianName: string;
    matchScore: number;
    reason: string;
}

const SkillMatchingModal: React.FC<SkillMatchingModalProps> = ({ isOpen, onClose, employees }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  if (!isOpen) return null;

  const handleMatch = () => {
      setIsAnalyzing(true);
      
      // Simulate AI Processing
      setTimeout(() => {
          const newAssignments: Assignment[] = mockPendingJobs.map(job => {
              // Simple mock logic to pick a "best" employee based on skills
              // In a real app, this would be a complex algorithm
              let bestTech = employees[0];
              let bestScore = 0;
              let reason = "";

              employees.filter(e => e.role === 'Technician').forEach(tech => {
                  let score = 60 + Math.random() * 30; // Base score
                  
                  // Boost score if tech has required skills
                  const hasSkills = job.requiredSkills?.every(reqSkill => 
                      tech.skills.some(s => s.name.includes(reqSkill.split(' ')[0]) && s.level > 70)
                  );
                  
                  if (hasSkills) score += 15;
                  
                  // Adjust for load
                  score -= (tech.currentLoad / 10);

                  if (score > bestScore) {
                      bestScore = score;
                      bestTech = tech;
                      reason = `High proficiency in ${job.requiredSkills?.[0]} (${Math.floor(score)}%)`;
                  }
              });

              // Force specific realistic matches for demo
              if (job.id === 'JOB-101') { // EV Job
                 const evTech = employees.find(e => e.skills.some(s => s.name.includes('EV'))) || employees[0];
                 bestTech = evTech;
                 bestScore = 95;
                 reason = "Certified EV Specialist available";
              }

              return {
                  jobId: job.id,
                  technicianId: bestTech.id,
                  technicianName: bestTech.name,
                  matchScore: Math.min(Math.floor(bestScore), 99),
                  reason: reason
              };
          });

          setAssignments(newAssignments);
          setIsAnalyzing(false);
      }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 h-[80vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-indigo-900 text-white">
          <div className="flex items-center gap-2">
            <BrainCircuit className="text-indigo-400" size={24} />
            <div>
                <h3 className="font-bold text-lg">Technician Skill Matching Engine</h3>
                <p className="text-xs text-indigo-200">AI-driven assignment based on skills, load, and certifications.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition-colors text-indigo-200 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col p-6 bg-slate-50">
            {assignments.length === 0 && !isAnalyzing ? (
                <div className="flex-1 flex flex-col items-center justify-center space-y-6">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 max-w-2xl w-full">
                        <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <Briefcase size={20} className="text-indigo-600"/> Unassigned Jobs Queue
                        </h4>
                        <div className="space-y-3">
                            {mockPendingJobs.map(job => (
                                <div key={job.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
                                    <div>
                                        <div className="font-semibold text-sm text-slate-900">{job.vehicle} - {job.issue}</div>
                                        <div className="flex gap-2 mt-1">
                                            {job.requiredSkills?.map(skill => (
                                                <span key={skill} className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded border border-indigo-200">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <span className={`text-xs font-bold px-2 py-1 rounded ${job.priority === 'Critical' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                                        {job.priority} Priority
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button 
                        onClick={handleMatch}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-indigo-500/30 transition-all flex items-center gap-3"
                    >
                        <Sparkles size={24} /> Run AI Matching Analysis
                    </button>
                </div>
            ) : isAnalyzing ? (
                <div className="flex-1 flex flex-col items-center justify-center">
                    <div className="relative">
                        <div className="w-24 h-24 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                        <BrainCircuit className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-600" size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mt-6">Analyzing Workforce Skills...</h3>
                    <p className="text-slate-500 mt-2">Comparing job requirements against 42 skill parameters.</p>
                </div>
            ) : (
                <div className="flex-1 overflow-auto space-y-4">
                    <div className="flex justify-between items-center mb-2">
                        <h4 className="font-bold text-slate-700">Proposed Assignments</h4>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-bold">Optimization Complete</span>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {assignments.map((assignment, idx) => {
                            const job = mockPendingJobs.find(j => j.id === assignment.jobId);
                            return (
                                <div key={idx} className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 flex flex-col md:flex-row items-center gap-6 animate-in slide-in-from-bottom-2 duration-500" style={{animationDelay: `${idx * 150}ms`}}>
                                    {/* Job Side */}
                                    <div className="flex-1 w-full">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs font-bold text-slate-400">{job?.id}</span>
                                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${job?.priority === 'Critical' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>
                                                {job?.priority}
                                            </span>
                                        </div>
                                        <h4 className="font-bold text-slate-900">{job?.vehicle}</h4>
                                        <p className="text-sm text-slate-500">{job?.issue}</p>
                                        <div className="flex gap-1 mt-2">
                                            {job?.requiredSkills?.map(s => (
                                                <span key={s} className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">{s}</span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Connection */}
                                    <div className="hidden md:flex flex-col items-center justify-center min-w-[120px]">
                                        <div className="h-0.5 w-full bg-indigo-100 relative">
                                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm">
                                                {assignment.matchScore}% Match
                                            </div>
                                        </div>
                                    </div>

                                    {/* Technician Side */}
                                    <div className="flex-1 w-full bg-indigo-50/50 rounded-lg p-3 border border-indigo-100">
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-indigo-100 shadow-sm text-indigo-600 font-bold">
                                                    {assignment.technicianName.charAt(0)}
                                                </div>
                                                <div>
                                                    <h5 className="font-bold text-indigo-900 text-sm">{assignment.technicianName}</h5>
                                                    <div className="flex items-center gap-1 text-xs text-indigo-700">
                                                        <Star size={10} className="fill-current"/> 
                                                        Top Performer
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <button className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded transition-colors flex items-center gap-1">
                                                    <Check size={12} /> Confirm
                                                </button>
                                            </div>
                                        </div>
                                        <div className="mt-3 pt-2 border-t border-indigo-100">
                                            <p className="text-xs text-indigo-800 flex items-start gap-1.5">
                                                <Activity size={12} className="mt-0.5 shrink-0"/> 
                                                <b>AI Reasoning:</b> {assignment.reason}. Current workload is optimal.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>

        {assignments.length > 0 && (
            <div className="p-4 border-t border-slate-100 bg-white flex justify-end gap-3">
                <button onClick={() => {setAssignments([]); setIsAnalyzing(false);}} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                    Reset
                </button>
                <button onClick={onClose} className="px-6 py-2 text-sm font-medium text-white bg-indigo-900 hover:bg-indigo-800 rounded-lg shadow-sm transition-colors flex items-center gap-2">
                    <Wrench size={16} /> Assign All & Notify Technicians
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default SkillMatchingModal;