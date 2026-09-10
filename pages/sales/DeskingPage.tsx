import React, { useState } from 'react';
import { 
  Calculator, ShieldAlert, Sparkles, CheckCircle2, 
  DollarSign, Car, User, ArrowRight, Percent, Building2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DeskingPage: React.FC = () => {
  const navigate = useNavigate();
  const [model, setModel] = useState('Tata Curvv EV Empowered+ 55kWh');
  const [exShowroom, setExShowroom] = useState<number>(2199000);
  const [accessories, setAccessories] = useState<number>(45000);
  const [insurance, setInsurance] = useState<number>(68000);
  const [warranty, setWarranty] = useState<number>(28000);
  const [rto, setRto] = useState<number>(185000);
  const [discount, setDiscount] = useState<number>(40000);
  const [tradeIn, setTradeIn] = useState<number>(250000);
  
  // Finance settings
  const [downPayment, setDownPayment] = useState<number>(400000);
  const [tenureMonths, setTenureMonths] = useState<number>(60);
  const [interestRate, setInterestRate] = useState<number>(8.75);
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [proposalSubmitted, setProposalSubmitted] = useState<string | null>(null);

  // Calculations
  const grossOnRoad = exShowroom + accessories + insurance + warranty + rto;
  const netPayable = grossOnRoad - discount - tradeIn;
  const loanAmount = Math.max(0, netPayable - downPayment);
  
  // Monthly EMI formula: [P x R x (1+R)^N]/[(1+R)^N-1]
  const monthlyRate = (interestRate / 100) / 12;
  const emi = loanAmount > 0 
    ? Math.round((loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) / (Math.pow(1 + monthlyRate, tenureMonths) - 1))
    : 0;

  // Margin calculation: Dealer margin before discount is ~8.5%
  const baseMarginAmount = exShowroom * 0.085;
  const netMarginAmount = baseMarginAmount - discount;
  const marginPct = (netMarginAmount / exShowroom) * 100;
  const isMarginBreached = marginPct < 4.0; // Floor limit 4.0%

  const handleSubmitProposal = () => {
    setProposalSubmitted("ActionProposal #AP-DSK-4109 queued: Sales Manager Priya Sharma notified for Discount Override approval.");
    setTimeout(() => setProposalSubmitted(null), 6000);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#0c121e] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div>
          <span className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider">
            AutoEra Commercial Desking Suite
          </span>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-1 font-['Outfit']">
            Interactive Vehicle Deal Sheet & Margin Guard
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Customer: <strong className="text-slate-800 dark:text-slate-200">Rajesh Kumar</strong> (VIP Platinum) • Representative: Arjun Reddy
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/customer-360')}
            className="px-3.5 py-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 transition-all"
          >
            Open Customer 360
          </button>
        </div>
      </div>

      {proposalSubmitted && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-xs text-emerald-400 flex items-center justify-between animate-fade-in">
          <span className="flex items-center gap-2">
            <CheckCircle2 size={16} /> {proposalSubmitted}
          </span>
          <button onClick={() => setProposalSubmitted(null)} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Main Grid: Itemized Desking Breakdown & Live Finance Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Price Structure (7 Cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-[#0c121e] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Car size={16} className="text-orange-500" />
              <span>Vehicle Configuration & Line Items</span>
            </h2>
            <select
              value={model}
              onChange={(e) => {
                setModel(e.target.value);
                if (e.target.value.includes('Curvv')) setExShowroom(2199000);
                else if (e.target.value.includes('Creta')) setExShowroom(1950000);
                else setExShowroom(4500000);
              }}
              className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-medium text-slate-800 dark:text-slate-200 px-3 py-1.5 outline-none cursor-pointer"
            >
              <option value="Tata Curvv EV Empowered+ 55kWh">Tata Curvv EV Empowered+ 55kWh</option>
              <option value="Hyundai Creta 1.5 SX(O) Turbo">Hyundai Creta 1.5 SX(O) Turbo</option>
              <option value="Hyundai Ioniq 5 AWD Long Range">Hyundai Ioniq 5 AWD Long Range</option>
            </select>
          </div>

          <div className="space-y-3.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400">Ex-Showroom Base Price</span>
              <span className="font-bold text-slate-900 dark:text-white">₹ {exShowroom.toLocaleString()}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400">Essential Accessories Pack</span>
              <input
                type="number"
                value={accessories}
                onChange={(e) => setAccessories(Number(e.target.value) || 0)}
                className="w-32 text-right bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded px-2 py-1 font-bold text-slate-900 dark:text-white outline-none"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400">Comprehensive Insurance (Zero Dep + RTI)</span>
              <input
                type="number"
                value={insurance}
                onChange={(e) => setInsurance(Number(e.target.value) || 0)}
                className="w-32 text-right bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded px-2 py-1 font-bold text-slate-900 dark:text-white outline-none"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400">Extended Warranty (5 Yr / 1,00,000 km)</span>
              <input
                type="number"
                value={warranty}
                onChange={(e) => setWarranty(Number(e.target.value) || 0)}
                className="w-32 text-right bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded px-2 py-1 font-bold text-slate-900 dark:text-white outline-none"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400">RTO Registration & Road Tax (Bangalore)</span>
              <span className="font-bold text-slate-900 dark:text-white">₹ {rto.toLocaleString()}</span>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex items-center justify-between font-bold text-sm">
              <span className="text-slate-700 dark:text-slate-300">Gross On-Road Total</span>
              <span className="text-slate-900 dark:text-white">₹ {grossOnRoad.toLocaleString()}</span>
            </div>

            {/* Deductions: Discount & Trade-in */}
            <div className="p-3.5 bg-slate-50 dark:bg-slate-900/60 rounded-xl space-y-2.5 border border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between text-xs">
                <span className="text-orange-500 font-semibold">Dealer Festive Discount / Subvention</span>
                <input
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value) || 0)}
                  className="w-32 text-right bg-white dark:bg-slate-800 border border-orange-500/40 rounded px-2 py-1 font-bold text-orange-500 outline-none"
                />
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-blue-500 font-semibold">Trade-in Allowance (Creta 2023 Exchange)</span>
                <input
                  type="number"
                  value={tradeIn}
                  onChange={(e) => setTradeIn(Number(e.target.value) || 0)}
                  className="w-32 text-right bg-white dark:bg-slate-800 border border-blue-500/40 rounded px-2 py-1 font-bold text-blue-500 outline-none"
                />
              </div>
            </div>

            <div className="p-4 bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl text-white flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400 uppercase font-semibold">Net Customer Payable</span>
                <p className="text-xl font-bold font-mono">₹ {netPayable.toLocaleString()}</p>
              </div>
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-bold border border-emerald-500/30">
                Ready for Desking
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Margin Guard & Loan Calculator (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Margin Guard Status Card */}
          <div className={`p-5 rounded-2xl border transition-all ${
            isMarginBreached
              ? 'bg-rose-500/10 border-rose-500/30 dark:bg-rose-950/20'
              : 'bg-white dark:bg-[#0c121e] border-slate-200 dark:border-slate-800'
          }`}>
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <ShieldAlert size={15} className={isMarginBreached ? 'text-rose-500' : 'text-emerald-500'} />
                <span>Margin Guard System</span>
              </h3>
              <span className={`text-xs font-bold px-2 py-0.5 rounded font-mono ${
                isMarginBreached ? 'bg-rose-500 text-white' : 'bg-emerald-500/10 text-emerald-500'
              }`}>
                {marginPct.toFixed(2)}% Margin
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              Target Dealership Margin: <strong>7.50%</strong> (Floor Limit: <strong>4.00%</strong>).
              {isMarginBreached && ' Current discount exceeds floor boundary. Requires Sales Manager authorization before booking.'}
            </p>

            {isMarginBreached && (
              <button
                onClick={handleSubmitProposal}
                className="mt-3.5 w-full py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-500/20 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles size={14} />
                <span>Request Manager Floor Approval</span>
              </button>
            )}
          </div>

          {/* Real-time EMI Calculator */}
          <div className="bg-white dark:bg-[#0c121e] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calculator size={16} className="text-orange-500" />
              <span>Auto Loan & Monthly EMI</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-500 dark:text-slate-400">Preferred Lending Partner</label>
                <select
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                  className="w-full mt-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-xs font-medium text-slate-800 dark:text-slate-200 outline-none"
                >
                  <option value="HDFC Bank">HDFC Bank Auto Loan (8.75%)</option>
                  <option value="SBI Auto Loan">State Bank of India (8.65%)</option>
                  <option value="ICICI Bank">ICICI Bank Fast-Track (8.85%)</option>
                  <option value="Tata Capital">Tata Capital EV Subvention (8.25%)</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Down Payment</span>
                  <span className="font-bold text-slate-900 dark:text-white">₹ {downPayment.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min={100000}
                  max={netPayable}
                  step={25000}
                  value={downPayment}
                  onChange={(e) => setDownPayment(Number(e.target.value))}
                  className="w-full mt-1.5 accent-orange-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Tenure</span>
                  <span className="font-bold text-slate-900 dark:text-white">{tenureMonths} Months ({tenureMonths / 12} Yrs)</span>
                </div>
                <div className="grid grid-cols-4 gap-2 mt-1.5">
                  {[36, 48, 60, 84].map(t => (
                    <button
                      key={t}
                      onClick={() => setTenureMonths(t)}
                      className={`py-1 text-xs font-bold rounded-lg border transition-all ${
                        tenureMonths === t
                          ? 'bg-orange-500 text-white border-orange-500 shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {t} M
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl text-center mt-2">
                <span className="text-[10px] text-orange-600 dark:text-orange-400 font-bold uppercase tracking-wider">
                  Calculated Monthly EMI
                </span>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5 font-mono">
                  ₹ {emi.toLocaleString()} <span className="text-xs text-slate-400 font-normal">/ month</span>
                </p>
                <p className="text-[11px] text-slate-400 mt-1">Financed: ₹ {loanAmount.toLocaleString()} @ {interestRate}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeskingPage;
