# AutoEra AI ERP — Stage 6D.2 Real AI Service Advisor Audit

**Document ID**: `STAGE6D2-SERVICE-ADVISOR-009`  
**Classification**: AI Agent & Service Advisor Verification  
**Primary Scenario**: Customer Diagnostic Voice Call $\to$ Grounded Advice $\to$ Slot Check  

---

## 1. Verified Diagnostic Flow

```
[Customer Calls: "My car is making a grinding noise when I press the brake pedal"]
                                      │
                                      ▼
                      [1. Identification of Caller]
                      Matched: Karthik Subbaraj (Phone: 9840123456)
                      Matched: Hyundai Creta (Reg: TN09AB1234, VIN: VINVOICE998877)
                                      │
                                      ▼
                      [2. Diagnostic RAG Retrieval]
                      Document: Brake Diagnostic SOP v1 (Section: 1.1)
                      Guidance: Check pad lining thickness (<3mm replace)
                      TAT: 45 min, Estimated Cost: Rs 3,500
                                      │
                                      ▼
                      [3. AI Service Advisor Synthesis]
                      Grounded Response: Explains brake pad wear symptoms,
                      cites SOP, provides estimate, suggests inspection.
                                      │
                                      ▼
                      [4. Bay Availability Tool]
                      Tool: get_appointment_availability
                      Result: 4 open morning slots tomorrow
```

---

## 2. Evidence of Non-Fabrication

1. **No Hallucination**: When asked about unsupported vehicle components not in dealership SOPs, the AI Service Advisor safely responds with general guidance and offers human service advisor callback.
2. **Citations**: Citations contain document title, version, and section reference.
3. **Database Scoping**: Only service history and SOPs matching `organization_id` are accessed.
