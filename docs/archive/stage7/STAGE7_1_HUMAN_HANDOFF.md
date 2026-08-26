# AutoEra AI ERP — Stage 7.1 Human Handoff & Context Transfer

**Document ID**: `STAGE7.1-HANDOFF-001`  
**Classification**: Live Human Escalation Protocol, State Machine & Context Transfer Audit  
**Audit Date**: August 22, 2026  
**Auditor**: Principal Customer Experience Systems Architect  

---

## 1. Human Escalation Triggers Verified

1. **Manager Request**: Customer explicitly asks to speak to the General Manager or Workshop Manager.
2. **Monetary Dispute**: Billing discrepancies or unresolved refund requests ($>\text{₹}5,000$).
3. **Severe Distress / Sentiment**: High frustration or repeated recognition failure ($>2$ unconfirmed turns).
4. **Accident / Legal**: Major vehicle collision claims or legal disputes requiring human surveyor presence.

---

## 2. Context Transfer Packet Specification

When `VoiceSession.status` transitions to `HUMAN_HANDOFF`, the live Service Advisor console renders:
- **Caller Identity**: Customer Name, Phone, VIP/Tier status, Lifetime Spend.
- **Vehicle Profile**: Make, Model, Registration, Current Odometer, Service History.
- **Real-Time Transcript**: Complete verbatim dialogue history up to the handoff turn.
- **AI Summary**: Extracted intent, detected sentiment, proposed actions, and escalation reason.
- **Result**: Human advisor continues the call immediately without asking the customer to repeat themselves.
