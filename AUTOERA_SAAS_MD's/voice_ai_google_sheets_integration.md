# Voice AI Testing Dataset - Google Sheets Integration Guide

## 📊 Google Sheets Setup for Voice AI Testing

### Step 1: Create Your Google Sheet
1. Go to [sheets.google.com](https://sheets.google.com)
2. Create a new blank spreadsheet
3. Name it: "AutoEra Voice AI Test Dataset"
4. Copy the column headers from below

### Step 2: Column Headers (Row 1)
```
id,customer_name,phone,email,vehicle_make,vehicle_model,vehicle_year,registration_number,service_type,last_service_date,next_service_due,communication_preference,is_repeat_customer,loyalty_points,customer_segment,preferred_language,location_city,location_area,emergency_contact,preferred_time_slots,vehicle_condition_notes,service_history_count,last_service_feedback
```

### Step 3: Sample Data (Copy from CSV)
Paste the sample data starting from Row 2. You can copy directly from the provided CSV file.

### Step 4: Share the Sheet
1. Click "Share" button (top-right)
2. Set permissions to "Anyone with the link can view"
3. Copy the share link

### Step 5: Integration in Your App
Use this share link format for integration:
```
https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit?usp=sharing
```

Replace `[SPREADSHEET_ID]` with the actual ID from your share link.

## 🔗 Google Sheets API Integration

### Required Dependencies
```json
{
  "dependencies": {
    "googleapis": "^118.0.0",
    "google-auth-library": "^8.9.0"
  }
}
```

### Sample Integration Code
```javascript
import { google } from 'googleapis';

const SHEET_ID = 'your-spreadsheet-id-here';
const RANGE = 'Sheet1!A2:Z'; // Skip header row

async function getCustomerData() {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        // Your Google Cloud service account credentials
        type: "service_account",
        private_key: process.env.GOOGLE_PRIVATE_KEY,
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: RANGE,
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      return [];
    }

    // Convert to customer objects
    return rows.map(row => ({
      id: row[0],
      customer_name: row[1],
      phone: row[2],
      email: row[3],
      vehicle_make: row[4],
      vehicle_model: row[5],
      vehicle_year: parseInt(row[6]),
      registration_number: row[7],
      service_type: row[8],
      last_service_date: row[9],
      next_service_due: row[10],
      communication_preference: row[11],
      is_repeat_customer: row[12] === 'true',
      loyalty_points: parseInt(row[13]),
      customer_segment: row[14],
      preferred_language: row[15],
      location_city: row[16],
      location_area: row[17],
      emergency_contact: row[18],
      preferred_time_slots: row[19],
      vehicle_condition_notes: row[20],
      service_history_count: parseInt(row[21]),
      last_service_feedback: row[22]
    }));
  } catch (error) {
    console.error('Error fetching customer data:', error);
    return [];
  }
}
```

## 📋 Voice AI Testing Scenarios

### Test Case 1: VIP Repeat Customer
**Sheet Row:** ID 1 (Santhosh Kumar)
**Expected Behavior:**
- AI recognizes repeat customer
- Offers preferred time slots
- Applies loyalty discounts
- Sends SMS confirmation

### Test Case 2: New Customer Acquisition
**Sheet Row:** ID 3 (Rajesh Patel)
**Expected Behavior:**
- AI gathers complete information
- Explains service process
- Provides pricing details
- Books appointment with email confirmation

### Test Case 3: Emergency Situation
**Sheet Row:** ID 6 (Kavita Rao)
**Expected Behavior:**
- AI detects urgency
- Prioritizes immediate scheduling
- Arranges emergency service
- Sends immediate notifications

### Test Case 4: Multi-Language Support
**Sheet Row:** ID 2 (Priya Sharma - Hindi)
**Expected Behavior:**
- AI responds in customer's preferred language
- Handles Hindi voice input
- Sends WhatsApp confirmation in Hindi

### Test Case 5: High-Value Customer
**Sheet Row:** ID 5 (Amit Singh - VIP)
**Expected Behavior:**
- Offers premium services
- Provides dedicated support
- Applies maximum loyalty benefits

## 📊 Testing Metrics Dashboard

### Real-time Metrics to Track:
1. **Call Success Rate:** % of calls answered
2. **Booking Conversion:** % of calls resulting in appointments
3. **Communication Delivery:** % of confirmations sent successfully
4. **Customer Satisfaction:** Average feedback scores
5. **Average Call Duration:** Time spent per customer
6. **Service Type Distribution:** Popular services booked

### Google Sheets Formulas for Metrics:
```
Call Success Rate: =COUNTIF(B:B, "Answered") / COUNTA(A:A)
Booking Conversion: =COUNTIF(F:F, "Booked") / COUNTIF(B:B, "Answered")
Average Satisfaction: =AVERAGE(IFERROR(VALUE(G:G), 0))
```

## 🚀 Bulk Calling Campaign Setup

### Step 1: Segment Customers
Filter your Google Sheet data by:
- Customer segment (VIP, Regular, New)
- Service type needed
- Geographic location
- Communication preference

### Step 2: Schedule Calling Campaigns
Create separate sheets for:
- **Morning Campaign:** 9 AM - 12 PM (IDs: 1,4,6,9,11,14,15,19,21,25,28,31,34,37,40,43,46,49)
- **Afternoon Campaign:** 2 PM - 5 PM (IDs: 2,5,7,8,10,12,16,17,18,20,22,24,26,29,32,35,38,41,44,47,50)
- **Evening Campaign:** 4 PM - 7 PM (IDs: 3,13,23,27,30,33,36,39,42,45,48)

### Step 3: Voice AI Scripts by Segment

#### VIP Customer Script:
```
AI: "Hello [Name]! Welcome back to AutoEra. I see you've been with us for [X] services."
Customer: [Response]
AI: "Based on your VIP status, I can offer you our premium service package..."
```

#### New Customer Script:
```
AI: "Hello! Thank you for considering AutoEra Service AI."
AI: "I'd like to help you schedule your [Service Type] for your [Vehicle]."
Customer: [Response]
AI: "Great! This service typically takes [Duration] and costs around ₹[Price]..."
```

#### Emergency Script:
```
AI: "I understand this is urgent. Are you in a safe location?"
Customer: [Response]
AI: "Our emergency team can assist you within 30 minutes. What's the issue with your [Vehicle]?"
```

## 📞 Communication Templates

### SMS Template:
```
AutoEra: Hi [Name]! Your [Service] appointment is confirmed for [Date] at [Time].
Location: [Address]
Questions? Call +91-XXXXXXXXXX
```

### WhatsApp Template:
```
🚗 *AutoEra Service AI*

Hi [Name]!

✅ Appointment Confirmed
📅 [Date] at [Time]
🚗 [Vehicle]
🔧 [Service]

Location: [Address]
Contact: +91-XXXXXXXXXX

See you soon! 👍
```

### Email Template:
```
Subject: Your AutoEra Service Appointment - [Date]

Dear [Name],

Your service appointment has been confirmed!

Details:
- Service: [Service Type]
- Vehicle: [Make] [Model] ([Year])
- Date & Time: [Date] at [Time]
- Location: [Address]

Please arrive 10 minutes early with your vehicle documents.

Questions? Contact us at +91-XXXXXXXXXX

Thank you for choosing AutoEra!

Best regards,
AutoEra Service Team
```

## 🔍 Quality Assurance Checklist

### Pre-Campaign Testing:
- [ ] Voice AI responds correctly in all languages
- [ ] Calendar integration works for all time slots
- [ ] Communication APIs (SMS/WhatsApp/Email) functional
- [ ] Emergency protocols trigger appropriately
- [ ] Customer data loads correctly from Google Sheets

### During Campaign:
- [ ] Monitor call success rates (>70%)
- [ ] Track booking conversion rates (>60%)
- [ ] Check communication delivery rates (>95%)
- [ ] Monitor average call duration (3-5 minutes)
- [ ] Record customer feedback and satisfaction

### Post-Campaign Analysis:
- [ ] Calculate ROI per customer segment
- [ ] Identify most/least successful service types
- [ ] Analyze geographic performance
- [ ] Review voice AI conversation quality
- [ ] Update customer database with new information

## 📈 Expected Results

### Performance Benchmarks:
- **Call Answer Rate:** 75-85%
- **Booking Conversion:** 65-75%
- **Customer Satisfaction:** 4.5/5.0
- **Communication Success:** 95%+
- **Average Call Duration:** 3.5 minutes

### Business Impact:
- **Revenue Increase:** 40-60% from automated bookings
- **Time Savings:** 70% reduction in manual scheduling
- **Show-up Rate:** 85%+ with automated reminders
- **Customer Retention:** 25% improvement
- **Market Reach:** 10x more customers contacted daily

This comprehensive dataset and integration guide will enable thorough testing of your voice AI agent across all customer segments and scenarios. Start with small batches and scale up as you refine the AI responses and booking flows.
