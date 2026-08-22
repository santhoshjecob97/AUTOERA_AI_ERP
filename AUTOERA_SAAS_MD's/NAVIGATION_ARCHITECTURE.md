# Service AI Engine - New Navigation Architecture

## Navigation Flow

```
Sidebar "Service" 
  ↓
Service AI Engine (Dashboard Overview)
  ↓ Click Tab
  ├── Operations → /service/operations (Full Page)
  ├── Scheduler → /service/scheduler (Full Page)
  ├── Communication → /service/communication (Full Page)
  ├── Inventory → /service/inventory (Full Page)
  ├── Quality → /service/quality (Full Page)
  ├── Emergency → /service/emergency (Full Page)
  └── Analytics → /service/analytics (Full Page)
```

## Implementation Plan

1. **Keep ServiceEngine.tsx** as the main dashboard overview
2. **Create 7 new page components** in `pages/service/` folder
3. **Update App.tsx** to add React Router
4. **Convert tabs to navigation links** that route to new pages
5. **Add back button** on each feature page to return to main dashboard

## Files to Create

- pages/service/OperationsPage.tsx ✅
- pages/service/SchedulerPage.tsx
- pages/service/CommunicationPage.tsx
- pages/service/InventoryPage.tsx
- pages/service/QualityPage.tsx
- pages/service/EmergencyPage.tsx
- pages/service/AnalyticsPage.tsx

## Files to Update

- App.tsx (add routing)
- ServiceEngine.tsx (convert tabs to navigation)
- types.ts (add new view states)
