import React, { useState } from 'react';
import { Users, Briefcase, TrendingUp, Calendar, Plus, Search, Filter, GraduationCap, CheckCircle, BrainCircuit, Download } from 'lucide-react';
import StatCard from '../components/StatCard';
import { Employee } from '../types';
import AddEmployeeModal from '../components/AddEmployeeModal';
import PerformanceReviewModal from '../components/PerformanceReviewModal';
import ShiftSchedulerModal from '../components/ShiftSchedulerModal';
import SkillMatchingModal from '../components/SkillMatchingModal';
import { BarChart, Bar, XAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import CsvImportModal, { CsvColumn } from '../components/common/CsvImportModal';
import ActionDropdown from '../components/common/ActionDropdown';
import WorkforceDashboard from '../components/dashboard/WorkforceDashboard';
import VoiceCallButton from '../components/voice/VoiceCallButton';
import VoiceCallModal from '../components/voice/VoiceCallModal';
import UniversalVoiceCampaignSection from '../components/voice/UniversalVoiceCampaignSection';

const initialEmployees: Employee[] = [
    { 
        id: 'EMP-001', name: 'Amit Kumar', role: 'Technician', department: 'Service', status: 'Active', 
        efficiencyScore: 92, currentLoad: 85, attendance: 98,
        skills: [{name: 'Engine Repair', level: 90, targetLevel: 95}, {name: 'EV Diagnostics', level: 95, targetLevel: 95}, {name: 'Brake Systems', level: 95, targetLevel: 90}],
        recommendedTraining: [{id: 'TR-1', title: 'Advanced EV Systems', duration: '4 Hours', priority: 'High', reason: 'Skill gap in EV Diagnostics detected', status: 'Not Started'}]
    },
    { 
        id: 'EMP-002', name: 'Sarah Jenkins', role: 'Sales Executive', department: 'Sales', status: 'Active', 
        efficiencyScore: 88, currentLoad: 70, attendance: 95,
        skills: [{name: 'Negotiation', level: 85, targetLevel: 90}, {name: 'CRM Tools', level: 95, targetLevel: 90}, {name: 'EV Product Knowledge', level: 75, targetLevel: 90}],
        recommendedTraining: [{id: 'TR-2', title: 'Closing High-Value Deals', duration: '2 Hours', priority: 'Medium', reason: 'Improve conversion rate on premium models', status: 'In Progress'}]
    },
    { 
        id: 'EMP-003', name: 'Rajesh Singh', role: 'Technician', department: 'Service', status: 'Training', 
        efficiencyScore: 78, currentLoad: 0, attendance: 100,
        skills: [{name: 'Engine Repair', level: 70, targetLevel: 90}, {name: 'General Maintenance', level: 85, targetLevel: 85}],
        recommendedTraining: []
    },
    { 
        id: 'EMP-004', name: 'Priya Mehta', role: 'Service Advisor', department: 'Service', status: 'Active', 
        efficiencyScore: 95, currentLoad: 90, attendance: 96,
        skills: [{name: 'Customer Service', level: 98, targetLevel: 95}, {name: 'Technical Estimating', level: 90, targetLevel: 90}],
        recommendedTraining: []
    },
];

const efficiencyData = [
    { name: 'Mon', score: 85 },
    { name: 'Tue', score: 88 },
    { name: 'Wed', score: 92 },
    { name: 'Thu', score: 86 },
    { name: 'Fri', score: 90 },
    { name: 'Sat', score: 94 },
];

const workforceCsvColumns: CsvColumn[] = [
  { key: 'employeeId', label: 'Unique employee identifier', required: true },
  { key: 'name', label: 'Employee full name', required: true },
  { key: 'email', label: 'Employee email' },
  { key: 'phone', label: 'Contact phone number' },
  { key: 'department', label: 'Department (Sales, Service, Finance, Operations)', required: true },
  { key: 'role', label: 'Job role/title', required: true },
  { key: 'joiningDate', label: 'Date of joining (YYYY-MM-DD)' },
  { key: 'skills', label: 'Skills (comma-separated)' },
  { key: 'certifications', label: 'Certifications (comma-separated)' },
  { key: 'performanceScore', label: 'Performance score (0-100)' },
  { key: 'status', label: 'Employment status' },
];

const workforceSampleRows = [
  {
    employeeId: 'EMP001',
    name: 'Amit Kumar',
    email: 'amit.k@autoera.com',
    phone: '+91-9876543218',
    department: 'Service',
    role: 'Senior Technician',
    joiningDate: '2020-03-15',
    skills: 'EV Repair,Diagnostics,Brake Systems',
    certifications: 'ASE Certified',
    performanceScore: '92',
    status: 'Active',
  },
  {
    employeeId: 'EMP002',
    name: 'Priya Sharma',
    email: 'priya.s@autoera.com',
    phone: '+91-9876543219',
    department: 'Sales',
    role: 'Sales Executive',
    joiningDate: '2021-06-01',
    skills: 'Customer Relations,Product Knowledge',
    certifications: 'Sales Pro',
    performanceScore: '88',
    status: 'Active',
  },
];

const WorkforceEngine: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isSchedulerOpen, setIsSchedulerOpen] = useState(false);
  const [isSkillMatchingOpen, setIsSkillMatchingOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [selectedEmployeeForCall, setSelectedEmployeeForCall] = useState<Employee | null>(null);

  const handleAddEmployee = (data: any) => {
    const newEmp: Employee = {
        ...data,
        id: `EMP-00${employees.length + 1}`,
        efficiencyScore: 80, // Default start
        currentLoad: 0,
        attendance: 100,
        skills: [{name: 'General', level: 50, targetLevel: 80}],
        recommendedTraining: []
    };
    setEmployees([...employees, newEmp]);
  };

  const handleReview = (emp: Employee) => {
      setSelectedEmployee(emp);
      setIsReviewOpen(true);
  };

  const updateEmployeeStatus = (id: string, status: Employee['status']) => {
    setEmployees(prev => prev.map(e => (e.id === id ? { ...e, status } : e)));
  };

  const handleImportEmployees = (
    rows: Array<
      Omit<
        Employee,
        'id' | 'efficiencyScore' | 'currentLoad' | 'skills' | 'recommendedTraining' | 'attendance'
      > & { __empId: string }
    >,
  ) => {
    const existingIds = new Set(employees.map((e) => e.id));

    const imported: Employee[] = rows.map((data) => {
      let id = data.__empId || `EMP-IMP-${Math.random().toString(36).slice(2, 8)}`;
      if (existingIds.has(id)) {
        let suffix = 1;
        while (existingIds.has(`${id}-${suffix}`)) suffix += 1;
        id = `${id}-${suffix}`;
      }
      existingIds.add(id);

      const perf = data.performanceScore != null ? data.performanceScore : 80;

      return {
        ...data,
        id,
        efficiencyScore: perf,
        currentLoad: 0,
        attendance: 100,
        skills: [{ name: 'General', level: 50, targetLevel: 80 }],
        recommendedTraining: [],
      } as Employee;
    });

    setEmployees([...employees, ...imported]);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="text-purple-600" /> Workforce AI Engine
          </h1>
          <p className="text-slate-500">Skill Matching, Performance Tracking & Shift Optimization.</p>
        </div>
        <div className="flex flex-wrap gap-2 w-full xl:w-auto">
            <button 
                onClick={() => setIsImportOpen(true)}
                className="flex-1 sm:flex-none bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
            >
                <Download size={16} /> Import Employees
            </button>
            <button 
                onClick={() => setIsSkillMatchingOpen(true)}
                className="flex-1 sm:flex-none bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
            >
                <BrainCircuit size={16} className="text-indigo-600"/> Skill Matching Engine
            </button>
            <button 
                onClick={() => setIsSchedulerOpen(true)}
                className="flex-1 sm:flex-none bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
            >
                <Calendar size={16} /> AI Shift Scheduler
            </button>
            <button 
                onClick={() => setIsAddModalOpen(true)}
                className="flex-1 sm:flex-none bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 shadow-sm shadow-purple-200"
            >
                <Plus size={16} /> Add Employee
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Team Efficiency" value="89%" trend="2.4%" trendUp={true} icon={<TrendingUp size={24}/>} color="purple" />
        <StatCard title="Active Staff" value="42" trend="Full Strength" icon={<Briefcase size={24}/>} color="blue" />
        <StatCard title="Training Active" value="8" trend="Upskilling" icon={<GraduationCap size={24}/>} color="orange" />
        <StatCard title="On-Time Arrival" value="96%" trend="1.2%" trendUp={true} icon={<CheckCircle size={24}/>} color="green" />
      </div>

      {/* Enterprise Analytics Dashboard */}
      <WorkforceDashboard />

      {/* Voice AI Bulk Campaign Section */}
      <UniversalVoiceCampaignSection engineType="workforce" />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
             <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-bold text-slate-900">Employee Directory</h3>
                <div className="relative">
                    <Search size={14} className="absolute left-3 top-2.5 text-slate-400"/>
                    <input type="text" placeholder="Search staff..." className="pl-8 pr-4 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 bg-slate-50 w-48"/>
                </div>
             </div>
             <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500">
                        <tr>
                            <th className="px-6 py-4 font-medium">Employee</th>
                            <th className="px-6 py-4 font-medium">Role & Dept</th>
                            <th className="px-6 py-4 font-medium">Status</th>
                            <th className="px-6 py-4 font-medium">Efficiency</th>
                            <th className="px-6 py-4 font-medium">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {employees.map((emp) => (
                            <tr key={emp.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="font-medium text-slate-900">{emp.name}</div>
                                    <div className="text-xs text-slate-500">{emp.id}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-slate-900">{emp.role}</div>
                                    <div className="text-xs text-slate-500">{emp.department}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                        ${emp.status === 'Active' ? 'bg-green-100 text-green-800' : 
                                          emp.status === 'Training' ? 'bg-blue-100 text-blue-800' : 
                                          'bg-slate-100 text-slate-800'}`}>
                                        {emp.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-16 bg-slate-100 rounded-full h-1.5">
                                            <div 
                                                className={`h-1.5 rounded-full ${emp.efficiencyScore >= 90 ? 'bg-green-500' : emp.efficiencyScore >= 75 ? 'bg-blue-500' : 'bg-orange-500'}`} 
                                                style={{ width: `${emp.efficiencyScore}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-xs font-bold">{emp.efficiencyScore}%</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <button 
                                            onClick={() => handleReview(emp)}
                                            className="text-purple-600 hover:text-purple-800 font-medium text-xs hover:bg-purple-50 px-2 py-1 rounded transition-colors"
                                        >
                                            Review
                                        </button>
                                        <VoiceCallButton
                                            engineType="workforce"
                                            contextData={emp}
                                            customerName={emp.name}
                                            customerPhone={emp.phone || '+91-9876543210'}
                                            onClick={() => {
                                                setSelectedEmployeeForCall(emp);
                                                setIsVoiceModalOpen(true);
                                            }}
                                            variant="icon"
                                            size="sm"
                                        />
                                        <ActionDropdown
                                          items={[
                                            {
                                              label: 'Set Active',
                                              onClick: () => updateEmployeeStatus(emp.id, 'Active'),
                                            },
                                            {
                                              label: 'Set On Leave',
                                              onClick: () => updateEmployeeStatus(emp.id, 'On Leave'),
                                            },
                                            {
                                              label: 'Set Training',
                                              onClick: () => updateEmployeeStatus(emp.id, 'Training'),
                                            },
                                          ]}
                                        />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
             </div>
          </div>

          <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                  <h3 className="font-bold text-slate-900 mb-4">Productivity Trend (Weekly)</h3>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={efficiencyData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                            <Tooltip cursor={{fill: 'transparent'}} />
                            <Bar dataKey="score" fill="#9333ea" radius={[4, 4, 0, 0]} barSize={30} />
                        </BarChart>
                    </ResponsiveContainer>
                  </div>
              </div>

              <div className="bg-purple-900 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
                  <div className="relative z-10">
                      <h3 className="font-bold text-lg mb-2">Skill Gap Alert</h3>
                      <p className="text-purple-200 text-sm mb-4">AI detected a shortage of **EV Diagnostic** skills for next week's predicted volume.</p>
                      <button 
                        onClick={() => setIsSchedulerOpen(true)}
                        className="bg-white text-purple-900 px-4 py-2 rounded-lg text-sm font-bold hover:bg-purple-50 transition-colors"
                      >
                          Adjust Schedule
                      </button>
                  </div>
                  <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4">
                      <GraduationCap size={150} />
                  </div>
              </div>
          </div>
      </div>

      <AddEmployeeModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddEmployee}
      />

      <PerformanceReviewModal 
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        employee={selectedEmployee}
      />

      <ShiftSchedulerModal 
        isOpen={isSchedulerOpen}
        onClose={() => setIsSchedulerOpen(false)}
      />

      <SkillMatchingModal 
        isOpen={isSkillMatchingOpen} 
        onClose={() => setIsSkillMatchingOpen(false)}
        employees={employees}
      />

      {isImportOpen && (
        <CsvImportModal
          isOpen={isImportOpen}
          title="Import Workforce Employees"
          description="Upload workforce_employees_template.csv to bulk import employees. Required: employeeId, name, department, role."
          columns={workforceCsvColumns}
          sampleRows={workforceSampleRows}
          mapRow={(raw) => {
            const trim = (v: unknown) => (v == null ? '' : String(v).trim());

            const employeeId = trim((raw as any).employeeId);
            const name = trim((raw as any).name);
            const email = trim((raw as any).email);
            const phone = trim((raw as any).phone);
            const departmentRaw = trim((raw as any).department);
            const roleRaw = trim((raw as any).role);
            const joiningDate = trim((raw as any).joiningDate);
            const skills = trim((raw as any).skills);
            const certifications = trim((raw as any).certifications);
            const performanceScoreRaw = trim((raw as any).performanceScore);
            const statusRaw = trim((raw as any).status);

            if (!employeeId) return { error: 'employeeId is required' };
            if (!name) return { error: 'name is required' };
            if (!departmentRaw) return { error: 'department is required' };
            if (!roleRaw) return { error: 'role is required' };

            if (email) {
              const emailRegex = /[^@\s]+@[^@\s]+\.[^@\s]+/;
              if (!emailRegex.test(email)) {
                return { error: 'Invalid email format' };
              }
            }

            if (phone) {
              const phoneClean = phone.replace(/\s+/g, '');
              if (!/^\+?[0-9\-]+$/.test(phoneClean)) {
                return { error: 'Invalid phone format. Use country code, e.g. +91-9876543210' };
              }
            }

            const deptNorm = departmentRaw.toLowerCase();
            const deptMap: Record<string, Employee['department']> = {
              sales: 'Sales',
              service: 'Service',
              finance: 'Finance',
              operations: 'Operations',
            };
            const department = deptMap[deptNorm];
            if (!department) {
              return { error: 'department must be one of: Sales, Service, Finance, Operations' };
            }

            const roleNorm = roleRaw.toLowerCase();
            let role: Employee['role'] = 'Technician';
            if (roleNorm.includes('technician')) role = 'Technician';
            else if (roleNorm.includes('sales')) role = 'Sales Executive';
            else if (roleNorm.includes('advisor')) role = 'Service Advisor';
            else if (roleNorm.includes('manager')) role = 'Manager';

            if (joiningDate) {
              if (!/^\d{4}-\d{2}-\d{2}$/.test(joiningDate)) {
                return { error: 'Invalid joiningDate format. Use YYYY-MM-DD' };
              }
              const jd = new Date(`${joiningDate}T00:00:00`);
              const today = new Date();
              const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
              if (jd > todayMidnight) {
                return { error: 'joiningDate cannot be in the future' };
              }
            }

            let performanceScore: number | undefined;
            if (performanceScoreRaw) {
              const val = Number(performanceScoreRaw);
              if (!Number.isFinite(val) || val < 0 || val > 100) {
                return { error: 'performanceScore must be between 0 and 100' };
              }
              performanceScore = val;
            }

            let status: Employee['status'] = 'Active';
            if (statusRaw) {
              const norm = statusRaw.toLowerCase();
              const map: Record<string, Employee['status']> = {
                active: 'Active',
                'on leave': 'On Leave',
                training: 'Training',
              };
              if (!map[norm]) {
                return { error: 'status must be one of: Active, On Leave, Training' };
              }
              status = map[norm];
            }

            const value: Omit<
              Employee,
              'id' | 'efficiencyScore' | 'currentLoad' | 'skills' | 'recommendedTraining' | 'attendance'
            > & { __empId: string } = {
              __empId: employeeId,
              name,
              role,
              department,
              status,
              email: email || undefined,
              phone: phone || undefined,
              joiningDate: joiningDate || undefined,
              certifications: certifications || undefined,
              performanceScore,
            };

            return { value };
          }}
          onImport={(rows) => {
            handleImportEmployees(
              rows as Array<
                Omit<
                  Employee,
                  'id' | 'efficiencyScore' | 'currentLoad' | 'skills' | 'recommendedTraining' | 'attendance'
                > & { __empId: string }
              >,
            );
            setIsImportOpen(false);
          }}
          onClose={() => setIsImportOpen(false)}
        />
      )}

      {/* Voice Call Modal */}
      {isVoiceModalOpen && selectedEmployeeForCall && (
        <VoiceCallModal
          isOpen={isVoiceModalOpen}
          onClose={() => {
            setIsVoiceModalOpen(false);
            setSelectedEmployeeForCall(null);
          }}
          engineType="workforce"
          contextData={selectedEmployeeForCall}
          customerName={selectedEmployeeForCall.name}
          customerPhone={selectedEmployeeForCall.phone || '+91-9876543210'}
        />
      )}

    </div>
  );
};

export default WorkforceEngine;