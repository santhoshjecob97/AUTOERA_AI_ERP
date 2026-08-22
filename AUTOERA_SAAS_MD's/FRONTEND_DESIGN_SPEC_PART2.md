# Complete Frontend Design Specification - Part 2
## D-F: Dealership Home, CRM, Sales

---

## D. Dealership Admin — Home

**FRAME:** Dealership / Home

### Goal
One-page summary of dealership KPIs and quick actions for daily operations.

### Layout
4-column responsive grid with widget cards

### Must-Have Widgets

#### 1. Today's Service Bookings
**Components:**
- Count badge (scheduled/completed/in-progress)
- Mini calendar with dots
- List of next 5 appointments
- "View All" link

**Data:**
```typescript
interface ServiceBookings {
  total: number;
  completed: number;
  inProgress: number;
  upcoming: Appointment[];
}
```

#### 2. Lead Funnel Snapshot
**Components:**
- Funnel chart (New → Qualified → Proposal → Won)
- Conversion rate percentage
- Top 3 hot leads with scores

#### 3. Bay Utilization Heatmap
**Components:**
- Grid showing bays (rows) × time slots (columns)
- Color coding: green (available), yellow (scheduled), red (occupied)
- Click to see details

#### 4. Revenue Snapshot
**Components:**
- MTD revenue with trend arrow
- YTD revenue
- Target progress bar
- Comparison vs last month

#### 5. Alerts & Notifications
**Components:**
- Priority badges
- Alert types: parts shortage, SLA breach, payment due
- Dismiss/Snooze actions
- Count indicator

#### 6. Quick Actions Panel
**Buttons:**
- Create Appointment
- Add New Lead
- Assign Job
- Generate Invoice
- View Reports

**Each opens modal or navigates to page**

### Data Props
```typescript
interface DashboardData {
  kpis: {
    revenue: { mtd: number; ytd: number; target: number };
    bookings: ServiceBookings;
    conversionRate: number;
  };
  schedule: Appointment[];
  bayUtilization: BayStatus[][];
  alerts: Alert[];
  notifications: Notification[];
}
```

### API Contract
```
GET /api/analytics/overview/?period=30d
Response: {
  revenue: number,
  bookings: number,
  conversion_rate: number,
  vehicles: number,
  predictions: number
}

GET /api/service/appointments/?date=today
GET /api/sales/leads/?filter=hot&limit=3
GET /api/service/allocation/bay-utilization/{center_id}/
```

### Interactions
- Click widget → drill down to detail page
- Hover → show tooltip with more info
- Refresh button → reload data
- Auto-refresh every 30 seconds

---

## E. Customers / CRM

**FRAME:** CRM / Customers

### Goal
Complete customer relationship management with timeline, vehicles, and communication history.

### Pages

#### 1. Customer List
**Components:**
- Search bar (name, phone, VIN)
- Filters: status, last service date, vehicle type
- Sort: name, last contact, total spent
- Table columns:
  - Avatar + Name
  - Phone + Email
  - Vehicles count
  - Last service
  - Total spent
  - Status badge
  - Actions menu

**Pagination:** 25/50/100 per page

#### 2. Customer Details
**Layout:** 3-column

**Left Sidebar:**
- Avatar & name
- Contact info (editable)
- Tags
- Preferred contact method
- Customer since date

**Main Content:**
- Tabs: Timeline | Vehicles | Documents | Invoices
- Timeline shows:
  - Service appointments
  - Calls & SMS
  - Emails
  - Payments
  - Notes
- Each entry has icon, timestamp, description

**Right Sidebar:**
- Quick actions:
  - Call
  - Message
  - Schedule appointment
  - Create invoice
- Recent vehicles
- Upcoming appointments

#### 3. Lead Board (Kanban)
**Columns:**
- New Leads
- Contacted
- Qualified
- Proposal Sent
- Negotiation
- Won
- Lost

**Card shows:**
- Lead name
- AI score badge
- Vehicle interest
- Days in stage
- Assigned to avatar

**Drag & drop between columns**

#### 4. Create/Edit Customer Modal
**Form Fields:**
- Personal: Name, Phone, Email, DOB
- Address: Street, City, State, PIN
- Vehicles: VIN, Reg No, Make, Model, Year
- Preferences: Contact method, Language
- Tags: VIP, Fleet, Corporate

**Validation:**
- Phone format
- Email format
- VIN uniqueness

#### 5. Bulk Import/Export
**Import:**
- CSV/Excel upload
- Column mapping UI
- Preview before import
- Error handling

**Export:**
- Select fields
- Filter criteria
- Format: CSV/Excel/PDF

### Data Props
```typescript
interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  vehicles: Vehicle[];
  lastService: Date;
  totalSpent: number;
  status: 'active' | 'inactive' | 'vip';
  preferredContact: 'phone' | 'email' | 'sms';
  timeline: TimelineEvent[];
}

interface TimelineEvent {
  type: 'service' | 'call' | 'email' | 'payment' | 'note';
  timestamp: Date;
  description: string;
  metadata: any;
}
```

### API Contracts
```
GET /api/customers/?search=&page=&status=
Response: { count, results: Customer[] }

GET /api/customers/{id}/
Response: Customer with full details

POST /api/customers/
Body: { name, phone, email, vehicles: [{vin, reg_no}] }

PUT /api/customers/{id}/
Body: Updated customer data

POST /api/customers/{id}/message/
Body: { channel: 'sms'|'email', templateId, payload }

POST /api/customers/import/
Body: FormData with CSV file

GET /api/customers/export/?format=csv&fields=
```

### UX Features
- Quick-create from any page (floating button)
- Inline editing in list view
- Keyboard shortcuts (N for new, / for search)
- Recent customers dropdown
- Merge duplicate customers

---

## F. Sales — Leads & Deals

**FRAME:** Sales / Leads

### Goal
Manage leads with AI-powered scoring and recommended actions for conversion.

### Pages

#### 1. Lead List
**Components:**
- Filter bar: Stage, Score range, Source, Assigned to
- Sort: Score (high→low), Date, Name
- View toggle: List | Grid | Kanban

**List View Columns:**
- Lead name + contact
- AI Score (0-100) with color coding
  - 80-100: Green (Hot)
  - 50-79: Yellow (Warm)
  - 0-49: Gray (Cold)
- Vehicle interest
- Source
- Stage
- Assigned to
- Days in pipeline
- Next action
- Actions menu

**Grid View:**
- Cards with key info
- Larger score badge
- Quick action buttons

#### 2. Lead Detail
**Layout:** 2-column

**Left Column:**
- Lead info card
- AI Insights panel:
  - Lead score with breakdown
  - Predicted conversion timeline
  - Recommended actions (AI-generated)
  - Similar successful conversions
- Activity timeline
- Notes section

**Right Column:**
- Recommended vehicles (top 5)
  - Vehicle card with image
  - Match confidence %
  - Price
  - "Send Details" button
- Offers & quotes
- Documents
- Communication log

#### 3. Deal Pipeline
**Kanban Board:**
- Columns: Prospecting → Qualification → Proposal → Negotiation → Closed Won/Lost
- Drag & drop cards
- Column totals (count + value)
- Filters apply to board

**Card Content:**
- Company/Person name
- Deal value
- Probability %
- Expected close date
- Owner avatar

#### 4. Quote Generator
**Steps:**
1. Select vehicle(s)
2. Add accessories/services
3. Apply discounts
4. Financing options
5. Generate PDF

**Components:**
- Vehicle selector with search
- Line items table (editable)
- Discount calculator
- EMI calculator widget
- Terms & conditions
- Preview & send

#### 5. Virtual 360 Showroom
**Features:**
- 360° vehicle viewer
- Color/variant selector
- Feature highlights (hotspots)
- Compare up to 3 vehicles
- Share link generator
- Track views & interactions

### Data Props
```typescript
interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: string;
  stage: LeadStage;
  aiScore: number;
  scoreBreakdown: {
    engagement: number;
    budget: number;
    timeline: number;
    intent: number;
  };
  predictedConversionDate: Date;
  recommendedActions: Action[];
  vehicleInterest: string[];
  assignedTo: User;
  timeline: Activity[];
}

interface Action {
  type: 'call' | 'email' | 'schedule' | 'send_quote';
  priority: 'high' | 'medium' | 'low';
  description: string;
  confidence: number;
}
```

### API Contracts
```
GET /api/sales/leads/?filter=stage&score_min=&score_max=
Response: { count, results: Lead[] }

GET /api/sales/leads/{id}/
Response: Lead with full details

GET /api/sales/leads/{id}/recommendations/
Response: { 
  vehicles: [{ id, name, confidence, price }],
  actions: Action[]
}

POST /api/sales/leads/{id}/action/
Body: { type: 'email'|'call'|'schedule', payload }

POST /api/sales/quotes/
Body: { leadId, items[], discounts[], terms }
Response: { quoteId, pdfUrl }

GET /api/sales/virtual-showroom/{sessionId}/
POST /api/sales/virtual-showroom/track/
Body: { sessionId, vehicleId, interaction }
```

### UI Interactions
- Hover lead → show quick insights tooltip
- Click score → show breakdown modal
- Click action → execute or open form
- Drag lead → update stage (with confirmation)
- Export leads to CSV
- Bulk assign leads
- Send bulk email campaign

### AI Features
- Auto-score on new lead creation
- Real-time score updates based on activity
- Predictive close date
- Next best action suggestions
- Vehicle recommendation engine
- Optimal contact time prediction

---

