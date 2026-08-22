import React, { useState, useEffect } from 'react';
import { Calculator, PieChart as PieIcon, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const EMIWidget: React.FC = () => {
  const [amount, setAmount] = useState(1000000);
  const [rate, setRate] = useState(9.5);
  const [tenure, setTenure] = useState(60);
  const [emi, setEmi] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [showSchedule, setShowSchedule] = useState(false);

  useEffect(() => {
    const P = amount;
    const R = rate / 12 / 100;
    const N = tenure;
    
    if (P > 0 && R > 0 && N > 0) {
      const calculatedEmi = P * R * (Math.pow(1 + R, N) / (Math.pow(1 + R, N) - 1));
      setEmi(Math.round(calculatedEmi));
      setTotalInterest(Math.round((calculatedEmi * N) - P));
    }
  }, [amount, rate, tenure]);

  const data = [
    { name: 'Principal', value: amount, color: '#10b981' }, // emerald-500
    { name: 'Interest', value: totalInterest, color: '#f59e0b' }, // amber-500
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-full flex flex-col transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-slate-900 flex items-center gap-2">
          <Calculator size={18} className="text-emerald-600" />
          Quick EMI Calculator
        </h3>
        <button 
            onClick={() => {setAmount(1000000); setRate(9.5); setTenure(60);}}
            className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
        >
            <RefreshCw size={14} />
        </button>
      </div>

      <div className="flex-1 space-y-6">
        {!showSchedule && (
        <div className="space-y-4">
            <div>
                <div className="flex justify-between text-xs mb-1 font-medium text-slate-600">
                    <span>Loan Amount</span>
                    <span>₹{(amount/100000).toFixed(1)} Lakhs</span>
                </div>
                <input 
                    type="range" min="100000" max="5000000" step="50000" 
                    value={amount} onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
            </div>
            <div>
                <div className="flex justify-between text-xs mb-1 font-medium text-slate-600">
                    <span>Interest Rate</span>
                    <span>{rate}%</span>
                </div>
                <input 
                    type="range" min="5" max="20" step="0.1" 
                    value={rate} onChange={(e) => setRate(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
            </div>
            <div>
                <div className="flex justify-between text-xs mb-1 font-medium text-slate-600">
                    <span>Tenure</span>
                    <span>{tenure} Months</span>
                </div>
                <input 
                    type="range" min="12" max="84" step="6" 
                    value={tenure} onChange={(e) => setTenure(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
            </div>
        </div>
        )}

        <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 text-center">
            <p className="text-xs text-emerald-700 font-medium uppercase tracking-wider mb-1">Monthly EMI</p>
            <p className="text-3xl font-bold text-emerald-700">₹{emi.toLocaleString('en-IN')}</p>
        </div>

        {showSchedule ? (
            <div className="h-48 overflow-y-auto pr-2 border border-slate-100 rounded-lg">
                <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 sticky top-0">
                        <tr>
                            <th className="p-2 font-medium text-slate-500">Year</th>
                            <th className="p-2 font-medium text-slate-500">Principal</th>
                            <th className="p-2 font-medium text-slate-500">Interest</th>
                            <th className="p-2 font-medium text-slate-500">Balance</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {/* Mock Amortization Rows */}
                        {[1, 2, 3, 4, 5].map((year) => {
                            const yearlyInterest = Math.round(totalInterest / (tenure/12));
                            const yearlyPrincipal = Math.round(amount / (tenure/12));
                            const balance = Math.max(0, amount - (yearlyPrincipal * year));
                            return (
                                <tr key={year}>
                                    <td className="p-2 font-medium">Year {year}</td>
                                    <td className="p-2">₹{yearlyPrincipal.toLocaleString()}</td>
                                    <td className="p-2 text-amber-600">₹{yearlyInterest.toLocaleString()}</td>
                                    <td className="p-2 text-slate-400">₹{balance.toLocaleString()}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        ) : (
            <div className="flex items-center gap-4 h-32">
                <div className="flex-1 h-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie 
                                data={data} 
                                innerRadius={25} 
                                outerRadius={40} 
                                paddingAngle={5} 
                                dataKey="value"
                                stroke="none"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value: number) => `₹${value.toLocaleString('en-IN')}`} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        <span className="text-slate-600">Principal</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                        <span className="text-slate-600">Interest</span>
                    </div>
                    <div className="pt-2 border-t border-slate-100 font-semibold text-slate-900">
                        Total: ₹{(amount + totalInterest).toLocaleString('en-IN')}
                    </div>
                </div>
            </div>
        )}
        
        <button 
            onClick={() => setShowSchedule(!showSchedule)}
            className="w-full text-xs text-slate-500 hover:text-emerald-600 font-medium flex items-center justify-center gap-1 py-1"
        >
            {showSchedule ? 'Hide Breakdown' : 'View Amortization Schedule'}
            {showSchedule ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
        </button>
      </div>
    </div>
  );
};

export default EMIWidget;