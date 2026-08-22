# AutoEra AI ERP -- Stage 6D Real Unit Economics

**Verification Date**: 2026-08-22
**Mode**: ESTIMATED (No real provider billing data available)

## 1. Previous Claim

The Stage 6D implementation report claimed: **~$0.0137 (~Rs 1.15) per 2.5 min call**.

## 2. Independent Cost Estimation

### Per-Component Cost Model (Based on published provider pricing, Aug 2026)

| Component | Provider | Published Rate | Usage per 2.5 min call | Est. Cost |
| :--- | :--- | :--- | :--- | ---: |
| **Telephony (PSTN Inbound)** | Twilio India | $0.0085/min | 2.5 min | **$0.02125** |
| **Telephony (PSTN Outbound)** | Twilio India | $0.013/min | 2.5 min (if outbound) | **$0.03250** |
| **STT** | Google Cloud Speech | $0.006/15 sec | 10 segments (~2.5 min) | **$0.06000** |
| **LLM (Gemini Flash)** | Google AI | $0.075/1M input tokens | ~1,500 tokens (4 turns) | **$0.00011** |
| **LLM (Gemini Flash output)** | Google AI | $0.30/1M output tokens | ~600 tokens (4 turns) | **$0.00018** |
| **TTS** | Google Cloud TTS | $4.00/1M chars | ~400 chars (4 responses) | **$0.00160** |
| **Compute (Django)** | GCP e2-medium | ~$0.034/hr | ~0.04 hr | **$0.00136** |
| **Database (CloudSQL)** | PostgreSQL | ~$0.017/hr | ~0.04 hr | **$0.00068** |

### Corrected Total Per-Call Estimate

| Scenario | Telephony | STT | LLM | TTS | Infra | Total | INR Equiv |
| :--- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| **Inbound, 2.5 min, 4 turns** | $0.021 | $0.060 | $0.000 | $0.002 | $0.002 | **$0.085** | **~Rs 7.15** |
| **Inbound, 5 min, 8 turns** | $0.043 | $0.120 | $0.001 | $0.003 | $0.003 | **$0.170** | **~Rs 14.30** |
| **Inbound, 10 min, 15 turns** | $0.085 | $0.240 | $0.001 | $0.006 | $0.005 | **$0.337** | **~Rs 28.35** |

## 3. Previous Claim vs. Independent Estimate

| Metric | Previous Claim | Independent Estimate | Delta |
| :--- | ---: | ---: | :--- |
| Cost per 2.5 min call | $0.0137 (Rs 1.15) | **$0.085 (Rs 7.15)** | **Previous claim underestimated by ~6x** |

### Why the Previous Claim Was Wrong

The previous estimate of $0.0137 **excluded the dominant cost: real STT transcription**. Google Cloud Speech-to-Text at $0.006/15 sec is the largest per-call expense. The previous model also used unrealistically low telephony costs.

## 4. Volume Projections

| Volume | Cost/Day | Cost/Month (30 days) |
| :--- | ---: | ---: |
| 100 calls/day (2.5 min avg) | **$8.50** (Rs 715) | **$255** (Rs 21,450) |
| 1,000 calls/day | **$85.00** (Rs 7,150) | **$2,550** (Rs 214,500) |
| 10,000 calls/day | **$850.00** (Rs 71,500) | **$25,500** (Rs 2,145,000) |

## 5. Comparison to Human BDC Agent

| Metric | AI Voice Agent | Human BDC Agent | Savings |
| :--- | ---: | ---: | ---: |
| Cost per call (2.5 min) | Rs 7.15 | Rs 45-75 | **84-90% savings** |
| Availability | 24/7 | Business hours | -- |
| Consistency | Deterministic | Variable | -- |

## 6. Cost Optimization Opportunities

- Use Exotel (Indian provider) instead of Twilio: ~40% telephony cost reduction
- Use streaming STT with VAD (voice activity detection): ~30% STT cost reduction
- Cache frequent RAG retrievals: reduces LLM token usage

## 7. Verdict

**The previous claim of Rs 1.15/call is NOT ACCURATE.**

**Corrected independent estimate: Rs 7.15/call (2.5 min, 4 turns).**

This still represents an **84-90% cost reduction** vs. human BDC agents, making the unit economics commercially viable. However, the 6x underestimate should be corrected in all commercial projections.

**NOTE**: These are estimates based on published pricing. Actual costs require real provider billing data from live calls, which is NOT available in this environment.
