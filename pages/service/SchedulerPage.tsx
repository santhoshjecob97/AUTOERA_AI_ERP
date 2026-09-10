import React, { useState } from 'react';
import { 
  Calendar, Clock, User, Filter, ChevronLeft, ChevronRight, Plus, 
  Check, ArrowLeft, Sparkles, AlertTriangle, ShieldCheck, Wrench,
  CheckCircle2, Car, MapPin
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface WorkshopSlot {
  id: string;
  bayName: string;
  bayType: 'Express 60-Min' | 'Mechanical Lift' | 'Diagnostic & ECM' | 'EV High-Voltage' | 'Wheel Alignment' | 'Paint Booth';
  timeSlot: string;
  customerName: string;
  phone: string;
  vehicle: string;
  regNumber: string;
  servicePackage: string;
  technician: string;
  techSkillLevel: 'L1 (Routine)' | 'L2 (Diagnostic)' | 'L3 (Master / EV)';
  status: 'SCHEDULED' | 'IN_BAY' | 'QC_READY' | 'COMPLETED' | 'NO_SHOW';
}

const pilotSlots: WorkshopSlot[] = [
  {
    id: 'SLOT-01',
    bayName: 'Bay 01 — Express Service',
    bayType: 'Express 60-Min',
    timeSlot: '09:00 - 10:00 AM',
    customerName: 'Anandhan Murugan',
    phone: '+91-9840221144',
    vehicle: 'Maruti Suzuki Brezza ZXi',
    regNumber: 'TN-09-CB-4012',
    servicePackage: '20,000 km Periodic Service',
    technician: 'Ramesh K.',
    techSkillLevel: 'L1 (Routine)',
    status: 'IN_BAY'
  },
  {
    id: 'SLOT-02',
    bayName: 'Bay 04 — EV High-Voltage Isolation',
    bayType: 'EV High-Voltage',
    timeSlot: '10:00 - 11:30 AM',
    customerName: 'Kavitha Sundar',
    phone: '+91-9841883300',
    vehicle: 'Tata Nexon EV Max LR',
    regNumber: 'TN-07-EV-9182',
    servicePackage: 'BMS SOH Calibration & Coolant Flush',
    technician: 'Saravanan M. (Certified)',
    techSkillLevel: 'L3 (Master / EV)',
    status: 'IN_BAY'
  },
  {
    id: 'SLOT-03',
    bayName: 'Bay 02 — Two-Post Lift',
    bayType: 'Mechanical Lift',
    timeSlot: '11:00 - 12:30 PM',
    customerName: 'Muthukumar S.',
    phone: '+91-9444778899',
    vehicle: 'Mahindra XUV700 AX7',
    regNumber: 'TN-14-AX-5511',
    servicePackage: 'Front Brake Rotor & Pad Replacement',
    technician: 'Dinesh Babu',
    techSkillLevel: 'L2 (Diagnostic)',
    status: 'SCHEDULED'
  },
  {
    id: 'SLOT-04',
    bayName: 'Bay 07 — Wheel Alignment & Balance',
    bayType: 'Wheel Alignment',
    timeSlot: '11:30 - 12:15 PM',
    customerName: 'Dr. Arunachalam',
    phone: '+91-9791443322',
    vehicle: 'Hyundai Creta 1.5 Turbo',
    regNumber: 'TN-10-CR-1199',
    servicePackage: '3D Laser Alignment & Balancing',
    technician: 'Vignesh P.',
    techSkillLevel: 'L1 (Routine)',
    status: 'SCHEDULED'
  },
  {
    id: 'SLOT-05',
    bayName: 'Bay 05 — Diagnostic ECM Scan',
    bayType: 'Diagnostic & ECM',
    timeSlot: '01:30 - 03:00 PM',
    customerName: 'Gopinath V.',
    phone: '+91-9940112288',
    vehicle: 'Tata Harrier XZA+',
    regNumber: 'TN-02-HR-8833',
    servicePackage: 'Check Engine DPF Regeneration & Sensor Check',
    technician: 'Saravanan M.',
    techSkillLevel: 'L3 (Master / EV)',
    status: 'SCHEDULED'
  },
  {
    id: 'SLOT-06',
    bayName: 'Bay 08 — Dust-Free Paint Booth',
    bayType: 'Paint Booth',
    timeSlot: '02:00 - 05:00 PM',
    customerName: 'Deepak Rajan',
    phone: '+91-9884001144',
    vehicle: 'Kia Seltos Facelift',
    regNumber: 'TN-22-KL-4490',
    servicePackage: 'Left Bumper & Fender Scratch Repair',
    technician: 'Mani K.',
    techSkillLevel: 'L2 (Diagnostic)',
    status: 'SCHEDULED'
  }
];

const SchedulerPage: React.FC = () => {
  const navigate = useNavigate();
  const [slots, setSlots] = useState<WorkshopSlot[]>(pilotSlots);
  const [selectedBayFilter, setSelectedBayFilter] = useState('ALL');
  const [activeNotification, setActiveNotification] = useState<string | null>(null);

  const filteredSlots = selectedBayFilter === 'ALL'
    ? slots
    : slots.filter(s => s.bayType.includes(selectedBayFilter));

  const handleStatusToggle = (slotId: string) => {
    setSlots(prev => prev.map(s => {
      if (s.id === slotId) {
        const nextStatus = s.status === 'SCHEDULED' ? 'IN_BAY' :
                           s.status === 'IN_BAY' ? 'QC_READY' :
                           s.status === 'QC_READY' ? 'COMPLETED' : 'SCHEDULED';
        return { ...s, status: nextStatus };
      }
      return s;
    }));
    setActiveNotification('Updated bay workflow stage & dispatched customer WhatsApp status update.');
    setTimeout(() => setActiveNotification(null), 3500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header Banner */}
      <div className="bg-[#0D1117] border border-slate-800/90 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/service')}
              className="p-2.5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-xl transition-all"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-wider mb-1.5">
                <Sparkles size={13} className="text-orange-500" />
                Section 06 &bull; 12-Bay Workshop Scheduler &amp; Skill Matrix
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-['Outfit'] flex items-center gap-3">
                Workshop Bay Control Tower &amp; Appointments
              </h1>
              <p className="text-slate-400 text-sm">
                Real-time appointment slot balancing, technician L1/L2/L3 skill matching, EV high-voltage safety clearance &amp; automated stage updates.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-orange-500/20 transition-all cursor-pointer">
              <Plus size={15} />
              <span>Book Walk-in Service</span>
            </button>
          </div>
        </div>
      </div>

      {/* Action Notification */}
      {activeNotification && (
        <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2.5 animate-in fade-in">
          <CheckCircle2 size={16} />
          <span>{activeNotification}</span>
        </div>
      )}

      {/* Bay Type Filter Strip */}
      <div className="bg-[#0D1117] border border-slate-800/90 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Bay Filter:</span>
          {['ALL', 'Express', 'Lift', 'Diagnostic', 'EV High-Voltage', 'Wheel Alignment', 'Paint'].map(bay => (
            <button
              key={bay}
              onClick={() => setSelectedBayFilter(bay)}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                selectedBayFilter === bay 
                  ? 'bg-orange-500 text-white shadow-xs' 
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {bay}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4 text-xs text-slate-400">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> In Bay</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Scheduled</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Ready QC</span>
        </div>
      </div>

      {/* Scheduled Bay Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSlots.map(slot => {
          const isInBay = slot.status === 'IN_BAY';
          const isQC = slot.status === 'QC_READY';

          return (
            <div 
              key={slot.id}
              className={`p-5 rounded-xl border bg-[#0D1117] transition-all flex flex-col justify-between ${
                isInBay ? 'border-cyan-500/50 shadow-lg ring-1 ring-cyan-500/20' :
                isQC ? 'border-emerald-500/50 shadow-lg ring-1 ring-emerald-500/20' :
                'border-slate-800/90 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="text-[11px] font-mono text-orange-400 font-bold uppercase">{slot.bayName}</span>
                    <h4 className="text-sm font-black text-white font-['Outfit'] mt-0.5">{slot.vehicle}</h4>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black border ${
                    isInBay ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40' :
                    isQC ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' :
                    'bg-slate-800 text-slate-300 border-slate-700'
                  }`}>
                    {slot.status}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1.5 text-xs text-slate-300 mb-3">
                  <p className="font-semibold text-white">{slot.servicePackage}</p>
                  <p className="text-[11px] text-slate-400 font-mono">Reg: {slot.regNumber}</p>
                  <p className="text-[11px] text-slate-400">Customer: <strong className="text-slate-200">{slot.customerName}</strong> ({slot.phone})</p>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 py-1 border-t border-slate-800/60">
                  <div className="flex items-center gap-1.5">
                    <Clock size={13} className="text-cyan-400" />
                    <span>{slot.timeSlot}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-300 font-semibold">{slot.technician}</span>
                    <span className="text-[10px] text-orange-400 block font-mono">{slot.techSkillLevel}</span>
                  </div>
                </div>
              </div>

              {/* Action Stage Button */}
              <div className="pt-4 mt-2 border-t border-slate-800/80">
                <button
                  onClick={() => handleStatusToggle(slot.id)}
                  className="w-full py-2 px-3 rounded-lg bg-slate-900 border border-slate-700 hover:border-orange-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Wrench size={13} className="text-orange-400" />
                  <span>Advance Stage &rarr;</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SchedulerPage;
