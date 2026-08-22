# Design Document

## Overview

The Sales AI Engine Pages feature adds tab-based navigation to the existing Sales Engine, creating dedicated pages for each AI-powered module while preserving the current dashboard as the main overview. This design follows the established pattern from the Service Engine implementation, providing a consistent user experience across all AI engines in the AUTOERA platform.

The system will include six main tabs:
1. **Overview** - Current Sales AI dashboard (existing functionality)
2. **Leads** - Advanced lead management with AI scoring
3. **Virtual Showroom** - 3D vehicle visualization and customization
4. **Pricing** - Dynamic pricing with market intelligence
5. **Chatbot** - AI conversation management and monitoring
6. **Analytics** - Comprehensive sales performance analytics

## Architecture

### Component Structure

```
pages/
├── SalesEngine.tsx (Main container with tab navigation)
└── sales/
    ├── LeadsPage.tsx
    ├── VirtualShowroomPage.tsx
    ├── PricingPage.tsx
    ├── ChatbotPage.tsx
    └── AnalyticsPage.tsx
```

### Navigation Flow

The Sales Engine will use React Router for tab navigation, similar to the Service Engine pattern:
- Main route: `/sales` (Overview tab - existing dashboard)
- Sub-routes: `/sales/leads`, `/sales/showroom`, `/sales/pricing`, `/sales/chatbot`, `/sales/analytics`

### State Management

- Local state for tab selection and page-specific data
- Shared context for lead data across tabs
- Voice AI integration through existing VoiceContext
- Dashboard data through existing useDashboardData hook

## Components and Interfaces

### 1. Sales Engine Main Container

The main SalesEngine component will be refactored to include tab navigation while preserving all existing functionality.

```typescript
type SalesView = 'overview' | 'leads' | 'showroom' | 'pricing' | 'chatbot' | 'analytics';

interface SalesEngineProps {
  // No props needed - standalone page
}
```

### 2. Leads Page Component

```typescript
interface LeadsPageProps {
  // No props - uses shared lead context
}

interface LeadCategory {
  id: string;
  name: string;
  scoreRange: [number, number];
  color: string;
  leads: Lead[];
}
```


### 3. Virtual Showroom Page Component

```typescript
interface VirtualShowroomPageProps {
  // No props - standalone page
}

interface VehicleConfiguration {
  vehicleId: string;
  model: string;
  exteriorColor: string;
  interiorColor: string;
  wheels: string;
  packages: string[];
  accessories: string[];
  totalPrice: number;
}

interface PricingBreakdown {
  basePrice: number;
  customization: number;
  accessories: number;
  subtotal: number;
  gst: number;
  total: number;
  aiRecommendedDiscount?: number;
}
```

### 4. Pricing Page Component

```typescript
interface PricingPageProps {
  // No props - standalone page
}

interface PricingStrategy {
  vehicleId: string;
  currentPrice: number;
  aiSuggestedPrice: number;
  minPrice: number;
  maxPrice: number;
  confidence: number;
  competitorPrices: CompetitorPrice[];
  marketPosition: 'competitive' | 'premium' | 'value';
  demandLevel: 'low' | 'medium' | 'high';
}

interface CompetitorPrice {
  dealerName: string;
  price: number;
  lastUpdated: Date;
}
```

### 5. Chatbot Page Component

```typescript
interface ChatbotPageProps {
  // No props - standalone page
}

interface ChatConversation {
  id: string;
  customerName: string;
  startTime: Date;
  status: 'active' | 'completed' | 'escalated';
  leadScore: number;
  intent: string;
  messages: ChatMessage[];
}

interface ChatMessage {
  id: string;
  sender: 'customer' | 'ai' | 'agent';
  content: string;
  timestamp: Date;
  attachments?: string[];
}
```

### 6. Analytics Page Component

```typescript
interface AnalyticsPageProps {
  // No props - standalone page
}

interface SalesMetrics {
  conversionRate: number;
  avgDealValue: number;
  pipelineValue: number;
  aiImpact: number;
  salesTrend: TrendData[];
  conversionFunnel: FunnelStage[];
  teamPerformance: TeamMember[];
}

interface FunnelStage {
  name: string;
  count: number;
  conversionRate: number;
}

interface TeamMember {
  name: string;
  leads: number;
  conversions: number;
  conversionRate: number;
  revenue: number;
}
```

## Data Models

### Extended Lead Interface

```typescript
interface Lead {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  vehicleInterest: string;
  vehicleDetails?: string;
  budget: string;
  aiScore: number;
  status: 'New' | 'Contacted' | 'Negotiation' | 'Closed';
  lastAction: string;
  source?: string;
  priority?: 'High' | 'Medium' | 'Low';
  assignedTo?: string;
  notes?: string;
  timeline?: string;
  creditScore?: number;
  communicationPreference?: 'phone' | 'email' | 'whatsapp';
  activityTimeline?: Activity[];
}

interface Activity {
  id: string;
  type: 'inquiry' | 'email' | 'call' | 'visit' | 'chatbot';
  description: string;
  timestamp: Date;
}
```

### Vehicle Model

```typescript
interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  basePrice: number;
  category: 'sedan' | 'suv' | 'hatchback' | 'luxury' | 'ev';
  features: string[];
  specifications: VehicleSpecs;
  availableColors: Color[];
  availableInteriors: Interior[];
  packages: Package[];
  inventory: number;
}

interface VehicleSpecs {
  engine: string;
  transmission: string;
  fuelType: string;
  mileage: string;
  seating: number;
  dimensions: string;
}
```


### Color and Package Models

```typescript
interface Color {
  id: string;
  name: string;
  hexCode: string;
  additionalCost: number;
}

interface Interior {
  id: string;
  name: string;
  material: string;
  additionalCost: number;
}

interface Package {
  id: string;
  name: string;
  description: string;
  features: string[];
  price: number;
}
```

### Market Intelligence Model

```typescript
interface MarketData {
  vehicleId: string;
  competitorPrices: CompetitorPrice[];
  demandTrend: 'increasing' | 'stable' | 'decreasing';
  inventoryAge: number;
  marketPosition: 'competitive' | 'premium' | 'value';
  lastUpdated: Date;
}

interface PriceSensitivity {
  customerId: string;
  sensitivityLevel: 'low' | 'medium' | 'high';
  priceElasticity: number;
  recommendedDiscountRange: [number, number];
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Tab navigation preserves state
*For any* tab navigation sequence, navigating between tabs and returning to a previous tab should preserve the state of that tab (filters, scroll position, form data).
**Validates: Requirements 1.3, 7.3**

### Property 2: Lead categorization consistency
*For any* lead with an AI score, the lead should be categorized correctly: Hot (85-100), Warm (60-84), Cool (40-59), Cold (0-39).
**Validates: Requirements 2.1**

### Property 3: Lead card completeness
*For any* lead displayed in the lead management interface, the rendered card should contain all required fields: customer name, vehicle interest, budget, AI score, status, and action buttons.
**Validates: Requirements 2.2**

### Property 4: Filter result accuracy
*For any* filter criteria applied to the lead list, all displayed leads should match the filter criteria and no matching leads should be excluded.
**Validates: Requirements 2.4**

### Property 5: AI score calculation and assignment
*For any* newly added or imported lead, the system should automatically calculate an AI score between 0-100 and assign the lead to the appropriate category based on that score.
**Validates: Requirements 2.5**

### Property 6: Configuration visualization updates
*For any* customization option selected in the virtual showroom, the 3D visualization should update to reflect the selected option within 500ms.
**Validates: Requirements 3.2**

### Property 7: Dynamic pricing calculation
*For any* vehicle configuration, the pricing breakdown should correctly sum base price + customization + accessories + GST to equal the total price.
**Validates: Requirements 3.3**

### Property 8: Shareable link generation
*For any* saved vehicle configuration, the system should generate a unique, valid shareable link that can be used to restore the exact configuration.
**Validates: Requirements 3.4**

### Property 9: Upsell recommendation relevance
*For any* customer profile and vehicle configuration, AI upsell recommendations should have match percentages between 0-100 and be ranked by relevance.
**Validates: Requirements 3.5**

### Property 10: Pricing impact calculation
*For any* pricing adjustment simulation, the system should calculate and display the impact on conversion probability, expected revenue, and profit margin with values that are mathematically consistent.
**Validates: Requirements 4.3**

### Property 11: Personalized pricing strategy
*For any* customer with price sensitivity data, the system should display pricing strategies that fall within the customer's recommended discount range.
**Validates: Requirements 4.4**

### Property 12: Pricing performance tracking
*For any* applied pricing decision, the system should record historical data including timestamp, price, conversion outcome, and actual vs predicted performance.
**Validates: Requirements 4.5**

### Property 13: Conversation intent detection
*For any* chatbot conversation, the system should detect and display customer intent with a confidence score between 0-100.
**Validates: Requirements 5.2**

### Property 14: Handoff context preservation
*For any* conversation requiring human intervention, the handoff should include complete conversation history, detected intent, lead score, and customer profile data.
**Validates: Requirements 5.3**

### Property 15: Lead assignment logic
*For any* lead qualified through the chatbot, the system should assign the lead to a sales representative based on defined assignment rules (availability, expertise, workload).
**Validates: Requirements 5.4**

### Property 16: Conversion funnel accuracy
*For any* set of leads, the conversion funnel should accurately calculate the number of leads at each stage and the conversion rate between consecutive stages.
**Validates: Requirements 6.2**

### Property 17: Team performance ranking
*For any* sales team data, individual representatives should be ranked correctly based on the selected metric (conversions, revenue, conversion rate).
**Validates: Requirements 6.3**

### Property 18: Time period filtering
*For any* selected time period, all visualizations and metrics should display only data within that time range, with no data leakage from outside the period.
**Validates: Requirements 6.5**

### Property 19: AI component consistency
*For any* AI-powered feature across all pages, the system should use standardized UI components for AI badges, score visualizations, and confidence indicators.
**Validates: Requirements 8.2**

### Property 20: Accessibility compliance
*For any* page in the Sales AI Engine, automated accessibility tests should pass WCAG 2.1 AA compliance checks for color contrast, keyboard navigation, and screen reader support.
**Validates: Requirements 8.5**

### Property 21: Voice AI data passing
*For any* voice call initiated from the Sales Engine, the system should pass all relevant customer data (name, phone, vehicle interest, budget, AI score) to the Voice AI engine.
**Validates: Requirements 9.3**

### Property 22: Campaign outcome processing
*For any* completed voice campaign, the system should update lead statuses and recalculate AI scores based on call outcomes (connected, not interested, callback requested, etc.).
**Validates: Requirements 9.5**

### Property 23: Orientation change resilience
*For any* screen orientation change, the layout should adapt smoothly and all form data, filters, and user selections should be preserved.
**Validates: Requirements 10.4**

## Error Handling

### Navigation Errors

**Route Not Found**
- Display user-friendly 404 page with navigation back to Overview tab
- Log error for monitoring
- Preserve user session and context

**Tab Loading Failures**
- Show error boundary with retry option
- Fall back to Overview tab if retry fails
- Display error message: "Unable to load [Tab Name]. Please try again."

### Data Loading Errors

**Lead Data Fetch Failure**
- Display skeleton loaders during initial load
- Show error message with retry button if fetch fails
- Cache last successful data and display with "Data may be outdated" warning
- Log error with context for debugging

**AI Score Calculation Failure**
- Assign default score of 50 (medium priority)
- Flag lead with "Score pending" indicator
- Queue for background recalculation
- Notify user: "AI scoring temporarily unavailable"

**Voice AI Integration Errors**
- Disable voice call buttons with tooltip explaining issue
- Log integration error details
- Display fallback contact options (manual dial, email)
- Retry connection in background

### User Input Errors

**Invalid Lead Data**
- Validate all required fields before submission
- Display inline error messages for each invalid field
- Highlight invalid fields in red
- Prevent form submission until all errors are resolved

**Filter Errors**
- Validate filter criteria before applying
- Show error message for invalid date ranges or numeric values
- Reset to default filters if validation fails
- Preserve valid filters while rejecting invalid ones

**Configuration Errors**
- Validate vehicle configurations for compatibility
- Warn user about incompatible options before applying
- Prevent invalid combinations (e.g., packages that conflict)
- Suggest alternative compatible options

### API and Network Errors

**Network Timeout**
- Retry failed requests up to 3 times with exponential backoff
- Show loading indicator during retries
- Display error message after final retry failure
- Offer manual retry option

**API Rate Limiting**
- Queue requests when rate limit is reached
- Display "Processing..." message to user
- Process queued requests when rate limit resets
- Log rate limit events for capacity planning

**Authentication Errors**
- Redirect to login page if session expires
- Preserve current page URL for redirect after login
- Display message: "Your session has expired. Please log in again."
- Clear sensitive data from memory

### State Management Errors

**Context Provider Errors**
- Wrap all context providers in error boundaries
- Fall back to default state if context fails
- Log context errors with stack trace
- Display generic error message to user

**State Synchronization Errors**
- Detect state inconsistencies between tabs
- Refresh data from source of truth (API)
- Display warning: "Data has been refreshed"
- Log synchronization errors for investigation

## Testing Strategy

### Unit Testing

The Sales AI Engine Pages will use **Vitest** as the testing framework for unit tests, following the existing project patterns.

**Component Testing:**
- Test each page component renders without errors
- Test tab navigation component displays all tabs correctly
- Test lead card component displays all required fields
- Test filter components apply filters correctly
- Test form validation logic
- Test error boundary components

**Utility Function Testing:**
- Test lead categorization logic (score ranges)
- Test pricing calculation functions
- Test date formatting and filtering utilities
- Test data transformation functions
- Test validation functions

**Hook Testing:**
- Test custom hooks for data fetching
- Test state management hooks
- Test navigation hooks
- Test form handling hooks

**Example Unit Tests:**
```typescript
describe('Lead Categorization', () => {
  it('should categorize lead with score 90 as Hot', () => {
    expect(categorizeLead(90)).toBe('Hot');
  });
  
  it('should categorize lead with score 70 as Warm', () => {
    expect(categorizeLead(70)).toBe('Warm');
  });
  
  it('should handle edge case of score 85 as Hot', () => {
    expect(categorizeLead(85)).toBe('Hot');
  });
});

describe('Pricing Calculation', () => {
  it('should calculate total price correctly', () => {
    const config = {
      basePrice: 1000000,
      customization: 50000,
      accessories: 30000,
      gstRate: 0.28
    };
    const result = calculateTotalPrice(config);
    expect(result.total).toBe(1382400);
  });
});
```

### Property-Based Testing

The Sales AI Engine Pages will use **fast-check** as the property-based testing library for TypeScript/JavaScript.

**Configuration:**
- Each property test should run a minimum of 100 iterations
- Use appropriate generators for domain-specific data (scores 0-100, valid dates, etc.)
- Configure shrinking to find minimal failing examples
- Set reasonable timeouts for complex properties

**Property Test Implementation:**
- Each correctness property from the design document must be implemented as a property-based test
- Tag each test with a comment referencing the design document property
- Use format: `// Feature: sales-ai-engine-pages, Property X: [property text]`

**Example Property Tests:**

```typescript
import fc from 'fast-check';

// Feature: sales-ai-engine-pages, Property 2: Lead categorization consistency
describe('Property: Lead categorization consistency', () => {
  it('should categorize any lead correctly based on AI score', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 100 }), // Generate AI scores
        (aiScore) => {
          const category = categorizeLead(aiScore);
          
          if (aiScore >= 85) {
            return category === 'Hot';
          } else if (aiScore >= 60) {
            return category === 'Warm';
          } else if (aiScore >= 40) {
            return category === 'Cool';
          } else {
            return category === 'Cold';
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});

// Feature: sales-ai-engine-pages, Property 7: Dynamic pricing calculation
describe('Property: Dynamic pricing calculation', () => {
  it('should calculate total price correctly for any configuration', () => {
    fc.assert(
      fc.property(
        fc.record({
          basePrice: fc.integer({ min: 500000, max: 10000000 }),
          customization: fc.integer({ min: 0, max: 500000 }),
          accessories: fc.integer({ min: 0, max: 300000 }),
          gstRate: fc.constant(0.28)
        }),
        (config) => {
          const result = calculateTotalPrice(config);
          const expectedSubtotal = config.basePrice + config.customization + config.accessories;
          const expectedGst = expectedSubtotal * config.gstRate;
          const expectedTotal = expectedSubtotal + expectedGst;
          
          return Math.abs(result.total - expectedTotal) < 0.01; // Allow for floating point errors
        }
      ),
      { numRuns: 100 }
    );
  });
});

// Feature: sales-ai-engine-pages, Property 4: Filter result accuracy
describe('Property: Filter result accuracy', () => {
  it('should return only leads matching filter criteria', () => {
    fc.assert(
      fc.property(
        fc.array(fc.record({
          id: fc.uuid(),
          name: fc.string(),
          aiScore: fc.integer({ min: 0, max: 100 }),
          status: fc.constantFrom('New', 'Contacted', 'Negotiation', 'Closed'),
          budget: fc.integer({ min: 500000, max: 10000000 })
        })),
        fc.record({
          minScore: fc.integer({ min: 0, max: 100 }),
          maxScore: fc.integer({ min: 0, max: 100 }),
          status: fc.option(fc.constantFrom('New', 'Contacted', 'Negotiation', 'Closed'))
        }),
        (leads, filter) => {
          const filtered = filterLeads(leads, filter);
          
          return filtered.every(lead => {
            const scoreMatch = lead.aiScore >= filter.minScore && lead.aiScore <= filter.maxScore;
            const statusMatch = !filter.status || lead.status === filter.status;
            return scoreMatch && statusMatch;
          });
        }
      ),
      { numRuns: 100 }
    );
  });
});

// Feature: sales-ai-engine-pages, Property 1: Tab navigation preserves state
describe('Property: Tab navigation preserves state', () => {
  it('should preserve state when navigating between tabs', () => {
    fc.assert(
      fc.property(
        fc.array(fc.constantFrom('overview', 'leads', 'showroom', 'pricing', 'chatbot', 'analytics'), { minLength: 2, maxLength: 10 }),
        fc.record({
          filters: fc.record({ minScore: fc.integer({ min: 0, max: 100 }) }),
          scrollPosition: fc.integer({ min: 0, max: 1000 })
        }),
        (navigationSequence, initialState) => {
          const stateManager = new TabStateManager();
          stateManager.setState('leads', initialState);
          
          // Navigate through sequence
          navigationSequence.forEach(tab => stateManager.navigateTo(tab));
          
          // Navigate back to leads
          stateManager.navigateTo('leads');
          const restoredState = stateManager.getState('leads');
          
          return JSON.stringify(restoredState) === JSON.stringify(initialState);
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

### Integration Testing

**Tab Navigation Integration:**
- Test navigation between all tabs
- Verify URL updates correctly
- Verify active tab highlighting
- Test browser back/forward buttons

**Voice AI Integration:**
- Test voice call initiation from lead cards
- Test bulk campaign creation
- Test data passing to Voice AI engine
- Test call status updates

**Data Flow Integration:**
- Test lead creation flow from form to display
- Test filter application across components
- Test configuration saving and loading
- Test pricing updates across components

### End-to-End Testing

**Critical User Journeys:**
- Complete lead management workflow (add → filter → view details → call)
- Virtual showroom configuration and quote generation
- Dynamic pricing simulation and application
- Chatbot conversation and lead qualification
- Analytics dashboard data visualization

**Cross-Browser Testing:**
- Test on Chrome, Firefox, Safari, Edge
- Verify responsive layouts on different screen sizes
- Test touch interactions on mobile devices

### Accessibility Testing

**Automated Testing:**
- Run axe-core accessibility tests on all pages
- Verify WCAG 2.1 AA compliance
- Test keyboard navigation
- Test screen reader compatibility

**Manual Testing:**
- Navigate entire application using only keyboard
- Test with screen reader (NVDA, JAWS, VoiceOver)
- Verify color contrast ratios
- Test with browser zoom at 200%

### Performance Testing

**Load Time Metrics:**
- Measure First Contentful Paint (target: < 1.5s)
- Measure Time to Interactive (target: < 3.5s)
- Measure Largest Contentful Paint (target: < 2.5s)

**Runtime Performance:**
- Test with large datasets (1000+ leads)
- Measure filter application time (target: < 100ms)
- Measure tab switching time (target: < 200ms)
- Monitor memory usage during extended sessions

## Implementation Notes

### Reusing Service Engine Patterns

The Sales AI Engine Pages should follow the exact same patterns established in the Service Engine implementation:

1. **Tab Navigation Structure:**
   - Use the same tab component styling and layout
   - Implement the same routing pattern with sub-routes
   - Use the same active tab highlighting logic

2. **Page Layout:**
   - Maintain consistent header structure
   - Use the same spacing and padding
   - Apply the same responsive breakpoints

3. **Component Reuse:**
   - Reuse dashboard components (KPICard, TrendChart, etc.)
   - Reuse Voice AI integration components
   - Reuse common UI components (modals, buttons, forms)

### Voice AI Integration

All Sales AI pages should integrate with the existing Voice AI system:

1. **Lead Management Page:**
   - Display VoiceCallButton on each lead card
   - Pass lead data as context to Voice AI
   - Update lead status after calls complete

2. **Bulk Campaign Section:**
   - Reuse UniversalVoiceCampaignSection component
   - Configure for sales-specific campaign types
   - Filter leads for campaign eligibility

3. **Call Monitoring:**
   - Display real-time transcription during calls
   - Show sentiment analysis results
   - Update AI scores based on call outcomes

### Design System Compliance

All pages must follow the design system specified in the UI/UX document:

1. **Color Palette:**
   - Primary: Deep Blue (#1E3A8A)
   - Secondary: Vibrant Orange (#F97316)
   - Success: Emerald Green (#10B981)
   - Warning: Amber (#F59E0B)
   - Danger: Red (#EF4444)

2. **Typography:**
   - Headings: Inter Bold
   - Body: Inter Regular
   - Data/Metrics: JetBrains Mono

3. **Animations:**
   - Use 300ms transitions
   - Apply smooth easing functions
   - Implement micro-interactions for user feedback

### Progressive Enhancement

Implement features with progressive enhancement:

1. **Core Functionality:**
   - Ensure basic navigation works without JavaScript
   - Provide fallback for 3D visualizations
   - Support basic filtering without advanced features

2. **Enhanced Features:**
   - Add real-time updates when WebSocket available
   - Enable advanced visualizations on capable devices
   - Provide touch gestures on touch-enabled devices

3. **Offline Support:**
   - Cache critical data for offline viewing
   - Queue actions for sync when connection restored
   - Display offline indicator clearly

### Security Considerations

1. **Data Protection:**
   - Sanitize all user inputs
   - Validate data on both client and server
   - Encrypt sensitive customer data

2. **Authentication:**
   - Verify user permissions for each action
   - Implement role-based access control
   - Handle session expiration gracefully

3. **API Security:**
   - Use HTTPS for all API calls
   - Implement rate limiting
   - Validate API responses before processing

## Future Enhancements

### Phase 2 Features

1. **Advanced AI Capabilities:**
   - Predictive lead scoring with machine learning
   - Automated follow-up recommendations
   - Sentiment analysis on customer interactions

2. **Enhanced Visualizations:**
   - 3D vehicle configurator with AR support
   - Interactive pricing heat maps
   - Real-time competitor tracking dashboard

3. **Collaboration Features:**
   - Team chat for lead discussions
   - Shared notes and annotations
   - Lead assignment automation

### Scalability Considerations

1. **Performance Optimization:**
   - Implement virtual scrolling for large lead lists
   - Use code splitting for faster initial load
   - Optimize images and assets

2. **Data Management:**
   - Implement pagination for large datasets
   - Use caching strategies for frequently accessed data
   - Optimize database queries

3. **Infrastructure:**
   - Support horizontal scaling
   - Implement load balancing
   - Use CDN for static assets
