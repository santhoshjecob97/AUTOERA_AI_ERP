# AutoEra AI ERP — Stage 6D Real AI Voice Architecture

## 1. Unified Voice Gateway & Agent Integration

Voice in AutoEra AI ERP is strictly an **interface layer**, never a separate database-mutating engine:

```mermaid
graph TD
    User([Customer / Dealer Staff Voice]) --> VoiceGW[Unified Voice Gateway]
    VoiceGW --> Telephony[Telephony Adapter / Simulator]
    Telephony --> STT[STTProvider + EntityNormalizer + LanguageResolver]
    STT --> Supervisor[AgentSupervisor]
    Supervisor --> Router[IntentRouter]
    Router --> Agents[7 Specialist Agents]
    Agents --> Tools[ERP Tool Registry + RAG HybridRetriever]
    Tools --> Proposal{High-Risk Action?}
    Proposal -- Yes --> ActionProposal[ActionProposal: PENDING_APPROVAL]
    Proposal -- No --> Exec[Safe Read / Scoped Write Tool]
    Exec --> Audit[AuditLog + Telemetry]
    ActionProposal --> Audit
    Audit --> Synthesis[ModelGateway Response Synthesis]
    Synthesis --> TTS[TTSProvider Concise Formatter]
    TTS --> VoiceGW
    VoiceGW --> User
```

---

## 2. Core Architectural Invariants

1. **Zero Direct Database Mutation from Voice**: Voice transcription is treated as untrusted user input. All ERP operations route strictly through `ToolRegistry` with role-based validation and tenant isolation.
2. **Reuse of AgentSupervisor**: Voice calls the identical multi-step tool execution loop, cycle detector, and RAG knowledge pipeline established in Stage 6C.
3. **Mandatory Human-in-the-Loop Interception**: High-risk financial operations (`issue_refund`, `approve_estimate`) create an `ActionProposal` in `PENDING_APPROVAL` status and never claim execution before manager approval.
