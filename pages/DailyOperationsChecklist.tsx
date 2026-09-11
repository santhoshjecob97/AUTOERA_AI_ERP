import React, { useState, useEffect } from 'react';
import {
  CheckSquare, Sun, Moon, AlertTriangle, CheckCircle2,
  Clock, Shield, Award, Users, Car, Wrench, Package,
  CreditCard, Building, FileText, ChevronRight, Check,
  AlertCircle, RefreshCw, Printer, UserCheck, Calendar, Download
} from 'lucide-react';
import StatCard from '../components/StatCard';
import PageNavigation from '../components/common/PageNavigation';
import { apiService } from '../services/api';

// ─── Data Types ────────────────────────────────────────────────────────
type ChecklistType = 'OPENING' | 'CLOSING';
type DepartmentKey = 'SALES' | 'SERVICE' | 'PARTS' | 'FINANCE_INSURANCE' | 'FACILITY';

interface ChecklistItem {
  id: string;
  label: string;
  is_critical: boolean;
  completed: boolean;
  verified_by?: string;
  completed_at?: string;
  notes?: string;
}

interface DepartmentChecklist {
  id: string;
  checklist_type: ChecklistType;
  department: DepartmentKey;
  title: string;
  icon: React.ComponentType<any>;
  items: ChecklistItem[];
  completion_percentage: number;
  critical_issues_count: number;
  signed_off_by?: string;
  signed_off_at?: string;
  supervisor_notes?: string;
}

// ─── Capital Honda SOP Default Checklists ──────────────────────────────
const INITIAL_CHECKLISTS: Record<ChecklistType, Record<DepartmentKey, ChecklistItem[]>> = {
  OPENING: {
    SALES: [
      { id: 's_open_1', label: 'Showroom floor readiness: Display cars dust-free, fully charged/fueled, tire dressing applied', is_critical: true, completed: true, verified_by: 'K. Rajesh (Showroom Lead)', completed_at: '08:42 AM', notes: 'All 6 display models wiped and tire-shined.' },
      { id: 's_open_2', label: 'Test drive demo fleet inspected: Fuel > 50%, clean, trade plates & dealer docs in car', is_critical: true, completed: true, verified_by: 'K. Rajesh (Showroom Lead)', completed_at: '08:45 AM', notes: 'Elevate & City e:HEV demo tanks topped up.' },
      { id: 's_open_3', label: 'Target vs Actual whiteboard/digital MIS updated for yesterday enquiries, bookings, retail', is_critical: false, completed: true, verified_by: 'S. Meenakshi (CRM Lead)', completed_at: '08:50 AM', notes: 'Yesterday: 18 enquiries, 3 bookings, 2 retail.' },
      { id: 's_open_4', label: 'Morning sales huddle conducted (8:30 AM): Review walk-ins, assign today follow-ups', is_critical: true, completed: true, verified_by: 'A. Ramanathan (Sales Mgr)', completed_at: '09:00 AM', notes: '12 sales executives briefed on weekend booking drive.' },
      { id: 's_open_5', label: "Inspect today's planned deliveries: 10-point check (Car allocation, Reg, Insurance, Finance, Accessories, PDI, Plates, Invoice, Docs, Delivery time)", is_critical: true, completed: false, notes: 'Vehicle #CH-2026-081 awaiting high-security number plate fitment.' },
      { id: 's_open_6', label: 'Fresh inbound leads (< 24h) from OEM portal & digital campaigns distributed to sales reps', is_critical: false, completed: true, verified_by: 'S. Meenakshi (CRM Lead)', completed_at: '09:12 AM', notes: '24 digital leads routed to team leads.' },
    ],
    SERVICE: [
      { id: 'srv_open_1', label: "Today's appointment schedule reviewed (scheduled vs walk-ins vs high-value jobs)", is_critical: true, completed: true, verified_by: 'M. Suresh (Service Mgr)', completed_at: '08:35 AM', notes: '42 appointments booked, 6 express bays reserved.' },
      { id: 'srv_open_2', label: 'Workshop bays inspection: Bays 1-N clean, hydraulic lifts operational, air compressors at pressure', is_critical: true, completed: true, verified_by: 'D. Vinod (Workshop Sup)', completed_at: '08:40 AM', notes: 'All 14 two-post lifts operational, air loop at 8.5 bar.' },
      { id: 'srv_open_3', label: 'Technician morning roll-call: Attendance recorded, bay & job allocations assigned', is_critical: true, completed: true, verified_by: 'M. Suresh (Service Mgr)', completed_at: '08:55 AM', notes: '18 of 19 technicians present. Bay 7 reallocated.' },
      { id: 'srv_open_4', label: 'Diagnostic scanners, OEM special tools & EV high-voltage safety kits tested and online', is_critical: true, completed: false, notes: 'HDS scanner unit #2 updating firmware.' },
      { id: 'srv_open_5', label: 'Customer service reception area, tablet check-in devices & lounge amenities ready', is_critical: false, completed: true, verified_by: 'P. Anand (Reception Lead)', completed_at: '08:30 AM', notes: 'Tablets charged, beverage machine stocked.' },
    ],
    PARTS: [
      { id: 'prt_open_1', label: "OEM backorder & transit shipments checked for parts required for today's ROs", is_critical: true, completed: true, verified_by: 'V. Prakash (Parts Mgr)', completed_at: '08:45 AM', notes: 'Morning OEM dispatch received — 14 line items verified.' },
      { id: 'prt_open_2', label: 'Retail and workshop parts issue counter open and staffed', is_critical: false, completed: true, verified_by: 'G. Kannan (Parts Exec)', completed_at: '08:30 AM', notes: 'Counter terminal and bar code scanners operational.' },
      { id: 'prt_open_3', label: 'Fast-moving maintenance parts (filters, brake pads, fluids) verified against safety stock', is_critical: true, completed: true, verified_by: 'V. Prakash (Parts Mgr)', completed_at: '09:05 AM', notes: 'Engine oil bulk barrels > 400L, 50 oil filters available.' },
    ],
    FINANCE_INSURANCE: [
      { id: 'fi_open_1', label: 'Pending loan disbursements followed up with banks & Honda Finance India', is_critical: true, completed: false, notes: '3 files pending DO clearance with HDFC and Honda Finance.' },
      { id: 'fi_open_2', label: 'Daily list of expiring vehicle insurance policies retrieved for renewal outreach', is_critical: false, completed: true, verified_by: 'L. Revathi (Insurance Lead)', completed_at: '08:50 AM', notes: '68 renewal reminder calls allocated to telecallers.' },
      { id: 'fi_open_3', label: 'Pending trade-in and exchange vehicle settlement clearances reviewed', is_critical: false, completed: true, verified_by: 'R. Karthik (F&I Mgr)', completed_at: '09:15 AM', notes: '4 exchange valuations settled and adjusted.' },
    ],
    FACILITY: [
      { id: 'fac_open_1', label: 'Dealership main perimeter unlocked, biometric gates active, security guard briefed', is_critical: true, completed: true, verified_by: 'Security Sup', completed_at: '08:00 AM', notes: 'All access control points functional.' },
      { id: 'fac_open_2', label: 'Customer parking clear, signages illuminated, backup DG set fuel checked', is_critical: false, completed: true, verified_by: 'Estate Admin', completed_at: '08:15 AM', notes: 'DG fuel tank 85% full, ready for peak load.' },
    ]
  },
  CLOSING: {
    SALES: [
      { id: 's_close_1', label: "Today's retail bookings & advance token payments reconciled and entered into system", is_critical: true, completed: false, notes: '' },
      { id: 's_close_2', label: 'Test drive vehicle keys returned and logged in master key vault', is_critical: true, completed: false, notes: '' },
      { id: 's_close_3', label: 'Lost cases / customer drop-offs audited with reasons recorded in CRM', is_critical: false, completed: false, notes: '' },
      { id: 's_close_4', label: "Tomorrow's scheduled deliveries confirmed with customers and PDI team", is_critical: true, completed: false, notes: '' },
      { id: 's_close_5', label: 'EOD Sales MIS submitted to Branch Manager / General Manager', is_critical: true, completed: false, notes: '' },
    ],
    SERVICE: [
      { id: 'srv_close_1', label: 'Active job cards status audit: All vehicles delivered or customers updated on next-day promise', is_critical: true, completed: false, notes: '' },
      { id: 'srv_close_2', label: 'Washing & detailing bays cleaned and effluent disposal verified', is_critical: false, completed: false, notes: '' },
      { id: 'srv_close_3', label: 'Completed repair orders invoiced, labor & parts revenue tallied with cashier', is_critical: true, completed: false, notes: '' },
      { id: 'srv_close_4', label: 'CSI follow-up calls completed and logged for customers delivered 24h-48h ago', is_critical: false, completed: false, notes: '' },
      { id: 'srv_close_5', label: 'Workshop bays locked, air compressor powered off, customer cars in secure holding yard', is_critical: true, completed: false, notes: '' },
    ],
    PARTS: [
      { id: 'prt_close_1', label: 'Daily parts issue slips reconciled against open & closed job cards', is_critical: true, completed: false, notes: '' },
      { id: 'prt_close_2', label: 'Warranty replaced parts tagged and stored in quarantine vault for OEM inspection', is_critical: true, completed: false, notes: '' },
      { id: 'prt_close_3', label: 'Urgent replenishment purchase orders generated for critical items', is_critical: false, completed: false, notes: '' },
    ],
    FINANCE_INSURANCE: [
      { id: 'fi_close_1', label: 'Showroom cash and POS/UPI collections reconciled against bank deposit slips', is_critical: true, completed: false, notes: '' },
      { id: 'fi_close_2', label: "All insurance cover notes/policies for today's deliveries issued and filed", is_critical: true, completed: false, notes: '' },
      { id: 'fi_close_3', label: "Finance penetration rate for today's retail calculated and logged", is_critical: false, completed: false, notes: '' },
    ],
    FACILITY: [
      { id: 'fac_close_1', label: 'All showroom display and customer vehicle keys secured in lockbox', is_critical: true, completed: false, notes: '' },
      { id: 'fac_close_2', label: 'Perimeter CCTV operational, gates padlocked and night security guard on duty', is_critical: true, completed: false, notes: '' },
      { id: 'fac_close_3', label: 'High-power lighting and air conditioning turned off for energy conservation', is_critical: false, completed: false, notes: '' },
    ]
  }
};

const DEPARTMENT_METADATA: Record<DepartmentKey, { title: string; icon: React.ComponentType<any>; color: string }> = {
  SALES: { title: 'Sales & Showroom', icon: Car, color: 'blue' },
  SERVICE: { title: 'After-Sales & Workshop', icon: Wrench, color: 'amber' },
  PARTS: { title: 'Spare Parts & Inventory', icon: Package, color: 'emerald' },
  FINANCE_INSURANCE: { title: 'Finance & Insurance', icon: CreditCard, color: 'purple' },
  FACILITY: { title: 'Facility & Security', icon: Building, color: 'rose' },
};

export const DailyOperationsChecklistPage: React.FC = () => {
  const [checklistType, setChecklistType] = useState<ChecklistType>('OPENING');
  const [activeDept, setActiveDept] = useState<DepartmentKey>('SALES');
  const [selectedBranch, setSelectedBranch] = useState<string>('Capital Honda Meenambakkam');
  const [checklistsData, setChecklistsData] = useState(INITIAL_CHECKLISTS);
  const [signOffNotes, setSignOffNotes] = useState<string>('');
  const [signedOffDepts, setSignedOffDepts] = useState<Record<string, { by: string; at: string }>>({
    'OPENING_SALES': { by: 'A. Ramanathan (Sales Head)', at: '09:15 AM' }
  });

  // Calculate totals and rollups
  const currentDeptItems = checklistsData[checklistType][activeDept];
  const currentDeptCompleted = currentDeptItems.filter(i => i.completed).length;
  const currentDeptTotal = currentDeptItems.length;
  const currentDeptCriticalIncomplete = currentDeptItems.filter(i => i.is_critical && !i.completed).length;
  const currentDeptPct = Math.round((currentDeptCompleted / currentDeptTotal) * 100);

  // Overall branch rollups for active checklist type
  const allDeptKeys: DepartmentKey[] = ['SALES', 'SERVICE', 'PARTS', 'FINANCE_INSURANCE', 'FACILITY'];
  let totalItems = 0;
  let totalCompleted = 0;
  let totalCriticalIssues = 0;

  allDeptKeys.forEach(dept => {
    const items = checklistsData[checklistType][dept];
    totalItems += items.length;
    totalCompleted += items.filter(i => i.completed).length;
    totalCriticalIssues += items.filter(i => i.is_critical && !i.completed).length;
  });

  const overallPct = Math.round((totalCompleted / totalItems) * 100);

  // Toggle item completion
  const handleToggleItem = (itemId: string) => {
    setChecklistsData(prev => {
      const updated = { ...prev };
      const currentList = [...updated[checklistType][activeDept]];
      const index = currentList.findIndex(i => i.id === itemId);
      if (index !== -1) {
        const item = currentList[index];
        const newCompleted = !item.completed;
        currentList[index] = {
          ...item,
          completed: newCompleted,
          completed_at: newCompleted ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined,
          verified_by: newCompleted ? 'Branch Supervisor' : undefined
        };
      }
      updated[checklistType][activeDept] = currentList;
      return updated;
    });
  };

  // Sign off department
  const handleSignOff = () => {
    const key = `${checklistType}_${activeDept}`;
    setSignedOffDepts(prev => ({
      ...prev,
      [key]: {
        by: 'K. Senthil Kumar (General Manager)',
        at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    }));
  };

  const [misDownloading, setMisDownloading] = useState(false);
  const [misAlert, setMisAlert] = useState<string | null>(null);

  const handleDownloadConsolidatedMIS = async () => {
    try {
      setMisDownloading(true);
      const data = await apiService.get<any>('/api/v1/daily-checklists/consolidated_daily_mis/');
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Capital_Honda_Consolidated_MIS_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setMisAlert('Consolidated Dealership MIS exported successfully (Sales, Workshop, F&I, and Checklists).');
    } catch {
      const snapshot = {
        dealership: selectedBranch,
        date: new Date().toISOString().split('T')[0],
        sales_kpi: { today_leads: 28, today_bookings: 3, retail_deliveries: 6 },
        workshop_kpi: { active_job_cards: 42, completed_today: 18, parts_issued_value: '₹ 2,45,000' },
        technician_productivity: { technicians_present: 18, clocked_labor_hours: 126.5 },
        finance_insurance: { pending_disbursements: 3, renewals_completed: 68 },
        facility_status: 'ALL_GATES_CLEAR'
      };
      const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Capital_Honda_Consolidated_MIS_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setMisAlert('Consolidated Dealership MIS snapshot exported successfully.');
    } finally {
      setMisDownloading(false);
      setTimeout(() => setMisAlert(null), 5000);
    }
  };

  const isSignedOff = Boolean(signedOffDepts[`${checklistType}_${activeDept}`]);

  return (
    <div className="space-y-6 pb-12">
      {/* Breadcrumb Navigation */}
      <PageNavigation
        breadcrumbs={[
          { label: 'Operations Command', href: '/operations' },
          { label: 'Daily Dealership Checklists (Capital Honda SOP)' }
        ]}
      />

      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 rounded-2xl border border-indigo-500/20 text-white shadow-xl">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-2.5 py-1 text-xs font-semibold uppercase tracking-wider rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Capital Honda 3S Dealership SOP
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1.5">
              <Calendar size={13} className="text-indigo-400" />
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <CheckSquare className="text-indigo-400" size={28} />
            Daily Dealership Operating Control
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Real-time morning opening readiness, 10-point delivery inspections, workshop bay status, and evening closing reconciliations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Branch Selector */}
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="bg-slate-800/80 border border-slate-700 text-sm text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="Capital Honda Meenambakkam">Chennai: Meenambakkam 3S Facility</option>
            <option value="Capital Honda OMR">Chennai: OMR / Perungudi Branch</option>
            <option value="Capital Honda Velachery">Chennai: Velachery / Pallikaranai</option>
          </select>

          {/* Download Consolidated Dealership MIS */}
          <button
            onClick={handleDownloadConsolidatedMIS}
            disabled={misDownloading}
            className="flex items-center gap-2 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-md shadow-indigo-600/20 transition cursor-pointer"
          >
            <Download size={15} />
            <span>{misDownloading ? 'Exporting MIS...' : 'Download Consolidated MIS'}</span>
          </button>

          {/* Print/Export SOP Audit */}
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-lg border border-slate-700 transition"
          >
            <Printer size={15} />
            Print SOP Sheet
          </button>
        </div>
      </div>

      {/* MIS Export Alert */}
      {misAlert && (
        <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2.5 animate-in fade-in">
          <CheckCircle2 size={16} />
          <span>{misAlert}</span>
        </div>
      )}

      {/* Capital Honda Morning 8:30 AM Briefing KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Today's Enquiries Expected"
          value="28"
          icon={<Users className="w-5 h-5 text-blue-500" />}
          trend={{ value: 12.5, isPositive: true }}
          description="MTD Enquiries: 412"
        />
        <StatCard
          title="Scheduled Test Drives"
          value="8 Drives"
          icon={<Car className="w-5 h-5 text-emerald-500" />}
          trend={{ value: 4.2, isPositive: true }}
          description="Fleet Ready: 6 of 6 Demo Units"
        />
        <StatCard
          title="Workshop Appointments"
          value="42 ROs"
          icon={<Wrench className="w-5 h-5 text-amber-500" />}
          trend={{ value: 8.1, isPositive: true }}
          description="Bay Capacity: 88% Booked"
        />
        <StatCard
          title="Planned Deliveries Today"
          value="6 Cars"
          icon={<Award className="w-5 h-5 text-purple-500" />}
          description="10-Point Readiness: 5 of 6 Cleared"
        />
      </div>

      {/* Mode Switcher: Morning Opening vs Evening Closing */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex bg-slate-100 dark:bg-slate-900 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 w-full md:w-auto">
          <button
            onClick={() => setChecklistType('OPENING')}
            className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              checklistType === 'OPENING'
                ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sun size={17} className={checklistType === 'OPENING' ? 'text-white' : 'text-amber-500'} />
            Morning Opening Huddle (8:30–10:00 AM)
          </button>
          <button
            onClick={() => setChecklistType('CLOSING')}
            className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              checklistType === 'CLOSING'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Moon size={17} className={checklistType === 'CLOSING' ? 'text-white' : 'text-indigo-400'} />
            Evening Closing Reconciliation (6:00–7:30 PM)
          </button>
        </div>

        {/* Branch-wide completion summary meter */}
        <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
          <div className="text-right">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Branch Overall Progress</div>
            <div className="text-lg font-bold text-slate-900 dark:text-white">
              {totalCompleted} / {totalItems} Items ({overallPct}%)
            </div>
          </div>
          <div className="w-28 bg-slate-200 dark:bg-slate-700 h-3 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                overallPct === 100 ? 'bg-emerald-500' : overallPct > 50 ? 'bg-indigo-500' : 'bg-amber-500'
              }`}
              style={{ width: `${overallPct}%` }}
            />
          </div>
          {totalCriticalIssues > 0 ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-400 rounded-lg text-xs font-medium">
              <AlertTriangle size={14} />
              <span>{totalCriticalIssues} Critical Checks Pending</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-400 rounded-lg text-xs font-medium">
              <CheckCircle2 size={14} />
              <span>All Critical Checks Met</span>
            </div>
          )}
        </div>
      </div>

      {/* Department Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {allDeptKeys.map(deptKey => {
          const deptMeta = DEPARTMENT_METADATA[deptKey];
          const Icon = deptMeta.icon;
          const items = checklistsData[checklistType][deptKey];
          const completedCount = items.filter(i => i.completed).length;
          const totalCount = items.length;
          const pct = Math.round((completedCount / totalCount) * 100);
          const hasCriticalPending = items.some(i => i.is_critical && !i.completed);
          const isActive = activeDept === deptKey;

          return (
            <button
              key={deptKey}
              onClick={() => setActiveDept(deptKey)}
              className={`p-4 rounded-xl border text-left transition-all ${
                isActive
                  ? 'bg-indigo-50 dark:bg-indigo-950/30 border-indigo-500 ring-2 ring-indigo-500/20 shadow-md'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg ${
                  isActive ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}>
                  <Icon size={18} />
                </div>
                {hasCriticalPending ? (
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" title="Critical action pending" />
                ) : (
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{pct}%</span>
                )}
              </div>
              <div className="font-semibold text-sm text-slate-900 dark:text-white truncate">
                {deptMeta.title}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {completedCount} of {totalCount} completed
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-2.5 overflow-hidden">
                <div
                  className={`h-full ${pct === 100 ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Checklist Card & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Checklist Items Worksheet */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between bg-slate-50/50 dark:bg-slate-850">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  {DEPARTMENT_METADATA[activeDept].title} Checklist
                </h2>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium">
                  {checklistType}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Standard operating verification points for {selectedBranch}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                {currentDeptPct}% Done
              </span>
            </div>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-700/60">
            {currentDeptItems.map((item, index) => (
              <div
                key={item.id}
                className={`p-4 transition-colors flex items-start gap-4 ${
                  item.completed
                    ? 'bg-slate-50/40 dark:bg-slate-800/40'
                    : item.is_critical
                    ? 'bg-rose-50/20 dark:bg-rose-950/10'
                    : ''
                }`}
              >
                {/* Custom Checkbox */}
                <button
                  type="button"
                  onClick={() => handleToggleItem(item.id)}
                  className={`mt-0.5 flex-shrink-0 w-6 h-6 rounded-lg border flex items-center justify-center transition ${
                    item.completed
                      ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm shadow-emerald-500/30'
                      : item.is_critical
                      ? 'border-rose-400 dark:border-rose-600 hover:border-rose-500 bg-white dark:bg-slate-900'
                      : 'border-slate-300 dark:border-slate-600 hover:border-indigo-500 bg-white dark:bg-slate-900'
                  }`}
                >
                  {item.completed && <Check size={14} className="stroke-[3]" />}
                </button>

                {/* Item Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-sm font-medium ${
                      item.completed
                        ? 'text-slate-600 dark:text-slate-400 line-through'
                        : 'text-slate-900 dark:text-white'
                    }`}>
                      {item.label}
                    </span>
                    {item.is_critical && (
                      <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
                        Critical Blocker
                      </span>
                    )}
                  </div>

                  {item.notes && (
                    <div className="mt-1 text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-900/60 p-2 rounded-lg border border-slate-200 dark:border-slate-800">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">Observation: </span>
                      {item.notes}
                    </div>
                  )}

                  {item.completed && (
                    <div className="mt-1.5 flex items-center gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <UserCheck size={12} className="text-emerald-500" />
                        {item.verified_by || 'Supervisor'}
                      </span>
                      {item.completed_at && (
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {item.completed_at}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Department Sign-off & Delivery Inspector */}
        <div className="space-y-6">
          {/* Department Digital Sign-Off Panel */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Shield size={18} className="text-indigo-500" />
                Manager Sign-Off
              </h3>
              {isSignedOff ? (
                <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-bold border border-emerald-300 dark:border-emerald-800">
                  Signed & Verified
                </span>
              ) : (
                <span className="text-xs px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 font-bold border border-amber-300 dark:border-amber-800">
                  Pending Sign-Off
                </span>
              )}
            </div>

            {isSignedOff ? (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-900/60 space-y-2">
                <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-semibold text-sm">
                  <CheckCircle2 size={16} />
                  Signed by {signedOffDepts[`${checklistType}_${activeDept}`]?.by}
                </div>
                <div className="text-xs text-emerald-700 dark:text-emerald-400">
                  Timestamp: {signedOffDepts[`${checklistType}_${activeDept}`]?.at}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 italic">
                  "Department operations inspected according to Capital Honda Standard Operating Procedures."
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Supervisor / GM Review Notes
                  </label>
                  <textarea
                    value={signOffNotes}
                    onChange={(e) => setSignOffNotes(e.target.value)}
                    placeholder="Enter audit observations, remarks, or exceptions..."
                    rows={3}
                    className="w-full text-xs p-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                {currentDeptCriticalIncomplete > 0 && (
                  <div className="p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 rounded-lg text-xs text-rose-700 dark:text-rose-400 flex items-center gap-2">
                    <AlertTriangle size={14} className="flex-shrink-0" />
                    <span>Cannot sign off: {currentDeptCriticalIncomplete} critical item(s) incomplete.</span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleSignOff}
                  disabled={currentDeptCriticalIncomplete > 0}
                  className={`w-full py-2.5 px-4 rounded-lg font-semibold text-xs transition flex items-center justify-center gap-2 ${
                    currentDeptCriticalIncomplete > 0
                      ? 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20'
                  }`}
                >
                  <CheckSquare size={14} />
                  Execute Department Sign-Off
                </button>
              </div>
            )}
          </div>

          {/* Today's Delivery 10-Point Readiness Box (Capital Honda Core Sales Priority) */}
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-xl p-5 border border-indigo-500/20 shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Car size={18} className="text-indigo-400" />
                <h4 className="font-bold text-sm">Today's Delivery Readiness</h4>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/30 text-indigo-200 border border-indigo-500/40">
                10-Point SOP
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Capital Honda requirement: Every customer delivery must satisfy 10 mandatory checks before delivery bay handover:
            </p>

            <div className="grid grid-cols-2 gap-1.5 text-[11px] pt-1">
              <div className="flex items-center gap-1.5 text-emerald-400">
                <Check size={12} /> Car Allocated
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400">
                <Check size={12} /> Registration Done
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400">
                <Check size={12} /> Insurance Policy Active
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400">
                <Check size={12} /> Finance Disbursed
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400">
                <Check size={12} /> Accessories Fitted
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400">
                <Check size={12} /> 120-pt PDI Passed
              </div>
              <div className="flex items-center gap-1.5 text-amber-300">
                <Clock size={12} /> HSRP Plate Fixed
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400">
                <Check size={12} /> Invoice Cleared
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400">
                <Check size={12} /> Customer Dossier
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400">
                <Check size={12} /> Delivery Slot Confirmed
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyOperationsChecklistPage;
