import { useState, useEffect, useCallback, useRef } from 'react';
import { EngineType, EngineDashboardData } from '../types/dashboard';

interface UseDashboardDataOptions {
  engineType: EngineType;
  autoRefresh?: boolean;
  refreshInterval?: number; // in milliseconds
  cacheTime?: number; // in milliseconds
}

interface UseDashboardDataReturn<T extends EngineDashboardData> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  lastRefresh: Date | null;
  isStale: boolean;
  refresh: () => Promise<void>;
  retry: () => Promise<void>;
}

// Simple in-memory cache
const dataCache: Map<string, { data: EngineDashboardData; timestamp: number }> = new Map();

// Mock data fetcher - simulates API call
async function fetchDashboardData<T extends EngineDashboardData>(
  engineType: EngineType
): Promise<T> {
  // Attempt real API call first
  try {
    const { apiService } = await import('../services/api');
    const response = await apiService.get<T>(`/api/v1/${engineType}/dashboard/`);
    if (response) return response;
  } catch (e) {
    // API not reachable or endpoint not implemented yet, fallback to mock data
  }

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));

  // Return mock data based on engine type
  return getMockData(engineType) as T;
}


function getMockData(engineType: EngineType): EngineDashboardData {
  switch (engineType) {
    case 'service':
      return {
        bayUtilization: 89,
        technicianEfficiency: 94,
        serviceCompletion: 92,
        avgServiceTime: 3.2,
        revenueToday: 285000,
        revenueTrend: [
          { name: 'Mon', revenue: 245000, target: 250000 },
          { name: 'Tue', revenue: 268000, target: 250000 },
          { name: 'Wed', revenue: 252000, target: 250000 },
          { name: 'Thu', revenue: 298000, target: 250000 },
          { name: 'Fri', revenue: 285000, target: 250000 },
          { name: 'Sat', revenue: 312000, target: 280000 },
        ],
        bayOccupancy: generateBayOccupancy(),
        npsScore: 72,
        serviceTimeByType: [
          { type: 'Regular Service', time: 2.5, target: 3 },
          { type: 'Brake Repair', time: 1.8, target: 2 },
          { type: 'AC Service', time: 3.5, target: 4 },
          { type: 'Engine Repair', time: 5.2, target: 6 },
        ],
      };
    case 'sales':
      return {
        totalLeads: 342,
        conversionRate: 24.5,
        revenueThisMonth: 4850000,
        avgDealSize: 485000,
        pipelineFunnel: [
          { name: 'New Leads', value: 342, color: '#6366f1', conversionRate: 100 },
          { name: 'Qualified', value: 186, color: '#8b5cf6', conversionRate: 54 },
          { name: 'Test Drive', value: 98, color: '#a855f7', conversionRate: 53 },
          { name: 'Negotiation', value: 52, color: '#d946ef', conversionRate: 53 },
          { name: 'Closed Won', value: 28, color: '#22c55e', conversionRate: 54 },
        ],
        leadSourcePerformance: [
          { name: 'Website', leads: 120, conversions: 32 },
          { name: 'Walk-in', leads: 85, conversions: 28 },
          { name: 'Referral', leads: 62, conversions: 24 },
          { name: 'Social', leads: 45, conversions: 8 },
          { name: 'Events', leads: 30, conversions: 6 },
        ],
        forecastVsActual: { forecast: 5200000, actual: 4850000, variance: -6.7 },
        salesLeaderboard: [
          { id: '1', name: 'Rahul Sharma', deals: 8, revenue: 1250000 },
          { id: '2', name: 'Priya Patel', deals: 7, revenue: 1180000 },
          { id: '3', name: 'Amit Kumar', deals: 6, revenue: 980000 },
          { id: '4', name: 'Sneha Reddy', deals: 5, revenue: 820000 },
          { id: '5', name: 'Vikram Singh', deals: 4, revenue: 620000 },
        ],
      };
    case 'finance':
      return {
        totalDisbursement: 12500000,
        approvalRate: 68,
        avgLoanAmount: 485000,
        defaultRate: 2.3,
        loanDistribution: [
          { name: '< 3L', count: 45 },
          { name: '3-5L', count: 82 },
          { name: '5-8L', count: 56 },
          { name: '8-12L', count: 28 },
          { name: '> 12L', count: 12 },
        ],
        creditScoreDistribution: [
          { name: 'Excellent (750+)', count: 42, color: '#22c55e' },
          { name: 'Good (700-749)', count: 68, color: '#84cc16' },
          { name: 'Fair (650-699)', count: 45, color: '#f59e0b' },
          { name: 'Poor (<650)', count: 18, color: '#ef4444' },
        ],
        approvalFunnel: [
          { name: 'Applications', value: 245, color: '#6366f1' },
          { name: 'Documents Verified', value: 198, color: '#8b5cf6' },
          { name: 'Credit Approved', value: 142, color: '#a855f7' },
          { name: 'Disbursed', value: 128, color: '#22c55e' },
        ],
        emiCollectionTrend: [
          { name: 'Jan', collected: 2800000, due: 3000000 },
          { name: 'Feb', collected: 2950000, due: 3100000 },
          { name: 'Mar', collected: 3100000, due: 3200000 },
          { name: 'Apr', collected: 3050000, due: 3150000 },
        ],
      };

    case 'insurance':
      return {
        activePolicies: 1842,
        claimsProcessed: 156,
        fraudDetectionRate: 4.2,
        avgSettlementTime: 5.8,
        claimsTimeline: [
          { name: 'Week 1', filed: 42, processed: 38, settled: 32 },
          { name: 'Week 2', filed: 38, processed: 35, settled: 30 },
          { name: 'Week 3', filed: 45, processed: 42, settled: 36 },
          { name: 'Week 4', filed: 31, processed: 41, settled: 38 },
        ],
        fraudBreakdown: [
          { name: 'Document Fraud', count: 8, color: '#ef4444' },
          { name: 'Staged Accidents', count: 5, color: '#f97316' },
          { name: 'Inflated Claims', count: 12, color: '#f59e0b' },
          { name: 'Identity Fraud', count: 3, color: '#eab308' },
        ],
        renewalRate: 78,
        settlementByType: [
          { name: 'Accident', avgTime: 8.2, avgAmount: 125000 },
          { name: 'Theft', avgTime: 12.5, avgAmount: 280000 },
          { name: 'Natural Disaster', avgTime: 6.8, avgAmount: 85000 },
          { name: 'Third Party', avgTime: 4.2, avgAmount: 45000 },
        ],
      };
    case 'workforce':
      return {
        totalEmployees: 86,
        attendanceRate: 94.2,
        avgPerformanceScore: 4.1,
        trainingCompletion: 78,
        attendanceTrend: [
          { name: 'Mon', present: 82, absent: 4 },
          { name: 'Tue', present: 84, absent: 2 },
          { name: 'Wed', present: 80, absent: 6 },
          { name: 'Thu', present: 83, absent: 3 },
          { name: 'Fri', present: 78, absent: 8 },
        ],
        skillMatrix: generateSkillMatrix(),
        trainingByProgram: [
          { name: 'Safety', completed: 82, total: 86 },
          { name: 'Technical', completed: 68, total: 86 },
          { name: 'Customer Service', completed: 72, total: 86 },
          { name: 'Leadership', completed: 24, total: 32 },
        ],
        utilizationScores: [
          { id: '1', name: 'Amit Kumar', utilization: 96, efficiency: 94 },
          { id: '2', name: 'Rajesh Singh', utilization: 94, efficiency: 92 },
          { id: '3', name: 'Suresh Patel', utilization: 92, efficiency: 88 },
          { id: '4', name: 'Vikram Reddy', utilization: 88, efficiency: 90 },
          { id: '5', name: 'Priya Sharma', utilization: 85, efficiency: 86 },
        ],
      };
    case 'fleet':
      return {
        totalVehicles: 48,
        availableVehicles: 42,
        avgRouteEfficiency: 87.5,
        maintenanceAlerts: 6,
        vehicleStatus: [
          { name: 'Available', count: 42, color: '#22c55e' },
          { name: 'In Service', count: 3, color: '#f59e0b' },
          { name: 'Maintenance', count: 2, color: '#ef4444' },
          { name: 'Reserved', count: 1, color: '#6366f1' },
        ],
        routeEfficiency: [
          { name: 'Route A', efficiency: 92, fuelCost: 4500 },
          { name: 'Route B', efficiency: 88, fuelCost: 5200 },
          { name: 'Route C', efficiency: 85, fuelCost: 4800 },
          { name: 'Route D', efficiency: 78, fuelCost: 6100 },
        ],
        batteryHealth: [
          { name: 'Excellent', count: 12, color: '#22c55e' },
          { name: 'Good', count: 8, color: '#84cc16' },
          { name: 'Fair', count: 4, color: '#f59e0b' },
          { name: 'Poor', count: 1, color: '#ef4444' },
        ],
        maintenancePriority: [
          { vehicle: 'MH-01-AB-1234', alert: 'Brake pad replacement', priority: 'high' },
          { vehicle: 'MH-01-CD-5678', alert: 'Oil change due', priority: 'medium' },
          { vehicle: 'MH-01-EF-9012', alert: 'Tire rotation', priority: 'low' },
          { vehicle: 'MH-01-GH-3456', alert: 'Battery check', priority: 'medium' },
        ],
      };
    default:
      throw new Error(`Unknown engine type: ${engineType}`);
  }
}


function generateBayOccupancy() {
  const bays = ['Bay 1', 'Bay 2', 'Bay 3', 'Bay 4'];
  const times = ['9 AM', '12 PM', '3 PM', '6 PM'];
  const data = [];
  for (let y = 0; y < times.length; y++) {
    for (let x = 0; x < bays.length; x++) {
      data.push({
        x,
        y,
        value: 60 + Math.floor(Math.random() * 40),
        label: `${bays[x]} - ${times[y]}`,
      });
    }
  }
  return data;
}

function generateSkillMatrix() {
  const skills = ['Mechanical', 'Electrical', 'Diagnostics', 'Customer'];
  const levels = ['Junior', 'Mid', 'Senior', 'Expert'];
  const data = [];
  for (let y = 0; y < levels.length; y++) {
    for (let x = 0; x < skills.length; x++) {
      data.push({
        x,
        y,
        value: Math.floor(Math.random() * 20) + 5,
        label: `${skills[x]} - ${levels[y]}`,
      });
    }
  }
  return data;
}

export function useDashboardData<T extends EngineDashboardData>(
  options: UseDashboardDataOptions
): UseDashboardDataReturn<T> {
  const {
    engineType,
    autoRefresh = false,
    refreshInterval = 60000,
    cacheTime = 300000, // 5 minutes default
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [isStale, setIsStale] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchData = useCallback(async (useCache = true) => {
    const cacheKey = `dashboard_${engineType}`;
    
    // Check cache first
    if (useCache) {
      const cached = dataCache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < cacheTime) {
        setData(cached.data as T);
        setLastRefresh(new Date(cached.timestamp));
        setIsLoading(false);
        setIsStale(false);
        return;
      }
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchDashboardData<T>(engineType);
      const now = Date.now();
      
      // Update cache
      dataCache.set(cacheKey, { data: result, timestamp: now });
      
      setData(result);
      setLastRefresh(new Date(now));
      setIsStale(false);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      
      // Try to use cached data even if stale
      const cached = dataCache.get(cacheKey);
      if (cached) {
        setData(cached.data as T);
        setLastRefresh(new Date(cached.timestamp));
        setIsStale(true);
      }
    } finally {
      setIsLoading(false);
    }
  }, [engineType, cacheTime]);

  const refresh = useCallback(async () => {
    await fetchData(false);
  }, [fetchData]);

  const retry = useCallback(async () => {
    await fetchData(false);
  }, [fetchData]);

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auto-refresh
  useEffect(() => {
    if (autoRefresh && refreshInterval > 0) {
      intervalRef.current = setInterval(() => {
        fetchData(false);
      }, refreshInterval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoRefresh, refreshInterval, fetchData]);

  return {
    data,
    isLoading,
    error,
    lastRefresh,
    isStale,
    refresh,
    retry,
  };
}

export default useDashboardData;
