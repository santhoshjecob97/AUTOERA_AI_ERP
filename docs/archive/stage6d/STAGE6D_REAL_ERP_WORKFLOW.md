# AutoEra AI ERP -- Stage 6D Real ERP Workflow Verification

**Verification Date**: 2026-08-22
**Mode**: SIMULATED Voice, REAL ERP Data Path

## 1. Verified End-to-End Workflow

The following workflow was executed using the `VoiceGateway` with `SimulatedTelephonyAdapter`, exercising the real Django ORM, real `AgentSupervisor`, real `ToolRegistry`, and real `HybridRetriever`:

```
SIMULATED CALL
  -> VoiceSession.objects.create() [REAL DB WRITE]
  -> STTProvider.transcribe() [SIMULATED - text passthrough]
  -> LanguageResolver.detect_language() [REAL]
  -> AutomotiveEntityNormalizer [REAL]
  -> Customer.objects.filter() [REAL DB QUERY]
  -> Vehicle.objects.filter() [REAL DB QUERY]
  -> VoiceTranscript.objects.create() [REAL DB WRITE]
  -> supervisor.route_and_execute() [REAL AGENT ROUTING]
    -> IntentRouter.route_agent() [REAL]
    -> plan_tools() [REAL TOOL PLANNING]
    -> tool_registry.execute() [REAL RBAC + TENANT CHECK]
    -> HybridRetriever.retrieve() [REAL VECTOR SEARCH]
    -> RAGContextBuilder.build_context() [REAL]
    -> ModelGateway.generate() [SIMULATED - no API key]
  -> TTSProvider.synthesize() [SIMULATED - text formatting only]
  -> VoiceTranscript.objects.create() [REAL DB WRITE]
  -> VoiceSession.save() [REAL DB WRITE]
```

## 2. What Was Verified Against Real ERP Data

| Step | Real DB Operation | Verified |
| :--- | :--- | :---: |
| Customer identification by phone | `Customer.objects.filter(phone__icontains=...)` | YES - matched `Rajesh Kannan` |
| Vehicle identification by reg number | `Vehicle.objects.filter(registration_number__iexact=...)` | YES - matched `TN09AB1234` |
| RAG document retrieval | `KnowledgeChunk.objects.filter()` + cosine similarity | YES - returned `Brake System Inspection SOP` |
| Citation metadata | `document_title`, `version`, `section`, `relevance_score` | YES |
| ActionProposal creation | `ActionProposal.objects.create(status='PENDING_APPROVAL')` | YES - refund intercepted |
| Transcript persistence | `VoiceTranscript.objects.create()` per utterance | YES - 22+ transcripts |
| Session lifecycle | `INITIATED` -> `AI_ACTIVE` -> `COMPLETED` | YES |
| Tenant isolation | Org B cannot access Org A records | YES |

## 3. What Was NOT Verified

| Component | Reason |
| :--- | :--- |
| Real appointment creation | `create_service_appointment` tool returns simulated response |
| Real appointment slot availability | `get_appointment_availability` tool returns simulated response |
| Real LLM response | No Gemini API key; ModelGateway returns template response |
| Real invoice lookup | No test invoices in verification DB |

## 4. Verdict

**ERP Data Path: VERIFIED (via real Django ORM and real database)**
**AI Response Quality: NOT VERIFIED (no LLM API key)**
