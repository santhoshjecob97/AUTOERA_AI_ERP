# Sales AI Engine - Navigation Guide

## Quick Access

### Direct URLs
- **Overview**: `http://localhost:5173/sales`
- **Leads**: `http://localhost:5173/sales/leads`
- **Virtual Showroom**: `http://localhost:5173/sales/showroom`
- **Dynamic Pricing**: `http://localhost:5173/sales/pricing`
- **Chatbot**: `http://localhost:5173/sales/chatbot`
- **Analytics**: `http://localhost:5173/sales/analytics`

## Tab Navigation

Click any tab in the horizontal navigation bar at the top of the Sales Engine:

```
┌─────────────────────────────────────────────────────────────┐
│ [Overview] [Leads] [Virtual Showroom] [Pricing] [Chatbot] [Analytics] │
└─────────────────────────────────────────────────────────────┘
```

## Page Features

### 1. Overview Tab
**What you'll see:**
- 3 KPI stat cards (Predicted Conversions, High Intent Leads, Showroom Visits)
- Enterprise Sales Dashboard with charts
- Voice AI Bulk Campaign section
- AI Qualified Leads table with actions
- Quick action buttons (Scan Docs, Virtual Showroom, Import, Add Customer)

### 2. Leads Page
**What you'll see:**
- Search bar and status filter
- 4 stat cards showing lead counts by category
- Voice AI Campaign section
- Collapsible sections for each lead category:
  - 🔥 Hot Leads (85-100 score)
  - 🟠 Warm Leads (60-84 score)
  - 🔵 Cool Leads (40-59 score)
  - ⚪ Cold Leads (0-39 score)
- Lead cards with Voice AI call buttons

### 3. Virtual Showroom Page
**What you'll see:**
- Vehicle selector (BMW X7, Audi Q7, Mercedes GLE, etc.)
- 3D viewer placeholder with rotation controls
- AI-powered recommendations panel
- Customization options:
  - Exterior colors with cost
  - Interior options
  - Wheel selections
  - Package add-ons
- Real-time pricing breakdown
- Save Config and Share buttons

### 4. Dynamic Pricing Page
**What you'll see:**
- Vehicle selector
- AI Pricing Recommendation card with confidence score
- Competitor Analysis table
- Pricing Impact Simulator with slider
- Impact metrics (Conversion, Revenue, Margin, Time to Sale)
- Customer Price Sensitivity analysis
- Pricing Strategy panel with discount options
- Market Indicators (Demand, Inventory Age, Trend)

### 5. Chatbot Management Page
**What you'll see:**
- 4 stat cards (Active Conversations, Resolution Rate, Accuracy, Response Time)
- Conversations list (left panel)
- Conversation detail view (right panel):
  - Customer profile
  - AI insights (lead score, intent detection)
  - Message history
  - Take Over Chat / Assign buttons
- Recommended Next Actions panel

### 6. Sales Analytics Page
**What you'll see:**
- Time period selector (Today, Week, Month, Quarter, Year)
- 4 KPI cards with trends
- Conversion Funnel visualization
- Sales Trend bar chart
- Team Performance leaderboard table
- AI Model Performance metrics

## Common Actions

### Making a Voice Call
1. Go to Leads page or Overview
2. Find a lead card
3. Click the phone icon or "Call" button
4. Voice Call Modal opens with:
   - Customer info
   - Call controls
   - Real-time transcription
   - Sentiment analysis

### Starting a Bulk Campaign
1. Go to Leads page or Overview
2. Scroll to "Voice AI Campaign" section
3. Select campaign type
4. Choose leads
5. Click "Launch Campaign"

### Customizing a Vehicle
1. Go to Virtual Showroom
2. Select a vehicle from the top bar
3. Choose exterior color
4. Select interior option
5. Pick wheel style
6. Add packages
7. See pricing update in real-time
8. Click "Generate Quote"

### Simulating Pricing
1. Go to Dynamic Pricing page
2. Select a vehicle
3. Move the discount slider
4. Watch impact metrics update:
   - Conversion probability
   - Expected revenue
   - Profit margin
   - Time to sale

### Viewing Analytics
1. Go to Analytics page
2. Select time period from dropdown
3. View KPIs and trends
4. Scroll through visualizations
5. Click "Export" to download data

## Troubleshooting

### Tab not working?
- Make sure you're clicking the tab button, not just hovering
- Check browser console for errors
- Refresh the page

### Page shows old content?
- Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
- Clear browser cache
- Check that you're on the correct URL

### Navigation feels slow?
- This is normal for development mode
- Production build will be much faster
- Check network tab for any failed requests

## Development Notes

### File Structure
```
pages/
├── SalesEngine.tsx          # Main container with tabs
└── sales/
    ├── LeadsPage.tsx        # Lead management
    ├── VirtualShowroomPage.tsx  # 3D showroom
    ├── PricingPage.tsx      # Dynamic pricing
    ├── ChatbotPage.tsx      # Conversation monitoring
    └── AnalyticsPage.tsx    # Performance metrics
```

### How Routing Works
1. User clicks a tab in SalesEngine.tsx
2. `navigate()` is called with the route (e.g., `/sales/leads`)
3. React Router matches the route in App.tsx
4. Corresponding page component renders
5. Tab highlighting updates based on current route

### Adding a New Tab
1. Create new page component in `pages/sales/`
2. Add route in `App.tsx`
3. Add tab button in `SalesEngine.tsx`
4. Update route map in tab onClick handler
5. Update `getActiveView()` function

## Tips

- **Keyboard Navigation**: Use Tab key to navigate between interactive elements
- **Browser Back/Forward**: Works correctly with all tabs
- **Direct Links**: You can bookmark any tab's URL
- **Mobile**: Tabs scroll horizontally on small screens
- **State Preservation**: Each page maintains its own state when you switch tabs
