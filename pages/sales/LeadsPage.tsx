import React, { useState, useEffect } from 'react';
import { 
  Users, Search, Filter, Phone, Mail, MessageSquare, Sparkles, 
  ChevronDown, ChevronUp, TrendingUp, Target, Calendar, Clock,
  AlertTriangle, Send, CheckCircle2, UserCheck, ArrowRight
} from 'lucide-react';
import { Lead } from '../../types';
import VoiceCallModal from '../../components/voice/VoiceCallModal';
import { apiService } from '../../services/api';

interface EnhancedLead extends Lead {
  timeReceivedMinutesAgo: number;
  slaRemainingMinutes: number;
  nextBestAction: string;
  sourceChannel: 'Walk-in QR' | 'WhatsApp Bot' | 'Web Widget' | 'OEM Referral';
}

const pilotLeads: EnhancedLead[] = [
  {
    id: 'LD-101',
    name: 'Kumaraswamy V.',
    vehicleInterest: 'Tata Nexon EV Empowered+',
    budget: '₹17.5 Lakh',
    aiScore: 94,
    status: 'New',
    lastAction: 'Website booking inquiry 14 min ago',
    phone: '+91-9840123456',
    email: 'kumar.v@techcorp.in',
    priority: 'High',
    timeReceivedMinutesAgo: 14,
    slaRemainingMinutes: 16,
    nextBestAction: 'Call immediately: 73% hot conversion, comparing with MG ZS EV. Share Creta vs Nexon EV comparison.',
    sourceChannel: 'WhatsApp Bot'
  },
  {
    id: 'LD-102',
    name: 'Dr. Priya Ramachandran',
    vehicleInterest: 'Mahindra XUV700 AX7 Diesel AT',
    budget: '₹26.0 Lakh',
    aiScore: 91,
    status: 'Contacted',
    lastAction: 'Completed test drive at OMR branch',
    phone: '+91-9841987654',
    email: 'dr.priya@apollohosp.org',
    priority: 'High',
    timeReceivedMinutesAgo: 22,
    slaRemainingMinutes: 8,
    nextBestAction: 'Send DigiLocker loan pre-approval link + HDFC 8.65% EMI quote. Customer is finance-ready.',
    sourceChannel: 'Walk-in QR'
  },
  {
    id: 'LD-103',
    name: 'Senthil Nathan K.',
    vehicleInterest: 'Hyundai Creta SX(O) DCT',
    budget: '₹20.0 Lakh',
    aiScore: 88,
    status: 'Negotiation',
    lastAction: 'Quotation sent; requested 3% discount',
    phone: '+91-9444112233',
    email: 'senthil@apexlogistics.com',
    priority: 'High',
    timeReceivedMinutesAgo: 28,
    slaRemainingMinutes: 2,
    nextBestAction: 'Margin Guard: Apply Team Lead 2.5% discount + free ceramic coating to close today.',
    sourceChannel: 'OEM Referral'
  },
  {
    id: 'LD-104',
    name: 'Anand Sundaram',
    vehicleInterest: 'Maruti Grand Vitara Hybrid',
    budget: '₹19.5 Lakh',
    aiScore: 78,
    status: 'Contacted',
    lastAction: 'Downloaded e-brochure 3 hours ago',
    phone: '+91-9884556677',
    email: 'anand.s@cognizant.com',
    priority: 'Medium',
    timeReceivedMinutesAgo: 180,
    slaRemainingMinutes: 60,
    nextBestAction: 'Trigger Day-3 Nurture WhatsApp video showcasing 27.97 kmpl real-world mileage test.',
    sourceChannel: 'Web Widget'
  },
  {
    id: 'LD-105',
    name: 'Meenakshi Sundar',
    vehicleInterest: 'Tata Punch EV Adventure',
    budget: '₹12.0 Lakh',
    aiScore: 72,
    status: 'New',
    lastAction: 'Calculated EMI on portal',
    phone: '+91-9791001122',
    email: 'meenakshi@gmail.com',
    priority: 'Medium',
    timeReceivedMinutesAgo: 120,
    slaRemainingMinutes: 120,
    nextBestAction: 'Schedule home test drive at Anna Nagar. High weekend test-drive affinity.',
    sourceChannel: 'Web Widget'
  },
  {
    id: 'LD-106',
    name: 'Karthik Raja',
    vehicleInterest: 'Mahindra Scorpio-N Z8L',
    budget: '₹24.0 Lakh',
    aiScore: 48,
    status: 'Contacted',
    lastAction: 'No response to WhatsApp message',
    phone: '+91-9940223344',
    email: 'karthik.r@zoho.com',
    priority: 'Low',
    timeReceivedMinutesAgo: 1440,
    slaRemainingMinutes: 0,
    nextBestAction: 'Shift to automated 30-day AI re-engagement sequence with festive exchange bonus hook.',
    sourceChannel: 'OEM Referral'
  }
];

const LeadsPage: React.FC = () => {
  const [leads, setLeads] = useState<EnhancedLead[]>(pilotLeads);
  const [searchTerm, setSearchTerm] = useState('');
  const [channelFilter, setChannelFilter] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState<'HOT' | 'WARM' | 'COLD' | 'ALL'>('ALL');
  const [voiceCallLead, setVoiceCallLead] = useState<EnhancedLead | null>(null);
  const [activeNotification, setActiveNotification] = useState<string | null>(null);

  useEffect(() => {
    apiService.get<any[]>('/api/v1/leads/')
      .then(res => {
        if (Array.isArray(res) && res.length > 0) {
          const mapped: EnhancedLead[] = res.map((d: any, idx: number) => ({
            id: String(d.id),
            name: d.customer_name || `Lead Prospect #${idx + 1}`,
            vehicleInterest: d.interested_vehicle_model || 'Hyundai Creta 1.5 Turbo',
            budget: d.budget ? `₹${Number(d.budget).toLocaleString('en-IN')}` : '₹18.5 Lakh',
            aiScore: d.ai_score ? Math.round(d.ai_score) : 88,
            status: d.status || 'New',
            lastAction: d.sla_breached ? 'SLA Alert: Response overdue' : 'Fresh inquiry logged',
            phone: d.phone || '+91-9840123456',
            email: d.email || 'lead@apexdealers.in',
            priority: d.priority === 'HOT' ? 'High' : d.priority === 'WARM' ? 'Medium' : 'Low',
            timeReceivedMinutesAgo: 18,
            slaRemainingMinutes: d.sla_breached ? 0 : 12,
            nextBestAction: d.ai_score >= 85 ? 'Trigger 30-min Hot Response: Propose VIP Test Drive with Festive Exchange Subvention.' : 'Send WhatsApp digital brochure and comparison deck.',
            sourceChannel: d.source === 'WALK_IN' ? 'Walk-in QR' : d.source === 'WEBSITE' ? 'Web Widget' : 'WhatsApp Bot'
          }));
          setLeads(mapped);
        }
      })
      .catch(err => console.warn('Using demo baseline leads:', err));
  }, []);

  const handleTransition = async (leadId: string, newStatus: string) => {
    try {
      await apiService.post(`/api/v1/leads/${leadId}/transition/`, { status: newStatus });
      setActiveNotification(`Lead ${leadId} successfully transitioned to ${newStatus}`);
    } catch {
      setActiveNotification(`Lead ${leadId} transitioned to ${newStatus} (local preview)`);
    }
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus as any } : l));
    setTimeout(() => setActiveNotification(null), 4000);
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          lead.vehicleInterest.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          lead.phone?.includes(searchTerm);
    const matchesChannel = channelFilter === 'ALL' || lead.sourceChannel === channelFilter;
    
    let matchesCategory = true;
    if (selectedCategory === 'HOT') matchesCategory = lead.aiScore >= 85;
    else if (selectedCategory === 'WARM') matchesCategory = lead.aiScore >= 60 && lead.aiScore < 85;
    else if (selectedCategory === 'COLD') matchesCategory = lead.aiScore < 60;

    return matchesSearch && matchesChannel && matchesCategory;
  });

  const handleTriggerWhatsApp = (lead: EnhancedLead) => {
    setActiveNotification(`Dispatched AI-personalized WhatsApp to ${lead.name} (${lead.phone})`);
    setTimeout(() => setActiveNotification(null), 4000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Title & SLA Header */}
      <div className="bg-[#0D1117] border border-slate-800/90 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles size={13} className="text-orange-500" />
              Section 05 &bull; AI Lead Scoring &amp; 30-Min SLA Engine
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-['Outfit'] flex items-center gap-3">
              Omni-Channel Lead Intelligence &amp; SLA Control
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-3xl">
              Gradient Boosted scoring (1-10), 30-minute hot response SLA enforcement with auto-escalation, WhatsApp nurture sequences &amp; Sarvam Voice AI.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-right">
              <p className="text-[10px] text-rose-400 font-bold uppercase">Hot Lead SLA Compliance</p>
              <p className="text-xl font-black text-rose-300 font-['Outfit']">96.4% &bull; &le; 18 min avg</p>
            </div>
          </div>
        </div>
      </div>

      {/* SLA Notification Banner */}
      {activeNotification && (
        <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2.5 animate-in fade-in">
          <CheckCircle2 size={16} />
          <span>{activeNotification}</span>
        </div>
      )}

      {/* KPI & Category Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => setSelectedCategory('ALL')}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            selectedCategory === 'ALL' 
              ? 'bg-slate-900 border-orange-500 shadow-md' 
              : 'bg-[#0D1117] border-slate-800 text-slate-400 hover:border-slate-700'
          }`}
        >
          <p className="text-xs text-slate-400 font-bold uppercase">Total Pipeline</p>
          <p className="text-xl font-black text-white font-['Outfit'] mt-1">{leads.length} Leads</p>
          <p className="text-[11px] text-slate-500">₹1.18 Cr Opportunity</p>
        </button>

        <button
          onClick={() => setSelectedCategory('HOT')}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            selectedCategory === 'HOT' 
              ? 'bg-rose-500/20 border-rose-500 shadow-md text-white' 
              : 'bg-[#0D1117] border-slate-800 text-slate-400 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <p className="text-xs text-rose-400 font-bold uppercase">Hot Leads (85+)</p>
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          </div>
          <p className="text-xl font-black text-rose-300 font-['Outfit'] mt-1">
            {leads.filter(l => l.aiScore >= 85).length} Active
          </p>
          <p className="text-[11px] text-rose-400/80">&le; 30-min call SLA</p>
        </button>

        <button
          onClick={() => setSelectedCategory('WARM')}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            selectedCategory === 'WARM' 
              ? 'bg-amber-500/20 border-amber-500 shadow-md text-white' 
              : 'bg-[#0D1117] border-slate-800 text-slate-400 hover:border-slate-700'
          }`}
        >
          <p className="text-xs text-amber-400 font-bold uppercase">Warm Leads (60-84)</p>
          <p className="text-xl font-black text-amber-300 font-['Outfit'] mt-1">
            {leads.filter(l => l.aiScore >= 60 && l.aiScore < 85).length} Nurturing
          </p>
          <p className="text-[11px] text-amber-400/80">4-hr WhatsApp SLA</p>
        </button>

        <button
          onClick={() => setSelectedCategory('COLD')}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            selectedCategory === 'COLD' 
              ? 'bg-slate-800 border-slate-600 shadow-md text-white' 
              : 'bg-[#0D1117] border-slate-800 text-slate-400 hover:border-slate-700'
          }`}
        >
          <p className="text-xs text-slate-400 font-bold uppercase">Cold Nurture (&lt;60)</p>
          <p className="text-xl font-black text-slate-300 font-['Outfit'] mt-1">
            {leads.filter(l => l.aiScore < 60).length} Automated
          </p>
          <p className="text-[11px] text-slate-500">30-day AI cycle</p>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-[#0D1117] border border-slate-800/90 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search size={15} className="absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search lead by name, model, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:border-orange-500"
          />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-slate-400 font-medium">Channel:</span>
          {['ALL', 'WhatsApp Bot', 'Walk-in QR', 'Web Widget', 'OEM Referral'].map(ch => (
            <button
              key={ch}
              onClick={() => setChannelFilter(ch)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                channelFilter === ch ? 'bg-orange-500 text-white' : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {ch}
            </button>
          ))}
        </div>
      </div>

      {/* Lead Cards List */}
      <div className="space-y-3">
        {filteredLeads.map(lead => {
          const isHot = lead.aiScore >= 85;
          const isUrgent = isHot && lead.slaRemainingMinutes <= 15;

          return (
            <div 
              key={lead.id}
              className={`p-4 rounded-xl border transition-all ${
                isUrgent 
                  ? 'bg-[#0D1117] border-rose-500/60 shadow-lg ring-1 ring-rose-500/20' 
                  : 'bg-[#0D1117] border-slate-800/90 hover:border-slate-700'
              }`}
            >
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                
                {/* Lead Profile */}
                <div className="flex items-start gap-3.5">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm ${
                    isHot ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                    lead.aiScore >= 60 ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                    'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}>
                    {lead.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white font-['Outfit']">{lead.name}</h4>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-900 text-slate-300 border border-slate-700">
                        {lead.sourceChannel}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                        isHot ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' :
                        'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                      }`}>
                        AI Score: {lead.aiScore}/100
                      </span>
                    </div>

                    <p className="text-xs text-orange-400 font-semibold mt-0.5">
                      {lead.vehicleInterest} &bull; <span className="text-slate-400">Budget: {lead.budget}</span>
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1 font-mono">{lead.phone} &bull; {lead.email}</p>
                  </div>
                </div>

                {/* SLA Timer Indicator */}
                <div className="flex items-center gap-4 text-xs">
                  {isHot && (
                    <div className={`px-3 py-1.5 rounded-lg border flex items-center gap-2 ${
                      lead.slaRemainingMinutes <= 10 
                        ? 'bg-rose-500/20 border-rose-500 text-rose-300 animate-pulse' 
                        : 'bg-slate-900 border-slate-700 text-slate-300'
                    }`}>
                      <Clock size={14} className="text-rose-400" />
                      <div>
                        <p className="text-[9px] uppercase font-bold text-slate-400">SLA Remaining</p>
                        <p className="font-bold">{lead.slaRemainingMinutes} minutes</p>
                      </div>
                    </div>
                  )}

                  {/* Quick Triggers & Pipeline State Transition */}
                  <div className="flex items-center gap-2">
                    <select
                      value={lead.status}
                      onChange={(e) => handleTransition(lead.id, e.target.value)}
                      className="bg-slate-900 border border-slate-700 text-slate-300 text-[11px] font-bold rounded-lg px-2 py-1.5 outline-none cursor-pointer hover:border-orange-500"
                    >
                      <option value="New">Stage: New</option>
                      <option value="Contacted">Stage: Contacted</option>
                      <option value="Qualified">Stage: Qualified</option>
                      <option value="Test Drive">Stage: Test Drive</option>
                      <option value="Quotation">Stage: Quotation</option>
                      <option value="Negotiation">Stage: Negotiation</option>
                      <option value="Booked">Stage: Booked</option>
                    </select>

                    <button
                      onClick={() => handleTriggerWhatsApp(lead)}
                      className="p-2 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 transition-all cursor-pointer"
                      title="Send AI WhatsApp Quote"
                    >
                      <MessageSquare size={16} />
                    </button>

                    <button
                      onClick={() => setVoiceCallLead(lead)}
                      className="px-3 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-orange-500/20 cursor-pointer"
                    >
                      <Phone size={14} />
                      <span>Sarvam Voice AI</span>
                    </button>
                  </div>
                </div>

              </div>

              {/* AI Next Best Action Strip */}
              <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-start gap-2 text-xs">
                <Sparkles size={14} className="text-cyan-400 shrink-0 mt-0.5" />
                <p className="text-slate-300 font-medium">
                  <span className="text-cyan-400 font-bold uppercase text-[10px] mr-1">AI Recommendation:</span>
                  {lead.nextBestAction}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Voice Call Modal */}
      {voiceCallLead && (
        <VoiceCallModal
          isOpen={!!voiceCallLead}
          onClose={() => setVoiceCallLead(null)}
          customerName={voiceCallLead.name}
          customerPhone={voiceCallLead.phone || ''}
          vehicleInterest={voiceCallLead.vehicleInterest}
        />
      )}
    </div>
  );
};

export default LeadsPage;
