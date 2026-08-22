# Sales AI Engine - Quick Test Guide

## 🚀 Start Testing in 3 Steps

### Step 1: Start the Server
```bash
npm run dev
```

### Step 2: Open Browser
Navigate to: `http://localhost:5173`

### Step 3: Test Each Tab

---

## ✅ Quick Test Checklist

### Tab 1: Overview (`/sales`)
- [ ] See 3 KPI cards at top
- [ ] See sales dashboard with charts
- [ ] See leads table with 5 rows
- [ ] Click "AI Analysis" button on a lead
- [ ] Click phone icon to test Voice AI modal

**Expected**: Full dashboard with interactive elements

---

### Tab 2: Leads (`/sales/leads`)
- [ ] Click "Leads" tab
- [ ] See 4 colored stat cards (Hot/Warm/Cool/Cold)
- [ ] See "🔥 HOT LEADS" section expanded
- [ ] Type in search box - see results filter
- [ ] Change status dropdown - see results update
- [ ] Click a lead card's "Call" button

**Expected**: Lead management page with filtering

---

### Tab 3: Virtual Showroom (`/sales/showroom`)
- [ ] Click "Virtual Showroom" tab
- [ ] See 3D viewer placeholder with vehicle name
- [ ] Click different vehicle buttons at top
- [ ] Select a different exterior color
- [ ] Add/remove a package
- [ ] Watch pricing update in real-time

**Expected**: Customization interface with live pricing

---

### Tab 4: Dynamic Pricing (`/sales/pricing`)
- [ ] Click "Pricing" tab
- [ ] See AI recommendation card with confidence score
- [ ] Move the discount slider
- [ ] Watch 4 impact metrics update
- [ ] See competitor prices table
- [ ] Click different discount preset buttons

**Expected**: Pricing simulator with real-time calculations

---

### Tab 5: Chatbot (`/sales/chatbot`)
- [ ] Click "Chatbot" tab
- [ ] See 4 stat cards at top
- [ ] See 3 conversations in left panel
- [ ] Click a conversation
- [ ] See customer profile and AI insights
- [ ] See message history on right

**Expected**: Conversation monitoring interface

---

### Tab 6: Analytics (`/sales/analytics`)
- [ ] Click "Analytics" tab
- [ ] See 4 KPI cards with trends
- [ ] See conversion funnel bars
- [ ] See sales trend chart
- [ ] See team performance table
- [ ] Change time period dropdown

**Expected**: Analytics dashboard with charts

---

## 🎯 Key Features to Test

### Voice AI Integration
1. Go to Leads page
2. Click phone icon on any lead
3. Modal should open with:
   - Customer name and phone
   - Call controls
   - Transcription area
   - Sentiment display

### Filtering
1. Go to Leads page
2. Type "Rajesh" in search
3. Should see only matching leads
4. Change status to "Negotiation"
5. Should filter further

### Real-time Calculations
1. Go to Virtual Showroom
2. Add "M Sport Package"
3. Pricing should increase by ₹4.5L
4. Total should recalculate with GST

### Navigation
1. Click through all 6 tabs
2. Use browser back button
3. Should navigate back through tabs
4. Active tab should highlight correctly

---

## 🐛 Common Issues

### Issue: Tabs don't navigate
**Solution**: Hard refresh (`Ctrl+Shift+R`)

### Issue: Page shows old content
**Solution**: Clear browser cache

### Issue: Build errors
**Solution**: 
```bash
npm install
npm run dev
```

### Issue: Port already in use
**Solution**: Kill process on port 5173 or use different port

---

## 📸 What You Should See

### Overview Tab
```
┌─────────────────────────────────────────┐
│ Sales AI Engine                         │
│ [Overview] Leads Showroom Pricing ...   │
├─────────────────────────────────────────┤
│ ┌─────┐ ┌─────┐ ┌─────┐                │
│ │ 48  │ │ 156 │ │ 32  │  ← KPI Cards   │
│ └─────┘ └─────┘ └─────┘                │
│                                         │
│ [Dashboard Charts]                      │
│                                         │
│ [Leads Table with 5 rows]               │
└─────────────────────────────────────────┘
```

### Leads Page
```
┌─────────────────────────────────────────┐
│ Lead Management                         │
│ Overview [Leads] Showroom Pricing ...   │
├─────────────────────────────────────────┤
│ [Search box] [Status filter]            │
│                                         │
│ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐        │
│ │ 3   │ │ 4   │ │ 2   │ │ 1   │        │
│ │ Hot │ │Warm │ │Cool │ │Cold │        │
│ └─────┘ └─────┘ └─────┘ └─────┘        │
│                                         │
│ 🔥 HOT LEADS (85-100) ▼                 │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐    │
│ │ Lead 1  │ │ Lead 2  │ │ Lead 3  │    │
│ └─────────┘ └─────────┘ └─────────┘    │
└─────────────────────────────────────────┘
```

### Virtual Showroom
```
┌─────────────────────────────────────────┐
│ Virtual Showroom                        │
│ Overview Leads [Showroom] Pricing ...   │
├─────────────────────────────────────────┤
│ [BMW X7] [Audi Q7] [Mercedes GLE]       │
│                                         │
│ ┌─────────────────┐ ┌───────────────┐  │
│ │                 │ │ Exterior Color│  │
│ │   3D Viewer     │ │ ○ Black       │  │
│ │   Placeholder   │ │ ○ White       │  │
│ │                 │ │               │  │
│ │   [Controls]    │ │ Interior      │  │
│ │                 │ │ ○ Cognac      │  │
│ └─────────────────┘ │               │  │
│                     │ Pricing       │  │
│                     │ Total: ₹1.36Cr│  │
│                     └───────────────┘  │
└─────────────────────────────────────────┘
```

---

## ✨ Success Criteria

You'll know it's working when:

✅ All 6 tabs are clickable  
✅ Each tab shows different content  
✅ No "coming soon" placeholders  
✅ Filters update results in real-time  
✅ Pricing calculations work  
✅ Voice AI modals open  
✅ Browser back/forward works  
✅ Active tab highlights correctly  

---

## 🎉 If Everything Works

**Congratulations!** The Sales AI Engine is fully functional with:
- 6 working tabs
- 50+ features implemented
- Voice AI integration
- Real-time calculations
- Interactive dashboards
- Professional UI/UX

**Next**: Start customizing for your needs or integrate with backend!

---

## 📞 Need Help?

Check these files:
- `SALES_AI_ENGINE_FIX_COMPLETE.md` - What was fixed
- `SALES_ENGINE_NAVIGATION_GUIDE.md` - Detailed navigation
- `SALES_AI_ENGINE_FINAL_STATUS.md` - Complete status

**Happy Testing! 🚀**
