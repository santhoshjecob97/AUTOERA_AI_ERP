// Dashboard Types and Interfaces for Enterprise Dashboards

export type EngineType = 'service' | 'sales' | 'finance' | 'insurance' | 'workforce' | 'fleet';

// ============================================
// Shared Widget Types
// ============================================

export interface SummaryMetric {
  label: string;
  value: string | number;
  trend?: number;
  trendUp?: boolean;
}

export interface ChartDataPoint {
  name: string;
  [key: string]: string | number;
}

export interface LineConfig {
  dataKey: string;
  color: string;
  name: string;
  type?: 'line' | 'area';
}

export interface FunnelStage {
  name: string;
  value: number;
  color: string;
  conversionRate?: number;
}

export interface HeatMapCell {
  x: number;
  y: number;
  value: number;
  label?: string;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  avatar?: string;
  [key: string]: any;
}

export interface LeaderboardColumn {
  key: string;
  label: string;
  format?: 'number' | 'currency' | 'percentage';
}

// ============================================
// Widget Props Interfaces
// ============================================

export interface DashboardPanelProps {
  engineType: EngineType;
  title: string;
  children: any;
  summaryMetrics?: SummaryMetric[];
  onRefresh?: () => void;
  isLoading?: boolean;
}

export interface KPICardProps {
  title: string;
  value: string | number;
  trend?: number;
  trendUp?: boolean;
  icon?: any;
  color?: 'indigo' | 'green' | 'orange' | 'red' | 'blue' | 'purple';
  sparklineData?: number[];
  subtitle?: string;
  loading?: boolean;
}

export interface TrendChartProps {
  title: string;
  data: ChartDataPoint[];
  lines: LineConfig[];
  height?: number;
  showLegend?: boolean;
  timeRange?: 'day' | 'week' | 'month';
  onTimeRangeChange?: (range: string) => void;
}

export interface FunnelChartProps {
  title: string;
  data: FunnelStage[];
  height?: number;
  showPercentage?: boolean;
}

export interface HeatMapProps {
  title: string;
  data: HeatMapCell[];
  xLabels: string[];
  yLabels: string[];
  colorScale?: string[];
}

export interface LeaderboardProps {
  title: string;
  data: LeaderboardEntry[];
  columns: LeaderboardColumn[];
  maxItems?: number;
}

export interface ProgressRingProps {
  value: number;
  maxValue?: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
  showPercentage?: boolean;
}

// ============================================
// Dashboard State
// ============================================

export interface DashboardState {
  isExpanded: boolean;
  lastRefresh: Date | null;
  isLoading: boolean;
  error: string | null;
}

// ============================================
// Engine-Specific Dashboard Data
// ============================================

export interface ServiceDashboardData {
  bayUtilization: number;
  technicianEfficiency: number;
  serviceCompletion: number;
  avgServiceTime: number;
  revenueToday: number;
  revenueTrend: ChartDataPoint[];
  bayOccupancy: HeatMapCell[];
  npsScore: number;
  serviceTimeByType: { type: string; time: number; target: number }[];
}

export interface SalesDashboardData {
  totalLeads: number;
  conversionRate: number;
  revenueThisMonth: number;
  avgDealSize: number;
  pipelineFunnel: FunnelStage[];
  leadSourcePerformance: ChartDataPoint[];
  forecastVsActual: { forecast: number; actual: number; variance: number };
  salesLeaderboard: LeaderboardEntry[];
}

export interface FinanceDashboardData {
  totalDisbursement: number;
  approvalRate: number;
  avgLoanAmount: number;
  defaultRate: number;
  loanDistribution: { name: string; count: number }[];
  creditScoreDistribution: { name: string; count: number; color: string }[];
  approvalFunnel: FunnelStage[];
  emiCollectionTrend: ChartDataPoint[];
}

export interface InsuranceDashboardData {
  activePolicies: number;
  claimsProcessed: number;
  fraudDetectionRate: number;
  avgSettlementTime: number;
  claimsTimeline: ChartDataPoint[];
  fraudBreakdown: { name: string; count: number; color: string }[];
  renewalRate: number;
  settlementByType: { name: string; avgTime: number; avgAmount: number }[];
}

export interface WorkforceDashboardData {
  totalEmployees: number;
  attendanceRate: number;
  avgPerformanceScore: number;
  trainingCompletion: number;
  attendanceTrend: ChartDataPoint[];
  skillMatrix: HeatMapCell[];
  trainingByProgram: { name: string; completed: number; total: number }[];
  utilizationScores: LeaderboardEntry[];
}

export interface FleetDashboardData {
  totalVehicles: number;
  availableVehicles: number;
  avgRouteEfficiency: number;
  maintenanceAlerts: number;
  vehicleStatus: { name: string; count: number; color: string }[];
  routeEfficiency: ChartDataPoint[];
  batteryHealth: { name: string; count: number; color: string }[];
  maintenancePriority: { vehicle: string; alert: string; priority: 'high' | 'medium' | 'low' }[];
}

// Union type for all dashboard data
export type EngineDashboardData = 
  | ServiceDashboardData 
  | SalesDashboardData 
  | FinanceDashboardData 
  | InsuranceDashboardData 
  | WorkforceDashboardData 
  | FleetDashboardData;
