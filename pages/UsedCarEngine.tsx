import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Car, Search, Plus, Filter, TrendingUp, TrendingDown,
  CheckCircle, AlertTriangle, Clock, DollarSign, BarChart2,
  Camera, FileText, Star, ChevronRight, Eye, Wrench,
  ShieldCheck, Tag, Package, ArrowRightLeft, Zap, Award,
  RefreshCw, Download, Upload
} from 'lucide-react';
import StatCard from '../components/StatCard';
import PageNavigation from '../components/common/PageNavigation';
import CsvImportModal, { CsvColumn } from '../components/common/CsvImportModal';

// ─── Types ───────────────────────────────────────────────────────────
interface AppraisalRecord {
  id: string;
  appraisalNumber: string;
  make: string;
  model: string;
  variant: string;
  year: number;
  registration: string;
  odometerKm: number;
  source: string;
  status: string;
  inspectionGrade: string;
  overallScore: number;
  customerName: string;
  appraisalDate: string;
  bodyCondition: string;
  engineCondition: string;
}

interface ValuationRecord {
  id: string;
  appraisalNumber: string;
  vehicle: string;
  fairMarketValue: number;
  recommendedAcquisition: number;
  recommendedSelling: number;
  totalRefurbEstimate: number;
  projectedMargin: number;
  marginPct: number;
  aiConfidence: number;
  recommendation: string;
  method: string;
}

interface InventoryVehicle {
  id: string;
  stockNumber: string;
  make: string;
  model: string;
  variant: string;
  year: number;
  registration: string;
  color: string;
  fuelType: string;
  odometerKm: number;
  status: string;
  ageingTier: string;
  acquisitionCost: number;
  reconditioningCost: number;
  totalInvestment: number;
  askingPrice: number;
  daysInStock: number;
  certification: string;
  isFeatured: boolean;
  enquiries: number;
  testDrives: number;
}

type UsedCarView = 'dashboard' | 'appraisals' | 'valuations' | 'inventory' | 'reconditioning';

// ─── Demo Data ───────────────────────────────────────────────────────
const demoAppraisals: AppraisalRecord[] = [
  { id: '1', appraisalNumber: 'APR-202609-10001', make: 'Maruti Suzuki', model: 'Swift', variant: 'ZXi+', year: 2021, registration: 'KA-01-AB-1234', odometerKm: 35000, source: 'TRADE_IN', status: 'OFFER_MADE', inspectionGrade: 'A', overallScore: 49, customerName: 'Rajesh Patel', appraisalDate: '2026-09-08', bodyCondition: 'GOOD', engineCondition: 'EXCELLENT' },
  { id: '2', appraisalNumber: 'APR-202609-10002', make: 'Hyundai', model: 'Creta', variant: 'SX(O)', year: 2022, registration: 'MH-02-CD-5678', odometerKm: 22000, source: 'DIRECT_PURCHASE', status: 'INSPECTION_COMPLETE', inspectionGrade: 'A+', overallScore: 55, customerName: 'Priya Sharma', appraisalDate: '2026-09-09', bodyCondition: 'EXCELLENT', engineCondition: 'EXCELLENT' },
  { id: '3', appraisalNumber: 'APR-202609-10003', make: 'Toyota', model: 'Innova Crysta', variant: 'VX', year: 2020, registration: 'DL-04-EF-9012', odometerKm: 68000, source: 'TRADE_IN', status: 'PENDING_INSPECTION', inspectionGrade: 'B', overallScore: 38, customerName: 'Anil Kumar', appraisalDate: '2026-09-10', bodyCondition: 'FAIR', engineCondition: 'GOOD' },
  { id: '4', appraisalNumber: 'APR-202609-10004', make: 'Tata', model: 'Nexon', variant: 'XZ+', year: 2023, registration: 'TN-07-GH-3456', odometerKm: 15000, source: 'CORPORATE_LEASE_RETURN', status: 'ACQUIRED', inspectionGrade: 'A+', overallScore: 56, customerName: 'Fleet Solutions Ltd', appraisalDate: '2026-09-07', bodyCondition: 'EXCELLENT', engineCondition: 'EXCELLENT' },
  { id: '5', appraisalNumber: 'APR-202609-10005', make: 'Mahindra', model: 'XUV700', variant: 'AX7', year: 2022, registration: 'GJ-05-IJ-7890', odometerKm: 42000, source: 'AUCTION', status: 'CUSTOMER_REJECTED', inspectionGrade: 'B+', overallScore: 44, customerName: 'Auto Exchange Hub', appraisalDate: '2026-09-06', bodyCondition: 'GOOD', engineCondition: 'GOOD' },
];

const demoValuations: ValuationRecord[] = [
  { id: '1', appraisalNumber: 'APR-202609-10001', vehicle: 'Maruti Swift ZXi+ (2021)', fairMarketValue: 685000, recommendedAcquisition: 520000, recommendedSelling: 699000, totalRefurbEstimate: 28000, projectedMargin: 151000, marginPct: 21.6, aiConfidence: 92, recommendation: 'STRONG_BUY', method: 'AI_PREDICTIVE' },
  { id: '2', appraisalNumber: 'APR-202609-10002', vehicle: 'Hyundai Creta SX(O) (2022)', fairMarketValue: 1120000, recommendedAcquisition: 890000, recommendedSelling: 1150000, totalRefurbEstimate: 15000, projectedMargin: 245000, marginPct: 21.3, aiConfidence: 95, recommendation: 'STRONG_BUY', method: 'AI_PREDICTIVE' },
  { id: '3', appraisalNumber: 'APR-202609-10004', vehicle: 'Tata Nexon XZ+ (2023)', fairMarketValue: 920000, recommendedAcquisition: 730000, recommendedSelling: 945000, totalRefurbEstimate: 12000, projectedMargin: 203000, marginPct: 21.5, aiConfidence: 90, recommendation: 'STRONG_BUY', method: 'AI_PREDICTIVE' },
];

const demoInventory: InventoryVehicle[] = [
  { id: '1', stockNumber: 'UC-202609-10001', make: 'Maruti Suzuki', model: 'Swift', variant: 'ZXi+', year: 2021, registration: 'KA-01-AB-1234', color: 'Pearl Arctic White', fuelType: 'Petrol', odometerKm: 35000, status: 'LISTED_FOR_SALE', ageingTier: 'FRESH', acquisitionCost: 520000, reconditioningCost: 28000, totalInvestment: 548000, askingPrice: 699000, daysInStock: 8, certification: 'CPO_SILVER', isFeatured: true, enquiries: 12, testDrives: 3 },
  { id: '2', stockNumber: 'UC-202609-10002', make: 'Honda', model: 'City', variant: 'V CVT', year: 2020, registration: 'MH-12-XY-4567', color: 'Radiant Red Metallic', fuelType: 'Petrol', odometerKm: 52000, status: 'CERTIFIED', ageingTier: 'FRESH', acquisitionCost: 680000, reconditioningCost: 35000, totalInvestment: 715000, askingPrice: 885000, daysInStock: 15, certification: 'CPO_GOLD', isFeatured: false, enquiries: 8, testDrives: 2 },
  { id: '3', stockNumber: 'UC-202608-10003', make: 'Kia', model: 'Seltos', variant: 'HTX+', year: 2021, registration: 'KA-03-PQ-8901', color: 'Gravity Grey', fuelType: 'Diesel', odometerKm: 44000, status: 'LISTED_FOR_SALE', ageingTier: 'AGING', acquisitionCost: 750000, reconditioningCost: 22000, totalInvestment: 772000, askingPrice: 935000, daysInStock: 42, certification: 'CPO_SILVER', isFeatured: true, enquiries: 18, testDrives: 5 },
  { id: '4', stockNumber: 'UC-202607-10004', make: 'Toyota', model: 'Fortuner', variant: '4x2 AT', year: 2019, registration: 'DL-01-RS-2345', color: 'Super White', fuelType: 'Diesel', odometerKm: 78000, status: 'LISTED_FOR_SALE', ageingTier: 'SLOW', acquisitionCost: 2100000, reconditioningCost: 85000, totalInvestment: 2185000, askingPrice: 2650000, daysInStock: 72, certification: 'DEALER_WARRANTY', isFeatured: false, enquiries: 6, testDrives: 1 },
  { id: '5', stockNumber: 'UC-202606-10005', make: 'Tata', model: 'Harrier', variant: 'XZ', year: 2020, registration: 'TN-09-UV-6789', color: 'Calisto Copper', fuelType: 'Diesel', odometerKm: 61000, status: 'IN_RECONDITIONING', ageingTier: 'FRESH', acquisitionCost: 850000, reconditioningCost: 45000, totalInvestment: 895000, askingPrice: 0, daysInStock: 5, certification: 'AS_IS', isFeatured: false, enquiries: 0, testDrives: 0 },
  { id: '6', stockNumber: 'UC-202605-10006', make: 'Mahindra', model: 'Thar', variant: 'LX Diesel AT', year: 2022, registration: 'GJ-01-WX-0123', color: 'Aquamarine', fuelType: 'Diesel', odometerKm: 28000, status: 'SOLD', ageingTier: 'FRESH', acquisitionCost: 1350000, reconditioningCost: 18000, totalInvestment: 1368000, askingPrice: 1650000, daysInStock: 22, certification: 'CPO_GOLD', isFeatured: false, enquiries: 25, testDrives: 8 },
];

const appraisalCsvColumns: CsvColumn[] = [
  { key: 'registration', label: 'Vehicle registration number', required: true },
  { key: 'make', label: 'Vehicle make', required: true },
  { key: 'model', label: 'Vehicle model', required: true },
  { key: 'year', label: 'Manufacturing year', required: true },
  { key: 'variant', label: 'Vehicle variant' },
  { key: 'customerName', label: 'Owner / seller name' },
  { key: 'phone', label: 'Contact phone' },
  { key: 'odometerKm', label: 'Odometer reading (km)' },
  { key: 'source', label: 'Acquisition source' },
];

const appraisalSampleRows = [
  { registration: 'KA-01-AB-1234', make: 'Maruti', model: 'Swift', year: '2021', variant: 'ZXi+', customerName: 'Rajesh', phone: '+91-9876543210', odometerKm: '35000', source: 'Trade-In' },
];

// ─── Helpers ─────────────────────────────────────────────────────────
const statusBadge = (status: string) => {
  const map: Record<string, { bg: string; text: string; label: string }> = {
    'PENDING_INSPECTION': { bg: 'bg-amber-500/15', text: 'text-amber-400', label: 'Pending Inspection' },
    'INSPECTION_COMPLETE': { bg: 'bg-blue-500/15', text: 'text-blue-400', label: 'Inspection Done' },
    'VALUATION_PENDING': { bg: 'bg-purple-500/15', text: 'text-purple-400', label: 'Valuation Pending' },
    'OFFER_MADE': { bg: 'bg-indigo-500/15', text: 'text-indigo-400', label: 'Offer Made' },
    'CUSTOMER_ACCEPTED': { bg: 'bg-green-500/15', text: 'text-green-400', label: 'Customer Accepted' },
    'CUSTOMER_REJECTED': { bg: 'bg-red-500/15', text: 'text-red-400', label: 'Customer Rejected' },
    'ACQUIRED': { bg: 'bg-emerald-500/15', text: 'text-emerald-400', label: 'Acquired' },
    'IN_RECONDITIONING': { bg: 'bg-orange-500/15', text: 'text-orange-400', label: 'Reconditioning' },
    'RECONDITIONING_COMPLETE': { bg: 'bg-teal-500/15', text: 'text-teal-400', label: 'Recon Complete' },
    'CERTIFIED': { bg: 'bg-emerald-500/15', text: 'text-emerald-400', label: 'Certified CPO' },
    'LISTED_FOR_SALE': { bg: 'bg-sky-500/15', text: 'text-sky-400', label: 'For Sale' },
    'RESERVED': { bg: 'bg-violet-500/15', text: 'text-violet-400', label: 'Reserved' },
    'SOLD': { bg: 'bg-green-500/15', text: 'text-green-400', label: 'Sold' },
    'CANCELLED': { bg: 'bg-gray-500/15', text: 'text-gray-400', label: 'Cancelled' },
  };
  const s = map[status] || { bg: 'bg-gray-500/15', text: 'text-gray-400', label: status };
  return <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${s.bg} ${s.text}`}>{s.label}</span>;
};

const ageingBadge = (tier: string) => {
  const map: Record<string, { bg: string; text: string; label: string }> = {
    'FRESH': { bg: 'bg-emerald-500/15', text: 'text-emerald-400', label: '< 30d Fresh' },
    'AGING': { bg: 'bg-amber-500/15', text: 'text-amber-400', label: '31-60d Aging' },
    'SLOW': { bg: 'bg-orange-500/15', text: 'text-orange-400', label: '61-90d Slow' },
    'DEAD': { bg: 'bg-red-500/15', text: 'text-red-400', label: '> 90d Dead Stock' },
  };
  const s = map[tier] || { bg: 'bg-gray-500/15', text: 'text-gray-400', label: tier };
  return <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${s.bg} ${s.text}`}>{s.label}</span>;
};

const recommendBadge = (rec: string) => {
  const map: Record<string, { bg: string; text: string; label: string }> = {
    'STRONG_BUY': { bg: 'bg-emerald-500/15', text: 'text-emerald-400', label: '★ Strong Buy' },
    'BUY': { bg: 'bg-green-500/15', text: 'text-green-400', label: 'Buy' },
    'HOLD': { bg: 'bg-amber-500/15', text: 'text-amber-400', label: 'Hold' },
    'PASS': { bg: 'bg-red-500/15', text: 'text-red-400', label: 'Pass' },
  };
  const s = map[rec] || { bg: 'bg-gray-500/15', text: 'text-gray-400', label: rec };
  return <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${s.bg} ${s.text}`}>{s.label}</span>;
};

const formatCurrency = (v: number) =>
  '₹' + v.toLocaleString('en-IN', { maximumFractionDigits: 0 });

const gradeColor = (g: string) => {
  if (g === 'A+') return 'text-emerald-400';
  if (g === 'A') return 'text-green-400';
  if (g === 'B+') return 'text-lime-400';
  if (g === 'B') return 'text-yellow-400';
  if (g === 'C') return 'text-orange-400';
  return 'text-red-400';
};

// ─── Component ───────────────────────────────────────────────────────
const UsedCarEngine: React.FC = () => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<UsedCarView>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [showImportModal, setShowImportModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [ageingFilter, setAgeingFilter] = useState('ALL');

  // Navigation tabs
  const tabs = [
    { id: 'dashboard' as UsedCarView, label: 'Dashboard', icon: BarChart2 },
    { id: 'appraisals' as UsedCarView, label: 'Appraisals', icon: Search },
    { id: 'valuations' as UsedCarView, label: 'Valuations', icon: TrendingUp },
    { id: 'inventory' as UsedCarView, label: 'Inventory', icon: Package },
    { id: 'reconditioning' as UsedCarView, label: 'Reconditioning', icon: Wrench },
  ];

  // Inventory stats
  const totalStock = demoInventory.filter(v => !['SOLD', 'TRANSFERRED'].includes(v.status)).length;
  const freshCount = demoInventory.filter(v => v.ageingTier === 'FRESH' && v.status !== 'SOLD').length;
  const agingCount = demoInventory.filter(v => v.ageingTier === 'AGING' && v.status !== 'SOLD').length;
  const slowCount = demoInventory.filter(v => v.ageingTier === 'SLOW' && v.status !== 'SOLD').length;
  const deadCount = demoInventory.filter(v => v.ageingTier === 'DEAD' && v.status !== 'SOLD').length;
  const soldCount = demoInventory.filter(v => v.status === 'SOLD').length;
  const totalMargin = demoInventory.filter(v => v.status === 'SOLD').reduce((sum, v) => sum + (v.askingPrice - v.totalInvestment), 0);
  const avgMarginPct = soldCount > 0 ? demoInventory.filter(v => v.status === 'SOLD').reduce((sum, v) => sum + ((v.askingPrice - v.totalInvestment) / v.askingPrice * 100), 0) / soldCount : 0;
  const totalInventoryValue = demoInventory.filter(v => !['SOLD', 'TRANSFERRED'].includes(v.status)).reduce((sum, v) => sum + v.askingPrice, 0);

  // Filtered views
  const filteredAppraisals = useMemo(() => {
    let result = demoAppraisals;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(a =>
        a.appraisalNumber.toLowerCase().includes(q) ||
        a.make.toLowerCase().includes(q) ||
        a.model.toLowerCase().includes(q) ||
        a.customerName.toLowerCase().includes(q) ||
        a.registration.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== 'ALL') {
      result = result.filter(a => a.status === statusFilter);
    }
    return result;
  }, [searchQuery, statusFilter]);

  const filteredInventory = useMemo(() => {
    let result = demoInventory;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(v =>
        v.stockNumber.toLowerCase().includes(q) ||
        v.make.toLowerCase().includes(q) ||
        v.model.toLowerCase().includes(q) ||
        v.registration.toLowerCase().includes(q)
      );
    }
    if (ageingFilter !== 'ALL') {
      result = result.filter(v => v.ageingTier === ageingFilter);
    }
    return result;
  }, [searchQuery, ageingFilter]);

  // ─── Dashboard View ────────────────────────────────────────────────
  const renderDashboard = () => (
    <div className="space-y-6">
      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div className="bg-gradient-to-br from-slate-800/70 to-slate-900/70 rounded-xl border border-slate-700/50 p-4">
          <div className="text-xs text-slate-400 mb-1">Total In Stock</div>
          <div className="text-2xl font-bold text-white">{totalStock}</div>
          <div className="text-xs text-emerald-400 mt-1">Active vehicles</div>
        </div>
        <div className="bg-gradient-to-br from-slate-800/70 to-slate-900/70 rounded-xl border border-slate-700/50 p-4">
          <div className="text-xs text-slate-400 mb-1">Inventory Value</div>
          <div className="text-2xl font-bold text-white">{formatCurrency(totalInventoryValue)}</div>
          <div className="text-xs text-sky-400 mt-1">At asking price</div>
        </div>
        <div className="bg-gradient-to-br from-slate-800/70 to-slate-900/70 rounded-xl border border-slate-700/50 p-4">
          <div className="text-xs text-slate-400 mb-1">Vehicles Sold</div>
          <div className="text-2xl font-bold text-emerald-400">{soldCount}</div>
          <div className="text-xs text-slate-400 mt-1">This month</div>
        </div>
        <div className="bg-gradient-to-br from-slate-800/70 to-slate-900/70 rounded-xl border border-slate-700/50 p-4">
          <div className="text-xs text-slate-400 mb-1">Total Margin</div>
          <div className="text-2xl font-bold text-green-400">{formatCurrency(totalMargin)}</div>
          <div className="text-xs text-green-400 mt-1">↑ {avgMarginPct.toFixed(1)}% avg</div>
        </div>
        <div className="bg-gradient-to-br from-slate-800/70 to-slate-900/70 rounded-xl border border-slate-700/50 p-4">
          <div className="text-xs text-slate-400 mb-1">Pending Appraisals</div>
          <div className="text-2xl font-bold text-amber-400">{demoAppraisals.filter(a => a.status === 'PENDING_INSPECTION').length}</div>
          <div className="text-xs text-amber-400 mt-1">Need inspection</div>
        </div>
        <div className="bg-gradient-to-br from-slate-800/70 to-slate-900/70 rounded-xl border border-slate-700/50 p-4">
          <div className="text-xs text-slate-400 mb-1">In Reconditioning</div>
          <div className="text-2xl font-bold text-orange-400">{demoInventory.filter(v => v.status === 'IN_RECONDITIONING').length}</div>
          <div className="text-xs text-orange-400 mt-1">Workshop queue</div>
        </div>
      </div>

      {/* Ageing Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 rounded-xl border border-slate-700/50 p-6">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Clock size={16} className="text-sky-400" /> Stock Ageing Distribution
          </h3>
          <div className="space-y-3">
            {[
              { label: 'Fresh (< 30d)', count: freshCount, color: 'bg-emerald-500', pct: totalStock ? (freshCount / totalStock * 100) : 0 },
              { label: 'Aging (31-60d)', count: agingCount, color: 'bg-amber-500', pct: totalStock ? (agingCount / totalStock * 100) : 0 },
              { label: 'Slow (61-90d)', count: slowCount, color: 'bg-orange-500', pct: totalStock ? (slowCount / totalStock * 100) : 0 },
              { label: 'Dead (> 90d)', count: deadCount, color: 'bg-red-500', pct: totalStock ? (deadCount / totalStock * 100) : 0 },
            ].map((tier, i) => (
              <div key={i}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">{tier.label}</span>
                  <span className="text-white font-semibold">{tier.count} vehicles ({tier.pct.toFixed(0)}%)</span>
                </div>
                <div className="w-full bg-slate-700/50 rounded-full h-2">
                  <div className={`${tier.color} h-2 rounded-full transition-all duration-700`} style={{ width: `${tier.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 rounded-xl border border-slate-700/50 p-6">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Zap size={16} className="text-amber-400" /> Recent Used-Car Activity
          </h3>
          <div className="space-y-3">
            {[
              { action: 'Appraisal Created', vehicle: 'Toyota Innova Crysta VX (2020)', time: '10 min ago', icon: FileText, color: 'text-blue-400' },
              { action: 'AI Valuation Generated', vehicle: 'Hyundai Creta SX(O) (2022)', time: '25 min ago', icon: TrendingUp, color: 'text-purple-400' },
              { action: 'Vehicle Acquired', vehicle: 'Tata Nexon XZ+ (2023)', time: '1h ago', icon: ArrowRightLeft, color: 'text-emerald-400' },
              { action: 'Reconditioning Started', vehicle: 'Tata Harrier XZ (2020)', time: '3h ago', icon: Wrench, color: 'text-orange-400' },
              { action: 'CPO Certified', vehicle: 'Honda City V CVT (2020)', time: '5h ago', icon: Award, color: 'text-green-400' },
              { action: 'Vehicle Sold', vehicle: 'Mahindra Thar LX Diesel (2022)', time: 'Yesterday', icon: DollarSign, color: 'text-green-400' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 py-2 border-b border-slate-700/30 last:border-0">
                <div className={`p-1.5 rounded-lg bg-slate-700/50 ${item.color}`}>
                  <item.icon size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-white">{item.action}</div>
                  <div className="text-xs text-slate-400 truncate">{item.vehicle}</div>
                </div>
                <div className="text-[10px] text-slate-500 whitespace-nowrap">{item.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'New Appraisal', icon: Plus, color: 'from-sky-500/20 to-sky-600/10 border-sky-500/30', textColor: 'text-sky-400', action: () => setActiveView('appraisals') },
          { label: 'Run AI Valuation', icon: Zap, color: 'from-purple-500/20 to-purple-600/10 border-purple-500/30', textColor: 'text-purple-400', action: () => setActiveView('valuations') },
          { label: 'View Inventory', icon: Package, color: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30', textColor: 'text-emerald-400', action: () => setActiveView('inventory') },
          { label: 'Import Vehicles', icon: Upload, color: 'from-amber-500/20 to-amber-600/10 border-amber-500/30', textColor: 'text-amber-400', action: () => setShowImportModal(true) },
        ].map((btn, i) => (
          <button
            key={i}
            onClick={btn.action}
            className={`bg-gradient-to-br ${btn.color} rounded-xl border p-4 flex flex-col items-center gap-2 hover:scale-[1.02] transition-all duration-200 group`}
          >
            <btn.icon size={20} className={`${btn.textColor} group-hover:scale-110 transition-transform`} />
            <span className={`text-xs font-semibold ${btn.textColor}`}>{btn.label}</span>
          </button>
        ))}
      </div>
    </div>
  );

  // ─── Appraisals View ───────────────────────────────────────────────
  const renderAppraisals = () => (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by appraisal #, vehicle, customer, registration..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-800/60 border border-slate-700/50 rounded-xl text-sm text-white placeholder-slate-500 focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/20 transition-all"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-3 py-2.5 bg-slate-800/60 border border-slate-700/50 rounded-xl text-sm text-white focus:border-sky-500/50"
        >
          <option value="ALL">All Statuses</option>
          <option value="PENDING_INSPECTION">Pending Inspection</option>
          <option value="INSPECTION_COMPLETE">Inspection Complete</option>
          <option value="OFFER_MADE">Offer Made</option>
          <option value="ACQUIRED">Acquired</option>
          <option value="CUSTOMER_REJECTED">Rejected</option>
        </select>
        <button
          onClick={() => setShowImportModal(true)}
          className="px-4 py-2.5 bg-sky-500/20 border border-sky-500/30 text-sky-400 rounded-xl text-sm font-medium hover:bg-sky-500/30 transition-all flex items-center gap-2"
        >
          <Plus size={16} /> New Appraisal
        </button>
      </div>

      <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 rounded-xl border border-slate-700/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700/50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Appraisal #</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Vehicle</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Registration</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Odometer</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Source</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Grade</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Customer</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/30">
              {filteredAppraisals.map(a => (
                <tr key={a.id} className="hover:bg-slate-700/20 transition-colors cursor-pointer">
                  <td className="px-4 py-3 font-mono text-xs text-sky-400">{a.appraisalNumber}</td>
                  <td className="px-4 py-3">
                    <div className="text-white font-medium text-xs">{a.make} {a.model}</div>
                    <div className="text-[10px] text-slate-400">{a.variant} • {a.year}</div>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-300">{a.registration}</td>
                  <td className="px-4 py-3 text-xs text-slate-300">{a.odometerKm.toLocaleString()} km</td>
                  <td className="px-4 py-3 text-xs text-slate-300">{a.source.replace(/_/g, ' ')}</td>
                  <td className="px-4 py-3">
                    <span className={`text-lg font-bold ${gradeColor(a.inspectionGrade)}`}>{a.inspectionGrade}</span>
                    <span className="text-[10px] text-slate-500 ml-1">({a.overallScore}/60)</span>
                  </td>
                  <td className="px-4 py-3">{statusBadge(a.status)}</td>
                  <td className="px-4 py-3 text-xs text-slate-300">{a.customerName}</td>
                  <td className="px-4 py-3 text-center">
                    <button className="p-1.5 rounded-lg bg-slate-700/50 text-slate-300 hover:bg-sky-500/20 hover:text-sky-400 transition-all">
                      <Eye size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // ─── Valuations View ───────────────────────────────────────────────
  const renderValuations = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 rounded-xl border border-emerald-500/20 p-4">
          <div className="text-xs text-emerald-400/80 mb-1">Strong Buy Recommendations</div>
          <div className="text-2xl font-bold text-emerald-400">{demoValuations.filter(v => v.recommendation === 'STRONG_BUY').length}</div>
        </div>
        <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 rounded-xl border border-purple-500/20 p-4">
          <div className="text-xs text-purple-400/80 mb-1">Avg AI Confidence</div>
          <div className="text-2xl font-bold text-purple-400">{(demoValuations.reduce((s, v) => s + v.aiConfidence, 0) / demoValuations.length).toFixed(0)}%</div>
        </div>
        <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 rounded-xl border border-green-500/20 p-4">
          <div className="text-xs text-green-400/80 mb-1">Avg Projected Margin</div>
          <div className="text-2xl font-bold text-green-400">{(demoValuations.reduce((s, v) => s + v.marginPct, 0) / demoValuations.length).toFixed(1)}%</div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 rounded-xl border border-slate-700/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700/50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Appraisal</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Vehicle</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Fair Market Value</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Rec. Acquisition</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Refurb Est.</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Rec. Selling</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Proj. Margin</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">AI Conf.</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Recommendation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/30">
              {demoValuations.map(v => (
                <tr key={v.id} className="hover:bg-slate-700/20 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-sky-400">{v.appraisalNumber}</td>
                  <td className="px-4 py-3 text-xs text-white font-medium">{v.vehicle}</td>
                  <td className="px-4 py-3 text-xs text-white text-right font-semibold">{formatCurrency(v.fairMarketValue)}</td>
                  <td className="px-4 py-3 text-xs text-amber-400 text-right">{formatCurrency(v.recommendedAcquisition)}</td>
                  <td className="px-4 py-3 text-xs text-orange-400 text-right">{formatCurrency(v.totalRefurbEstimate)}</td>
                  <td className="px-4 py-3 text-xs text-emerald-400 text-right font-semibold">{formatCurrency(v.recommendedSelling)}</td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-xs text-green-400 font-bold">{formatCurrency(v.projectedMargin)}</span>
                    <span className="text-[10px] text-slate-400 ml-1">({v.marginPct}%)</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="inline-flex items-center gap-1">
                      <div className="w-8 h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500 rounded-full" style={{ width: `${v.aiConfidence}%` }} />
                      </div>
                      <span className="text-[10px] text-purple-400 font-semibold">{v.aiConfidence}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">{recommendBadge(v.recommendation)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // ─── Inventory View ────────────────────────────────────────────────
  const renderInventory = () => (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by stock #, make, model, registration..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-800/60 border border-slate-700/50 rounded-xl text-sm text-white placeholder-slate-500 focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/20 transition-all"
          />
        </div>
        <select
          value={ageingFilter}
          onChange={e => setAgeingFilter(e.target.value)}
          className="px-3 py-2.5 bg-slate-800/60 border border-slate-700/50 rounded-xl text-sm text-white focus:border-sky-500/50"
        >
          <option value="ALL">All Ageing Tiers</option>
          <option value="FRESH">Fresh (&lt; 30d)</option>
          <option value="AGING">Aging (31-60d)</option>
          <option value="SLOW">Slow (61-90d)</option>
          <option value="DEAD">Dead (&gt; 90d)</option>
        </select>
        <button className="px-4 py-2.5 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-xl text-sm font-medium hover:bg-emerald-500/30 transition-all flex items-center gap-2">
          <Download size={16} /> Export Inventory
        </button>
      </div>

      <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 rounded-xl border border-slate-700/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700/50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Stock #</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Vehicle</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Reg.</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Days</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Ageing</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Investment</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Asking Price</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Cert.</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Enq.</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">TD</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/30">
              {filteredInventory.map(v => (
                <tr key={v.id} className={`hover:bg-slate-700/20 transition-colors ${v.isFeatured ? 'bg-amber-500/5' : ''}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-xs text-sky-400">{v.stockNumber}</span>
                      {v.isFeatured && <Star size={12} className="text-amber-400 fill-amber-400" />}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-white font-medium text-xs">{v.make} {v.model}</div>
                    <div className="text-[10px] text-slate-400">{v.variant} • {v.year} • {v.color}</div>
                    <div className="text-[10px] text-slate-500">{v.fuelType} • {v.odometerKm.toLocaleString()} km</div>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-300">{v.registration}</td>
                  <td className="px-4 py-3 text-center text-xs text-white font-semibold">{v.daysInStock}</td>
                  <td className="px-4 py-3 text-center">{ageingBadge(v.ageingTier)}</td>
                  <td className="px-4 py-3 text-right text-xs text-slate-300">{formatCurrency(v.totalInvestment)}</td>
                  <td className="px-4 py-3 text-right text-xs text-white font-semibold">
                    {v.askingPrice > 0 ? formatCurrency(v.askingPrice) : '—'}
                  </td>
                  <td className="px-4 py-3 text-center">{statusBadge(v.status)}</td>
                  <td className="px-4 py-3 text-center">
                    {v.certification.startsWith('CPO') ? (
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 text-[10px] font-semibold">
                        <ShieldCheck size={10} /> {v.certification.replace('CPO_', '')}
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-500">{v.certification.replace(/_/g, ' ')}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center text-xs text-slate-400">{v.enquiries}</td>
                  <td className="px-4 py-3 text-center text-xs text-slate-400">{v.testDrives}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // ─── Reconditioning View ───────────────────────────────────────────
  const reconVehicles = demoInventory.filter(v => ['ACQUIRED', 'IN_RECONDITIONING', 'RECONDITIONING_COMPLETE', 'PENDING_CERTIFICATION'].includes(v.status));
  const renderReconditioning = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 rounded-xl border border-amber-500/20 p-4">
          <div className="text-xs text-amber-400/80 mb-1">Awaiting Reconditioning</div>
          <div className="text-2xl font-bold text-amber-400">
            {demoInventory.filter(v => v.status === 'ACQUIRED').length}
          </div>
        </div>
        <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 rounded-xl border border-orange-500/20 p-4">
          <div className="text-xs text-orange-400/80 mb-1">In Workshop</div>
          <div className="text-2xl font-bold text-orange-400">
            {demoInventory.filter(v => v.status === 'IN_RECONDITIONING').length}
          </div>
        </div>
        <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 rounded-xl border border-emerald-500/20 p-4">
          <div className="text-xs text-emerald-400/80 mb-1">Ready for Certification</div>
          <div className="text-2xl font-bold text-emerald-400">
            {demoInventory.filter(v => v.status === 'RECONDITIONING_COMPLETE').length}
          </div>
        </div>
      </div>

      {reconVehicles.length > 0 ? (
        <div className="space-y-3">
          {reconVehicles.map(v => (
            <div key={v.id} className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 rounded-xl border border-slate-700/50 p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-sky-400">{v.stockNumber}</span>
                    {statusBadge(v.status)}
                  </div>
                  <div className="text-white font-semibold text-sm mt-1">{v.make} {v.model} {v.variant} ({v.year})</div>
                  <div className="text-xs text-slate-400">{v.registration} • {v.color} • {v.odometerKm.toLocaleString()} km</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-400">Recon Budget</div>
                  <div className="text-sm font-bold text-orange-400">{formatCurrency(v.reconditioningCost)}</div>
                </div>
              </div>

              <div className="flex gap-2">
                {v.status === 'ACQUIRED' && (
                  <button className="px-3 py-1.5 bg-orange-500/20 border border-orange-500/30 text-orange-400 rounded-lg text-xs font-medium hover:bg-orange-500/30 transition-all flex items-center gap-1.5">
                    <Wrench size={12} /> Start Reconditioning
                  </button>
                )}
                {v.status === 'IN_RECONDITIONING' && (
                  <button className="px-3 py-1.5 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-lg text-xs font-medium hover:bg-emerald-500/30 transition-all flex items-center gap-1.5">
                    <CheckCircle size={12} /> Mark Complete
                  </button>
                )}
                {v.status === 'RECONDITIONING_COMPLETE' && (
                  <button className="px-3 py-1.5 bg-green-500/20 border border-green-500/30 text-green-400 rounded-lg text-xs font-medium hover:bg-green-500/30 transition-all flex items-center gap-1.5">
                    <Award size={12} /> Issue CPO Certificate
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 rounded-xl border border-slate-700/50 p-12 text-center">
          <Wrench size={40} className="text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 text-sm">No vehicles currently in the reconditioning pipeline.</p>
        </div>
      )}
    </div>
  );

  // ─── Main Render ───────────────────────────────────────────────────
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2.5 font-['Outfit']">
            <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30">
              <Car size={20} className="text-amber-400" />
            </div>
            Used Car Engine
          </h1>
          <p className="text-xs text-slate-400 mt-1 ml-12">
            Pre-Owned Vehicle Lifecycle — Appraisal • Valuation • Inventory • Reconditioning • Certification
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-1 bg-slate-800/40 rounded-xl border border-slate-700/30 p-1">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveView(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
              activeView === tab.id
                ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 border border-amber-500/30 shadow-lg shadow-amber-500/5'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/30'
            }`}
          >
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Active View Content */}
      {activeView === 'dashboard' && renderDashboard()}
      {activeView === 'appraisals' && renderAppraisals()}
      {activeView === 'valuations' && renderValuations()}
      {activeView === 'inventory' && renderInventory()}
      {activeView === 'reconditioning' && renderReconditioning()}

      {/* CSV Import Modal */}
      <CsvImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImport={(data) => { console.log('Imported:', data); setShowImportModal(false); }}
        entityName="Used Car Appraisals"
        columns={appraisalCsvColumns}
        sampleData={appraisalSampleRows}
      />
    </div>
  );
};

export default UsedCarEngine;
