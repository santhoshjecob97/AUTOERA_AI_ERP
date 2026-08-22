import React, { useState } from 'react';
import { Users, Search, Filter, Phone, Mail, MessageSquare, Sparkles, ChevronDown, ChevronUp, TrendingUp, Target, Calendar } from 'lucide-react';
import { Lead } from '../../types';
import VoiceCallButton from '../../components/voice/VoiceCallButton';
import VoiceCallModal from '../../components/voice/VoiceCallModal';
import UniversalVoiceCampaignSection from '../../components/voice/UniversalVoiceCampaignSection';
import PageNavigation from '../../components/common/PageNavigation';

// Mock data - categorized by AI score
const mockLeads: Lead[] = [
  // Hot Leads (85-100)
  { id: 'L001', name: 'Rajesh Kumar', vehicleInterest: 'BMW X7', budget: '₹90L', aiScore: 94, status: 'Negotiation', lastAction: 'Test drive scheduled', phone: '+91-9876543210', email: 'rajesh@example.com', priority: 'High' },
  { id: 'L002', name: 'Priya Sharma', vehicleInterest: 'Audi Q5', budget: '₹65L', aiScore: 91, status: 'Contacted', lastAction: 'Pricing sent', phone: '+91-9876543211', email: 'priya@example.com', priority: 'High' },
  { id: 'L003', name: 'Amit Patel', vehicleInterest: 'Mercedes GLE', budget: '₹85L', aiScore: 88, status: 'Negotiation', lastAction: 'Follow-up call', phone: '+91-9876543212', email: 'amit@example.com', priority: 'High' },
  
  // Warm Leads (60-84)
  { id: 'L004', name: 'Sneha Reddy', vehicleInterest: 'Volvo XC90', budget: '₹95L', aiScore: 78, status: 'Contacted', lastAction: 'Brochure sent', phone: '+91-9876543213', email: 'sneha@example.com', priority: 'Medium' },
  { id: 'L005', name: 'Vikram Singh', vehicleInterest: 'Land Rover Discovery', budget: '₹1.2Cr', aiScore: 72, status: 'New', lastAction: 'Web inquiry', phone: '+91-9876543214', email: 'vikram@example.com', priority: 'Medium' },
  { id: 'L006', name: 'Ananya Desai', vehicleInterest: 'Porsche Cayenne', budget: '₹1.5Cr', aiScore: 68, status: 'Contacted', lastAction: 'Email opened', phone: '+91-9876543215', email: 'ananya@example.com', priority: 'Medium' },
  { id: 'L007', name: 'Karthik Iyer', vehicleInterest: 'Jaguar F-PACE', budget: '₹75L', aiScore: 65, status: 'New', lastAction: 'Form submitted', phone: '+91-9876543216', email: 'karthik@example.com', priority: 'Medium' },
  
  // Cool Leads (40-59)
  { id: 'L008', name: 'Meera Nair', vehicleInterest: 'Lexus RX', budget: '₹80L', aiScore: 52, status: 'New', lastAction: 'Website visit', phone: '+91-9876543217', email: 'meera@example.com', priority: 'Low' },
  { id: 'L009', name: 'Rohan Gupta', vehicleInterest: 'BMW X5', budget: '₹85L', aiScore: 48, status: 'Contacted', lastAction: 'No response', phone: '+91-9876543218', email: 'rohan@example.com', priority: 'Low' },
  
  // Cold Leads (0-39)
  { id: 'L010', name: 'Sanjay Mehta', vehicleInterest: 'Audi Q7', budget: '₹90L', aiScore: 32, status: 'New', lastAction: 'Inquiry', phone: '+91-9876543219', email: 'sanjay@example.com', priority: 'Low' },
];

type LeadCategory = 'hot' | 'warm' | 'cool' | 'cold';

const categorizeLead = (score: number): LeadCategory => {
  if (score >= 85) return 'hot';
  if (score >= 60) return 'warm';
  if (score >= 40) return 'cool';
  return 'cold';
};

const LeadsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [expandedCategory, setExpandedCategory] = useState<LeadCategory | null>('hot');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);

  // Categorize leads
  const categorizedLeads = {
    hot: mockLeads.filter(l => categorizeLead(l.aiScore) === 'hot'),
    warm: mockLeads.filter(l => categorizeLead(l.aiScore) === 'warm'),
    cool: mockLeads.filter(l => categorizeLead(l.aiScore) === 'cool'),
    cold: mockLeads.filter(l => categorizeLead(l.aiScore) === 'cold'),
  };

  // Apply filters
  const filterLeads = (leads: Lead[]) => {
    return leads.filter(lead => {
      const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           lead.vehicleInterest.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  };

  const getCategoryColor = (category: LeadCategory) => {
    switch (category) {
      case 'hot': return 'red';
      case 'warm': return 'orange';
      case 'cool': return 'blue';
      case 'cold': return 'gray';
    }
  };

  const getCategoryIcon = (category: LeadCategory) => {
    switch (category) {
      case 'hot': return '🔥';
      case 'warm': return '🟠';
      case 'cool': return '🔵';
      case 'cold': return '⚪';
    }
  };

  const renderLeadCard = (lead: Lead) => (
    <div key={lead.id} className="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md transition-all">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h4 className="font-bold text-slate-900 text-lg">{lead.name}</h4>
          <p className="text-sm text-slate-600">{lead.vehicleInterest}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className={`px-3 py-1 rounded-full text-xs font-bold ${
            lead.aiScore >= 85 ? 'bg-red-100 text-red-700' :
            lead.aiScore >= 60 ? 'bg-orange-100 text-orange-700' :
            lead.aiScore >= 40 ? 'bg-blue-100 text-blue-700' :
            'bg-gray-100 text-gray-700'
          }`}>
            AI Score: {lead.aiScore}
          </div>
          <span className={`text-xs px-2 py-0.5 rounded-full ${
            lead.status === 'Negotiation' ? 'bg-purple-100 text-purple-700' :
            lead.status === 'Contacted' ? 'bg-blue-100 text-blue-700' :
            lead.status === 'Closed' ? 'bg-green-100 text-green-700' :
            'bg-gray-100 text-gray-700'
          }`}>
            {lead.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
        <div className="flex items-center gap-1 text-slate-600">
          <Target size={14} />
          <span>{lead.budget}</span>
        </div>
        <div className="flex items-center gap-1 text-slate-600">
          <Calendar size={14} />
          <span>{lead.lastAction}</span>
        </div>
      </div>

      <div className="flex gap-2">
        <VoiceCallButton
          engineType="sales"
          contextData={lead}
          customerName={lead.name}
          customerPhone={lead.phone || '+91-9876543210'}
          onClick={() => {
            setSelectedLead(lead);
            setIsVoiceModalOpen(true);
          }}
          variant="outline"
          size="sm"
        />
        <button className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-100 transition-colors">
          <Mail size={14} />
          Email
        </button>
        <button className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-xs font-medium hover:bg-green-100 transition-colors">
          <MessageSquare size={14} />
          WhatsApp
        </button>
      </div>
    </div>
  );

  const renderCategory = (category: LeadCategory, title: string) => {
    const leads = filterLeads(categorizedLeads[category]);
    const isExpanded = expandedCategory === category;
    const color = getCategoryColor(category);

    return (
      <div key={category} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <button
          onClick={() => setExpandedCategory(isExpanded ? null : category)}
          className={`w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors ${
            category === 'hot' ? 'bg-red-50' :
            category === 'warm' ? 'bg-orange-50' :
            category === 'cool' ? 'bg-blue-50' :
            'bg-gray-50'
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">{getCategoryIcon(category)}</span>
            <div className="text-left">
              <h3 className="font-bold text-slate-900 text-lg">{title}</h3>
              <p className="text-sm text-slate-600">{leads.length} leads</p>
            </div>
          </div>
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>

        {isExpanded && (
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {leads.length > 0 ? (
              leads.map(renderLeadCard)
            ) : (
              <div className="col-span-full text-center py-8 text-slate-400">
                No leads match your filters
              </div>
            )}
          </div>
        )}
      </div>
    );
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

      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="text-blue-600" /> Lead Management
          </h1>
          <p className="text-slate-500">Advanced lead filtering, AI scoring, and customer insights.</p>
        </div>

        <div className="flex gap-2">
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            <Users size={16} />
            Add Lead
          </button>
          <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
            <TrendingUp size={16} />
            Import
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search leads by name or vehicle..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Negotiation">Negotiation</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-4 text-white">
          <div className="text-3xl font-bold">{categorizedLeads.hot.length}</div>
          <div className="text-red-100 text-sm">🔥 Hot Leads</div>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-4 text-white">
          <div className="text-3xl font-bold">{categorizedLeads.warm.length}</div>
          <div className="text-orange-100 text-sm">🟠 Warm Leads</div>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
          <div className="text-3xl font-bold">{categorizedLeads.cool.length}</div>
          <div className="text-blue-100 text-sm">🔵 Cool Leads</div>
        </div>
        <div className="bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl p-4 text-white">
          <div className="text-3xl font-bold">{categorizedLeads.cold.length}</div>
          <div className="text-gray-100 text-sm">⚪ Cold Leads</div>
        </div>
      </div>

      {/* Voice AI Campaign Section */}
      <UniversalVoiceCampaignSection engineType="sales" />

      {/* Lead Categories */}
      <div className="space-y-4">
        {renderCategory('hot', '🔥 HOT LEADS (85-100)')}
        {renderCategory('warm', '🟠 WARM LEADS (60-84)')}
        {renderCategory('cool', '🔵 COOL LEADS (40-59)')}
        {renderCategory('cold', '⚪ COLD LEADS (0-39)')}
      </div>

      {/* Voice Call Modal */}
      {selectedLead && (
        <VoiceCallModal
          isOpen={isVoiceModalOpen}
          onClose={() => {
            setIsVoiceModalOpen(false);
            setSelectedLead(null);
          }}
          engineType="sales"
          contextData={selectedLead}
          customerName={selectedLead.name}
          customerPhone={selectedLead.phone || '+91-9876543210'}
        />
      )}
    </div>
  );
};

export default LeadsPage;
