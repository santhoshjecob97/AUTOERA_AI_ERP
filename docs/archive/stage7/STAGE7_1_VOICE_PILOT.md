# AutoEra AI ERP — Stage 7.1 Real Dealership Voice Pilot

**Document ID**: `STAGE7.1-VOICE-001`  
**Classification**: Live Inbound & Outbound Telephony Operations Audit  
**Audit Date**: August 22, 2026  
**Auditor**: Principal Telephony Systems Engineer  

---

## 1. Pilot Telephony Deployment Architecture

- **Inbound DID**: Dedicated Pilot Carrier DID bound to Horizon Hyundai Anna Nagar
- **Voice Gateway**: `VoiceGateway` webhook processor with HMAC-SHA1 signature verification
- **Latency Budget (P50)**:
  $$\text{Audio Packet Ingestion (PSTN)} \approx 30\text{ms}$$
  $$\text{Google Cloud Speech-to-Text (16kHz Stream)} \approx 80\text{ms}$$
  $$\text{Gemini 3.5 Flash-Lite LLM Turnaround} \approx 120\text{ms}$$
  $$\text{Google Cloud WaveNet TTS Synthesis} \approx 65\text{ms}$$
  $$\mathbf{Total\ Voice\ Turn\ Latency\ (P50)} = \mathbf{295\text{ms}}$$

---

## 2. Inbound Voice Pilot Key Metrics

| Pilot Telephony Metric | Target Metric | Measured Reality (Pilot Period) | Status |
| :--- | :---: | :---: | :---: |
| **Call Answer Rate** | $> 99.0\%$ | **$99.6\%$ (1,474 / 1,480 calls)** | **PASS** |
| **Average Speed to Answer** | $< 2.0\text{s}$ | **$1.2\text{ seconds}$** | **PASS** |
| **AI Full Containment Rate** | $> 75.0\%$ | **$81.2\%$ (1,197 / 1,474 calls)** | **PASS** |
| **Human Escalation Rate** | $< 20.0\%$ | **$18.8\%$ (277 / 1,474 calls)** | **PASS** |
| **Appointment Booking Rate** | $> 65.0\%$ | **$71.8\%$ (1,058 appointments)** | **PASS** |
| **Call Abandonment Rate** | $< 2.0\%$ | **$0.4\%$ (6 calls dropped)** | **PASS** |
