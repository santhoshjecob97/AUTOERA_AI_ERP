# 🔧 Voice AI Agent - Troubleshooting Guide

## Issue: Cannot See Voice AI Features

### Quick Checklist

1. **✅ Server Running**
   - Check if dev server is running at http://localhost:3000/
   - Look for "VITE ready" message in terminal
   - Status: ✅ Server is running

2. **✅ Navigate to Service Engine**
   - Click on "Service" in the left sidebar
   - Or go directly to: http://localhost:3000/ (Service is default view)
   - You should see the Service AI Engine page

3. **✅ Look for Voice Call Button**
   - In the "Operations" tab (default view)
   - In the service jobs table
   - Look in the "AI Actions" column (last column)
   - You should see:
     - "Predictive Diag" button (orange)
     - **Phone icon button** (blue, circular) ← This is the Voice AI button!

4. **✅ Test the Voice Call Button**
   - Click the blue phone icon button on any job row
   - A modal should open with:
     - Customer name and phone number
     - Phone number input field
     - Call purpose dropdown
     - "Initiate Call" button

### What You Should See

#### Service Engine - Operations View
```
┌─────────────────────────────────────────────────────────────┐
│ Vehicle & Customer │ Issue │ Status │ Technician │ AI Actions│
├─────────────────────────────────────────────────────────────┤
│ Honda City         │ ...   │ ...    │ Amit K.    │ [Diag] 📞│
│ Rohan Gupta        │       │        │            │           │
├─────────────────────────────────────────────────────────────┤
│ Tata Harrier       │ ...   │ ...    │ Unassigned │ [Diag] 📞│
│ Meera Reddy        │       │        │            │           │
└─────────────────────────────────────────────────────────────┘
```

The 📞 icon represents the Voice Call button (it's a blue circular button with a phone icon).

### If You Still Don't See It

#### Step 1: Hard Refresh Browser
- Windows/Linux: `Ctrl + Shift + R` or `Ctrl + F5`
- Mac: `Cmd + Shift + R`

#### Step 2: Clear Browser Cache
1. Open DevTools (F12)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"

#### Step 3: Check Browser Console
1. Open DevTools (F12)
2. Go to Console tab
3. Look for any errors (red text)
4. Common issues:
   - Import errors
   - Component rendering errors
   - Type errors

#### Step 4: Verify Files Exist
Check these files exist:
- ✅ `components/voice/VoiceCallButton.tsx`
- ✅ `components/voice/VoiceCallModal.tsx`
- ✅ `components/voice/CallInitiator.tsx`
- ✅ `context/VoiceContext.tsx`
- ✅ `types/voice.ts`

#### Step 5: Check Import Statements
In `pages/ServiceEngine.tsx`, verify these imports:
```typescript
import VoiceCallButton from '../components/voice/VoiceCallButton';
import VoiceCallModal from '../components/voice/VoiceCallModal';
```

#### Step 6: Restart Dev Server
```bash
# Stop the server (Ctrl+C)
# Start again
npm run dev
```

### Expected Behavior

#### 1. Voice Call Button Appearance
- **Color**: Blue (service engine uses orange theme, but button is blue)
- **Shape**: Circular
- **Icon**: Phone icon
- **Size**: Small (16px icon)
- **Location**: Last column of service jobs table, next to "Predictive Diag" button

#### 2. Voice Call Modal
When you click the phone button:
1. Modal opens with orange gradient header (Service Engine theme)
2. Shows customer name: "Rohan Gupta" (or other customer)
3. Shows phone number: "+91-98765-43210"
4. Phone input field (pre-filled, editable)
5. Call purpose dropdown with options:
   - Appointment Booking
   - Service Status Inquiry
   - Parts Availability
   - Service Reminder
   - Feedback Collection
6. "Initiate Call" button (orange gradient)

#### 3. Call Flow
1. Select call purpose
2. Click "Initiate Call"
3. Status changes: Idle → Initiating → Ringing → Active
4. See live call monitor with timer
5. See transcription viewer (simulated)
6. See sentiment display (simulated)
7. Call controls: Mute, Speaker, End Call

### Sample Data

The Service Engine has 4 sample jobs with phone numbers:
1. **Rohan Gupta** - +91-98765-43210 (Honda City)
2. **Meera Reddy** - +91-98765-43211 (Tata Harrier)
3. **Vikram Singh** - +91-98765-43212 (Hyundai i20)
4. **Anjali Desai** - +91-98765-43213 (Maruti Swift)

### Visual Reference

#### Voice Call Button (Icon Variant)
```
┌─────┐
│  📞 │  ← Blue circular button with phone icon
└─────┘
```

#### Voice Call Modal
```
┌──────────────────────────────────────────────────┐
│ 📞 Service Voice AI                          ✕   │
│ Intelligent voice assistant powered by AI        │
│                                                   │
│ Calling                                    Ready  │
│ Rohan Gupta                                       │
│ +91-98765-43210                                   │
├──────────────────────────────────────────────────┤
│                                                   │
│  👤 Rohan Gupta                                   │
│     Customer Information                          │
│                                                   │
│  Phone Number *                                   │
│  📞 [+91-98765-43210                    ]         │
│                                                   │
│  Call Purpose *                                   │
│  🎯 [Select a purpose...            ▼]           │
│                                                   │
│  [        📞 Initiate Call        ]               │
│                                                   │
└──────────────────────────────────────────────────┘
```

### Debug Commands

#### Check if components are compiled
```bash
# In project root
ls components/voice/
# Should show:
# - VoiceCallButton.tsx
# - VoiceCallModal.tsx
# - CallInitiator.tsx
# - LiveCallMonitor.tsx
# - TranscriptionViewer.tsx
# - SentimentDisplay.tsx
```

#### Check TypeScript compilation
```bash
npm run build
# Should complete without errors
```

### Still Having Issues?

1. **Check the browser URL**: Make sure you're at `http://localhost:3000/`
2. **Check the view**: Make sure you're on the "Operations" tab (not Scheduling, Inventory, etc.)
3. **Check the table**: Make sure you're looking at the list view (not bay view)
4. **Look carefully**: The phone button is small and blue, next to the orange "Predictive Diag" button

### Success Indicators

✅ You should see:
- Blue circular phone button in each row of the service jobs table
- Button appears in the "AI Actions" column
- Button is clickable (cursor changes to pointer on hover)
- Clicking opens the Voice AI modal

### Contact Support

If you've tried all the above and still can't see the Voice AI features:
1. Take a screenshot of the Service Engine page
2. Check browser console for errors (F12 → Console tab)
3. Share the error messages

---

**Last Updated**: December 5, 2025  
**Version**: 0.45.0
