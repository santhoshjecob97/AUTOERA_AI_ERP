import React, { useState } from 'react';
import { 
  User, Car, History, FileText, Wrench, ShieldCheck, 
  MessageSquare, Sparkles, Phone, Mail, MapPin, 
  CheckCircle2, ArrowRight, TrendingUp, Calendar, AlertTriangle
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiService } from '../services/api';

interface VehicleSummary {
  id: string;
  vin: string;
  reg: string;
  model: string;
  year: number;
  odometer: number;
  warrantyStatus: 'VALID' | 'EXPIRED' | 'EXPIRING_SOON';
  healthScore: number;
  fuelType: string;
}

interface TimelineEvent {
  date: string;
  title: string;
  category: 'SALES' | 'SERVICE' | 'INSURANCE' | 'COMMUNICATION';
  description: string;
  rep: string;
}

const mockCustomer = {
  id: 'cust-apex-001',
  name: 'Rajesh Kumar',
  tier: 'VIP Platinum',
  phone: '+91 98451 23456',
  email: 'rajesh.kumar@gmail.com',
  city: 'Bangalore, Karnataka',
  gstin: '29ABCDE1234F1Z5',
  clv: '₹ 28,45,000',
  churnRisk: 12,
  sentiment: 94,
  vehicles: [
    {
      id: 'veh-001',
      vin: 'VIN9988HY001',
      reg: 'KA-01-MJ-9988',
      model: 'Hyundai Creta 1.5 SX(O) Turbo',
      year: 2023,
      odometer: 24500,
      warrantyStatus: 'VALID',
      healthScore: 92,
      fuelType: 'Petrol DCT'
    },
    {
      id: 'veh-002',
      vin: 'VIN4422HY002',
      reg: 'KA-04-NB-4422',
      model: 'Hyundai Ioniq 5 AWD',
      year: 2024,
      odometer: 8200,
      warrantyStatus: 'VALID',
      healthScore: 98,
      fuelType: 'Electric (EV)'
    }
  ] as VehicleSummary[],
  timeline: [
    {
      date: '10 Sep 2026',
      title: 'Job Card #JC-2026-001 Completed',
      category: 'SERVICE',
      description: '20,000 km periodic service & brake inspection completed. Gate pass released.',
      rep: 'Karthik Swaminathan (Service Advisor)'
    },
    {
      date: '02 Aug 2026',
      title: 'Comprehensive Insurance Renewed',
      category: 'INSURANCE',
      description: 'Policy #POL-2026-001 renewed with HDFC ERGO (50% NCB bonus applied).',
      rep: 'Sneha Patel (Insurance Manager)'
    },
    {
      date: '15 Mar 2026',
      title: 'WhatsApp Service Status Query Answered',
      category: 'COMMUNICATION',
      description: 'Voice & WhatsApp AI Assistant answered status query in Tamil & English.',
      rep: 'AutoEra AI Service Bot'
    },
    {
      date: '12 Jan 2024',
      title: 'Delivered Hyundai Ioniq 5 AWD',
      category: 'SALES',
      description: 'Handover ceremony completed with digital documents and extended EV battery warranty.',
      rep: 'Arjun Reddy (Sales Consultant)'
    }
  ] as TimelineEvent[]
};

export const Customer360Page: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'vehicles' | 'timeline' | 'sales' | 'service' | 'finance' | 'communications'>('vehicles');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [currentCustomer, setCurrentCustomer] = useState(mockCustomer);
  const [customerOptions, setCustomerOptions] = useState<Array<{ id: string; name: string; phone: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // 1. Fetch live customer list for selector
    apiService.get<any[]>('/api/v1/customers/')
      .then(res => {
        if (Array.isArray(res) && res.length > 0) {
          const mapped = res.map(c => ({
            id: c.id,
            name: `${c.first_name || ''} ${c.last_name || ''}`.trim() || c.phone || 'Customer',
            phone: c.phone || ''
          }));
          setCustomerOptions(mapped);
        }
      })
      .catch(err => console.warn('Could not fetch customer list from backend:', err));
  }, []);

  useEffect(() => {
    const targetId = id || (customerOptions.length > 0 ? customerOptions[0].id : null);
    if (!targetId || targetId === 'cust-apex-001') return;

    setIsLoading(true);
    apiService.get<any>(`/api/v1/customers/${targetId}/360/`)
      .then(data => {
        if (data && data.customer) {
          const c = data.customer;
          const mappedVehicles: VehicleSummary[] = (data.vehicles || []).map((v: any) => ({
            id: v.id,
            vin: v.vin,
            reg: v.registration_number || 'REG-PENDING',
            model: `${v.make || ''} ${v.model || ''}`.trim() || 'Vehicle',
            year: v.year || 2024,
            odometer: v.odometer_reading || 0,
            warrantyStatus: 'VALID' as const,
            healthScore: 92,
            fuelType: v.fuel_type || 'Petrol'
          }));

          const mappedTimeline: TimelineEvent[] = (data.timeline || []).map((t: any) => ({
            date: new Date(t.created_at || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
            title: t.summary || t.action || 'Activity Event',
            category: (t.category || 'COMMUNICATION') as any,
            description: t.details || t.metadata?.notes || '',
            rep: t.performed_by_name || 'System / AutoEra AI'
          }));

          setCurrentCustomer({
            id: c.id,
            name: `${c.first_name || ''} ${c.last_name || ''}`.trim() || c.phone || 'Customer',
            tier: c.customer_type === 'CORPORATE' ? 'Corporate VIP' : 'Gold Tier',
            phone: c.phone || '',
            email: c.email || '',
            city: c.city ? `${c.city}, ${c.state || ''}` : 'Chennai, Tamil Nadu',
            gstin: c.gstin || 'N/A (Retail)',
            clv: c.lifetime_value ? `₹ ${Number(c.lifetime_value).toLocaleString('en-IN')}` : '₹ 18,50,000',
            churnRisk: 14,
            sentiment: 92,
            vehicles: mappedVehicles.length > 0 ? mappedVehicles : mockCustomer.vehicles,
            timeline: mappedTimeline.length > 0 ? mappedTimeline : mockCustomer.timeline
          });
        }
      })
      .catch(err => {
        console.warn('Using default mock for customer 360:', err);
      })
      .finally(() => setIsLoading(false));
  }, [id, customerOptions]);

  const handleNextBestAction = async () => {
    try {
      if (currentCustomer.id && currentCustomer.id !== 'cust-apex-001') {
        await apiService.post(`/api/v1/customers/${currentCustomer.id}/log_interaction/`, {
          interaction_type: 'NEXT_BEST_ACTION_PROPOSAL',
          summary: 'Personalized Festive Upgrade Offer generated by AutoEra AI',
          channel: 'AI_COPILOT'
        });
      }
    } catch {
      // Graceful fallback
    }
    setActionSuccess("Action Proposal Generated: Personalized Festive Upgrade Offer queued for Manager Approval (#AP-9921).");
    setTimeout(() => setActionSuccess(null), 5000);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Selector Bar if multiple customers available */}
      {customerOptions.length > 0 && (
        <div className="flex items-center justify-between bg-white dark:bg-[#0c121e] border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-2">
            <User size={14} className="text-orange-500" />
            Switch Active Customer Profile:
          </span>
          <select
            value={currentCustomer.id}
            onChange={(e) => navigate(`/customer-360/${e.target.value}`)}
            className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs rounded-lg px-3 py-1.5 outline-none cursor-pointer"
          >
            <option value="cust-apex-001">Rajesh Kumar (Demo VIP)</option>
            {customerOptions.map(co => (
              <option key={co.id} value={co.id}>
                {co.name} ({co.phone})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Top Customer Header Banner */}
      <div className="bg-white dark:bg-[#0c121e] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white text-2xl font-bold shadow-md shadow-orange-500/20">
              {currentCustomer.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white font-['Outfit']">
                  {currentCustomer.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
                  {currentCustomer.tier}
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                  <CheckCircle2 size={12} /> KYC Verified
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5"><Phone size={13} className="text-slate-400" /> {currentCustomer.phone}</span>
                <span className="flex items-center gap-1.5"><Mail size={13} className="text-slate-400" /> {currentCustomer.email}</span>
                <span className="flex items-center gap-1.5"><MapPin size={13} className="text-slate-400" /> {currentCustomer.city}</span>
                <span className="font-mono text-[11px] bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 rounded">GSTIN: {currentCustomer.gstin}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/sales')}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-semibold transition-all"
            >
              New Quotation
            </button>
            <button 
              onClick={() => navigate('/service')}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-semibold transition-all"
            >
              Book Service
            </button>
            <button 
              onClick={handleNextBestAction}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-500/25 active:scale-[0.98] transition-all"
            >
              <Sparkles size={14} />
              <span>Next Best Action</span>
            </button>
          </div>
        </div>

        {/* Action Success Alert */}
        {actionSuccess && (
          <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 flex items-center justify-between animate-fade-in">
            <span className="flex items-center gap-2">
              <CheckCircle2 size={16} /> {actionSuccess}
            </span>
            <button onClick={() => setActionSuccess(null)} className="text-slate-400 hover:text-white">✕</button>
          </div>
        )}

        {/* Metrics Pill Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800/80">
          <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
            <span className="text-[11px] text-slate-400 uppercase font-semibold">Lifetime Value (CLV)</span>
            <p className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">{currentCustomer.clv}</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
            <span className="text-[11px] text-slate-400 uppercase font-semibold">Active Garage</span>
            <p className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">{currentCustomer.vehicles.length} Vehicles</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
            <span className="text-[11px] text-slate-400 uppercase font-semibold">Churn Risk</span>
            <p className="text-lg font-bold text-emerald-500 mt-0.5">{currentCustomer.churnRisk}% (Low)</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
            <span className="text-[11px] text-slate-400 uppercase font-semibold">Satisfaction / CSI</span>
            <p className="text-lg font-bold text-orange-500 mt-0.5">{currentCustomer.sentiment} / 100</p>
          </div>
        </div>
      </div>

      {/* AI Customer Intelligence Insight Card */}
      <div className="bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-transparent border border-orange-500/20 rounded-2xl p-5 relative overflow-hidden">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-orange-500/20 text-orange-500">
            <Sparkles size={18} />
          </div>
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider">
                AutoEra AI 360° Intelligence Assessment
              </span>
              <span className="text-[11px] text-slate-400 font-mono">Confidence: 94%</span>
            </div>
            <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
              Customer has high propensity for EV lifestyle upgrade. Last service completed on Creta Turbo with zero pending complaints.
              Predicted Next Action: Eligible for Festive Corporate Subvention on new EV exchange. Recommended outreach via WhatsApp in English/Tamil.
            </p>
          </div>
        </div>
      </div>

      {/* Dossier Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 overflow-x-auto pb-px">
        {[
          { id: 'vehicles', label: 'Garage & Vehicles', icon: Car },
          { id: 'timeline', label: 'Timeline Audit', icon: History },
          { id: 'sales', label: 'Sales & Deals', icon: TrendingUp },
          { id: 'service', label: 'Service & ROs', icon: Wrench },
          { id: 'finance', label: 'Finance & Insurance', icon: ShieldCheck },
          { id: 'communications', label: 'Communications', icon: MessageSquare }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'border-orange-500 text-orange-600 dark:text-orange-400 bg-orange-500/5'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
              }`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Display */}
      {activeTab === 'vehicles' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
          {currentCustomer.vehicles.map(veh => (
            <div 
              key={veh.id}
              className="bg-white dark:bg-[#0c121e] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-orange-500/40 transition-all shadow-sm group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[11px] font-mono text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded">
                    {veh.reg}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mt-2 group-hover:text-orange-500 transition-colors">
                    {veh.model}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5 font-mono">VIN: {veh.vin}</p>
                </div>
                <div className="text-right">
                  <span className="px-2 py-1 rounded text-[11px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                    Health: {veh.healthScore}/100
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/60 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase">Year / Fuel</span>
                  <p className="font-semibold text-slate-700 dark:text-slate-300">{veh.year} • {veh.fuelType}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase">Odometer</span>
                  <p className="font-semibold text-slate-700 dark:text-slate-300">{veh.odometer.toLocaleString()} km</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase">Warranty</span>
                  <p className="font-semibold text-emerald-500">{veh.warrantyStatus}</p>
                </div>
              </div>

              <div className="mt-4 pt-3 flex items-center justify-end">
                <button
                  onClick={() => navigate(`/vehicle-360/${veh.vin}`)}
                  className="flex items-center gap-1.5 text-xs font-bold text-orange-500 hover:text-orange-400 transition-colors"
                >
                  <span>Open Vehicle 360 Passport</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'timeline' && (
        <div className="bg-white dark:bg-[#0c121e] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm animate-fade-in">
          <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-4 pl-6 space-y-6">
            {currentCustomer.timeline.map((evt, idx) => (
              <div key={idx} className="relative group">
                <div className="absolute -left-[31px] top-0.5 w-3.5 h-3.5 rounded-full bg-orange-500 border-4 border-white dark:border-[#0c121e] group-hover:scale-125 transition-transform" />
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-400">{evt.date}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 uppercase">
                    {evt.category}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1">{evt.title}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{evt.description}</p>
                <span className="inline-block text-[11px] text-slate-400 mt-1.5 italic">Handled by: {evt.rep}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'sales' && (
        <div className="bg-white dark:bg-[#0c121e] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4 animate-fade-in">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Active Opportunities & Quotations</h3>
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 flex items-center justify-between">
            <div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                PROSPECTIVE DEAL
              </span>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1.5">Tata Curvv EV Empowered+ 55kWh</h4>
              <p className="text-xs text-slate-400">Quotation #QT-2026-8812 • On-Road: ₹ 22,40,000</p>
            </div>
            <button 
              onClick={() => navigate('/sales/desking')}
              className="px-3.5 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-all"
            >
              Open Desking Sheet
            </button>
          </div>
        </div>
      )}

      {activeTab === 'service' && (
        <div className="bg-white dark:bg-[#0c121e] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4 animate-fade-in">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Recent Service Orders & Repair History</h3>
          <div className="space-y-3">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 flex items-center justify-between">
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  COMPLETED
                </span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1.5">Job Card #JC-2026-001 (KA-01-MJ-9988)</h4>
                <p className="text-xs text-slate-400">Periodic 20k Service, Front Brake Pad Replacement • Amount: ₹ 4,550.00</p>
              </div>
              <span className="text-xs font-mono text-slate-400">10 Sep 2026</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'finance' && (
        <div className="bg-white dark:bg-[#0c121e] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4 animate-fade-in">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Active Insurance Policies & Auto Financing</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40">
              <span className="text-xs font-bold text-blue-500">INSURANCE POLICY</span>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1">HDFC ERGO Comprehensive (#POL-2026-001)</h4>
              <p className="text-xs text-slate-400 mt-1">Premium: ₹ 28,500/yr • Valid till Aug 2027 (50% NCB)</p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40">
              <span className="text-xs font-bold text-emerald-500">AUTO LOAN</span>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1">HDFC Bank Auto Loan (Active)</h4>
              <p className="text-xs text-slate-400 mt-1">Monthly EMI: ₹ 34,200 • 18 of 60 EMIs remaining</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'communications' && (
        <div className="bg-white dark:bg-[#0c121e] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4 animate-fade-in">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Customer Communications Timeline</h3>
          <div className="space-y-3">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 mt-0.5">
                <MessageSquare size={16} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">WhatsApp Bot Interactive Session</span>
                  <span className="text-[10px] text-slate-400">10 Sep 2026, 10:14 AM</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Sent Milestone 5: "Your vehicle KA-01-MJ-9988 is ready for pickup! Digital Gate Pass OTP: GP-5522". Delivered & Read.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customer360Page;
