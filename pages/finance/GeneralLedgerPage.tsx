import React, { useState } from 'react';
import { 
  BookOpen, Calendar, Download, Filter, 
  TrendingUp, CheckCircle2, DollarSign, FileSpreadsheet, ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const GeneralLedgerPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'daybook' | 'coa' | 'gst'>('daybook');

  const daybookEntries = [
    {
      voucherNo: 'RV-2026-0811',
      date: '10 Sep 2026',
      type: 'RECEIPT',
      account: 'Bank — HDFC Dealership Current A/c',
      party: 'Rajesh Kumar (Creta Service #JC-001)',
      debit: 4550,
      credit: 0,
      narration: 'Service invoice payment received via UPI'
    },
    {
      voucherNo: 'PV-2026-0421',
      date: '10 Sep 2026',
      type: 'PAYMENT',
      account: 'Accounts Payable — Mobis Parts India',
      party: 'Mobis Genuine Auto Parts',
      debit: 0,
      credit: 48500,
      narration: 'Invoice #MOB-9941 payment against GRN-2026-04'
    },
    {
      voucherNo: 'RV-2026-0812',
      date: '10 Sep 2026',
      type: 'RECEIPT',
      account: 'Customer Advance — Vehicle Booking',
      party: 'Ananya Deshmukh',
      debit: 25000,
      credit: 0,
      narration: 'Booking token for Hyundai Venue SX Plus'
    },
    {
      voucherNo: 'JV-2026-0192',
      date: '09 Sep 2026',
      type: 'JOURNAL',
      account: 'GST Output Liability (CGST + SGST 18%)',
      party: 'Monthly Tax Accrual',
      debit: 0,
      credit: 142000,
      narration: 'Accrual on vehicle and parts delivery invoices'
    }
  ];

  const chartOfAccounts = [
    { code: '1000', name: 'CURRENT ASSETS', balance: '₹ 84,20,500', type: 'DEBIT' },
    { code: '1010', name: '  HDFC Bank Dealership Operating A/c', balance: '₹ 42,10,000', type: 'DEBIT' },
    { code: '1020', name: '  Showroom Cash in Hand', balance: '₹ 1,50,500', type: 'DEBIT' },
    { code: '1030', name: '  New Vehicle Inventory (Yard Stock)', balance: '₹ 32,40,000', type: 'DEBIT' },
    { code: '1040', name: '  Spare Parts & Consumables Warehouse', balance: '₹ 8,20,000', type: 'DEBIT' },
    { code: '2000', name: 'CURRENT LIABILITIES', balance: '₹ 48,15,000', type: 'CREDIT' },
    { code: '2010', name: '  Accounts Payable (OEM & Spares Suppliers)', balance: '₹ 31,50,000', type: 'CREDIT' },
    { code: '2020', name: '  Customer Booking Advances', balance: '₹ 6,25,000', type: 'CREDIT' },
    { code: '2030', name: '  GST Output Liability (CGST + SGST)', balance: '₹ 10,40,000', type: 'CREDIT' },
    { code: '3000', name: 'REVENUE & SALES', balance: '₹ 1,84,50,000', type: 'CREDIT' },
    { code: '3010', name: '  New Vehicle Retail Sales', balance: '₹ 1,48,20,000', type: 'CREDIT' },
    { code: '3020', name: '  Workshop Labour Income', balance: '₹ 22,40,000', type: 'CREDIT' },
    { code: '3030', name: '  Spare Parts & Lubricants Sales', balance: '₹ 13,90,000', type: 'CREDIT' },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#0c121e] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div>
          <span className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider">
            Indian Dealership Back-Office Accounting
          </span>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-1 font-['Outfit']">
            General Ledger, Day Book & GST Statutory Accounting
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Apex Mobility Group • GSTIN: <strong className="text-slate-800 dark:text-slate-200">29ABCDE1234F1Z5</strong> (Karnataka)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => navigate('/finance')}
            className="px-4 py-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 transition-all"
          >
            Invoices & Billing
          </button>
          <button className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold transition-all">
            <Download size={14} />
            <span>Export Tally XML</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-px">
        {[
          { id: 'daybook', label: 'Day Book (Daily Vouchers)', icon: BookOpen },
          { id: 'coa', label: 'Chart of Accounts (COA)', icon: FileSpreadsheet },
          { id: 'gst', label: 'GST GSTR-1 / 3B Reconciliation', icon: TrendingUp }
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

      {/* Tab 1: Day Book */}
      {activeTab === 'daybook' && (
        <div className="bg-white dark:bg-[#0c121e] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Daily Cash & Bank Vouchers</h3>
            <span className="text-xs font-mono text-slate-400">10 September 2026</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-400 uppercase">
                  <th className="py-2.5 px-3">Voucher #</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Account Head & Party</th>
                  <th className="py-2.5 px-3 text-right">Debit (₹)</th>
                  <th className="py-2.5 px-3 text-right">Credit (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-sans">
                {daybookEntries.map((v, i) => (
                  <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-orange-500">{v.voucherNo}</td>
                    <td className="py-3 px-3 text-slate-500">{v.date}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        v.type === 'RECEIPT' ? 'bg-emerald-500/10 text-emerald-500' :
                        v.type === 'PAYMENT' ? 'bg-rose-500/10 text-rose-500' : 'bg-blue-500/10 text-blue-500'
                      }`}>
                        {v.type}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-bold text-slate-800 dark:text-slate-200">{v.account}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{v.party} • {v.narration}</p>
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                      {v.debit > 0 ? `₹ ${v.debit.toLocaleString()}` : '—'}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                      {v.credit > 0 ? `₹ ${v.credit.toLocaleString()}` : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Chart of Accounts */}
      {activeTab === 'coa' && (
        <div className="bg-white dark:bg-[#0c121e] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4 animate-fade-in">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Standard Automotive Chart of Accounts</h3>
          <div className="space-y-1 font-mono text-xs">
            {chartOfAccounts.map((acc, i) => (
              <div 
                key={i} 
                className={`flex items-center justify-between p-2 rounded-lg ${
                  acc.code.endsWith('000') 
                    ? 'bg-slate-100 dark:bg-slate-900 font-bold text-slate-900 dark:text-white' 
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900/30'
                }`}
              >
                <span>{acc.code} {acc.name}</span>
                <span className={acc.type === 'DEBIT' ? 'text-blue-500 font-semibold' : 'text-emerald-500 font-semibold'}>
                  {acc.balance}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: GST Reconciliation */}
      {activeTab === 'gst' && (
        <div className="bg-white dark:bg-[#0c121e] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">GSTR-1 & GSTR-3B Statutory Summary (August 2026)</h3>
            <span className="px-2.5 py-1 rounded text-xs font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              Filed & Reconciled
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40">
              <span className="text-[11px] text-slate-400 uppercase font-semibold">Total Taxable Outward Supplies</span>
              <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">₹ 1,48,20,000</p>
              <p className="text-[11px] text-slate-400 mt-1">Vehicles, Parts, & Workshop Labour</p>
            </div>
            <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40">
              <span className="text-[11px] text-slate-400 uppercase font-semibold">Total Output GST (18%)</span>
              <p className="text-xl font-bold text-orange-500 mt-1">₹ 26,67,600</p>
              <p className="text-[11px] text-slate-400 mt-1">CGST: ₹ 13.33L • SGST: ₹ 13.33L</p>
            </div>
            <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40">
              <span className="text-[11px] text-slate-400 uppercase font-semibold">Input Tax Credit (ITC 2B)</span>
              <p className="text-xl font-bold text-emerald-500 mt-1">₹ 18,45,200</p>
              <p className="text-[11px] text-slate-400 mt-1">OEM Vehicle Inward & Spares</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GeneralLedgerPage;
