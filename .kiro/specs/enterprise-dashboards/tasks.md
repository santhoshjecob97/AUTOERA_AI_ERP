# Implementation Plan

## Phase 1: Shared Dashboard Component Library

- [x] 1. Create dashboard types and interfaces


  - Create TypeScript interfaces for all dashboard data models
  - Define props interfaces for all widget components
  - Create shared types for chart data, KPI data, and funnel data
  - _Requirements: 1.1, 1.2, 1.3_



- [x] 2. Create DashboardPanel container component
  - Implement collapsible panel with smooth animation
  - Add header with title, refresh button, and toggle button
  - Implement collapsed summary bar with key metrics
  - Add localStorage persistence for toggle state
  - _Requirements: 8.1, 8.2, 8.3, 8.4_

- [x]* 2.1 Write property test for toggle state persistence


  - **Property 2: Dashboard Toggle State Persistence**
  - **Validates: Requirements 8.1, 8.2, 8.3**

- [x] 3. Create KPICard widget component
  - Implement card with value, trend, and icon display
  - Add sparkline chart option using Recharts
  - Implement loading skeleton state
  - Add color variants matching design system
  - _Requirements: 1.2, 1.4_



- [ ]* 3.1 Write property test for KPI card data display
  - **Property 1: KPI Card Data Display**
  - **Validates: Requirements 1.2**

- [x] 4. Create TrendChart widget component
  - Implement area/line chart using Recharts
  - Add time range selector (day/week/month)
  - Implement responsive container
  - Add loading and error states
  - _Requirements: 1.3, 10.5_

- [x]* 4.1 Write property test for chart responsive container


  - **Property 8: Chart Responsive Container**
  - **Validates: Requirements 10.5**

- [x] 5. Create FunnelChart widget component

  - Implement funnel visualization for pipelines

  - Add conversion rate display between stages
  - Implement responsive sizing
  - _Requirements: 1.3_



- [x] 6. Create HeatMap widget component
  - Implement color-coded grid visualization
  - Add tooltip on cell hover
  - Implement responsive sizing
  - _Requirements: 1.3_

- [x] 7. Create Leaderboard widget component
  - Implement ranked list with avatars and metrics
  - Add column formatting (number, currency, percentage)
  - Implement scrollable list with max items
  - _Requirements: 1.3_

- [x] 8. Create ProgressRing widget component
  - Implement circular progress indicator
  - Add center value display
  - Implement color variants
  - _Requirements: 1.3_

- [x] 9. Create useDashboardData hook


  - Implement data fetching with loading state
  - Add error handling with retry logic
  - Implement data caching
  - _Requirements: 9.1, 9.2, 9.4_

- [ ]* 9.1 Write property test for loading state display
  - **Property 3: Loading State Display**
  - **Validates: Requirements 1.4**

- [ ]* 9.2 Write property test for error state with retry
  - **Property 4: Error State with Retry**
  - **Validates: Requirements 1.5**

- [x] 10. Create useDashboardToggle hook


  - Implement toggle state management


  - Add localStorage persistence
  - Handle storage errors gracefully
  - _Requirements: 8.2, 8.3_

- [x] 11. Create useAnimatedValue hook


  - Implement value animation on change
  - Add configurable duration and easing
  - _Requirements: 9.5_

- [ ] 12. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.


## Phase 2: Engine-Specific Dashboards

- [x] 13. Create ServiceDashboard component
  - Implement bay utilization KPI with heat map
  - Add technician efficiency metrics
  - Create service revenue trend chart
  - Add NPS score display with breakdown
  - Implement service time by job type comparison
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [x] 14. Create SalesDashboard component


  - Implement lead funnel visualization
  - Add conversion rate KPIs
  - Create lead source performance chart
  - Add forecast vs actual comparison
  - Implement sales rep leaderboard
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 15. Create FinanceDashboard component


  - Implement loan disbursement KPIs
  - Add loan distribution chart by amount/tenure
  - Create credit score distribution visualization
  - Add approval funnel with rejection reasons
  - Implement EMI collection trend chart
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [x] 16. Create InsuranceDashboard component


  - Implement claims status KPIs
  - Add claims processing timeline chart
  - Create fraud detection metrics display
  - Add policy renewal rate with calendar
  - Implement settlement metrics by claim type
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [x] 17. Create WorkforceDashboard component


  - Implement attendance KPIs with trend
  - Add skill matrix heat map
  - Create training completion chart
  - Add technician utilization leaderboard
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [x] 18. Create FleetDashboard component


  - Implement vehicle status KPIs
  - Add route efficiency comparison chart
  - Create battery health distribution for EVs
  - Add predictive maintenance alerts list
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [ ] 19. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.


## Phase 3: Engine Page Integration

- [x] 20. Integrate dashboard into ServiceEngine page
  - Add ServiceDashboard below header section
  - Connect to existing service data
  - Ensure no changes to existing operations view
  - _Requirements: 2.1_

- [x] 21. Integrate dashboard into SalesEngine page


  - Add SalesDashboard below header section
  - Connect to existing leads data
  - Ensure no changes to existing leads table
  - _Requirements: 3.1_

- [x] 22. Integrate dashboard into FinanceEngine page


  - Add FinanceDashboard below header section
  - Connect to existing loan data
  - Ensure no changes to existing finance views
  - _Requirements: 4.1_

- [x] 23. Integrate dashboard into InsuranceEngine page


  - Add InsuranceDashboard below header section
  - Connect to existing claims/policy data
  - Ensure no changes to existing insurance views
  - _Requirements: 5.1_

- [x] 24. Integrate dashboard into WorkforceEngine page


  - Add WorkforceDashboard below header section
  - Connect to existing employee data
  - Ensure no changes to existing workforce views
  - _Requirements: 6.1_

- [x] 25. Integrate dashboard into FleetEngine page


  - Add FleetDashboard below header section
  - Connect to existing fleet data
  - Ensure no changes to existing fleet views
  - _Requirements: 7.1_

- [ ] 26. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.


## Phase 4: Responsive Design and Polish

- [x] 27. Implement responsive grid layouts

  - Add responsive breakpoints for all dashboards
  - Implement 4-column desktop, 2-column tablet, 1-column mobile
  - Add smooth transitions between layouts
  - _Requirements: 10.1, 10.2, 10.3, 10.4_

- [ ]* 27.1 Write property test for responsive grid layout
  - **Property 5: Responsive Grid Layout**
  - **Validates: Requirements 10.1, 10.2, 10.3**

- [x] 28. Add data refresh functionality

  - Implement refresh button in dashboard header
  - Add auto-refresh option with configurable interval
  - Show last refresh timestamp
  - _Requirements: 9.3_

- [ ]* 28.1 Write property test for data refresh behavior
  - **Property 6: Data Refresh Behavior**
  - **Validates: Requirements 9.3**

- [x] 29. Implement collapsed summary bar

  - Create compact metric display for collapsed state
  - Add tooltip on hover with details
  - Implement smooth expand/collapse animation
  - _Requirements: 8.4, 8.5_

- [ ]* 29.1 Write property test for collapsed summary display
  - **Property 7: Collapsed Summary Display**
  - **Validates: Requirements 8.4**

- [x] 30. Add loading animations

  - Implement skeleton loaders for all widgets
  - Add value change animations
  - Implement chart loading states
  - _Requirements: 1.4, 9.5_

- [x] 31. Add error handling UI

  - Create error state component for widgets
  - Add retry button functionality
  - Implement graceful degradation
  - _Requirements: 1.5, 9.4_

- [x] 32. Final visual polish


  - Ensure consistent spacing and alignment
  - Add hover effects and transitions
  - Verify color consistency with design system
  - Test on multiple browsers
  - _Requirements: 1.1_

- [ ] 33. Final Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

