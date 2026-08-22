# Service AI Engine - Navigation Flow Guide

## 🎯 Dual Navigation System

Your Service AI Engine now has **TWO ways** to access features:

### Option 1: Tab-Based (On Main Dashboard)
```
Service AI Engine Dashboard
├── [Operations Tab] ← Click to show content below
├── [Scheduler Tab]
├── [Communication Tab]
├── [Inventory Tab]
├── [Quality Tab]
├── [Emergency Tab]
└── [Analytics Tab]

Content Area (changes based on active tab)
└── Shows selected feature content
```

### Option 2: Page-Based (Dedicated Pages)
```
Service AI Engine Dashboard
├── Click [Operations Tab]
    └── Navigates to → /service/operations (Full Page)
        └── [← Back Button] returns to dashboard

├── Click [Scheduler Tab]
    └── Navigates to → /service/scheduler (Full Page)
        └── [← Back Button] returns to dashboard

... and so on for all tabs
```

## 🔄 Navigation Flow Diagram

```
┌─────────────────────────────────────────┐
│     Sidebar → Service AI Engine         │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │  Service AI Engine Dashboard       │ │
│  │  ┌──────────────────────────────┐  │ │
│  │  │ [Ops][Sched][Comm][Inv]...   │  │ │
│  │  └──────────────────────────────┘  │ │
│  │                                    │ │
│  │  📊 Stats Cards                    │ │
│  │  📈 Enterprise Dashboard           │ │
│  │  📋 Tab Content (Active View)      │ │
│  └────────────────────────────────────┘ │
│                                          │
│  Click Tab → BOTH:                      │
│  1. Highlights tab                      │
│  2. Navigates to dedicated page         │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │  Operations Page (Full Screen)     │ │
│  │  [← Back] Operations Dashboard     │ │
│  │                                    │ │
│  │  Full operations content here      │ │
│  └────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

## 📍 URL Structure

| Tab | Main Dashboard | Dedicated Page |
|-----|---------------|----------------|
| Operations | `/service` (tab active) | `/service/operations` |
| Scheduler | `/service` (tab active) | `/service/scheduler` |
| Communication | `/service` (tab active) | `/service/communication` |
| Inventory | `/service` (tab active) | `/service/inventory` |
| Quality & CX | `/service` (tab active) | `/service/quality` |
| Emergency | `/service` (tab active) | `/service/emergency` |
| Analytics | `/service` (tab active) | `/service/analytics` |

## 🎨 Visual Indicators

### On Main Dashboard:
- **Active Tab**: Orange background, white text
- **Inactive Tabs**: Gray text, hover shows light background
- **Content Area**: Shows content for active tab

### On Dedicated Pages:
- **Back Arrow**: Top-left corner
- **Page Title**: Feature name with icon
- **Full Screen**: Entire page dedicated to that feature

## 💡 Use Cases

### When to use Main Dashboard (Tab View):
- Quick switching between features
- Overview of multiple features
- Comparing data across tabs
- Quick access without URL changes

### When to use Dedicated Pages:
- Deep dive into specific feature
- Bookmarking specific feature
- Sharing link to specific feature
- Full-screen focus on one feature
- Browser back/forward navigation

## 🔧 Technical Implementation

### Tab Click Behavior:
```typescript
onClick={() => {
    // 1. Update local state (highlight tab)
    setActiveView('operations');
    
    // 2. Navigate to dedicated page
    navigate('/service/operations');
}}
```

### Result:
- Tab highlights immediately
- URL changes to dedicated page
- User sees dedicated page content
- Back button returns to main dashboard

## ✅ Features Preserved

All existing functionality works on BOTH:
- Main dashboard with tabs
- Dedicated pages

Including:
- Job management
- Modals (Add Job, Analysis, etc.)
- CSV import
- Voice AI calls
- All data and state management

## 🎯 Best of Both Worlds!

You now have:
✅ Traditional tab interface (familiar UX)
✅ Modern page-based navigation (bookmarkable URLs)
✅ Browser history support (back/forward buttons)
✅ Shareable links to specific features
✅ All existing functionality preserved
