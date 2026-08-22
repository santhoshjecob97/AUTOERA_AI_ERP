# 🎯 AutoEra Voice AI Testing Dataset - Complete Package

## 📦 What's Included

This comprehensive testing package provides everything you need to test your voice AI agent for bulk customer calling and appointment booking.

### 📄 Files Created:

1. **`voice_ai_complete_test_dataset.csv`** (50 customers)
   - Complete dataset with 22 columns of customer information
   - Diverse customer segments (VIP, Regular, New)
   - Multiple service types and vehicle brands
   - Geographic distribution across India
   - Realistic contact information and preferences

2. **`voice_ai_test_dataset_documentation.md`**
   - Detailed field descriptions and data structure
   - Customer scenario explanations
   - Voice AI conversation flow examples
   - Communication templates (SMS/WhatsApp/Email)
   - Testing metrics and success criteria

3. **`voice_ai_google_sheets_integration.md`**
   - Step-by-step Google Sheets setup guide
   - API integration code samples
   - Testing scenarios by customer type
   - Bulk calling campaign strategies
   - Quality assurance checklists

4. **`voice_ai_dataset_processor.py`**
   - Python script for processing CSV data
   - Campaign simulation with realistic metrics
   - Customer segmentation by time slots and priority
   - Results export and reporting
   - Command-line interface for different campaign types

## 🚀 Quick Start Guide

### Option 1: CSV Upload Testing
```bash
# Run morning campaign simulation
python voice_ai_dataset_processor.py --csv voice_ai_complete_test_dataset.csv --campaign morning --output morning_campaign_results.json

# Run VIP customer campaign
python voice_ai_dataset_processor.py --csv voice_ai_complete_test_dataset.csv --campaign vip --output vip_campaign_results.json
```

### Option 2: Google Sheets Integration
1. Create a new Google Sheet and copy the CSV data
2. Share the sheet with view permissions
3. Use the provided JavaScript integration code
4. Test bulk calling campaigns through your voice AI interface

## 📊 Dataset Coverage

### Customer Segments (50 total):
- **VIP Customers:** 12 (24%) - High-value repeat customers
- **Regular Customers:** 25 (50%) - Established relationships
- **New Customers:** 13 (26%) - First-time visitors

### Service Types Covered:
- Oil Change, Brake Inspection, AC Service
- General Repair, Tire Replacement, Body Work
- Battery Check, Engine Tune-up, Transmission Service
- Emergency services and specialized maintenance

### Geographic Distribution:
- **Major Cities:** Chennai, Bangalore, Mumbai, Delhi, Hyderabad
- **Regional Coverage:** Pune, Jaipur, Ahmedabad, Kolkata, and more
- **Language Support:** English, Hindi, Tamil, Telugu, Gujarati, etc.

### Communication Preferences:
- **SMS:** 40% (most reliable for confirmations)
- **WhatsApp:** 35% (preferred by younger demographics)
- **Email:** 25% (used for detailed confirmations)

## 🎯 Testing Scenarios

### 1. **Morning Campaign** (9 AM - 12 PM)
- Target: 18 customers preferring morning slots
- Focus: Routine maintenance and regular customers
- Expected Success Rate: 70-80%

### 2. **Afternoon Campaign** (2 PM - 5 PM)
- Target: 20 customers preferring afternoon slots
- Focus: Working professionals and urgent services
- Expected Success Rate: 65-75%

### 3. **Evening Campaign** (4 PM - 7 PM)
- Target: 12 customers preferring evening slots
- Focus: End-of-day scheduling and family vehicles
- Expected Success Rate: 60-70%

### 4. **VIP Priority Campaign**
- Target: 12 high-value customers
- Focus: Premium service offerings and loyalty rewards
- Expected Success Rate: 80-90%

### 5. **Emergency Response Campaign**
- Target: 13 customers needing urgent service
- Focus: Breakdown assistance and immediate scheduling
- Expected Success Rate: 75-85%

## 📈 Expected Performance Metrics

### Call Metrics:
- **Answer Rate:** 70-85% (higher for VIP customers)
- **Booking Conversion:** 60-80% (varies by customer segment)
- **Average Call Duration:** 3-5 minutes
- **Communication Success:** 95%+ delivery rate

### Business Impact:
- **Revenue Increase:** 40-60% from automated bookings
- **Time Savings:** 70% reduction in manual scheduling
- **Show-up Rate:** 85%+ with automated reminders
- **Customer Satisfaction:** 4.2/5.0 average rating

## 🔧 Technical Integration Points

### CSV Upload Integration:
```javascript
// Frontend: File upload handler
const handleFileUpload = (file) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    const csv = e.target.result;
    // Parse CSV and create customer objects
    const customers = parseCSV(csv);
    // Send to your voice AI system
    initiateBulkCalling(customers);
  };
  reader.readAsText(file);
};
```

### Google Sheets Integration:
```javascript
// Backend: Fetch data from Google Sheets
const SHEET_ID = 'your-spreadsheet-id';
const customers = await fetchFromGoogleSheets(SHEET_ID);

// Process customers and start calling campaign
const campaign = new VoiceAICampaign(customers);
await campaign.execute();
```

### Voice AI Processing Flow:
```javascript
// Voice AI conversation handler
const handleCustomerCall = async (customer) => {
  // 1. Greet customer
  await speak(`Hello ${customer.customer_name}! This is AutoEra Service AI.`);

  // 2. Identify needs
  const needs = await listenAndProcess();

  // 3. Check availability
  const availableSlots = await checkCalendar(customer.location_city);

  // 4. Book appointment
  const booking = await createAppointment(customer, selectedSlot);

  // 5. Send confirmation
  await sendConfirmation(customer, booking);
};
```

## 🎉 Ready to Test!

Your voice AI testing environment is now complete with:

- ✅ **50 diverse customer profiles** for comprehensive testing
- ✅ **Multiple campaign types** for different scenarios
- ✅ **Realistic conversation scripts** for voice AI training
- ✅ **Communication templates** for SMS/WhatsApp/Email
- ✅ **Performance tracking** and analytics
- ✅ **Integration guides** for CSV and Google Sheets
- ✅ **Python simulation tools** for testing without live calls

### Next Steps:
1. **Import the dataset** into your voice AI system
2. **Start with small campaigns** (5-10 customers) for testing
3. **Monitor performance metrics** and adjust AI responses
4. **Scale up campaigns** as confidence increases
5. **Analyze results** and optimize for better conversion rates

This dataset will enable thorough testing of your voice AI agent across all customer types, service scenarios, and communication preferences. Happy testing! 🚗🤖📞
