import React, { useState } from 'react';
import { 
  Car, Palette, Settings, Share2, Save, Sparkles, IndianRupee, 
  Check, Send, ShieldCheck, FileText, ChevronRight, Zap, CheckCircle2,
  AlertCircle, Download
} from 'lucide-react';

interface DealershipVehicle {
  id: string;
  name: string;
  variant: string;
  fuelType: 'EV' | 'PETROL' | 'DIESEL' | 'HYBRID';
  basePrice: number;
  rtoPct: number; // State RTO % (e.g. TN/KA ~12-14%, EV ~0-4%)
  insuranceZeroDep: number;
  fastagHypothecation: number;
  extendedWarranty: number;
  image: string;
  specs: {
    power: string;
    rangeOrMileage: string;
    transmission: string;
    seating: string;
  };
}

const dealershipCatalog: DealershipVehicle[] = [
  {
    id: 'nexon-ev',
    name: 'Tata Nexon EV',
    variant: 'Empowered+ LR 45kWh',
    fuelType: 'EV',
    basePrice: 1699000,
    rtoPct: 4.0, // Subsidized EV RTO
    insuranceZeroDep: 64500,
    fastagHypothecation: 2500,
    extendedWarranty: 28000,
    image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&auto=format&fit=crop&q=60',
    specs: {
      power: '142.6 bhp',
      rangeOrMileage: '465 km ARAI',
      transmission: 'Single Speed AT',
      seating: '5 Seater'
    }
  },
  {
    id: 'xuv700',
    name: 'Mahindra XUV700',
    variant: 'AX7 Luxury Pack Diesel AT AWD',
    fuelType: 'DIESEL',
    basePrice: 2399000,
    rtoPct: 14.5,
    insuranceZeroDep: 98000,
    fastagHypothecation: 2500,
    extendedWarranty: 38000,
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=60',
    specs: {
      power: '182.4 bhp',
      rangeOrMileage: '16.5 kmpl',
      transmission: '6-Speed Torque Converter',
      seating: '7 Seater'
    }
  },
  {
    id: 'creta',
    name: 'Hyundai Creta',
    variant: 'SX (O) 1.5 Turbo DCT',
    fuelType: 'PETROL',
    basePrice: 1999000,
    rtoPct: 13.0,
    insuranceZeroDep: 72000,
    fastagHypothecation: 2500,
    extendedWarranty: 26000,
    image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&auto=format&fit=crop&q=60',
    specs: {
      power: '157.8 bhp',
      rangeOrMileage: '18.4 kmpl',
      transmission: '7-Speed Dual Clutch',
      seating: '5 Seater'
    }
  },
  {
    id: 'grand-vitara',
    name: 'Maruti Grand Vitara',
    variant: 'Alpha+ Strong Hybrid e-CVT',
    fuelType: 'HYBRID',
    basePrice: 1983000,
    rtoPct: 11.0,
    insuranceZeroDep: 69000,
    fastagHypothecation: 2500,
    extendedWarranty: 24000,
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&auto=format&fit=crop&q=60',
    specs: {
      power: '114.4 bhp Combined',
      rangeOrMileage: '27.97 kmpl ARAI',
      transmission: 'e-CVT Electric',
      seating: '5 Seater'
    }
  }
];

const exteriorColors = [
  { name: 'Pristine White Pearl', hex: '#F8FAFC', cost: 0 },
  { name: 'Daytona Grey Metallic', hex: '#475569', cost: 0 },
  { name: 'Flame Red Dual-Tone', hex: '#CC4500', cost: 18000 },
  { name: 'Cosmic Blue Metallic', hex: '#00C8F0', cost: 18000 },
  { name: 'Midnight Phantom Black', hex: '#0F172A', cost: 12000 }
];

const accessoryPacks = [
  { id: 'acc-1', name: 'Official Chrome & Styling Kit', cost: 24500, items: ['Front lip chrome', 'Door cladding', 'Side step sills'] },
  { id: 'acc-2', name: 'All-Weather Interior Protection', cost: 14800, items: ['7D contoured floor mats', 'Boot liner', 'Magnetic sunshades'] },
  { id: 'acc-3', name: 'Smart AI Dashcam (Dual Channel)', cost: 18500, items: ['4K front + 1080p rear', 'GPS speed logging', 'App sync'] }
];

const VirtualShowroomPage: React.FC = () => {
  const [selectedVehicle, setSelectedVehicle] = useState<DealershipVehicle>(dealershipCatalog[0]);
  const [selectedColor, setSelectedColor] = useState(exteriorColors[0]);
  const [selectedPacks, setSelectedPacks] = useState<string[]>(['acc-2']);
  const [requestedDiscount, setRequestedDiscount] = useState<number>(15000);
  const [stateRto, setStateRto] = useState<'TN' | 'KA' | 'DL'>('TN');
  const [isQuotationSent, setIsQuotationSent] = useState(false);

  // Dynamic RTO multiplier based on state
  const stateRtoMultiplier = stateRto === 'KA' ? 1.15 : stateRto === 'DL' ? 0.9 : 1.0;
  const calculatedRto = Math.round((selectedVehicle.basePrice * (selectedVehicle.rtoPct / 100)) * stateRtoMultiplier);
  
  // TCS (1% on ex-showroom above 10 Lakhs)
  const tcsAmount = selectedVehicle.basePrice > 1000000 ? Math.round(selectedVehicle.basePrice * 0.01) : 0;
  
  const accessoriesTotal = selectedPacks.reduce((acc, id) => {
    const pack = accessoryPacks.find(p => p.id === id);
    return acc + (pack ? pack.cost : 0);
  }, 0);

  const grossOnRoad = selectedVehicle.basePrice + calculatedRto + selectedVehicle.insuranceZeroDep + 
                       selectedVehicle.fastagHypothecation + selectedVehicle.extendedWarranty + 
                       selectedColor.cost + accessoriesTotal + tcsAmount;

  const netOnRoad = grossOnRoad - requestedDiscount;
  const discountPct = Math.round((requestedDiscount / selectedVehicle.basePrice) * 1000) / 10;

  // Margin Guard rule: Exec <= 2%, Team Lead <= 4%, GM <= 8%
  const approvalAuthority = discountPct <= 2 ? 'Sales Executive (Pre-Approved)' :
                           discountPct <= 4 ? 'Team Lead Approval Required' :
                           discountPct <= 8 ? 'General Manager Sign-off Required' : 'Discount Exceeds Policy Limit (Blocked)';

  const toggleAccessory = (id: string) => {
    setSelectedPacks(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSendWhatsAppQuote = () => {
    setIsQuotationSent(true);
    setTimeout(() => setIsQuotationSent(false), 4000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Title Bar */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-[#0D1117] border border-slate-800/90 rounded-2xl p-6 shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles size={13} className="text-orange-500" />
            Section 05 &bull; Virtual Showroom &amp; On-Road Price Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-['Outfit'] flex items-center gap-3">
            Digital Showroom &amp; Instant Quotation Builder
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Real-time variant comparison, state-specific RTO taxation, Margin Guard discount approvals &amp; instant WhatsApp quotation dispatch.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-xl text-xs text-slate-300">
            <span className="text-slate-400 font-medium">State RTO:</span>
            {(['TN', 'KA', 'DL'] as const).map(st => (
              <button
                key={st}
                onClick={() => setStateRto(st)}
                className={`px-2 py-0.5 rounded font-bold transition-all ${stateRto === st ? 'bg-orange-500 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Vehicle Selector Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {dealershipCatalog.map(v => {
          const isSelected = selectedVehicle.id === v.id;
          return (
            <button
              key={v.id}
              onClick={() => setSelectedVehicle(v)}
              className={`p-3.5 rounded-xl border text-left transition-all relative overflow-hidden ${
                isSelected 
                  ? 'bg-slate-900 border-orange-500 shadow-md ring-1 ring-orange-500/30' 
                  : 'bg-[#0D1117] border-slate-800 hover:border-slate-700 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-white font-['Outfit']">{v.name}</span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-slate-800 text-orange-400 border border-slate-700">
                  {v.fuelType}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate">{v.variant}</p>
              <p className="text-sm font-extrabold text-white mt-2">
                ₹{(v.basePrice / 100000).toFixed(2)} Lakh <span className="text-[10px] text-slate-400 font-normal">Ex-Showroom</span>
              </p>
            </button>
          );
        })}
      </div>

      {/* Main Visualizer & Pricing Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 7 Cols: 3D Visualizer & Customization */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-[#0D1117] border border-slate-800/90 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-black text-white font-['Outfit']">{selectedVehicle.name}</h3>
                <p className="text-xs text-orange-400 font-medium">{selectedVehicle.variant}</p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center gap-1.5">
                <Zap size={13} /> {selectedVehicle.specs.rangeOrMileage}
              </span>
            </div>

            {/* Vehicle Hero Display */}
            <div className="relative rounded-xl overflow-hidden h-64 bg-gradient-to-b from-slate-900 to-black flex items-center justify-center border border-slate-800">
              <img 
                src={selectedVehicle.image} 
                alt={selectedVehicle.name}
                className="w-full h-full object-cover opacity-90 transition-all hover:scale-105 duration-700"
              />
              <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-xs text-white flex items-center gap-3">
                <span>Power: <strong>{selectedVehicle.specs.power}</strong></span>
                &bull;
                <span>Gearbox: <strong>{selectedVehicle.specs.transmission}</strong></span>
              </div>
            </div>

            {/* Color Palette Selector */}
            <div className="mt-5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
                Exterior Color: <span className="text-white font-semibold">{selectedColor.name}</span>
                {selectedColor.cost > 0 && <span className="text-orange-400 ml-2">(+₹{selectedColor.cost.toLocaleString()})</span>}
              </label>
              <div className="flex items-center gap-3">
                {exteriorColors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c)}
                    className={`w-9 h-9 rounded-full border-2 transition-all flex items-center justify-center ${
                      selectedColor.name === c.name 
                        ? 'border-orange-500 scale-110 shadow-lg shadow-orange-500/20' 
                        : 'border-slate-700 hover:border-slate-500'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  >
                    {selectedColor.name === c.name && (
                      <Check size={14} className={c.hex === '#F8FAFC' ? 'text-black' : 'text-white'} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Genuine Accessories Packages */}
            <div className="mt-6 pt-5 border-t border-slate-800">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                Dealership Genuine Accessories Bundles
              </h4>
              <div className="space-y-2.5">
                {accessoryPacks.map((pack) => {
                  const isChecked = selectedPacks.includes(pack.id);
                  return (
                    <div
                      key={pack.id}
                      onClick={() => toggleAccessory(pack.id)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                        isChecked 
                          ? 'bg-slate-900 border-orange-500/40 text-white' 
                          : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 text-slate-400'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded flex items-center justify-center border ${isChecked ? 'bg-orange-500 border-orange-500 text-white' : 'border-slate-700'}`}>
                          {isChecked && <Check size={13} />}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">{pack.name}</p>
                          <p className="text-[11px] text-slate-400">{pack.items.join(' &bull; ')}</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-orange-400">+₹{pack.cost.toLocaleString()}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Comprehensive On-Road Breakdown & Margin Guard */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-[#0D1117] border border-slate-800/90 rounded-2xl p-6 shadow-xl">
            <h3 className="text-base font-bold text-white font-['Outfit'] pb-3 border-b border-slate-800 flex items-center justify-between">
              <span>On-Road Price Breakdown</span>
              <span className="text-xs font-mono text-cyan-400">{stateRto} Registration</span>
            </h3>

            {/* Line Item Breakdown */}
            <div className="space-y-2.5 my-4 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Ex-Showroom Price</span>
                <span className="font-bold text-white">₹{selectedVehicle.basePrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">RTO Registration ({stateRto} @ {selectedVehicle.rtoPct}%)</span>
                <span className="font-bold text-white">₹{calculatedRto.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Comprehensive Zero-Dep Insurance (1 Yr + 3 Yr TP)</span>
                <span className="font-bold text-white">₹{selectedVehicle.insuranceZeroDep.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">TCS (1% on &gt; ₹10L)</span>
                <span className="font-bold text-white">₹{tcsAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Fastag &amp; HP Endorsement</span>
                <span className="font-bold text-white">₹{selectedVehicle.fastagHypothecation.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">5-Yr Extended Warranty Shield</span>
                <span className="font-bold text-white">₹{selectedVehicle.extendedWarranty.toLocaleString()}</span>
              </div>
              {selectedColor.cost > 0 && (
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Color Premium ({selectedColor.name})</span>
                  <span className="font-bold text-orange-400">₹{selectedColor.cost.toLocaleString()}</span>
                </div>
              )}
              {accessoriesTotal > 0 && (
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Selected Accessories ({selectedPacks.length} packs)</span>
                  <span className="font-bold text-orange-400">₹{accessoriesTotal.toLocaleString()}</span>
                </div>
              )}

              {/* Discount / Margin Guard Section */}
              <div className="pt-3">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs font-bold text-slate-300">Negotiated Dealership Discount</span>
                  <span className="font-bold text-emerald-400">-₹{requestedDiscount.toLocaleString()} ({discountPct}%)</span>
                </div>
                <input 
                  type="range"
                  min="0"
                  max="120000"
                  step="5000"
                  value={requestedDiscount}
                  onChange={(e) => setRequestedDiscount(Number(e.target.value))}
                  className="w-full accent-orange-500 bg-slate-800 rounded-lg cursor-pointer h-1.5"
                />

                {/* Margin Guard Level Indicator */}
                <div className={`mt-2 p-2.5 rounded-lg text-[11px] font-semibold border ${
                  discountPct <= 2 
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                    : discountPct <= 4 
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' 
                    : discountPct <= 8 
                    ? 'bg-orange-500/10 border-orange-500/30 text-orange-400' 
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                }`}>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck size={14} />
                    <span>Margin Guard: {approvalAuthority}</span>
                  </div>
                </div>
              </div>

              {/* Net On-Road Total */}
              <div className="pt-4 border-t-2 border-slate-800 flex justify-between items-end">
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Final Net On-Road</p>
                  <p className="text-2xl font-black text-white font-['Outfit']">₹{netOnRoad.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-400">Est. EMI (60 Mo)</p>
                  <p className="text-sm font-extrabold text-cyan-400">₹{Math.round((netOnRoad * 0.8) / 48).toLocaleString()} /mo</p>
                </div>
              </div>
            </div>

            {/* Quotation Dispatch Actions */}
            <div className="space-y-2.5 pt-4">
              <button
                onClick={handleSendWhatsAppQuote}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Send size={15} />
                <span>Send PDF Quote on WhatsApp</span>
              </button>

              {isQuotationSent && (
                <div className="p-2.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 size={15} />
                  <span>Quotation PDF dispatched to customer's WhatsApp with 24-hr price lock.</span>
                </div>
              )}

              <button className="w-full py-2.5 px-4 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-600 text-slate-300 font-bold text-xs flex items-center justify-center gap-2 transition-all">
                <FileText size={15} />
                <span>Save Deal in CRM &amp; Lock VIN</span>
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default VirtualShowroomPage;
