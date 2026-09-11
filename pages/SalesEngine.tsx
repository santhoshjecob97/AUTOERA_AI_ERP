import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Target, TrendingUp, Users, Plus, Download, Sparkles, Scan, Cuboid, Zap, BrainCircuit, BarChart2, DollarSign, Bot } from 'lucide-react';
import StatCard from '../components/StatCard';
import { Lead, Notification } from '../types';
import AddLeadModal from '../components/AddLeadModal';
import AIAnalysisModal from '../components/AIAnalysisModal';
import NotificationToast from '../components/NotificationToast';
import OCRModal from '../components/OCRModal';
import VirtualShowroomModal from '../components/VirtualShowroomModal';
import CsvImportModal, { CsvColumn } from '../components/common/CsvImportModal';
import SalesDashboard from '../components/dashboard/SalesDashboard';
import VoiceCallButton from '../components/voice/VoiceCallButton';
import VoiceCallModal from '../components/voice/VoiceCallModal';
import UniversalVoiceCampaignSection from '../components/voice/UniversalVoiceCampaignSection';
import PageNavigation from '../components/common/PageNavigation';
import { apiService } from '../services/api';

type SalesView = 'overview' | 'leads' | 'showroom' | 'pricing' | 'chatbot' | 'analytics';

const initialLeads: Lead[] = [
  { id: '1', name: 'Amit Patel', vehicleInterest: 'SUV', vehicleDetails: '2023 Maruti Grand Vitara Alpha', budget: '₹18L', aiScore: 98, status: 'Negotiation', lastAction: 'Test Drive Completed' },
  { id: '2', name: 'Sarah Khan', vehicleInterest: 'Mid-size SUV', vehicleDetails: '2024 Hyundai Creta SX', budget: '₹16L', aiScore: 85, status: 'Contacted', lastAction: 'Brochure Sent' },
  { id: '3', name: 'Rahul Verma', vehicleInterest: 'Luxury SUV', vehicleDetails: '2023 Mahindra XUV700 AX7', budget: '₹24L', aiScore: 92, status: 'New', lastAction: 'Web Inquiry' },
  { id: '4', name: 'Priya Singh', vehicleInterest: 'EV', vehicleDetails: '2024 Tata Nexon EV Max', budget: '₹15L', aiScore: 45, status: 'New', lastAction: 'Walk-in' },
  { id: '5', name: 'John Doe', vehicleInterest: 'Premium SUV', vehicleDetails: '2023 Toyota Fortuner Legender', budget: '₹45L', aiScore: 78, status: 'Contacted', lastAction: 'Call Scheduled' },
];

const salesCsvColumns: CsvColumn[] = [
  { key: 'name', label: 'Lead full name', required: true },
  { key: 'email', label: 'Email address', required: true },
  { key: 'phone', label: 'Phone number', required: true },
  { key: 'vehicleInterest', label: 'Vehicle model interested in', required: true },
  { key: 'source', label: 'Lead source' },
  { key: 'budget', label: 'Budget amount in INR' },
  { key: 'status', label: 'Lead status' },
  { key: 'priority', label: 'Priority level' },
  { key: 'assignedTo', label: 'Assigned sales representative' },
  { key: 'notes', label: 'Additional notes' },
];

const salesSampleRows = [
  {
    name: 'Rajesh Kumar',
    email: 'rajesh@example.com',
    phone: '+91-9876543210',
    vehicleInterest: 'Tata Nexon EV',
    source: 'Website',
    budget: '1500000',
    status: 'New',
    priority: 'High',
    assignedTo: 'Sales Team',
    notes: 'Interested in electric vehicles',
  },
  {
    name: 'Priya Sharma',
    email: 'priya@example.com',
    phone: '+91-9876543211',
    vehicleInterest: 'MG ZS EV',
    source: 'Referral',
    budget: '1800000',
    status: 'Contacted',
    priority: 'Medium',
    assignedTo: 'Sales Team',
    notes: 'Looking for family SUV',
  },
];

const SalesEngine: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Determine active view from current route
  const getActiveView = (): SalesView => {
    const path = location.pathname;
    if (path === '/sales/leads') return 'leads';
    if (path === '/sales/showroom') return 'showroom';
    if (path === '/sales/pricing') return 'pricing';
    if (path === '/sales/chatbot') return 'chatbot';
    if (path === '/sales/analytics') return 'analytics';
    return 'overview';
  };
  
  const activeView = getActiveView();
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isAnalysisOpen, setIsAnalysisOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOCRModalOpen, setIsOCRModalOpen] = useState(false);
  const [isShowroomModalOpen, setIsShowroomModalOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [selectedLeadForCall, setSelectedLeadForCall] = useState<Lead | null>(null);

  // Fetch live CRM leads from backend
  useEffect(() => {
    apiService.get<any[]>('/api/v1/leads/')
      .then(res => {
        if (Array.isArray(res) && res.length > 0) {
          const mapped: Lead[] = res.map((d: any, idx: number) => ({
            id: String(d.id),
            name: d.customer_name || `Prospect #${idx + 1}`,
            vehicleInterest: d.interested_vehicle_model || 'SUV',
            vehicleDetails: d.interested_vehicle_model || 'Hyundai Creta 1.5 SX',
            budget: d.budget ? `₹${Number(d.budget).toLocaleString('en-IN')}` : '₹18L',
            aiScore: d.ai_score ? Math.round(d.ai_score) : 85,
            status: (d.status === 'NEW' ? 'New' : d.status === 'QUALIFIED' ? 'Contacted' : d.status === 'BOOKED' ? 'Negotiation' : 'Contacted') as any,
            lastAction: d.sla_breached ? 'SLA Follow-up Required' : 'Inbound Inquiry'
          }));
          setLeads(mapped);
        }
      })
      .catch(err => console.warn('Using initial fallback leads in SalesEngine:', err));
  }, []);

  // Simulate Real-time Notifications
  useEffect(() => {
    const interval = setInterval(() => {
      // 10% chance every 10 seconds to trigger a lead alert
      if (Math.random() > 0.9) {
        const newNotification: Notification = {
          id: Date.now().toString(),
          title: 'High Priority Lead Alert',
          message: 'New web inquiry from Vikram Malhotra (Score: 94) for Tata Harrier.',
          type: 'success',
          timestamp: new Date()
        };
        setNotifications(prev => [...prev, newNotification]);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleDismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleAddLead = async (newLeadData: Omit<Lead, 'id' | 'aiScore' | 'lastAction'>) => {
    try {
      await apiService.post('/api/v1/leads/', {
        interested_vehicle_model: newLeadData.vehicleDetails || newLeadData.vehicleInterest,
        budget: parseFloat(newLeadData.budget.replace(/[^0-9.]/g, '')) * 100000 || 1800000,
        source: 'WEBSITE',
        status: 'NEW'
      });
    } catch (err) {
      console.warn('Saved lead locally in frontend:', err);
    }
    const newLead: Lead = {
      ...newLeadData,
      id: (leads.length + 1).toString(),
      aiScore: Math.floor(Math.random() * (99 - 60) + 60), // Mock AI score simulation
      lastAction: 'Added to System'
    };
    setLeads([newLead, ...leads]);
  };

  const handleImportLeads = (imported: Omit<Lead, 'id' | 'aiScore' | 'lastAction'>[]) => {
    const startIndex = leads.length + 1;
    const importedLeads: Lead[] = imported.map((data, idx) => ({
      ...data,
      id: (startIndex + idx).toString(),
      aiScore: Math.floor(Math.random() * (99 - 60) + 60),
      lastAction: 'Imported from CSV',
    }));
    setLeads([...importedLeads, ...leads]);
  };

  const handleViewAnalysis = (lead: Lead) => {
    setSelectedLead(lead);
    setIsAnalysisOpen(true);
  };

  // Define tabs for navigation
  const tabs = [
    { id: 'overview', label: 'Overview', path: '/sales' },
    { id: 'leads', label: 'Leads', path: '/sales/leads' },
    { id: 'showroom', label: 'Virtual Showroom', path: '/sales/showroom' },
    { id: 'pricing', label: 'Pricing', path: '/sales/pricing' },
    { id: 'chatbot', label: 'Chatbot', path: '/sales/chatbot' },
    { id: 'analytics', label: 'Analytics', path: '/sales/analytics' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Page Navigation */}
      <PageNavigation
        tabs={tabs}
        engineName="Sales AI Engine"
        enginePath="/sales"
      />
      
      {/* Toast Layer */}
      <NotificationToast notifications={notifications} onDismiss={handleDismissNotification} />

      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Target className="text-blue-600" /> Sales AI Engine
          </h1>
          <p className="text-slate-500">Automated Lead Qualification, Scoring & Conversion Predictions.</p>
        </div>
        
        <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-200 w-full xl:w-auto overflow-x-auto no-scrollbar">
          {[
            { id: 'overview', label: 'Overview', icon: Target },
            { id: 'leads', label: 'Leads', icon: Users },
            { id: 'showroom', label: 'Virtual Showroom', icon: Cuboid },
            { id: 'pricing', label: 'Pricing', icon: DollarSign },
            { id: 'chatbot', label: 'Chatbot', icon: Bot },
            { id: 'analytics', label: 'Analytics', icon: BarChart2 },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                // Navigate to dedicated page
                const routeMap: Record<string, string> = {
                  'overview': '/sales',
                  'leads': '/sales/leads',
                  'showroom': '/sales/showroom',
                  'pricing': '/sales/pricing',
                  'chatbot': '/sales/chatbot',
                  'analytics': '/sales/analytics'
                };
                navigate(routeMap[tab.id]);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeView === tab.id 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <tab.icon size={16} /> {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Tab Content - Only show on /sales route */}
      <div className="flex flex-wrap gap-2 w-full xl:w-auto mb-4">
            {/* OCR Trigger */}
            <button 
              onClick={() => setIsOCRModalOpen(true)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
            >
              <Scan size={16} className="text-indigo-500"/>
              Scan Docs
            </button>
            
            {/* Virtual Showroom Trigger */}
            <button 
              onClick={() => setIsShowroomModalOpen(true)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
            >
              <Cuboid size={16} className="text-purple-500"/>
              Virtual Showroom
            </button>

            <button 
              onClick={() => setIsImportOpen(true)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
            >
              <Download size={16} />
              Import
            </button>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm shadow-blue-200"
            >
              <Plus size={16} />
              Add New Customer
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard title="Predicted Conversions" value="48" trend="12%" trendUp={true} icon={<TrendingUp size={24}/>} color="green" />
            <StatCard title="High Intent Leads" value="156" trend="5%" trendUp={true} icon={<Target size={24}/>} color="blue" />
            <StatCard title="Showroom Visits" value="32" trend="2%" trendUp={false} icon={<Users size={24}/>} color="purple" />
          </div>

          {/* Enterprise Analytics Dashboard */}
          <SalesDashboard />

          {/* Voice AI Bulk Campaign Section */}
          <UniversalVoiceCampaignSection engineType="sales" />

          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <div className="flex items-center gap-3">
             <h3 className="font-bold text-slate-900">AI Qualified Leads</h3>
             <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full border border-green-200 flex items-center gap-1">
                <Zap size={10} className="fill-current"/> Live Updates
             </span>
          </div>
          <div className="flex items-center gap-2 text-xs bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full border border-indigo-100">
            <BrainCircuit size={14} />
            <span className="font-semibold">Qualification Engine Active</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Interest & Details</th>
                <th className="px-6 py-4 font-medium">Budget</th>
                <th className="px-6 py-4 font-medium">Conversion Likelihood</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Last Action</th>
                <th className="px-6 py-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">{lead.name}</td>
                  <td className="px-6 py-4">
                    <div className="text-slate-900 font-medium">{lead.vehicleInterest}</div>
                    {lead.vehicleDetails && <div className="text-xs text-slate-500 mt-0.5">{lead.vehicleDetails}</div>}
                  </td>
                  <td className="px-6 py-4 text-slate-600">{lead.budget}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex justify-between items-center w-36">
                         <span className={`text-[10px] uppercase font-bold tracking-wider ${
                            lead.aiScore >= 85 ? 'text-green-600' : 
                            lead.aiScore >= 60 ? 'text-blue-600' : 'text-orange-500'
                         }`}>
                            {lead.aiScore >= 85 ? 'Very Likely' : lead.aiScore >= 60 ? 'Probable' : 'Unlikely'}
                         </span>
                         <span className="text-xs font-bold text-slate-700">{lead.aiScore}%</span>
                      </div>
                      <div className="w-36 bg-slate-100 rounded-full h-2 overflow-hidden">
                         <div 
                            className={`h-full rounded-full transition-all duration-1000 ease-out ${
                               lead.aiScore >= 85 ? 'bg-gradient-to-r from-green-400 to-green-600 shadow-[0_0_10px_rgba(34,197,94,0.3)]' : 
                               lead.aiScore >= 60 ? 'bg-gradient-to-r from-blue-400 to-blue-600' : 'bg-gradient-to-r from-orange-400 to-orange-600'
                            }`}
                            style={{ width: `${lead.aiScore}%` }}
                         ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${lead.status === 'Negotiation' ? 'bg-purple-100 text-purple-800' : 
                        lead.status === 'Contacted' ? 'bg-blue-100 text-blue-800' : 
                        'bg-green-100 text-green-800'}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">{lead.lastAction}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleViewAnalysis(lead)}
                        className="text-blue-600 hover:text-blue-800 font-medium text-xs flex items-center gap-1.5 px-2 py-1 hover:bg-blue-50 rounded transition-colors"
                      >
                        <Sparkles size={14} />
                        AI Analysis
                      </button>
                      <VoiceCallButton
                        engineType="sales"
                        contextData={lead}
                        customerName={lead.name}
                        customerPhone={lead.phone || '+91-9876543210'}
                        onClick={() => {
                          setSelectedLeadForCall(lead);
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
      </div>

      <AddLeadModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onAdd={handleAddLead} 
      />
      
      <AIAnalysisModal 
        isOpen={isAnalysisOpen}
        onClose={() => setIsAnalysisOpen(false)}
        lead={selectedLead}
      />

      <OCRModal 
        isOpen={isOCRModalOpen}
        onClose={() => setIsOCRModalOpen(false)}
      />

      <VirtualShowroomModal 
        isOpen={isShowroomModalOpen}
        onClose={() => setIsShowroomModalOpen(false)}
      />

      {isImportOpen && (
        <CsvImportModal
          isOpen={isImportOpen}
          title="Import Sales Leads"
          description="Upload sales_leads_template.csv to import leads in bulk. Required: name, email, phone, vehicleInterest."
          columns={salesCsvColumns}
          sampleRows={salesSampleRows}
          mapRow={(raw) => {
            const trim = (v: unknown) => (v == null ? '' : String(v).trim());

            const name = trim((raw as any).name);
            const email = trim((raw as any).email);
            const phone = trim((raw as any).phone);
            const vehicleInterest = trim((raw as any).vehicleInterest);

            if (!name) return { error: 'name is required' };
            if (!email) return { error: 'email is required' };
            if (!phone) return { error: 'phone is required' };
            if (!vehicleInterest) return { error: 'vehicleInterest is required' };

            const emailRegex = /[^@\s]+@[^@\s]+\.[^@\s]+/;
            if (!emailRegex.test(email)) return { error: 'Invalid email format' };

            const phoneClean = phone.replace(/\s+/g, '');
            if (!/^\+?[0-9\-]+$/.test(phoneClean)) {
              return { error: 'Invalid phone format. Use country code, e.g. +91-9876543210' };
            }

            const budgetRaw = trim((raw as any).budget);
            if (budgetRaw) {
              const num = Number(budgetRaw.replace(/,/g, ''));
              if (!Number.isFinite(num) || num <= 0) {
                return { error: 'Budget must be a positive number (no currency symbols)' };
              }
            }

            const statusRaw = trim((raw as any).status).toLowerCase();
            const statusMap: Record<string, Lead['status']> = {
              new: 'New',
              contacted: 'Contacted',
              negotiation: 'Negotiation',
              closed: 'Closed',
            };
            let status: Lead['status'] = 'New';
            if (statusRaw) {
              if (!statusMap[statusRaw]) {
                return { error: 'Status must be one of: New, Contacted, Negotiation, Closed' };
              }
              status = statusMap[statusRaw];
            }

            const priorityRaw = trim((raw as any).priority).toLowerCase();
            const priorityMap: Record<string, NonNullable<Lead['priority']>> = {
              high: 'High',
              medium: 'Medium',
              low: 'Low',
            };
            let priority: Lead['priority'] | undefined;
            if (priorityRaw) {
              if (!priorityMap[priorityRaw]) {
                return { error: 'Priority must be one of: High, Medium, Low' };
              }
              priority = priorityMap[priorityRaw];
            }

            const source = trim((raw as any).source) || undefined;
            const assignedTo = trim((raw as any).assignedTo) || undefined;
            const notes = trim((raw as any).notes) || undefined;

            const budget = budgetRaw || '';

            const value: Omit<Lead, 'id' | 'aiScore' | 'lastAction'> = {
              name,
              vehicleInterest,
              vehicleDetails: undefined,
              budget,
              status,
              email,
              phone,
              source,
              priority,
              assignedTo,
              notes,
            };

            return { value };
          }}
          onImport={(rows) => {
            handleImportLeads(rows as Omit<Lead, 'id' | 'aiScore' | 'lastAction'>[]);
            setIsImportOpen(false);
          }}
          onClose={() => setIsImportOpen(false)}
        />
      )}

      {/* Voice Call Modal */}
      {isVoiceModalOpen && selectedLeadForCall && (
        <VoiceCallModal
          isOpen={isVoiceModalOpen}
          onClose={() => {
            setIsVoiceModalOpen(false);
            setSelectedLeadForCall(null);
          }}
          engineType="sales"
          contextData={selectedLeadForCall}
          customerName={selectedLeadForCall.name}
          customerPhone={selectedLeadForCall.phone || '+91-9876543210'}
        />
      )}
    </div>
  );
};

export default SalesEngine;