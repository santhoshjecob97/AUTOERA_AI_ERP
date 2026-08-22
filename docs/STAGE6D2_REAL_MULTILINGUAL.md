# AutoEra AI ERP — Stage 6D.2 Real Multilingual Verification

**Document ID**: `STAGE6D2-MULTI-012`  
**Classification**: Multilingual Voice Processing Audit  
**Languages Evaluated**: Indian English (`en-IN`), Tamil (`ta-IN`), Tanglish  

---

## 1. Multilingual Turn Matrix (15/15 Passed)

### 1. English (`en-IN`) — 5 Turns
1. Warranty check: `"Can you check if my vehicle warranty is active?"` $\to$ Answered correctly.
2. Estimate inquiry: `"I need an estimate for replacing engine oil and filter"` $\to$ Grounded estimate.
3. SLA inquiry: `"What is the turn around time for periodic maintenance?"` $\to$ 45 min standard TAT.
4. Policy query: `"Do you offer doorstep pick and drop service for car servicing?"` $\to$ Policy answered.
5. Booking request: `"Great, please confirm my service booking for Creta"` $\to$ **Appointment booked**.

### 2. Tamil (`ta-IN`) — 5 Turns
1. Service request: `"என் காருக்கு சர்வீஸ் செய்ய வேண்டும்"` $\to$ Tamil greeting and prompt.
2. Symptom description: `"பிரேக் சத்தம் போடுது, என்ன பழுது?"` $\to$ Diagnostic advice in Tamil.
3. Registration plate: `"என் வண்டி TN 09 AB 1234, சர்வீஸ் ஹிஸ்டரி சொல்லுங்க"` $\to$ Reg extracted, history queried.
4. Price question: `"சர்வீஸ் செய்ய எவ்வளவு செலவு ஆகும்?"` $\to$ ₹3,500 standard estimate.
5. Confirmation: `"சரி, அப்பாயின்ட்மென்ட் புக் பண்ணுங்க"` $\to$ **Tamil booking confirmation**.

### 3. Tanglish — 5 Turns
1. Service intent: `"En car-ku periodic service book pannanum"` $\to$ Routed to Service Advisor.
2. Noise symptom: `"Brake noise romba athigama varuthu"` $\to$ Grounded diagnosis.
3. Slot check: `"Naalaikku morning slot irukkaa? Bay availability check panunga"` $\to$ Slot availability checked.
4. Cost query: `"Approximate cost evvalavu aagum solunga"` $\to$ Concise estimate.
5. Confirmation: `"Sari okay confirm pannunga, appointment schedule panunga"` $\to$ **Appointment created**.
