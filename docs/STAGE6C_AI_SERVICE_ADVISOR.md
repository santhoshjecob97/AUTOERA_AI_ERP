# AutoEra AI ERP — Stage 6C AI Service Advisor Productionization

## 1. Diagnostic Intelligence Pipeline

The AI Service Advisor production engine brings together real-time dealership operational context with semantic knowledge retrieval:

1. **ERP Entity Context**:
   - Customer Profile (Name, Phone, VIP Tier)
   - Vehicle Record (Make, Model, Year, Mileage, Active Warranty Expiration)
   - Recent Service History (Past complaints, resolved job cards)
2. **Knowledge Retrieval**:
   - OEM Service Manuals
   - Warranty Coverage Matrices
   - Service Department SOPs
3. **Structured Technical Assessment**:
   - `priority`: `LOW` | `MEDIUM` | `HIGH` | `CRITICAL`
   - `possible_causes`: List of likely component wear or mechanical faults
   - `recommended_checks`: Objective inspection steps (e.g. caliper measurement, fluid levels)
   - `recommended_actions`: Clear repair operations
   - `customer_explanation`: Customer-friendly explanation free of technical jargon
   - `requires_human_review`: Strict `true` enforcement on all estimates.
