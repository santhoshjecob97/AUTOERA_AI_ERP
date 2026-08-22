# Design Document

## Overview

The Enterprise Dashboards feature adds comprehensive, visually appealing analytics dashboards to each of the six AI Engine pages in the AutoEra platform. These dashboards provide real-time KPIs, trend visualizations, and AI-powered insights that enhance the enterprise appeal of the platform while maintaining the existing UI structure and design language.

### Key Design Goals

1. **Non-Invasive Integration**: Add dashboards without modifying existing page layouts or functionality
2. **Consistent Design Language**: Match existing Indigo/Slate color scheme and component styling
3. **Reusable Components**: Create a shared dashboard component library for consistency
4. **Performance Optimized**: Lazy load dashboard data to avoid impacting page load times
5. **Responsive Design**: Work seamlessly across desktop, tablet, and mobile devices

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Engine Pages                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Service      │  │ Sales        │  │ Finance      │      │
│  │ Engine       │  │ Engine       │  │ Engine       │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                  │                  │              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Insurance    │  │ Workforce    │  │ Fleet        │      │
│  │ Engine       │  │ Engine       │  │ Engine       │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                  │                  │              │
│         └──────────────────┴──────────────────┘              │
│                            │                                 │
│                   ┌────────▼────────┐                       │
│                   │  Dashboard      │                       │
│                   │  Components     │                       │
│                   └────────┬────────┘                       │
└────────────────────────────┼────────────────────────────────┘
                             │
                    ┌────────▼────────┐
                    │  Dashboard      │
                    │  Data Service   │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │  Mock API /     │
                    │  Local State    │
                    └─────────────────┘
```

### Component Architecture

```
Dashboard Components
├── DashboardPanel (Shared Container)
│   ├── DashboardHeader
│   │   ├── Title
│   │   ├── RefreshButton
│   │   └── ToggleButton
│   ├── DashboardGrid
│   │   └── Widget slots
│   └── CollapsedSummary
│
├── Widgets (Shared)
│   ├── KPICard
│   ├── TrendChart
│   ├── FunnelChart
│   ├── HeatMap
│   ├── Leaderboard
│   ├── ProgressRing
│   └── SparklineCard
│
├── Engine-Specific Dashboards
│   ├── ServiceDashboard
│   ├── SalesDashboard
│   ├── FinanceDashboard
│   ├── InsuranceDashboard
│   ├── WorkforceDashboard
│   └── FleetDashboard
│
└── Hooks
    ├── useDashboardData
    ├── useDashboardToggle
    └── useAnimatedValue
```

## Components and Interfaces

### 1. DashboardPanel Component

**Purpose**: Collapsible container for dashboard widgets with toggle persistence

**Props Interface**:
```typescript
interface DashboardPanelProps {
  engineType: 'service' | 'sales' | 'finance' | 'insurance' | 'workforce' | 'fleet';
  title: string;
  children: React.ReactNode;
  summaryMetrics?: SummaryMetric[];
  onRefresh?: () => void;
  isLoading?: boolean;
}

interface SummaryMetric {
  label: string;
  value: string | number;
  trend?: number;
  trendUp?: boolean;
}
```

### 2. KPICard Component

**Purpose**: Display key performance indicators with trend data

**Props Interface**:
```typescript
interface KPICardProps {
  title: string;
  value: string | number;
  trend?: number;
  trendUp?: boolean;
  icon?: React.ReactNode;
  color?: 'indigo' | 'green' | 'orange' | 'red' | 'blue' | 'purple';
  sparklineData?: number[];
  subtitle?: string;
  loading?: boolean;
}
```

### 3. TrendChart Component

**Purpose**: Display time-series data with multiple metrics

**Props Interface**:
```typescript
interface TrendChartProps {
  title: string;
  data: ChartDataPoint[];
  lines: LineConfig[];
  height?: number;
  showLegend?: boolean;
  timeRange?: 'day' | 'week' | 'month';
  onTimeRangeChange?: (range: string) => void;
}

interface ChartDataPoint {
  name: string;
  [key: string]: string | number;
}

interface LineConfig {
  dataKey: string;
  color: string;
  name: string;
  type?: 'line' | 'area';
}
```

### 4. FunnelChart Component

**Purpose**: Display conversion funnel or pipeline stages

**Props Interface**:
```typescript
interface FunnelChartProps {
  title: string;
  data: FunnelStage[];
  height?: number;
  showPercentage?: boolean;
}

interface FunnelStage {
  name: string;
  value: number;
  color: string;
  conversionRate?: number;
}
```

### 5. HeatMap Component

**Purpose**: Display intensity data across two dimensions

**Props Interface**:
```typescript
interface HeatMapProps {
  title: string;
  data: HeatMapCell[];
  xLabels: string[];
  yLabels: string[];
  colorScale?: string[];
}

interface HeatMapCell {
  x: number;
  y: number;
  value: number;
  label?: string;
}
```

### 6. Leaderboard Component

**Purpose**: Display ranked list with metrics

**Props Interface**:
```typescript
interface LeaderboardProps {
  title: string;
  data: LeaderboardEntry[];
  columns: LeaderboardColumn[];
  maxItems?: number;
}

interface LeaderboardEntry {
  id: string;
  name: string;
  avatar?: string;
  [key: string]: any;
}

interface LeaderboardColumn {
  key: string;
  label: string;
  format?: 'number' | 'currency' | 'percentage';
}
```

## Data Models

### Dashboard State

```typescript
interface DashboardState {
  isExpanded: boolean;
  lastRefresh: Date | null;
  isLoading: boolean;
  error: string | null;
  data: EngineDashboardData;
}
```

### Engine-Specific Data Models

**Service Dashboard Data**:
```typescript
interface ServiceDashboardData {
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
```

**Sales Dashboard Data**:
```typescript
interface SalesDashboardData {
  totalLeads: number;
  conversionRate: number;
  revenueThisMonth: number;
  avgDealSize: number;
  pipelineFunnel: FunnelStage[];
  leadSourcePerformance: ChartDataPoint[];
  forecastVsActual: { forecast: number; actual: number; variance: number };
  salesLeaderboard: LeaderboardEntry[];
}
```

**Finance Dashboard Data**:
```typescript
interface FinanceDashboardData {
  totalDisbursement: number;
  approvalRate: number;
  avgLoanAmount: number;
  defaultRate: number;
  loanDistribution: ChartDataPoint[];
  creditScoreDistribution: ChartDataPoint[];
  approvalFunnel: FunnelStage[];
  emiCollectionTrend: ChartDataPoint[];
}
```

**Insurance Dashboard Data**:
```typescript
interface InsuranceDashboardData {
  activePolicies: number;
  claimsProcessed: number;
  fraudDetectionRate: number;
  avgSettlementTime: number;
  claimsTimeline: ChartDataPoint[];
  fraudBreakdown: ChartDataPoint[];
  renewalRate: number;
  settlementByType: ChartDataPoint[];
}
```

**Workforce Dashboard Data**:
```typescript
interface WorkforceDashboardData {
  totalEmployees: number;
  attendanceRate: number;
  avgPerformanceScore: number;
  trainingCompletion: number;
  attendanceTrend: ChartDataPoint[];
  skillMatrix: HeatMapCell[];
  trainingByProgram: ChartDataPoint[];
  utilizationScores: LeaderboardEntry[];
}
```

**Fleet Dashboard Data**:
```typescript
interface FleetDashboardData {
  totalVehicles: number;
  availableVehicles: number;
  avgRouteEfficiency: number;
  maintenanceAlerts: number;
  vehicleStatus: ChartDataPoint[];
  routeEfficiency: ChartDataPoint[];
  batteryHealth: ChartDataPoint[];
  maintenancePriority: { vehicle: string; alert: string; priority: 'high' | 'medium' | 'low' }[];
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: KPI Card Data Display
*For any* KPI card receiving valid data, the rendered output should contain the value, and if trend is provided, display the trend percentage with correct direction indicator.
**Validates: Requirements 1.2**

### Property 2: Dashboard Toggle State Persistence
*For any* dashboard toggle action, the new state should be persisted to localStorage and restored correctly on page reload.
**Validates: Requirements 8.1, 8.2, 8.3**

### Property 3: Loading State Display
*For any* dashboard widget in loading state, a skeleton loader should be visible until data is available.
**Validates: Requirements 1.4**

### Property 4: Error State with Retry
*For any* widget that encounters a data fetch error, an error message and retry button should be displayed.
**Validates: Requirements 1.5**

### Property 5: Responsive Grid Layout
*For any* viewport width, the dashboard grid should display the correct number of columns (4 on desktop, 2 on tablet, 1 on mobile).
**Validates: Requirements 10.1, 10.2, 10.3**

### Property 6: Data Refresh Behavior
*For any* refresh action, all dashboard widgets should refetch data and display loading state during fetch.
**Validates: Requirements 9.3**

### Property 7: Collapsed Summary Display
*For any* collapsed dashboard state, a summary bar with key metrics should be visible.
**Validates: Requirements 8.4**

### Property 8: Chart Responsive Container
*For any* chart component, it should be wrapped in a ResponsiveContainer to maintain aspect ratio on resize.
**Validates: Requirements 10.5**

## Error Handling

### Error Categories

1. **Data Fetch Errors**
   - Network timeout
   - API errors
   - Invalid response format

2. **Rendering Errors**
   - Invalid data format
   - Missing required props
   - Chart rendering failures

3. **State Errors**
   - localStorage unavailable
   - Invalid persisted state

### Error Handling Strategies

**Data Fetch Errors**:
- Display cached data if available
- Show staleness indicator
- Provide retry button
- Log errors for monitoring

**Rendering Errors**:
- Use error boundaries
- Display fallback UI
- Provide default values for optional props

**State Errors**:
- Fall back to default state
- Clear corrupted localStorage
- Continue with in-memory state

## Testing Strategy

### Unit Testing

**Component Tests**:
- Test KPICard renders correctly with various data
- Test DashboardPanel toggle behavior
- Test chart components with mock data
- Test loading and error states

### Property-Based Testing

The testing strategy will use **fast-check** (for TypeScript/JavaScript) as the property-based testing library.

**Configuration**:
- Each property test should run a minimum of 100 iterations
- Tests should use appropriate generators for dashboard data
- Failed tests should shrink to minimal failing examples

**Test Organization**:
- Each correctness property will be implemented as a separate property-based test
- Tests will be tagged with feature name and property number
- Tests will reference the design document property they validate

### Integration Testing

- Test dashboard integration with engine pages
- Test data flow from mock API to widgets
- Test responsive behavior across breakpoints

