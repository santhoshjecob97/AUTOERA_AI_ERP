# Complete Frontend Design Specification - Part 4
## J-L: Insurance, Fleet, Notifications

---

## J. Insurance AI Engine

**FRAME:** Insurance Engine

### Goal
Automate policy issuance and claims processing with AI damage assessment.

### Pages

#### 1. Policy Management
**Components:**
- **Policy List**: Active, Expiring Soon, Lapsed.
- **Policy Detail**: Coverage details, Premium, Add-ons, Nominees.
- **Renewal Workflow**: One-click renewal link generation.

#### 2. Claims Processing
**Flow:**
1. **FNOL (First Notice of Loss)**: Customer submits incident details + photos.
2. **AI Assessment**: System validates damage against policy coverage.
3. **Estimation**: Auto-generates repair estimate.
4. **Approval**: Surveyor/Admin review.
5. **Settlement**: Payment processing.

**Components:**
- Claims Kanban Board
- Comparison View (Claimed vs Assessed Damage)
- Fraud Flags

### Data Props
```typescript
interface Policy {
  id: string;
  policyNumber: string;
  customer: CustomerSummary;
  vehicle: VehicleSummary;
  expiryDate: string;
  status: 'Active' | 'Expired';
}

interface Claim {
  id: string;
  policyId: string;
  incidentDate: string;
  status: ClaimStatus;
  aiAssessment: {
    damageScore: number;
    estimatedCost: number;
    fraudProbability: number;
  };
}
```

### API Contract
```
GET /api/insurance/policies/
POST /api/insurance/renew/
GET /api/insurance/claims/
POST /api/insurance/claims/assess/
```

---

## K. Fleet AI Engine

**FRAME:** Fleet Engine

### Goal
Real-time monitoring and optimization for commercial vehicle fleets, specifically EVs.

### Pages

#### 1. Live Fleet Map
**Components:**
- Interactive Map (Google/Mapbox)
- Vehicle Markers (Color-coded by status: Moving, Idle, Charging, Error)
- Cluster view for large fleets.
- **Vehicle Pop-up**: Battery %, Speed, Driver, Next Stop.

#### 2. Vehicle Health Monitor
**List View Columns:**
- Vehicle ID
- SoC (State of Charge)
- Range Remaining
- Health Score (SOH)
- Alerts (e.g., "Cell Imbalance", "High Temp")

#### 3. Route Optimization
**Features:**
- Input: List of deliveries/stops.
- Constraints: Battery range, time windows, vehicle capacity.
- Output: Optimized route on map + sequence.

#### 4. Charging Management
**Components:**
- Charging Station Status (Available/Occupied)
- Charging Session Logs (Energy delivered, Cost)
- Smart Charging Scheduler (Optimize for off-peak rates)

### Data Props
```typescript
interface FleetVehicle {
  id: string;
  location: { lat: number; lng: number };
  telemetry: {
    speed: number;
    batteryLevel: number;
    range: number;
    odometer: number;
  };
  status: 'Active' | 'Charging' | 'Maintenance';
}
```

### API Contract
```
GET /api/fleet/vehicles/live/
GET /api/fleet/routes/optimize/
GET /api/fleet/charging/sessions/
```

---

## L. Notification Center

**FRAME:** Notifications

### Goal
Centralized hub for all system alerts, communications, and marketing campaigns.

### Pages

#### 1. Notification Hub (User)
**Components:**
- **Tabs**: All, Unread, Mentions, System Alerts.
- **List Item**: Icon, Title, Message, Time, Action Button.
- **Preferences**: Toggle Email/SMS/Push for different categories.

#### 2. Campaign Manager (Admin)
**Flow:**
1. **Select Audience**: Filter customers (e.g., "Purchased in 2023", "Service Due").
2. **Choose Channel**: Email, SMS, WhatsApp, App Push.
3. **Design Content**: Template editor with personalization tags.
4. **Schedule**: Send now or later.

**Analytics:**
- Sent / Delivered / Opened / Clicked rates.

#### 3. Template Editor
**Features:**
- Rich Text Editor / HTML builder.
- Variable insertion ({{customer_name}}, {{vehicle_model}}).
- Preview (Desktop/Mobile).

### Data Props
```typescript
interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionLink?: string;
}

interface Campaign {
  id: string;
  name: string;
  audienceSize: number;
  channel: Channel;
  status: 'Draft' | 'Scheduled' | 'Sent';
  stats: CampaignStats;
}
```

### API Contract
```
GET /api/notifications/
PATCH /api/notifications/{id}/read/
POST /api/notifications/campaigns/
GET /api/notifications/templates/
```

---
