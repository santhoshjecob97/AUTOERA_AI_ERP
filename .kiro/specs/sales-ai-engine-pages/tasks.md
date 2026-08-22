    # Implementation Plan

- [x] 1. Set up tab navigation infrastructure in SalesEngine




  - Refactor SalesEngine.tsx to support tab-based routing
  - Create tab navigation component with Overview, Leads, Virtual Showroom, Pricing, Chatbot, Analytics tabs
  - Implement routing structure: /sales (overview), /sales/leads, /sales/showroom, /sales/pricing, /sales/chatbot, /sales/analytics
  - Style tabs to match Service Engine pattern (same positioning, colors, active states)
  - Preserve existing dashboard functionality as Overview tab
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 7.1, 7.2, 7.3, 7.4_

- [x] 1.1 Write property test for tab navigation state preservation


  - **Property 1: Tab navigation preserves state**
  - **Validates: Requirements 1.3, 7.3**

- [x] 2. Create Leads Management page with AI scoring



  - Create pages/sales/LeadsPage.tsx component
  - Implement lead categorization by AI score (Hot: 85-100, Warm: 60-84, Cool: 40-59, Cold: 0-39)
  - Build collapsible category sections with lead counts
  - Create lead card component displaying: name, vehicle interest, budget, AI score, status, action buttons
  - Implement lead detail modal with AI insights, customer profile, activity timeline, communication options
  - Add filter controls (score range, status, date, search)
  - Integrate Voice AI call buttons on lead cards
  - Add bulk campaign initiation capability
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 9.1, 9.2_

- [x] 2.1 Write property test for lead categorization

  - **Property 2: Lead categorization consistency**
  - **Validates: Requirements 2.1**

- [x] 2.2 Write property test for lead card completeness

  - **Property 3: Lead card completeness**
  - **Validates: Requirements 2.2**

- [x] 2.3 Write property test for filter accuracy

  - **Property 4: Filter result accuracy**
  - **Validates: Requirements 2.4**

- [x] 2.4 Write property test for AI score calculation

  - **Property 5: AI score calculation and assignment**
  - **Validates: Requirements 2.5**

- [x] 2.5 Write property test for Voice AI data passing

  - **Property 21: Voice AI data passing**
  - **Validates: Requirements 9.3**

- [x] 3. Build Virtual Showroom page with 3D visualization


  - Create pages/sales/VirtualShowroomPage.tsx component
  - Implement vehicle selector dropdown
  - Create 3D vehicle viewer placeholder (or integrate existing VirtualShowroomModal content)
  - Build customization panel with color, interior, wheels, packages selectors
  - Implement real-time pricing breakdown calculator
  - Add AI upsell recommendation panel with match percentages
  - Create configuration save and share functionality
  - Generate shareable links for customer review
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 3.1 Write property test for visualization updates

  - **Property 6: Configuration visualization updates**
  - **Validates: Requirements 3.2**

- [x] 3.2 Write property test for pricing calculation

  - **Property 7: Dynamic pricing calculation**
  - **Validates: Requirements 3.3**

- [x] 3.3 Write property test for shareable link generation

  - **Property 8: Shareable link generation**
  - **Validates: Requirements 3.4**

- [x] 3.4 Write property test for upsell recommendations

  - **Property 9: Upsell recommendation relevance**
  - **Validates: Requirements 3.5**

- [x] 4. Implement Dynamic Pricing page with market intelligence


  - Create pages/sales/PricingPage.tsx component
  - Build AI pricing recommendation card with confidence score
  - Implement competitor price comparison table
  - Create market analysis panel (demand level, inventory age, market position)
  - Build pricing strategy selector with discount options
  - Implement interactive pricing slider with impact simulator
  - Display conversion probability, revenue, and profit margin calculations
  - Add customer price sensitivity analysis section
  - Create pricing history tracking
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [x] 4.1 Write property test for pricing impact calculation

  - **Property 10: Pricing impact calculation**
  - **Validates: Requirements 4.3**

- [x] 4.2 Write property test for personalized pricing

  - **Property 11: Personalized pricing strategy**
  - **Validates: Requirements 4.4**

- [x] 4.3 Write property test for pricing tracking

  - **Property 12: Pricing performance tracking**
  - **Validates: Requirements 4.5**

- [x] 5. Create Chatbot Management page with conversation monitoring


  - Create pages/sales/ChatbotPage.tsx component
  - Build active conversations list with real-time updates
  - Implement conversation detail view with message history
  - Display AI-detected intent and confidence scores
  - Create lead qualification panel with auto-scoring
  - Build human handoff interface with context preservation
  - Implement sales rep assignment logic
  - Add chatbot performance metrics dashboard (resolution rate, qualification accuracy)
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [x] 5.1 Write property test for intent detection

  - **Property 13: Conversation intent detection**
  - **Validates: Requirements 5.2**

- [x] 5.2 Write property test for handoff context

  - **Property 14: Handoff context preservation**
  - **Validates: Requirements 5.3**

- [x] 5.3 Write property test for lead assignment

  - **Property 15: Lead assignment logic**
  - **Validates: Requirements 5.4**

- [x] 6. Build Sales Analytics page with comprehensive metrics


  - Create pages/sales/AnalyticsPage.tsx component
  - Implement KPI cards (conversion rate, avg deal value, pipeline value, AI impact)
  - Build sales trend line chart with AI predictions
  - Create conversion funnel visualization with stage metrics
  - Implement team performance leaderboard with rankings
  - Add AI model performance metrics panel
  - Create time period selector (today, week, month, quarter, year, custom)
  - Implement data export functionality
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [x] 6.1 Write property test for conversion funnel

  - **Property 16: Conversion funnel accuracy**
  - **Validates: Requirements 6.2**

- [x] 6.2 Write property test for team rankings

  - **Property 17: Team performance ranking**
  - **Validates: Requirements 6.3**

- [x] 6.3 Write property test for time filtering

  - **Property 18: Time period filtering**
  - **Validates: Requirements 6.5**

- [x] 7. Integrate Voice AI across all Sales pages

  - Add VoiceCallButton components to appropriate locations on each page
  - Configure Voice AI context data for sales-specific information
  - Implement call outcome processing to update lead statuses
  - Add AI score recalculation based on call results
  - Create campaign completion handlers
  - Test voice integration on all pages
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

- [x] 7.1 Write property test for campaign outcome processing

  - **Property 22: Campaign outcome processing**
  - **Validates: Requirements 9.5**

- [x] 8. Implement responsive design and accessibility

  - Apply mobile-first responsive layouts (320px-767px: stacked, 768px-1023px: two-column, 1024px+: multi-column)
  - Implement touch-optimized controls for mobile devices
  - Add swipe gestures for mobile navigation
  - Test orientation change handling
  - Implement keyboard navigation for all interactive elements
  - Add ARIA labels and landmarks for screen readers
  - Ensure color contrast meets WCAG 2.1 AA standards
  - Test with screen readers (NVDA, JAWS, VoiceOver)
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 8.5_

- [x] 8.1 Write property test for orientation resilience

  - **Property 23: Orientation change resilience**
  - **Validates: Requirements 10.4**

- [x] 8.2 Write property test for accessibility compliance

  - **Property 20: Accessibility compliance**
  - **Validates: Requirements 8.5**

- [x] 9. Apply design system and ensure consistency

  - Apply color palette across all pages (Primary: #1E3A8A, Secondary: #F97316, Success: #10B981)
  - Implement typography system (Inter Bold for headings, Inter Regular for body)
  - Add 300ms transitions and smooth animations
  - Create standardized AI badge components
  - Implement consistent score visualization components
  - Apply glassmorphism effects to cards
  - Add micro-interactions for user feedback
  - Ensure visual consistency with Service Engine
  - _Requirements: 8.1, 8.2, 8.3, 8.4_

- [x] 9.1 Write property test for AI component consistency

  - **Property 19: AI component consistency**
  - **Validates: Requirements 8.2**

- [x] 10. Implement error handling and loading states

  - Add error boundaries for each page component
  - Implement skeleton loaders for data fetching
  - Create error messages with retry functionality
  - Handle network timeouts with exponential backoff
  - Implement fallback UI for failed components
  - Add session expiration handling
  - Create user-friendly error messages
  - Log errors for monitoring and debugging
  - _Design: Error Handling section_

- [x] 11. Add routing to App.tsx


  - Import all new Sales page components
  - Add routes for /sales/leads, /sales/showroom, /sales/pricing, /sales/chatbot, /sales/analytics
  - Ensure /sales route continues to show Overview (existing dashboard)
  - Test navigation from sidebar and direct URL access
  - Verify browser back/forward buttons work correctly
  - _Requirements: 1.1, 1.2, 1.3_

- [x] 12. Checkpoint - Ensure all tests pass

  - Ensure all tests pass, ask the user if questions arise.

- [x] 13. Final integration testing and polish


  - Test complete user journey: Dashboard → Leads → Call → Showroom → Pricing → Analytics
  - Verify Voice AI integration works across all pages
  - Test data flow between pages (e.g., lead selected in Leads page, used in Showroom)
  - Verify all tabs maintain state when navigating
  - Test with realistic data volumes (100+ leads, multiple conversations)
  - Perform cross-browser testing (Chrome, Firefox, Safari, Edge)
  - Test on mobile devices (iOS, Android)
  - Verify performance metrics (load time < 3.5s, tab switch < 200ms)
  - Polish animations and transitions
  - Fix any visual inconsistencies
  - _Requirements: All_
