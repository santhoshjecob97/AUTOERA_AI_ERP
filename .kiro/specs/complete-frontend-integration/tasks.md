# Implementation Plan

## Overview

This implementation plan transforms the AutoEra AI SaaS platform by adding 65+ AI models across 8 specialized engines with real-time updates, bulk processing, voice integration, and comprehensive analytics. Tasks are organized by priority and build incrementally.

## Phase 1: Foundation & Core Infrastructure

- [x] 1. Set up project dependencies and configuration


  - Install required npm packages (axios, socket.io-client, simple-peer, papaparse, date-fns, @tanstack/react-query)
  - Configure Tailwind CSS if not already set up
  - Update tsconfig.json for strict type checking
  - Create environment variables template (.env.example)
  - _Requirements: 10.1, 12.1, 12.2_

- [x] 2. Create directory structure for new components


  - Create components/ai/ directory
  - Create components/voice/ directory
  - Create components/analytics/ directory
  - Create components/common/ directory
  - Create pages/ai-engines/ directory
  - Create services/ directory structure
  - Create hooks/ directory
  - Create context/ directory
  - Create utils/ directory
  - _Requirements: 10.1_

- [x] 3. Implement centralized API service layer


- [x] 3.1 Create base API client with Axios


  - Set up Axios instance with base configuration
  - Implement request interceptor for auth token injection
  - Implement response interceptor for error handling
  - Add retry logic with exponential backoff (3 attempts max)
  - _Requirements: 10.1, 10.5_

- [x] 3.2 Create AI Engine API methods


  - Implement getModels(engineType) endpoint
  - Implement getModel(modelId) endpoint
  - Implement predict(modelName, input) endpoint
  - Implement batchPredict(modelId, data) endpoint
  - Implement getBatchJob(jobId) endpoint
  - _Requirements: 10.2_

- [x] 3.3 Create Analytics API methods


  - Implement getRevenue(dateRange) endpoint
  - Implement getCustomers(dateRange) endpoint
  - Implement getUtilization(dateRange) endpoint
  - Implement getVoice(dateRange) endpoint
  - _Requirements: 10.3, 6.1_

- [x] 3.4 Create Voice API methods


  - Implement getCalls(filters) endpoint
  - Implement getCall(callId) endpoint
  - Implement getTranscription(callId) endpoint
  - Implement getSentiment(callId) endpoint
  - Implement initiateCall(recipientPhone, agentId) endpoint
  - _Requirements: 10.4, 4.1_


- [x] 4. Implement WebSocket service for real-time updates


- [x] 4.1 Create WebSocket connection manager



  - Set up Socket.io client connection
  - Implement connection lifecycle (connect, disconnect, reconnect)
  - Add exponential backoff for reconnection (max 5 attempts)
  - Implement authentication with token
  - _Requirements: 2.1, 2.4, 2.5_

- [x] 4.2 Create channel subscription system

  - Implement subscribe(channel, callback) method
  - Implement unsubscribe(channel) method
  - Add channels: 'ai-predictions', 'notifications', 'voice-calls', 'analytics-updates', 'model-status'
  - Handle message routing to subscribers
  - _Requirements: 2.1_

- [x] 4.3 Create WebSocket context provider


  - Create WebSocketContext with connection state
  - Implement WebSocketProvider component
  - Add useWebSocket custom hook
  - Handle connection status UI indicators
  - _Requirements: 2.1, 2.5_

- [x] 5. Create authentication context and service


  - Create AuthContext with user state
  - Implement login/logout functionality
  - Add token storage and refresh logic
  - Create useAuth custom hook
  - Integrate with existing LoginScreen component
  - _Requirements: 7.1, 7.2, 7.4_

## Phase 2: Core AI Components

- [x] 6. Create AI Model Card component


- [x] 6.1 Implement AIModelCard component structure


  - Create component with TypeScript interface (AIModelCardProps)
  - Design card layout with gradient border based on status
  - Add model name, category badge, status indicator
  - Display circular accuracy gauge using Recharts
  - Show prediction count and last updated timestamp
  - _Requirements: 1.1, 1.3_

- [x] 6.2 Add interactive features to AIModelCard

  - Implement hover effects (shadow elevation, scale)
  - Add "Predict" button with onClick handler
  - Add "View Details" button with navigation
  - Add "Configure" button (admin only)
  - Implement status color coding (green=active, yellow=training, gray=idle, red=error)
  - _Requirements: 1.1, 1.4_

- [x] 6.3 Integrate real-time updates for AIModelCard


  - Subscribe to WebSocket 'model-status' channel
  - Update accuracy in real-time
  - Update prediction count dynamically
  - Add pulsing animation for active models
  - _Requirements: 1.1, 2.1_

- [x] 7. Create Bulk Upload component


- [x] 7.1 Implement file upload interface



  - Create drag-and-drop zone with visual feedback
  - Add file input with CSV validation
  - Implement file size validation (max 50MB)
  - Display file preview with name and size
  - _Requirements: 3.1, 3.2_

- [x] 7.2 Implement CSV parsing and validation

  - Integrate Papa Parse for CSV processing
  - Validate CSV structure and columns
  - Create column mapping interface (CSV → Model fields)
  - Display validation errors with row/column references
  - _Requirements: 3.2_

- [x] 7.3 Add batch processing with progress tracking

  - Implement progress bar with percentage
  - Show estimated time remaining (ETA)
  - Display real-time processing status via WebSocket
  - Handle processing errors with row-level reporting
  - _Requirements: 3.3_

- [x] 7.4 Create results display and download

  - Display results summary (total, successful, failed)
  - Create results table with original data + predictions
  - Add download button for results CSV
  - Implement result caching (24 hours)
  - _Requirements: 3.4, 3.5_

- [x] 8. Create Real-time Prediction Widget component


  - Create PredictionWidget component with scrollable list
  - Display last 50 predictions with timestamps
  - Add filter by engine type, model, confidence threshold
  - Implement color-coded confidence bars
  - Add expandable details view for each prediction
  - Auto-scroll to newest prediction
  - Add export to CSV functionality
  - Subscribe to WebSocket 'ai-predictions' channel
  - _Requirements: 2.1, 2.2, 2.3_


## Phase 3: AI Engine Dashboards

- [x] 9. Create Service AI Dashboard page



- [x] 9.1 Set up ServiceAIDashboard page structure



  - Create pages/ai-engines/ServiceAIDashboard.tsx
  - Implement page layout with header and filters
  - Add engine description and metrics summary
  - Create filter bar (by category, status, accuracy range)
  - Add search functionality for models
  - _Requirements: 1.1, 1.2_

- [x] 9.2 Integrate 15 Service AI models

  - Display all 15 models in grid layout (3-4 columns)
  - Add models: Battery Failure Prediction, Brake Wear Detection, Engine Diagnostics, AC System Analysis, Tire Pressure Monitoring
  - Add models: Service Time Estimation, Bay Utilization Optimizer, Appointment Scheduler, Quality Score Predictor, Customer Satisfaction Forecaster
  - Add models: Parts Demand Prediction, Inventory Optimizer, Skill Matching Engine, Workload Balancer, Damage Detection
  - Fetch model data from API on page load
  - _Requirements: 1.1, 1.2, 1.3_

- [x] 9.3 Add bulk prediction and real-time feed

  - Add "Bulk Upload" button opening BulkUpload modal
  - Integrate PredictionWidget in sidebar
  - Filter predictions for Service AI only
  - Add category grouping for models
  - _Requirements: 1.1, 3.1_

- [ ] 10. Create Sales AI Dashboard page
- [ ] 10.1 Set up SalesAIDashboard page structure
  - Create pages/ai-engines/SalesAIDashboard.tsx
  - Implement page layout with header and filters
  - Add engine description and metrics summary
  - Create filter bar and search
  - _Requirements: 1.1, 1.2_

- [ ] 10.2 Integrate 12 Sales AI models
  - Display all 12 models in grid layout
  - Add models: Lead Conversion Predictor, Hot Lead Identifier, Price Recommendation Engine, Discount Optimizer
  - Add models: Vehicle Demand Forecaster, Seasonal Trend Analyzer, Customer Lifetime Value, Churn Predictor
  - Add models: Upsell Opportunity Detector, Test Drive Scheduler, Financing Eligibility, Trade-in Valuator
  - Fetch model data from API
  - _Requirements: 1.1, 1.2, 1.3_

- [ ] 10.3 Add bulk prediction and real-time feed
  - Add "Bulk Upload" button
  - Integrate PredictionWidget for Sales AI
  - Add category grouping
  - _Requirements: 1.1, 3.1_

- [ ] 11. Create Finance AI Dashboard page
- [ ] 11.1 Set up FinanceAIDashboard page structure
  - Create pages/ai-engines/FinanceAIDashboard.tsx
  - Implement page layout with header and filters
  - _Requirements: 1.1, 1.2_

- [ ] 11.2 Integrate 10 Finance AI models
  - Display all 10 models in grid layout
  - Add models: Credit Score Predictor, Loan Approval Engine, Fraud Detection System, Transaction Anomaly Detector
  - Add models: Revenue Forecaster, Cash Flow Predictor, Payment Default Risk, EMI Calculator, Interest Rate Optimizer, Collection Priority Ranker
  - Fetch model data from API
  - _Requirements: 1.1, 1.2, 1.3_

- [ ] 11.3 Add bulk prediction and real-time feed
  - Add "Bulk Upload" button
  - Integrate PredictionWidget for Finance AI
  - _Requirements: 1.1, 3.1_

- [ ] 12. Create Insurance AI Dashboard page
- [ ] 12.1 Set up InsuranceAIDashboard page structure
  - Create pages/ai-engines/InsuranceAIDashboard.tsx
  - Implement page layout with header and filters
  - _Requirements: 1.1, 1.2_

- [ ] 12.2 Integrate 8 Insurance AI models
  - Display all 8 models in grid layout
  - Add models: Claim Probability Predictor, Damage Severity Estimator, Fraud Detection Engine, Risk Score Calculator
  - Add models: Premium Optimizer, Policy Renewal Predictor, Claim Cost Estimator, Underwriting Assistant
  - Fetch model data from API
  - _Requirements: 1.1, 1.2, 1.3_

- [ ] 12.3 Add bulk prediction and real-time feed
  - Add "Bulk Upload" button
  - Integrate PredictionWidget for Insurance AI
  - _Requirements: 1.1, 3.1_

- [ ] 13. Create Fleet AI Dashboard page
- [ ] 13.1 Set up FleetAIDashboard page structure
  - Create pages/ai-engines/FleetAIDashboard.tsx
  - Implement page layout with header and filters
  - _Requirements: 1.1, 1.2_

- [ ] 13.2 Integrate 10 Fleet AI models
  - Display all 10 models in grid layout
  - Add models: Route Optimizer, Fuel/Energy Consumption Predictor, Range Estimator, Charging Station Recommender
  - Add models: Battery Health Monitor, Maintenance Scheduler, Driver Behavior Analyzer, Vehicle Utilization Optimizer, Energy Cost Forecaster, Fleet Efficiency Scorer
  - Fetch model data from API
  - _Requirements: 1.1, 1.2, 1.3_

- [ ] 13.3 Add bulk prediction and real-time feed
  - Add "Bulk Upload" button
  - Integrate PredictionWidget for Fleet AI
  - _Requirements: 1.1, 3.1_

- [ ] 14. Create Workforce AI Dashboard page
- [ ] 14.1 Set up WorkforceAIDashboard page structure
  - Create pages/ai-engines/WorkforceAIDashboard.tsx
  - Implement page layout with header and filters
  - _Requirements: 1.1, 1.2_

- [ ] 14.2 Integrate 8 Workforce AI models
  - Display all 8 models in grid layout
  - Add models: Performance Predictor, Skill Gap Analyzer, Training Recommender, Shift Optimizer
  - Add models: Attrition Risk Predictor, Hiring Success Predictor, Productivity Forecaster, Team Composition Optimizer
  - Fetch model data from API
  - _Requirements: 1.1, 1.2, 1.3_

- [ ] 14.3 Add bulk prediction and real-time feed
  - Add "Bulk Upload" button
  - Integrate PredictionWidget for Workforce AI
  - _Requirements: 1.1, 3.1_


- [ ] 15. Create Voice AI Dashboard page
- [ ] 15.1 Set up VoiceAIDashboard page structure
  - Create pages/ai-engines/VoiceAIDashboard.tsx
  - Implement page layout with header and filters
  - _Requirements: 1.1, 1.2_

- [ ] 15.2 Integrate 10 Voice AI models
  - Display all 10 models in grid layout
  - Add models: Real-time Transcriber, Sentiment Analyzer, Emotion Detector, Intent Classifier
  - Add models: Conversion Predictor, Call Quality Scorer, Agent Performance Analyzer, Customer Satisfaction Predictor, Objection Handler, Upsell Opportunity Detector
  - Fetch model data from API
  - _Requirements: 1.1, 1.2, 1.3_

- [ ] 15.3 Add bulk prediction and real-time feed
  - Add "Bulk Upload" button
  - Integrate PredictionWidget for Voice AI
  - _Requirements: 1.1, 3.1_

- [ ] 16. Update App.tsx routing for AI Engine Dashboards
  - Add routes for all 7 AI Engine Dashboard pages
  - Update Sidebar navigation with AI Engine links
  - Add role-based access control for AI dashboards
  - Implement lazy loading for AI dashboard pages
  - _Requirements: 1.1, 7.1, 7.2_

## Phase 4: Enhanced Dashboard

- [ ] 17. Enhance main Dashboard page
- [ ] 17.1 Add AI predictions summary widget
  - Create EngineMetrics component
  - Display metrics for all 8 engines (model count, predictions 24h, avg accuracy, status)
  - Show total predictions across all engines
  - Add health status indicators (healthy/degraded/offline)
  - _Requirements: 5.4_

- [ ] 17.2 Add revenue metrics cards
  - Display MRR (Monthly Recurring Revenue)
  - Display ARR (Annual Recurring Revenue)
  - Display ARPU (Average Revenue Per User)
  - Display CAC (Customer Acquisition Cost)
  - Fetch data from analytics API
  - _Requirements: 5.1_

- [ ] 17.3 Add bay utilization gauge
  - Create gauge visualization showing current utilization
  - Display target threshold (89%)
  - Show total bays and occupied bays
  - Add bay details breakdown
  - _Requirements: 5.2_

- [ ] 17.4 Add real-time service queue
  - Display pending service jobs with priority indicators
  - Show estimated completion times
  - Add technician assignments
  - Update in real-time via WebSocket
  - _Requirements: 5.3_

- [ ] 17.5 Add voice call metrics widget
  - Display active calls count
  - Show average call duration
  - Display conversion rates
  - Add sentiment distribution
  - _Requirements: 5.5_

## Phase 5: Voice Integration

- [ ] 18. Implement WebRTC service
- [ ] 18.1 Create WebRTC connection manager
  - Set up Simple-peer for WebRTC connections
  - Implement signaling server communication
  - Handle peer connection lifecycle
  - Add ICE candidate handling
  - _Requirements: 4.1_

- [ ] 18.2 Implement audio streaming
  - Capture microphone audio
  - Stream audio to peer connection
  - Handle audio playback from remote peer
  - Add audio quality monitoring
  - _Requirements: 4.1, 4.2_

- [ ] 18.3 Create call state management
  - Implement call states (idle, ringing, active, on-hold, ended)
  - Add call controls (mute, hold, transfer, end)
  - Handle call events and callbacks
  - _Requirements: 4.1_

- [ ] 19. Create Voice Call Interface component
- [ ] 19.1 Build CallInterface component structure
  - Create component with call card layout
  - Display contact information
  - Add large call control buttons (mute, hold, transfer, end)
  - Show call timer
  - Add call quality indicator
  - _Requirements: 4.1_

- [ ] 19.2 Integrate live transcription display
  - Create scrollable transcription panel
  - Display transcription segments with timestamps
  - Add speaker identification (agent/customer)
  - Implement auto-scroll to latest segment
  - Update transcription every 3 seconds
  - _Requirements: 4.2_

- [ ] 19.3 Add sentiment analysis display
  - Create sentiment indicator component
  - Display current sentiment (positive/neutral/negative)
  - Show color-coded emotion visualization
  - Update sentiment every 10 seconds
  - Add sentiment timeline chart
  - _Requirements: 4.3_

- [ ] 19.4 Implement post-call summary
  - Save complete transcription on call end
  - Save sentiment analysis data
  - Extract key topics and action items
  - Display call summary modal
  - _Requirements: 4.4_

- [ ] 20. Create Voice Dashboard page
- [ ] 20.1 Build VoiceDashboard page structure
  - Create pages/VoiceDashboard.tsx
  - Add top metrics cards (active calls, total calls, avg duration, conversion rate)
  - Create layout sections (live calls, call history, analytics)
  - _Requirements: 4.5_

- [ ] 20.2 Implement live calls section
  - Display grid of active call cards
  - Show real-time call status
  - Add click to view call details
  - Update via WebSocket 'voice-calls' channel
  - _Requirements: 4.5_

- [ ] 20.3 Create call history table
  - Display past calls with filters (date, agent, sentiment, outcome)
  - Add pagination
  - Implement search functionality
  - Add click to view call details (transcription, sentiment)
  - _Requirements: 4.5_

- [ ] 20.4 Add voice analytics section
  - Create call volume trends chart
  - Display sentiment distribution pie chart
  - Show agent performance leaderboard
  - Add average call duration trend
  - _Requirements: 4.5_

- [ ] 20.5 Add call initiation functionality
  - Create "New Call" button
  - Build call initiation modal with phone number input
  - Integrate with WebRTC service
  - Open CallInterface on call start
  - _Requirements: 4.1_


- [ ] 21. Create Call Monitoring Dashboard component
  - Create CallMonitoring component for supervisors
  - Display all active calls in grid view
  - Show agent name, customer name, duration, sentiment for each call
  - Add supervisor controls (listen, whisper, barge-in)
  - Implement real-time alerts for negative sentiment or long duration
  - Add filter by agent, sentiment, duration
  - _Requirements: 4.5_

## Phase 6: Analytics Dashboard

- [ ] 22. Create Analytics Dashboard page
- [ ] 22.1 Set up AnalyticsDashboard page structure
  - Create pages/AnalyticsDashboard.tsx
  - Implement page layout with tabs/sections
  - Add date range picker component
  - Create export button for reports
  - _Requirements: 6.1, 6.2_

- [ ] 22.2 Implement Revenue Analytics section
  - Create RevenueChart component with line/area chart
  - Display MRR, ARR, ARPU, CAC, LTV metrics
  - Show revenue trends by engine (Sales, Service, Finance)
  - Add revenue forecasting visualization
  - Create top revenue sources breakdown
  - Fetch data from /api/analytics/revenue/
  - _Requirements: 6.1, 6.4_

- [ ] 22.3 Implement Customer Analytics section
  - Create CustomerMetrics component
  - Display total, active, new customers
  - Build acquisition funnel visualization
  - Create retention cohort analysis chart
  - Show churn rate trends
  - Display customer satisfaction scores
  - Fetch data from /api/analytics/customers/
  - _Requirements: 6.1, 6.4_

- [ ] 22.4 Implement Utilization Analytics section
  - Create UtilizationGauge component
  - Display service bay utilization gauge
  - Show technician productivity metrics
  - Add fleet vehicle utilization chart
  - Display parts inventory turnover
  - Show equipment usage rates
  - Fetch data from /api/analytics/utilization/
  - _Requirements: 6.1, 6.4_

- [ ] 22.5 Implement Voice Analytics section
  - Create VoiceMetrics component
  - Display call volume trends chart
  - Show average call duration trend
  - Create sentiment distribution visualization
  - Display conversion rates by agent
  - Add top performing agents leaderboard
  - Fetch data from /api/analytics/voice/
  - _Requirements: 6.1, 6.4_

- [ ] 22.6 Implement AI Engine Performance section
  - Create EnginePerformance component
  - Display predictions per engine (24h, 7d, 30d)
  - Show average accuracy by engine
  - Create model health status overview
  - Display API response times chart
  - Show error rates by engine
  - _Requirements: 6.4_

- [ ] 22.7 Add date range selection
  - Create DateRangePicker component
  - Add presets (Today, This Week, This Month, This Quarter, This Year, Custom)
  - Implement custom date range selection
  - Update all analytics on date range change
  - _Requirements: 6.2_

- [ ] 23. Implement export functionality
- [ ] 23.1 Create ExportButton component
  - Add export button with dropdown (PDF, Excel)
  - Implement report type selection
  - Add metric inclusion/exclusion options
  - Show export progress indicator
  - _Requirements: 6.3_

- [ ] 23.2 Implement PDF export
  - Integrate jsPDF library
  - Generate PDF with charts and data tables
  - Embed chart images using toBase64Image()
  - Add company branding and headers
  - Implement download trigger
  - _Requirements: 6.3_

- [ ] 23.3 Implement Excel export
  - Integrate xlsx library
  - Generate Excel with multiple sheets (Revenue, Customers, Utilization, Voice, AI Performance)
  - Format cells with proper data types
  - Add charts to Excel sheets
  - Implement download trigger
  - _Requirements: 6.3_


## Phase 7: Notification System

- [ ] 24. Create Notification Center component
- [ ] 24.1 Build NotificationCenter component
  - Create slide-out panel component
  - Display notification list with timestamps
  - Add filter by type (info, success, warning, error, ai-prediction)
  - Implement mark as read/unread functionality
  - Add "Clear all" button
  - Show unread count badge
  - _Requirements: 8.2_

- [ ] 24.2 Integrate with WebSocket notifications
  - Subscribe to 'notifications' WebSocket channel
  - Add new notifications to list in real-time
  - Update unread count dynamically
  - Play notification sound (optional)
  - _Requirements: 8.1, 8.2_

- [ ] 24.3 Add notification actions
  - Implement click notification to navigate to relevant page
  - Add notification settings modal
  - Allow enable/disable by notification type
  - Store preferences in user settings
  - _Requirements: 8.2, 8.5_

- [ ] 25. Implement push notifications
  - Request browser notification permission on login
  - Create service worker for background notifications
  - Implement notification triggers (high-value lead, fraud alert, predictive maintenance, negative sentiment)
  - Add click handler to navigate to relevant page
  - Handle notification permission denial gracefully
  - _Requirements: 8.3_

- [ ] 26. Enhance existing NotificationToast component
  - Update NotificationToast to use NotificationContext
  - Add support for different notification types with icons
  - Implement auto-dismiss after 5 seconds
  - Add manual dismiss button
  - Stack multiple notifications
  - _Requirements: 8.1_

## Phase 8: Common Components & Utilities

- [ ] 27. Create common reusable components
- [ ] 27.1 Create DataTable component
  - Build reusable table with sorting
  - Add pagination controls
  - Implement column filtering
  - Add row selection (checkbox)
  - Support custom cell renderers
  - _Requirements: 6.4_

- [ ] 27.2 Create LoadingSpinner component
  - Build spinner with customizable size and color
  - Add loading overlay variant
  - Create skeleton loading states
  - _Requirements: 12.1, 12.3_

- [ ] 27.3 Create ConfidenceBar component
  - Build visual confidence score bar
  - Add color gradient based on confidence level
  - Display percentage label
  - Support different sizes
  - _Requirements: 2.2_

- [ ] 27.4 Create Modal wrapper component
  - Build reusable modal with backdrop
  - Add close button and ESC key handler
  - Implement focus trap
  - Support different sizes
  - _Requirements: Various_

- [ ] 28. Create utility functions
- [ ] 28.1 Create CSV parser utilities
  - Implement CSV validation function
  - Create column mapping helper
  - Add data transformation utilities
  - Build CSV export function
  - _Requirements: 3.2, 3.5_

- [ ] 28.2 Create date formatter utilities
  - Implement relative time formatting (e.g., "2 hours ago")
  - Add date range formatting
  - Create timezone conversion helpers
  - Build date validation functions
  - _Requirements: 6.2_

- [ ] 28.3 Create chart helper utilities
  - Implement data transformation for charts
  - Add color palette generator
  - Create chart export helpers
  - Build tooltip formatters
  - _Requirements: 6.4_

- [ ] 28.4 Create validation utilities
  - Implement input validation functions (email, phone, etc.)
  - Add form validation helpers
  - Create error message generators
  - _Requirements: 3.2, 10.5_

- [ ] 28.5 Create export helper utilities
  - Implement PDF generation helpers
  - Add Excel formatting utilities
  - Create chart-to-image converters
  - Build report template generators
  - _Requirements: 6.3_

## Phase 9: Custom Hooks

- [ ] 29. Create custom React hooks
- [ ] 29.1 Create useAIModel hook
  - Implement data fetching for AI models
  - Add loading and error states
  - Support real-time updates via WebSocket
  - Add caching with React Query
  - _Requirements: 1.1, 2.1_

- [ ] 29.2 Create useVoiceCall hook
  - Implement call state management
  - Add WebRTC connection handling
  - Support call controls (mute, hold, end)
  - Handle transcription updates
  - _Requirements: 4.1, 4.2_

- [ ] 29.3 Create useNotifications hook
  - Implement notification state management
  - Add notification actions (mark read, clear)
  - Support filtering by type
  - Handle WebSocket notification updates
  - _Requirements: 8.1, 8.2_

- [ ] 29.4 Create useAnalytics hook
  - Implement analytics data fetching
  - Add date range filtering
  - Support multiple metric types
  - Add caching and refresh logic
  - _Requirements: 6.1, 6.2_

- [ ] 29.5 Create usePagination hook
  - Implement pagination state management
  - Add page change handlers
  - Support different page sizes
  - Calculate total pages
  - _Requirements: Various_

- [ ] 29.6 Create useFilters hook
  - Implement filter state management
  - Add filter change handlers
  - Support multiple filter types
  - Build filter reset functionality
  - _Requirements: Various_


## Phase 10: Integration & Testing

- [ ] 30. Integrate all components with existing pages
- [ ] 30.1 Update ServiceEngine page
  - Add link to Service AI Dashboard
  - Integrate real-time prediction widget
  - Add bulk upload button for service predictions
  - _Requirements: 1.1_

- [ ] 30.2 Update SalesEngine page
  - Add link to Sales AI Dashboard
  - Integrate real-time prediction widget
  - Add bulk upload button for lead scoring
  - _Requirements: 1.1_

- [ ] 30.3 Update FinanceEngine page
  - Add link to Finance AI Dashboard
  - Integrate real-time prediction widget
  - Add bulk upload button for credit scoring
  - _Requirements: 1.1_

- [ ] 30.4 Update InsuranceEngine page
  - Add link to Insurance AI Dashboard
  - Integrate real-time prediction widget
  - Add bulk upload button for claim predictions
  - _Requirements: 1.1_

- [ ] 30.5 Update FleetEngine page
  - Add link to Fleet AI Dashboard
  - Integrate real-time prediction widget
  - Add bulk upload button for route optimization
  - _Requirements: 1.1_

- [ ] 30.6 Update WorkforceEngine page
  - Add link to Workforce AI Dashboard
  - Integrate real-time prediction widget
  - Add bulk upload button for performance predictions
  - _Requirements: 1.1_

- [ ] 30.7 Update Sidebar navigation
  - Add "AI Engines" section with links to all 7 AI dashboards
  - Add "Voice Dashboard" link
  - Add "Analytics" link
  - Update icons and styling
  - _Requirements: 1.1_

- [ ] 30.8 Update App.tsx with new routes
  - Add routes for all new pages
  - Implement lazy loading for performance
  - Add error boundaries for each route
  - _Requirements: 12.2_

- [ ] 31. Implement error handling and loading states
- [ ] 31.1 Add error boundaries
  - Create ErrorBoundary component
  - Wrap each major section with error boundary
  - Display user-friendly error messages
  - Add error logging
  - _Requirements: Various error handling requirements_

- [ ] 31.2 Add loading states
  - Implement skeleton loaders for data-heavy components
  - Add loading spinners for async operations
  - Create loading overlays for modals
  - Add progress indicators for long operations
  - _Requirements: 12.1, 12.3_

- [ ] 31.3 Implement retry logic
  - Add retry buttons for failed API calls
  - Implement automatic retry with exponential backoff
  - Display retry count and status
  - _Requirements: 10.5_

- [ ] 32. Performance optimization
- [ ] 32.1 Implement code splitting
  - Add lazy loading for all page components
  - Split large components into chunks
  - Optimize bundle size
  - _Requirements: 12.2_

- [ ] 32.2 Add React.memo and useMemo
  - Memoize expensive components
  - Optimize re-renders with useMemo
  - Use useCallback for event handlers
  - _Requirements: 12.3_

- [ ] 32.3 Optimize images and assets
  - Compress images
  - Use appropriate image formats
  - Implement lazy loading for images
  - _Requirements: 12.4_

- [ ] 32.4 Implement caching strategies
  - Cache API responses with React Query
  - Set appropriate cache durations
  - Implement cache invalidation
  - _Requirements: 12.5_

