// Dashboard Components Export
export { default as DashboardPanel } from './DashboardPanel';
export { default as KPICard } from './KPICard';
export { default as TrendChart } from './TrendChart';
export { default as FunnelChart } from './FunnelChart';
export { default as HeatMap } from './HeatMap';
export { default as Leaderboard } from './Leaderboard';
export { default as ProgressRing } from './ProgressRing';

// Engine-Specific Dashboards
export { default as ServiceDashboard } from './ServiceDashboard';
export { default as SalesDashboard } from './SalesDashboard';
export { default as FinanceDashboard } from './FinanceDashboard';
export { default as InsuranceDashboard } from './InsuranceDashboard';
export { default as WorkforceDashboard } from './WorkforceDashboard';
export { default as FleetDashboard } from './FleetDashboard';

// Re-export types
export * from '../../types/dashboard';
