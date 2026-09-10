import React, { useState } from 'react';
import { 
  Wrench, Users, Clock, AlertTriangle, CheckCircle2, 
  Sparkles, Bot, MessageSquare, ArrowRight, Activity, Zap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const WorkshopCommandPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState<'EN' | 'TA' | 'HI'>('EN');
  const [whatsappSent, setWhatsappSent] = useState<string | null>(null);

  const bays = [
    {
      id: 'b1',
      name: 'Bay 1 — Express Lube',
      type: 'EXPRESS',
      status: 'OCCUPIED',
      vehicle: 'KA-01-MJ-9988 (Creta)',
      tech: 'Suresh Babu (L1 Master)',
      progress: 85,
      etaMins: 15,
      jobCard: 'JC-2026-001'
    },
    {
      id: 'b2',
      name: 'Bay 2 — General Mechanical',
      type: 'GENERAL',
      status: 'OCCUPIED',
      vehicle: 'KA-04-NB-4422 (Venue)',
      tech: 'Manoj Nair (L2 Tech)',
      progress: 42,
      etaMins: 45,
      jobCard: 'JC-2026-002'
    },
    {
      id: 'b3',
      name: 'Bay 3 — EV & Electrical Diagnostics',
      type: 'EV_DIAG',
      status: 'AVAILABLE',
      vehicle: 'Queued: Ioniq 5 (BMS Imbalance)',
      tech: 'Abdul Rahim (L3 EV Certified)',
      progress: 0,
      etaMins: 0,
      jobCard: 'Pending Allocation'
    },
    {
      id: 'b4',
      name: 'Bay 4 — 3D Laser Alignment',
      type: 'ALIGNMENT',
      status: 'OCCUPIED',
      vehicle: 'KA-05-PQ-7711 (Tucson)',
      tech: 'Pradeep Patil (L1)',
      progress: 92,
      etaMins: 8,
      jobCard: 'JC-2026-003'
    },
    {
      id: 'b5',
      name: 'Bay 5 — Quality Control & Detailing',
      type: 'WASH_QC',
      status: 'AVAILABLE',
      vehicle: 'Idle — Ready for Inspection',
      tech: 'Quality Inspector Team',
      progress: 0,
      etaMins: 0,
      jobCard: 'Ready'
    }
  ];

  const technicians = [
    { name: 'Suresh Babu', tier: 'L1 Periodic Master', efficiency: 98.5, activeJob: 'JC-2026-001' },
    { name: 'Manoj Nair', tier: 'L2 Engine Diagnostic', efficiency: 94.0, activeJob: 'JC-2026-002' },
    { name: 'Abdul Rahim', tier: 'L3 High-Voltage EV', efficiency: 96.2, activeJob: 'Standby' },
    { name: 'Pradeep Patil', tier: 'L1 Express Tech', efficiency: 99.0, activeJob: 'JC-2026-003' },
  ];

  const aiExplanations = {
    EN: "Customer reported brake scraping noise. Diagnostic confirmed front brake pads are worn down to 2mm (below 3mm safety limit), causing metal contact with disc rotor. Replacement of pads and rotor skimming is recommended to restore full braking performance and vehicle safety.",
    TA: "வாடிக்கையாளர் பிரேக் சத்தம் வருவதாக தெரிவித்தார். பரிசோதனையில் முன் பிரேக் பேட்கள் 2 மிமீ வரை தேய்ந்துபோயுள்ளது உறுதி செய்யப்பட்டது. முழுமையான பிரேக்கிங் பாதுகாப்புக்கு புதிய பிரேக் பேட்கள் பொருத்துவது அவசியமாகிறது.",
    HI: "ग्राहक ने ब्रेक से रगड़ने की आवाज आने की सूचना दी। निरीक्षण में पाया गया कि फ्रंट ब्रेक पैड 2 मिमी तक घिस गए हैं। सुरक्षित ड्राइविंग और कुशल ब्रेकिंग के लिए ब्रेक पैड बदलना अनिवार्य है।"
  };

  const handleSendWhatsApp = () => {
    setWhatsappSent("Customer WhatsApp notification dispatched with bilingual audio summary and 1-click digital approval link.");
    setTimeout(() => setWhatsappSent(null), 5000);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#0c121e] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div>
          <span className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider">
            Fixed Operations Command Center
          </span>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-1 font-['Outfit']">
            Workshop Bay Live Dispatch & AI Service Advisor
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            5 Active Bays • 4 Technicians • Average Bay Utilization: <strong className="text-emerald-500">86.4%</strong>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => navigate('/service')}
            className="px-4 py-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 transition-all"
          >
            Job Card Board
          </button>
        </div>
      </div>

      {whatsappSent && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-xs text-emerald-400 flex items-center justify-between animate-fade-in">
          <span className="flex items-center gap-2">
            <CheckCircle2 size={16} /> {whatsappSent}
          </span>
          <button onClick={() => setWhatsappSent(null)} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* 5-Bay Live Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {bays.map(bay => (
          <div 
            key={bay.id}
            className={`p-4 rounded-2xl border transition-all ${
              bay.status === 'OCCUPIED'
                ? 'bg-white dark:bg-[#0c121e] border-slate-200 dark:border-slate-800'
                : 'bg-emerald-500/5 border-emerald-500/30 dark:bg-emerald-950/10'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase">{bay.type}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                bay.status === 'OCCUPIED' ? 'bg-orange-500/10 text-orange-500' : 'bg-emerald-500/10 text-emerald-500'
              }`}>
                {bay.status}
              </span>
            </div>

            <h3 className="text-xs font-bold text-slate-900 dark:text-white mt-2 truncate">{bay.name}</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 truncate">{bay.vehicle}</p>
            <p className="text-[10px] text-slate-400 mt-0.5 truncate">{bay.tech}</p>

            {bay.status === 'OCCUPIED' ? (
              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                <div className="flex justify-between text-[10px] font-semibold text-slate-500">
                  <span>Progress</span>
                  <span>{bay.progress}% (~{bay.etaMins}m left)</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mt-1.5 overflow-hidden">
                  <div className="h-full bg-orange-500 rounded-full" style={{ width: `${bay.progress}%` }} />
                </div>
              </div>
            ) : (
              <div className="mt-4 pt-3 border-t border-emerald-500/20 text-center">
                <span className="text-[11px] font-bold text-emerald-500">Ready for Vehicle</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Two Column Section: AI Service Advisor (Left 7) & Technician Matrix (Right 5) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: AI Service Advisor Bot (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-[#0c121e] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-orange-500/20 text-orange-500">
                <Bot size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">AutoEra AI Service Advisor</h3>
                <p className="text-[11px] text-slate-400">Plain-language repair translation & customer objection handling</p>
              </div>
            </div>

            {/* Language Switcher */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-800 text-[11px]">
              {(['EN', 'TA', 'HI'] as const).map(lang => (
                <button
                  key={lang}
                  onClick={() => setSelectedLanguage(lang)}
                  className={`px-2 py-0.5 rounded font-bold transition-all ${
                    selectedLanguage === lang
                      ? 'bg-orange-500 text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {lang === 'EN' ? 'English' : lang === 'TA' ? 'தமிழ்' : 'हिंदी'}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800 space-y-2">
            <span className="text-[10px] font-bold text-orange-500 uppercase tracking-wider">
              Diagnostic Intake: Job Card #JC-2026-001 (KA-01-MJ-9988)
            </span>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
              {aiExplanations[selectedLanguage]}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase">Estimated Repair Cost</span>
              <p className="text-base font-bold text-slate-900 dark:text-white mt-0.5">₹ 4,550.00 (Incl. GST)</p>
            </div>
            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase">Customer Approval SLA</span>
              <p className="text-base font-bold text-emerald-500 mt-0.5">Approved via WhatsApp OTP</p>
            </div>
          </div>

          <button
            onClick={handleSendWhatsApp}
            className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
          >
            <MessageSquare size={15} />
            <span>Send WhatsApp Customer Explanation ({selectedLanguage})</span>
          </button>
        </div>

        {/* Right Column: Technician Workload Matrix (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-[#0c121e] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Users size={16} className="text-blue-500" />
              <span>Technician Skill & Allocation</span>
            </h3>
            <span className="text-[11px] font-mono text-emerald-500 font-bold">4 Available</span>
          </div>

          <div className="space-y-3">
            {technicians.map((tech, idx) => (
              <div 
                key={idx}
                className="p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/40 flex items-center justify-between"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{tech.name}</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">{tech.tier}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-500">{tech.efficiency}%</span>
                  <p className="text-[10px] font-mono text-slate-400 mt-0.5">{tech.activeJob}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkshopCommandPage;
