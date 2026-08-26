import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import apiService from '../services/api';
import {
    Wrench, Clock, AlertTriangle, CheckCircle, Plus, LayoutGrid, List, Sparkles, User, Car,
    Calendar, Box, Truck, ShieldCheck, BarChart2, Activity, MapPin, Search, Zap, ClipboardList, ThumbsUp, MessageSquare
} from 'lucide-react';
import StatCard from '../components/StatCard';
import { ServiceJob } from '../types';
import AddServiceModal from '../components/AddServiceModal';
import ServiceAnalysisModal from '../components/ServiceAnalysisModal';
import ServiceScheduler from '../components/ServiceScheduler';
import ServiceInventory from '../components/ServiceInventory';
import ServiceCommunication from '../components/ServiceCommunication';
import DamageDetectionModal from '../components/DamageDetectionModal';
import RoadsideAssistanceModal from '../components/RoadsideAssistanceModal';
import QualityChecklistModal from '../components/QualityChecklistModal';
import FeedbackAnalysisModal from '../components/FeedbackAnalysisModal';
import SkillMatchingModal from '../components/SkillMatchingModal';
import { RadialBarChart, RadialBar, Legend, ResponsiveContainer, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
import CsvImportModal, { CsvColumn } from '../components/common/CsvImportModal';
import VoiceCallButton from '../components/voice/VoiceCallButton';
import VoiceCallModal from '../components/voice/VoiceCallModal';
import ServiceDashboard from '../components/dashboard/ServiceDashboard';

type ServiceView = 'overview' | 'bays' | 'maintenance' | 'technicians' | 'partsInventory' | 'operations' | 'scheduling' | 'communication' | 'quality' | 'emergency' | 'analytics';

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

const analyticsData = [
    { name: 'Mon', revenue: 45000, efficiency: 85 },
    { name: 'Tue', revenue: 52000, efficiency: 88 },
    { name: 'Wed', revenue: 48000, efficiency: 82 },
    { name: 'Thu', revenue: 61000, efficiency: 90 },
    { name: 'Fri', revenue: 55000, efficiency: 47 },
    { name: 'Sat', revenue: 68000, efficiency: 95 },
];

const serviceCsvColumns: CsvColumn[] = [
    { key: 'customerName', label: 'Customer full name', required: true },
    { key: 'email', label: 'Customer email' },
    { key: 'phone', label: 'Contact phone number', required: true },
    { key: 'vehicleModel', label: 'Vehicle make and model', required: true },
    { key: 'registrationNumber', label: 'Vehicle registration/plate number' },
    { key: 'serviceType', label: 'Type of service', required: true },
    { key: 'appointmentDate', label: 'Appointment date (YYYY-MM-DD)', required: true },
    { key: 'appointmentTime', label: 'Appointment time (HH:MM)' },
    { key: 'technician', label: 'Assigned technician name' },
    { key: 'estimatedCost', label: 'Estimated cost in INR' },
    { key: 'notes', label: 'Service notes or special instructions' },
];

const serviceSampleRows = [
    {
        customerName: 'Rohan Gupta',
        email: 'rohan@example.com',
        phone: '+91-9876543212',
        vehicleModel: 'Honda City',
        registrationNumber: 'MH01AB1234',
        serviceType: 'Regular Service',
        appointmentDate: '2025-12-05',
        appointmentTime: '10:00',
        technician: 'Amit K.',
        estimatedCost: '8500',
        notes: '20000 km service',
    },
    {
        customerName: 'Meera Reddy',
        email: 'meera@example.com',
        phone: '+91-9876543213',
        vehicleModel: 'Tata Harrier',
        registrationNumber: 'KA02CD5678',
        serviceType: 'Brake Repair',
        appointmentDate: '2025-12-06',
        appointmentTime: '14:30',
        technician: 'Rajesh S.',
        estimatedCost: '4500',
        notes: 'Brake pad replacement needed',
    },
];

const ServiceEngine: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Determine active view from current route
    const getActiveView = (): ServiceView => {
        const path = location.pathname;
        if (path === '/service/bays') return 'bays';
        if (path === '/service/maintenance') return 'maintenance';
        if (path === '/service/technicians') return 'technicians';
        if (path === '/service/inventory') return 'partsInventory';
        if (path === '/service/operations') return 'operations';
        if (path === '/service/scheduler') return 'scheduling';
        if (path === '/service/communication') return 'communication';
        if (path === '/service/quality') return 'quality';
        if (path === '/service/emergency') return 'emergency';
        if (path === '/service/analytics') return 'analytics';
        return 'overview'; // Default to overview
    };

    const activeView = getActiveView();
    const [jobs, setJobs] = useState<ServiceJob[]>(initialJobs);
    const [viewMode, setViewMode] = useState<'list' | 'bay'>('list');

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState<ServiceJob | null>(null);
    const [isAnalysisOpen, setIsAnalysisOpen] = useState(false);
    const [isDamageModalOpen, setIsDamageModalOpen] = useState(false);
    const [isRoadsideModalOpen, setIsRoadsideModalOpen] = useState(false);
    const [isQualityModalOpen, setIsQualityModalOpen] = useState(false);
    const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
    const [isTechAssignModalOpen, setIsTechAssignModalOpen] = useState(false);
    const [isImportOpen, setIsImportOpen] = useState(false);
    const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
    const [selectedCustomerForCall, setSelectedCustomerForCall] = useState<ServiceJob | null>(null);

    /* Django API Integration */
    const [isLoading, setIsLoading] = useState(true);

    // Fetch jobs from Django backend API
    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const data = await apiService.get<any[]>('/api/v1/service/job-cards/');

                if (data && Array.isArray(data)) {
                    const mappedJobs: ServiceJob[] = data.map(job => ({
                        id: job.job_card_number || job.id,
                        customer: job.customer_name || `${job.customer?.first_name || ''} ${job.customer?.last_name || ''}`.trim() || 'Unknown',
                        vehicle: job.vehicle_model || job.vehicle?.model || 'Unknown',
                        issue: job.customer_complaints || job.issue || 'General Service',
                        status: job.status as any,
                        priority: job.priority as any || 'Medium',
                        technician: job.assigned_technician_name || job.technician || 'Unassigned',
                        bay: job.allocated_bay_name || job.bay || 'Unassigned',
                        predictedCompletion: job.estimated_delivery_date || 'TBD',
                        phone: job.customer_phone,
                        email: job.customer_email,
                        aiInsights: {
                            diagnosisConfidence: 85,
                            partsRequired: [],
                            partsAvailability: 'In Stock',
                            estimatedCost: job.estimated_total_cost?.toString() || job.estimated_cost?.toString() || '0'
                        }
                    }));
                    setJobs(mappedJobs);
                }
            } catch (error) {
                console.error('Error fetching jobs from Django API:', error);
                // Fallback to initialJobs if backend is unavailable
                setJobs(initialJobs);
            } finally {
                setIsLoading(false);
            }
        };

        fetchJobs();

        // Poll for updates every 30 seconds (replaces Supabase real-time)
        const interval = setInterval(fetchJobs, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleAddJob = async (newJobData: Omit<ServiceJob, 'id' | 'status' | 'aiInsights'>) => {
        try {
            // Create job card via Django API
            const response = await apiService.post<any>('/api/v1/service/job-cards/', {
                customer_complaints: newJobData.issue,
                priority: newJobData.priority || 'Medium',
                // Additional fields would be mapped from the form
            });

            if (response?.id) {
                // Refetch jobs to get the server-generated data
                const data = await apiService.get<any[]>('/api/v1/service/job-cards/');
                if (data && Array.isArray(data)) {
                    // Re-map and set (reuse the same mapping logic)
                    setJobs(data.map(job => ({
                        id: job.job_card_number || job.id,
                        customer: job.customer_name || 'Unknown',
                        vehicle: job.vehicle_model || 'Unknown',
                        issue: job.customer_complaints || 'General Service',
                        status: job.status as any,
                        priority: job.priority as any || 'Medium',
                        technician: job.assigned_technician_name || 'Unassigned',
                        bay: job.allocated_bay_name || 'Unassigned',
                        predictedCompletion: job.estimated_delivery_date || 'TBD',
                        phone: job.customer_phone,
                        email: job.customer_email,
                        aiInsights: {
                            diagnosisConfidence: 85,
                            partsRequired: [],
                            partsAvailability: 'In Stock',
                            estimatedCost: job.estimated_total_cost?.toString() || '0'
                        }
                    })));
                }
            }
        } catch (error) {
            console.error('Error creating job via Django API:', error);
            // Fallback: add to local state
            const newJob: ServiceJob = {
                ...newJobData,
                id: `SV-00${jobs.length + 1}`,
                status: 'Pending',
                aiInsights: { diagnosisConfidence: 85, partsRequired: ['Diagnostic Scan'], partsAvailability: 'In Stock', estimatedCost: 'TBD' }
            };
            setJobs([newJob, ...jobs]);
        }
    };

    const handleImportJobs = (rows: Omit<ServiceJob, 'id' | 'status' | 'aiInsights'>[]) => {
        const startIndex = jobs.length + 1;
        const importedJobs: ServiceJob[] = rows.map((data, idx) => {
            const baseId = startIndex + idx;
            const numericCost = Number((data as any).__estimatedCost || 0);

            return {
                ...data,
                id: `SV-${String(baseId).padStart(3, '0')}`,
                status: 'Pending',
                aiInsights: {
                    diagnosisConfidence: 85,
                    partsRequired: ['Diagnostic Scan'],
                    partsAvailability: 'In Stock',
                    estimatedCost: Number.isFinite(numericCost) && numericCost > 0 ? String(numericCost) : 'TBD',
                },
            };
        });

        setJobs([...importedJobs, ...jobs]);
    };

    const handleAnalyze = (job: ServiceJob) => {
        setSelectedJob(job);
        setIsAnalysisOpen(true);
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col">

            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-4 shrink-0">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <Wrench className="text-orange-600" /> Service AI Engine
                    </h1>
                    <p className="text-slate-500">Unified Operations: Predictive Maintenance, Scheduling & Quality.</p>
                </div>

                <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-200 w-full xl:w-auto overflow-x-auto no-scrollbar">
                    {[
                        { id: 'overview', label: 'Overview', icon: Activity },
                        { id: 'bays', label: 'Service Bays', icon: LayoutGrid },
                        { id: 'maintenance', label: 'Predictive Maintenance', icon: AlertTriangle },
                        { id: 'technicians', label: 'Technicians', icon: User },
                        { id: 'partsInventory', label: 'Parts Inventory', icon: Box },
                        { id: 'operations', label: 'Operations', icon: Wrench },
                        { id: 'scheduling', label: 'Scheduler', icon: Calendar },
                        { id: 'communication', label: 'Comm. & Voice', icon: MessageSquare },
                        { id: 'quality', label: 'Quality & CX', icon: ShieldCheck },
                        { id: 'emergency', label: 'Emergency', icon: Truck },
                        { id: 'analytics', label: 'Analytics', icon: BarChart2 },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => {
                                // Navigate to dedicated page
                                const routeMap: Record<string, string> = {
                                    'overview': '/service',
                                    'bays': '/service/bays',
                                    'maintenance': '/service/maintenance',
                                    'technicians': '/service/technicians',
                                    'partsInventory': '/service/inventory',
                                    'operations': '/service/operations',
                                    'scheduling': '/service/scheduler',
                                    'communication': '/service/communication',
                                    'quality': '/service/quality',
                                    'emergency': '/service/emergency',
                                    'analytics': '/service/analytics'
                                };
                                navigate(routeMap[tab.id]);
                            }}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeView === tab.id
                                    ? 'bg-orange-600 text-white shadow-md'
                                    : 'text-slate-600 hover:bg-slate-50'
                                }`}
                        >
                            <tab.icon size={16} /> {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 shrink-0">
                <StatCard title="Service Completion" value="92%" trend="4.5%" trendUp={true} icon={<CheckCircle size={24} />} color="green" />
                <StatCard title="Avg Service Time" value="3.2 Hrs" trend="-15 mins" trendUp={true} icon={<Clock size={24} />} color="blue" />
                <StatCard title="Technician Utilization" value="88%" trend="Optimal" icon={<User size={24} />} color="purple" />
                <StatCard title="Parts Availability" value="96%" trend="Stable" icon={<Box size={24} />} color="orange" />
            </div>

            {/* Enterprise Analytics Dashboard */}
            <div className="shrink-0">
                <ServiceDashboard />
            </div>

            <div className="flex-1 min-h-0 overflow-auto">
                {activeView === 'overview' && (
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
                                                                <Car size={16} className="text-slate-500" />
                                                            </div>
                                                            <div>
                                                                <div>{job.vehicle}</div>
                                                                <div className="text-xs text-slate-400 font-normal">{job.customer}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-slate-600">
                                                        <div>{job.issue}</div>
                                                        <span className={`text-[10px] font-bold uppercase tracking-wider ${job.priority === 'Critical' ? 'text-red-600' :
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
                                                            {job.status === 'In Progress' && (
                                                                <div className="w-24 h-1 bg-slate-100 rounded-full overflow-hidden">
                                                                    <div className="h-full bg-blue-500 w-2/3 animate-pulse"></div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-slate-600">
                                                        <div className="flex items-center gap-1.5">
                                                            <User size={14} className="text-slate-400" />
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
                                                            <button className="flex-1 py-1 text-[10px] bg-blue-50 text-blue-700 rounded border border-blue-100 hover:bg-blue-100">
                                                                Status
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
                )}

                {activeView === 'bays' && (
                    <div className="space-y-6">
                        <div className="bg-gradient-to-r from-teal-50 to-blue-50 border border-teal-200 rounded-xl p-8 text-center">
                            <LayoutGrid size={48} className="mx-auto text-teal-600 mb-4" />
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">Service Bay Management</h2>
                            <p className="text-slate-600 mb-4">Visual bay layout with drag-and-drop scheduling, real-time status tracking, and AI-powered bay utilization optimization.</p>
                            <div className="inline-flex items-center gap-2 bg-teal-100 text-teal-700 px-4 py-2 rounded-lg text-sm font-medium">
                                <Sparkles size={16} /> Coming Soon - Task 2
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white p-6 rounded-xl border border-slate-200">
                                <h3 className="font-bold text-slate-900 mb-2">Features</h3>
                                <ul className="text-sm text-slate-600 space-y-2">
                                    <li>• Visual bay layout with real-time status</li>
                                    <li>• Drag-and-drop job assignment</li>
                                    <li>• Bay utilization analytics</li>
                                    <li>• Queue management with priority</li>
                                </ul>
                            </div>
                            <div className="bg-white p-6 rounded-xl border border-slate-200">
                                <h3 className="font-bold text-slate-900 mb-2">AI Capabilities</h3>
                                <ul className="text-sm text-slate-600 space-y-2">
                                    <li>• Optimal bay assignment recommendations</li>
                                    <li>• Conflict detection and resolution</li>
                                    <li>• Throughput maximization</li>
                                    <li>• Schedule optimization</li>
                                </ul>
                            </div>
                            <div className="bg-white p-6 rounded-xl border border-slate-200">
                                <h3 className="font-bold text-slate-900 mb-2">Benefits</h3>
                                <ul className="text-sm text-slate-600 space-y-2">
                                    <li>• 400% higher throughput</li>
                                    <li>• 89% bay utilization</li>
                                    <li>• Reduced wait times</li>
                                    <li>• Better resource allocation</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                {activeView === 'maintenance' && (
                    <div className="space-y-6">
                        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-8 text-center">
                            <AlertTriangle size={48} className="mx-auto text-amber-600 mb-4" />
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">Predictive Maintenance</h2>
                            <p className="text-slate-600 mb-4">AI-powered maintenance forecasting, vehicle health timelines, warranty analysis, and proactive service scheduling.</p>
                            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-2 rounded-lg text-sm font-medium">
                                <Sparkles size={16} /> Coming Soon - Task 3
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white p-6 rounded-xl border border-slate-200">
                                <h3 className="font-bold text-slate-900 mb-2">Features</h3>
                                <ul className="text-sm text-slate-600 space-y-2">
                                    <li>• AI maintenance predictions</li>
                                    <li>• Vehicle health timelines</li>
                                    <li>• Parts failure forecasting</li>
                                    <li>• Cost estimation</li>
                                </ul>
                            </div>
                            <div className="bg-white p-6 rounded-xl border border-slate-200">
                                <h3 className="font-bold text-slate-900 mb-2">Warranty Tools</h3>
                                <ul className="text-sm text-slate-600 space-y-2">
                                    <li>• Coverage verification</li>
                                    <li>• Claim tracking</li>
                                    <li>• Expiration alerts</li>
                                    <li>• Utilization analytics</li>
                                </ul>
                            </div>
                            <div className="bg-white p-6 rounded-xl border border-slate-200">
                                <h3 className="font-bold text-slate-900 mb-2">Benefits</h3>
                                <ul className="text-sm text-slate-600 space-y-2">
                                    <li>• 85% prediction accuracy</li>
                                    <li>• Prevent breakdowns</li>
                                    <li>• Maximize warranty claims</li>
                                    <li>• Proactive scheduling</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                {activeView === 'technicians' && (
                    <div className="space-y-6">
                        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-8 text-center">
                            <User size={48} className="mx-auto text-purple-600 mb-4" />
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">Technician Management</h2>
                            <p className="text-slate-600 mb-4">Skill-based job matching, performance tracking, workload balancing, and mobile technician interface.</p>
                            <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-lg text-sm font-medium">
                                <Sparkles size={16} /> Coming Soon - Task 5
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white p-6 rounded-xl border border-slate-200">
                                <h3 className="font-bold text-slate-900 mb-2">Features</h3>
                                <ul className="text-sm text-slate-600 space-y-2">
                                    <li>• Skill matrix visualization</li>
                                    <li>• AI job matching</li>
                                    <li>• Performance metrics</li>
                                    <li>• Certification tracking</li>
                                </ul>
                            </div>
                            <div className="bg-white p-6 rounded-xl border border-slate-200">
                                <h3 className="font-bold text-slate-900 mb-2">Mobile App</h3>
                                <ul className="text-sm text-slate-600 space-y-2">
                                    <li>• Touch-optimized interface</li>
                                    <li>• Job details and status updates</li>
                                    <li>• Technical information access</li>
                                    <li>• Parts request system</li>
                                </ul>
                            </div>
                            <div className="bg-white p-6 rounded-xl border border-slate-200">
                                <h3 className="font-bold text-slate-900 mb-2">Benefits</h3>
                                <ul className="text-sm text-slate-600 space-y-2">
                                    <li>• 92% team efficiency</li>
                                    <li>• Optimal workload distribution</li>
                                    <li>• 4.7/5 quality score</li>
                                    <li>• 94% on-time completion</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                {activeView === 'partsInventory' && (
                    <div className="space-y-6">
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-8 text-center">
                            <Box size={48} className="mx-auto text-green-600 mb-4" />
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">Parts Inventory Management</h2>
                            <p className="text-slate-600 mb-4">AI demand forecasting, automated reordering, stock alerts, and supplier performance tracking.</p>
                            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-lg text-sm font-medium">
                                <Sparkles size={16} /> Coming Soon - Task 6
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white p-6 rounded-xl border border-slate-200">
                                <h3 className="font-bold text-slate-900 mb-2">Features</h3>
                                <ul className="text-sm text-slate-600 space-y-2">
                                    <li>• Real-time stock tracking</li>
                                    <li>• Critical stock alerts</li>
                                    <li>• Purchase order management</li>
                                    <li>• Supplier performance metrics</li>
                                </ul>
                            </div>
                            <div className="bg-white p-6 rounded-xl border border-slate-200">
                                <h3 className="font-bold text-slate-900 mb-2">AI Forecasting</h3>
                                <ul className="text-sm text-slate-600 space-y-2">
                                    <li>• Demand prediction</li>
                                    <li>• Automated reordering</li>
                                    <li>• Seasonal adjustments</li>
                                    <li>• Bulk discount alerts</li>
                                </ul>
                            </div>
                            <div className="bg-white p-6 rounded-xl border border-slate-200">
                                <h3 className="font-bold text-slate-900 mb-2">Benefits</h3>
                                <ul className="text-sm text-slate-600 space-y-2">
                                    <li>• 96% parts availability</li>
                                    <li>• 98% stock accuracy</li>
                                    <li>• Prevent stockouts</li>
                                    <li>• Cost optimization</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                {activeView === 'scheduling' && (
                    <div className="h-full">
                        <ServiceScheduler />
                    </div>
                )}

                {activeView === 'communication' && (
                    <div className="h-full">
                        <ServiceCommunication />
                    </div>
                )}

                {activeView === 'quality' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div
                                onClick={() => setIsDamageModalOpen(true)}
                                className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                            >
                                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                                    <Search size={24} className="text-blue-600" />
                                </div>
                                <h3 className="font-bold text-lg text-slate-900 mb-1">Deep Scan Damage Detection</h3>
                                <p className="text-sm text-slate-500">AI Vision analysis for automated damage assessment and cost estimation.</p>
                            </div>

                            <div
                                onClick={() => setIsQualityModalOpen(true)}
                                className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                            >
                                <div className="w-12 h-12 bg-teal-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-teal-100 transition-colors">
                                    <ClipboardList size={24} className="text-teal-600" />
                                </div>
                                <h3 className="font-bold text-lg text-slate-900 mb-1">Quality Assurance Audit</h3>
                                <p className="text-sm text-slate-500">Digital checklist with photo proofing and compliance tracking.</p>
                            </div>

                            <div
                                onClick={() => setIsFeedbackModalOpen(true)}
                                className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                            >
                                <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-indigo-100 transition-colors">
                                    <ThumbsUp size={24} className="text-indigo-600" />
                                </div>
                                <h3 className="font-bold text-lg text-slate-900 mb-1">Feedback Intelligence</h3>
                                <p className="text-sm text-slate-500">NPS tracking and sentiment analysis from customer reviews.</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl border border-slate-100 p-6">
                            <h3 className="font-bold text-slate-900 mb-4">Quality Trends</h3>
                            <div className="h-64 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400">
                                Placeholder for Quality Trend Chart
                            </div>
                        </div>
                    </div>
                )}

                {activeView === 'emergency' && (
                    <div className="space-y-6">
                        <div className="bg-red-50 border border-red-100 rounded-xl p-6 flex justify-between items-center">
                            <div>
                                <h3 className="font-bold text-xl text-red-900">Roadside Assistance Dispatch</h3>
                                <p className="text-red-700 mt-1">Manage emergency requests, track technician location, and ensure rapid response.</p>
                            </div>
                            <button
                                onClick={() => setIsRoadsideModalOpen(true)}
                                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-red-200 flex items-center gap-2"
                            >
                                <Truck size={20} /> Open Dispatch Console
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <StatCard title="Avg Response Time" value="12 mins" trend="-2 mins" trendUp={true} icon={<Clock size={24} />} color="green" />
                            <StatCard title="Active Requests" value="3" trend="High Demand" icon={<AlertTriangle size={24} />} color="red" />
                            <StatCard title="Technicians Available" value="8" icon={<User size={24} />} color="blue" />
                        </div>
                    </div>
                )}

                {activeView === 'analytics' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                                <h3 className="font-bold text-slate-900 mb-4">Service Revenue & Efficiency</h3>
                                <div className="h-72">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={analyticsData}>
                                            <defs>
                                                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.1} />
                                                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                            <YAxis yAxisId="left" orientation="left" stroke="#f97316" axisLine={false} tickLine={false} />
                                            <YAxis yAxisId="right" orientation="right" stroke="#3b82f6" axisLine={false} tickLine={false} domain={[0, 100]} />
                                            <Tooltip />
                                            <Legend />
                                            <Area yAxisId="left" type="monotone" dataKey="revenue" stroke="#f97316" fillOpacity={1} fill="url(#colorRev)" name="Revenue (₹)" />
                                            <Area yAxisId="right" type="monotone" dataKey="efficiency" stroke="#3b82f6" fillOpacity={0} strokeWidth={2} name="Efficiency %" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                                <h3 className="font-bold text-slate-900 mb-4">Predictive Failure Analysis</h3>
                                <div className="h-72">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RadialBarChart cx="50%" cy="50%" innerRadius="10%" outerRadius="80%" barSize={10} data={[
                                            { name: 'Battery', uv: 31.47, fill: '#8884d8' },
                                            { name: 'Brakes', uv: 26.69, fill: '#83a6ed' },
                                            { name: 'Engine', uv: 15.69, fill: '#8dd1e1' },
                                            { name: 'Tires', uv: 8.22, fill: '#82ca9d' },
                                        ]}>
                                            <RadialBar
                                                label={{ position: 'insideStart', fill: '#fff' }}
                                                background
                                                dataKey="uv"
                                            />
                                            <Legend iconSize={10} layout="vertical" verticalAlign="middle" wrapperStyle={{ right: 0 }} />
                                        </RadialBarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>

            {/* Modals Layer */}
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

            <DamageDetectionModal
                isOpen={isDamageModalOpen}
                onClose={() => setIsDamageModalOpen(false)}
            />

            <RoadsideAssistanceModal
                isOpen={isRoadsideModalOpen}
                onClose={() => setIsRoadsideModalOpen(false)}
            />

            <QualityChecklistModal
                isOpen={isQualityModalOpen}
                onClose={() => setIsQualityModalOpen(false)}
            />

            <FeedbackAnalysisModal
                isOpen={isFeedbackModalOpen}
                onClose={() => setIsFeedbackModalOpen(false)}
            />

            <SkillMatchingModal
                isOpen={isTechAssignModalOpen}
                onClose={() => setIsTechAssignModalOpen(false)}
                employees={[]}
            />

            {isImportOpen && (
                <CsvImportModal
                    isOpen={isImportOpen}
                    title="Import Service Appointments"
                    description="Upload service_appointments_template.csv to bulk create service jobs. Required: customerName, phone, vehicleModel, serviceType, appointmentDate."
                    columns={serviceCsvColumns}
                    sampleRows={serviceSampleRows}
                    mapRow={(raw) => {
                        const trim = (v: unknown) => (v == null ? '' : String(v).trim());

                        const customerName = trim((raw as any).customerName);
                        const email = trim((raw as any).email);
                        const phone = trim((raw as any).phone);
                        const vehicleModel = trim((raw as any).vehicleModel);
                        const registrationNumber = trim((raw as any).registrationNumber);
                        const serviceType = trim((raw as any).serviceType);
                        const appointmentDate = trim((raw as any).appointmentDate);
                        const appointmentTime = trim((raw as any).appointmentTime);
                        const technician = trim((raw as any).technician);
                        const estimatedCostRaw = trim((raw as any).estimatedCost);
                        const notes = trim((raw as any).notes);

                        if (!customerName) return { error: 'customerName is required' };
                        if (!phone) return { error: 'phone is required' };
                        if (!vehicleModel) return { error: 'vehicleModel is required' };
                        if (!serviceType) return { error: 'serviceType is required' };
                        if (!appointmentDate) return { error: 'appointmentDate is required' };

                        const phoneClean = phone.replace(/\s+/g, '');
                        if (!/^\+?[0-9\-]+$/.test(phoneClean)) {
                            return { error: 'Invalid phone format. Use country code, e.g. +91-9876543210' };
                        }

                        if (email) {
                            const emailRegex = /[^@\s]+@[^@\s]+\.[^@\s]+/;
                            if (!emailRegex.test(email)) {
                                return { error: 'Invalid email format' };
                            }
                        }

                        if (!/^\d{4}-\d{2}-\d{2}$/.test(appointmentDate)) {
                            return { error: 'Invalid appointmentDate format. Use YYYY-MM-DD' };
                        }

                        const date = new Date(`${appointmentDate}T00:00:00`);
                        const today = new Date();
                        const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
                        if (date < todayMidnight) {
                            return { error: 'Appointment date cannot be in the past' };
                        }

                        if (appointmentTime) {
                            if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(appointmentTime)) {
                                return { error: 'Invalid appointmentTime format. Use HH:MM (24h)' };
                            }
                        }

                        if (estimatedCostRaw) {
                            const cost = Number(estimatedCostRaw.replace(/,/g, ''));
                            if (!Number.isFinite(cost) || cost <= 0) {
                                return { error: 'estimatedCost must be a positive number (no currency symbols)' };
                            }
                        }

                        const vehicle = registrationNumber
                            ? `${vehicleModel} (${registrationNumber})`
                            : vehicleModel;

                        const predictedCompletion = appointmentTime
                            ? `Planned ${appointmentDate} ${appointmentTime}`
                            : `Planned ${appointmentDate}`;

                        const value: any = {
                            customer: customerName,
                            vehicle,
                            issue: serviceType,
                            predictedCompletion,
                            bay: 'Unassigned',
                            technician: technician || 'Unassigned',
                            priority: 'Medium' as const,
                            email: email || undefined,
                            phone,
                            notes: notes || undefined,
                            appointmentDate,
                            appointmentTime: appointmentTime || undefined,
                            registrationNumber: registrationNumber || undefined,
                        } as Omit<ServiceJob, 'id' | 'status' | 'aiInsights'> & { __estimatedCost?: string };

                        value.__estimatedCost = estimatedCostRaw || '';

                        return { value };
                    }}
                    onImport={(rows) => {
                        handleImportJobs(
                            rows as Omit<ServiceJob, 'id' | 'status' | 'aiInsights'>[],
                        );
                        setIsImportOpen(false);
                    }}
                    onClose={() => setIsImportOpen(false)}
                />
            )}

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

export default ServiceEngine;