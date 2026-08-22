# Voice AI Agent Test Dataset - Complete Customer Database

## 📊 Dataset Overview
This dataset contains 50 diverse customer profiles for testing voice AI appointment booking scenarios.

## 🎯 Customer Scenarios Covered

### **1. Repeat VIP Customers (High Priority)**
- Existing relationships, loyalty points
- Preferential treatment, flexible scheduling
- Quick booking process with minimal questions

### **2. New Customers (Lead Conversion)**
- First-time visitors, need education
- Price-sensitive, comparison shopping
- Require detailed service explanations

### **3. Emergency Cases (Urgent Priority)**
- Breakdown situations, safety concerns
- Need immediate attention
- May require special scheduling

### **4. Regular Maintenance (Standard)**
- Routine service appointments
- Familiar with process
- Prefer consistent service providers

### **5. Multi-Vehicle Owners (Cross-selling)**
- Own multiple vehicles
- May need coordinated scheduling
- Upselling opportunities

## 📋 Dataset Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| id | Integer | Unique customer ID | 1 |
| customer_name | String | Full customer name | "Santhosh Kumar" |
| phone | String | Primary phone number | "+91-7299534753" |
| email | String | Email address | "santhosh.kumar@email.com" |
| vehicle_make | String | Vehicle manufacturer | "Maruti" |
| vehicle_model | String | Vehicle model | "Swift" |
| vehicle_year | Integer | Manufacturing year | 2021 |
| registration_number | String | Vehicle registration | "KA-01-AB-1234" |
| service_type | String | Required service | "Oil Change" |
| last_service_date | Date | Previous service date | "2024-10-15" |
| next_service_due | Date | Recommended next service | "2025-01-15" |
| communication_preference | String | Preferred contact method | "SMS" |
| is_repeat_customer | Boolean | Returning customer status | true |
| loyalty_points | Integer | Reward points balance | 450 |
| customer_segment | String | Customer classification | "VIP" |
| preferred_language | String | Communication language | "English" |
| location_city | String | City location | "Chennai" |
| location_area | String | Specific area | "T. Nagar" |
| emergency_contact | String | Alternative contact | "+91-9876543210" |
| preferred_time_slots | String | Preferred appointment times | "Morning (9-12)" |
| vehicle_condition_notes | String | Vehicle status notes | "Good condition" |
| service_history_count | Integer | Previous services count | 12 |
| last_service_feedback | String | Previous feedback | "Excellent service" |

## 🔄 Voice AI Conversation Scenarios

### **Scenario 1: VIP Repeat Customer - Quick Booking**
**Customer Input:** "Hello, this is Santhosh. I need to book my regular service for my Swift."

**AI Response Flow:**
1. Greeting: "Hello Santhosh! Welcome back. I see you have a Maruti Swift from our records."
2. Confirmation: "Would you like to schedule your regular oil change service?"
3. Time preference: "What time works best for you today? Morning or afternoon?"
4. Booking: "Perfect! I've booked your oil change for tomorrow at 10 AM."
5. Confirmation: "You'll receive an SMS confirmation shortly. Is there anything else I can help with?"

### **Scenario 2: New Customer - Detailed Guidance**
**Customer Input:** "Hi, I'm new here. I need brake inspection for my Honda City."

**AI Response Flow:**
1. Greeting: "Hello! Thank you for choosing AutoEra Service AI."
2. Information gathering: "May I have your full name and contact number?"
3. Vehicle details: "Could you please confirm your vehicle - Honda City, correct?"
4. Service explanation: "A brake inspection typically takes 45 minutes and costs around ₹1,500."
5. Scheduling: "When would you prefer to come in? We have slots available this week."
6. Booking: "I've scheduled your brake inspection for Thursday at 2 PM."
7. Follow-up: "You'll receive confirmation via SMS and email. Any questions?"

### **Scenario 3: Emergency Breakdown**
**Customer Input:** "My car broke down! I need immediate service."

**AI Response Flow:**
1. Emergency protocol: "I understand this is urgent. Let me help you right away."
2. Location assessment: "Are you in a safe location? What's your current address?"
3. Service prioritization: "What seems to be the issue with your vehicle?"
4. Immediate assistance: "I can arrange for a tow truck and emergency service."
5. Scheduling: "Our emergency team can be there within 30 minutes."
6. Confirmation: "Help is on the way. Stay safe and keep your phone on."

### **Scenario 4: Multi-Service Request**
**Customer Input:** "I need oil change and tire check for my Scorpio."

**AI Response Flow:**
1. Service identification: "I'd be happy to help with both services for your Mahindra Scorpio."
2. Package offering: "We can do both services together - oil change and tire inspection."
3. Time estimation: "This will take about 90 minutes total."
4. Pricing: "Combined package price is ₹4,200 (saving ₹500)."
5. Scheduling: "When would you like to bring your vehicle in?"
6. Confirmation: "Perfect! Both services scheduled for next Monday at 11 AM."

## 📞 Communication Templates

### **SMS Confirmation Template**
```
AutoEra: Hi [Name]! Your [Service] for [Vehicle] is confirmed for [Date] at [Time].
Location: [Address]
Contact: +91-XXXXXXXXXX
Reply CONFIRM or call to reschedule.
```

### **WhatsApp Message Template**
```
🚗 *AutoEra Service AI*

Hi [Name]! 👋

Your appointment is confirmed:
📅 Date: [Date]
🕐 Time: [Time]
🚗 Vehicle: [Vehicle]
🔧 Service: [Service]

Location: [Address]
Contact: +91-XXXXXXXXXX

Need to reschedule? Reply here or call us.
Thank you for choosing AutoEra! 👍
```

### **Email Confirmation Template**
```
Subject: Your AutoEra Service Appointment Confirmation

Dear [Name],

Your service appointment has been successfully booked!

Appointment Details:
- Date: [Date]
- Time: [Time]
- Vehicle: [Vehicle Make] [Vehicle Model] ([Year])
- Service Type: [Service]
- Location: [Address]

Important Reminders:
- Please arrive 10 minutes early
- Bring your vehicle registration and insurance documents
- Our service advisor will call you 30 minutes before your appointment

Questions? Contact us:
Phone: +91-XXXXXXXXXX
Email: hello@autoera.ai

Thank you for choosing AutoEra Service AI!

Best regards,
AutoEra Service Team
```

## 📈 Testing Metrics

### **Success Criteria**
- **Call Answer Rate:** >70% of calls answered
- **Booking Conversion:** >60% of calls result in appointments
- **Communication Success:** >90% of confirmations delivered
- **Customer Satisfaction:** >4.2/5.0 rating
- **Average Call Duration:** 3-5 minutes

### **Test Scenarios Coverage**
- [ ] VIP repeat customers (10 customers)
- [ ] New customer acquisition (15 customers)
- [ ] Emergency situations (5 customers)
- [ ] Multi-service requests (10 customers)
- [ ] Different time preferences (morning/afternoon/evening)
- [ ] Various service types (all major categories)
- [ ] Different communication preferences (SMS/WhatsApp/Email)
- [ ] Multiple languages (English/Hindi/Tamil)
- [ ] Different customer segments (VIP/Regular/New)

## 🔗 Integration Points

### **CSV Upload Process**
1. Customer uploads CSV file via dashboard
2. System validates data format and required fields
3. AI processes customer profiles and segments
4. Voice AI schedules automated calling campaigns
5. Real-time dashboard shows calling progress and results

### **Google Sheets Integration**
1. Customer shares Google Sheet link
2. System connects via Google Sheets API
3. Real-time data synchronization
4. Automatic updates when sheet is modified
5. Batch processing for large datasets

### **Voice AI Calling Flow**
1. **Preparation:** AI analyzes customer profile and history
2. **Calling:** Automated outbound calls using Twilio
3. **Conversation:** Natural language processing and response
4. **Booking:** Real-time calendar integration
5. **Confirmation:** Multi-channel verification (SMS/WhatsApp/Email)
6. **Follow-up:** Automated reminders and status updates
