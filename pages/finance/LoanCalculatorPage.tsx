import React, { useState, useEffect } from 'react';
import { Calculator, Sparkles, TrendingUp, DollarSign, Calendar, Percent, CheckCircle } from 'lucide-react';
import PageNavigation from '../../components/common/PageNavigation';

interface LoanOption {
  name: string;
  amount: number;
  tenure: number;
  rate: number;
  emi: number;
  totalInterest: number;
  totalPayable: number;
}

const LoanCalculatorPage: React.FC = () => {
  const [loanAmount, setLoanAmount] = useState<number>(1500000);
  const [tenure, setTenure] = useState<number>(60);
  const [interestRate, setInterestRate] = useState<number>(8.5);
  const [emi, setEmi] = useState<number>(0);
  const [totalInterest, setTotalInterest] = useState<number>(0);
  const [totalPayable, setTotalPayable] = useState<number>(0);

  // Calculate EMI with debouncing
  useEffect(() => {
    const timer = setTimeout(() => {
      calculateEMI();
    }, 300);

    return () => clearTimeout(timer);
  }, [loanAmount, tenure, interestRate]);

  const calculateEMI = () => {
    const principal = loanAmount;
    const monthlyRate = interestRate / 12 / 100;
    const months = tenure;

    if (monthlyRate === 0) {
      const calculatedEMI = principal / months;
      setEmi(calculatedEMI);
      setTotalInterest(0);
      setTotalPayable(principal);
    } else {
      const calculatedEMI = 
        (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
        (Math.pow(1 + monthlyRate, months) - 1);
      
      const totalAmount = calculatedEMI * months;
      const interest = totalAmount - principal;

      setEmi(calculatedEMI);
      setTotalInterest(interest);
      setTotalPayable(totalAmount);
    }
  };

  const loanComparisons: LoanOption[] = [
    {
      name: 'Standard Loan',
      amount: loanAmount,
      tenure: tenure,
      rate: interestRate,
      emi: emi,
      totalInterest: totalInterest,
      totalPayable: totalPayable
    },
    {
      name: 'Shorter Tenure',
      amount: loanAmount,
      tenure: Math.max(12, tenure - 12),
      rate: interestRate - 0.5,
      emi: 0,
      totalInterest: 0,
      totalPayable: 0
    },
    {
      name: 'Lower Rate',
      amount: loanAmount,
      tenure: tenure,
      rate: Math.max(6, interestRate - 1.5),
      emi: 0,
      totalInterest: 0,
      totalPayable: 0
    }
  ];

  // Calculate comparison options
  loanComparisons.forEach((option, idx) => {
    if (idx > 0) {
      const monthlyRate = option.rate / 12 / 100;
      const months = option.tenure;
      
      if (monthlyRate === 0) {
        option.emi = option.amount / months;
        option.totalInterest = 0;
        option.totalPayable = option.amount;
      } else {
        option.emi = 
          (option.amount * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
          (Math.pow(1 + monthlyRate, months) - 1);
        option.totalPayable = option.emi * months;
        option.totalInterest = option.totalPayable - option.amount;
      }
    }
  });

  const formatCurrency = (amount: number) => {
    return `₹${Math.round(amount).toLocaleString('en-IN')}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-2">
          <Calculator size={32} className="text-purple-600" />
          <h2 className="text-2xl font-bold text-slate-900">Loan Calculator</h2>
        </div>
        <p className="text-slate-600">Calculate EMI and compare loan options with transparent pricing</p>
      </div>

      {/* Calculator Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <h3 className="text-xl font-bold text-slate-900 mb-6">Calculate Your EMI</h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Controls */}
          <div className="space-y-6">
            {/* Loan Amount */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <DollarSign size={18} className="text-purple-600" />
                  Loan Amount
                </label>
                <span className="text-2xl font-bold text-purple-600">
                  {formatCurrency(loanAmount)}
                </span>
              </div>
              <input
                type="range"
                min="100000"
                max="10000000"
                step="50000"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full h-3 bg-purple-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>₹1L</span>
                <span>₹1 Cr</span>
              </div>
            </div>

            {/* Loan Tenure */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Calendar size={18} className="text-blue-600" />
                  Loan Tenure
                </label>
                <span className="text-2xl font-bold text-blue-600">
                  {tenure} months
                </span>
              </div>
              <input
                type="range"
                min="12"
                max="84"
                step="6"
                value={tenure}
                onChange={(e) => setTenure(Number(e.target.value))}
                className="w-full h-3 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>1 year</span>
                <span>7 years</span>
              </div>
            </div>

            {/* Interest Rate */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Percent size={18} className="text-green-600" />
                  Interest Rate
                </label>
                <span className="text-2xl font-bold text-green-600">
                  {interestRate.toFixed(1)}%
                </span>
              </div>
              <input
                type="range"
                min="6"
                max="15"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full h-3 bg-green-200 rounded-lg appearance-none cursor-pointer accent-green-600"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>6%</span>
                <span>15%</span>
              </div>
            </div>

            {/* AI Recommendation */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-200">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={16} className="text-indigo-600" />
                <span className="text-sm font-semibold text-slate-900">AI Recommendation</span>
              </div>
              <p className="text-sm text-slate-700">
                {tenure <= 36 && "Shorter tenure means higher EMI but lower total interest. Good choice for quick repayment!"}
                {tenure > 36 && tenure <= 60 && "Balanced tenure with moderate EMI. Recommended for most borrowers."}
                {tenure > 60 && "Longer tenure reduces EMI but increases total interest. Consider if cash flow is a priority."}
              </p>
            </div>
          </div>

          {/* EMI Display */}
          <div className="space-y-4">
            {/* Monthly EMI */}
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border-2 border-purple-300">
              <div className="text-center">
                <div className="text-sm text-slate-600 mb-2">Monthly EMI</div>
                <div className="text-5xl font-bold text-purple-600 mb-2">
                  {formatCurrency(emi)}
                </div>
                <div className="text-sm text-slate-600">per month for {tenure} months</div>
              </div>
            </div>

            {/* Cost Breakdown */}
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-3">
              <h4 className="font-bold text-slate-900 mb-3">Cost Breakdown</h4>
              
              <div className="flex justify-between items-center pb-2 border-b border-slate-300">
                <span className="text-sm text-slate-600">Principal Amount</span>
                <span className="font-bold text-slate-900">{formatCurrency(loanAmount)}</span>
              </div>
              
              <div className="flex justify-between items-center pb-2 border-b border-slate-300">
                <span className="text-sm text-slate-600">Total Interest</span>
                <span className="font-bold text-orange-600">{formatCurrency(totalInterest)}</span>
              </div>
              
              <div className="flex justify-between items-center pb-2 border-b border-slate-300">
                <span className="text-sm text-slate-600">Processing Fee (0.5%)</span>
                <span className="font-bold text-slate-900">{formatCurrency(loanAmount * 0.005)}</span>
              </div>
              
              <div className="flex justify-between items-center pt-2">
                <span className="text-base font-bold text-slate-900">Total Payable</span>
                <span className="text-xl font-bold text-purple-600">{formatCurrency(totalPayable)}</span>
              </div>
            </div>

            {/* Interest vs Principal Chart */}
            <div className="bg-white rounded-xl p-4 border border-slate-200">
              <h4 className="font-semibold text-slate-900 mb-3 text-sm">Payment Distribution</h4>
              <div className="flex gap-2 h-8 rounded-lg overflow-hidden">
                <div 
                  className="bg-purple-500 flex items-center justify-center text-white text-xs font-semibold"
                  style={{ width: `${(loanAmount / totalPayable) * 100}%` }}
                >
                  Principal
                </div>
                <div 
                  className="bg-orange-500 flex items-center justify-center text-white text-xs font-semibold"
                  style={{ width: `${(totalInterest / totalPayable) * 100}%` }}
                >
                  Interest
                </div>
              </div>
              <div className="flex justify-between mt-2 text-xs">
                <span className="text-purple-600 font-semibold">
                  {((loanAmount / totalPayable) * 100).toFixed(1)}%
                </span>
                <span className="text-orange-600 font-semibold">
                  {((totalInterest / totalPayable) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Loan Comparison */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp size={24} className="text-purple-600" />
          <h3 className="text-xl font-bold text-slate-900">Compare Loan Options</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {loanComparisons.map((option, idx) => (
            <div
              key={idx}
              className={`rounded-xl p-5 border-2 transition-all ${
                idx === 0 
                  ? 'bg-purple-50 border-purple-300' 
                  : 'bg-slate-50 border-slate-200 hover:border-purple-300'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-slate-900">{option.name}</h4>
                {idx === 0 && (
                  <span className="px-2 py-1 bg-purple-600 text-white text-xs font-semibold rounded">
                    Current
                  </span>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Loan Amount</span>
                  <span className="font-semibold text-slate-900">{formatCurrency(option.amount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Tenure</span>
                  <span className="font-semibold text-slate-900">{option.tenure} months</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Interest Rate</span>
                  <span className="font-semibold text-green-600">{option.rate.toFixed(1)}%</span>
                </div>
                
                <div className="pt-3 border-t border-slate-300">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-slate-600">Monthly EMI</span>
                    <span className="text-lg font-bold text-purple-600">{formatCurrency(option.emi)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Total Interest</span>
                    <span className="font-semibold text-orange-600">{formatCurrency(option.totalInterest)}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-slate-600">Total Payable</span>
                    <span className="font-semibold text-slate-900">{formatCurrency(option.totalPayable)}</span>
                  </div>
                </div>

                {idx > 0 && (
                  <div className="pt-3 border-t border-slate-300">
                    <div className="text-xs text-green-600 font-semibold">
                      Save {formatCurrency(loanComparisons[0].totalPayable - option.totalPayable)}
                    </div>
                  </div>
                )}
              </div>

              {idx > 0 && (
                <button className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors">
                  Select This Option
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Transparent Pricing */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle size={24} className="text-green-600" />
          <h3 className="text-xl font-bold text-slate-900">Transparent Pricing Guarantee</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4 border border-green-200">
            <h4 className="font-semibold text-slate-900 mb-2">No Hidden Charges</h4>
            <ul className="text-sm text-slate-700 space-y-1">
              <li className="flex items-start gap-2">
                <CheckCircle size={14} className="text-green-600 mt-0.5" />
                <span>Processing fee: 0.5% (clearly shown)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle size={14} className="text-green-600 mt-0.5" />
                <span>No prepayment penalties</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle size={14} className="text-green-600 mt-0.5" />
                <span>No foreclosure charges</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg p-4 border border-green-200">
            <h4 className="font-semibold text-slate-900 mb-2">What You See Is What You Pay</h4>
            <ul className="text-sm text-slate-700 space-y-1">
              <li className="flex items-start gap-2">
                <CheckCircle size={14} className="text-green-600 mt-0.5" />
                <span>Fixed interest rate (no surprises)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle size={14} className="text-green-600 mt-0.5" />
                <span>All costs disclosed upfront</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle size={14} className="text-green-600 mt-0.5" />
                <span>Complete payment schedule provided</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-4 bg-white rounded-lg p-4 border border-green-200">
          <div className="flex items-start gap-2">
            <Sparkles size={16} className="text-green-600 mt-1" />
            <div className="text-sm text-slate-700">
              <strong>AI-Verified Pricing:</strong> Our AI system automatically verifies that all loan terms comply with 
              RBI guidelines and industry best practices. Every calculation is transparent and auditable.
            </div>
          </div>
        </div>
      </div>

      {/* Apply Now CTA */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-8 text-center">
        <h3 className="text-2xl font-bold text-white mb-2">Ready to Apply?</h3>
        <p className="text-purple-100 mb-6">Get instant approval with our AI-powered loan processing</p>
        <div className="flex gap-4 justify-center flex-wrap">
          <button className="bg-white hover:bg-slate-100 text-purple-600 px-8 py-3 rounded-lg font-bold transition-colors">
            Apply Now
          </button>
          <button className="bg-purple-700 hover:bg-purple-800 text-white px-8 py-3 rounded-lg font-bold transition-colors border-2 border-white">
            Talk to Expert
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoanCalculatorPage;
