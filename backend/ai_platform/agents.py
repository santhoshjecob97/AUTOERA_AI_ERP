import re
import time
import logging
from typing import Dict, Any, List, Optional
from .gateway import gateway
from .models import AIUsageLog, PromptTemplate
from .tools import tool_registry, RiskLevel
from .rag import HybridRetriever, RAGContextBuilder

logger = logging.getLogger('autoera.agents')


class IntentRouter:
    """
    Stage 6C Intent Router: Analyzes incoming natural language queries
    and determines the optimal specialist agent and tool requirements.
    """
    SPECIALIST_ROUTING = [
        # Management queries (Highest priority)
        (['kpi', 'executive summary', 'utilization', 'efficiency', 'delayed jobs', 'daily report', 'management', 'summary', 'bottleneck', 'gross profit', 'net promoter', 'aged vehicle', 'targets', 'delayed repair', 'conversion rates', 'quote conversion', 'highest conversion', 'revenue generated'], 'Management Copilot'),
        # Insurance
        (['insurance', 'claim', 'surveyor', 'policy renewal', 'renewal', 'ncb', 'cashless', 'deductible', 'underwriting', 'zero-dep', 'zero-depreciation', 're-inspection', 'insurance policy'], 'Insurance Assistant'),
        # Sales & Showroom (placed before general payment/finance to catch vehicle bookings)
        (['showroom vehicle stock', 'vehicle stock inventory', 'immediate delivery', 'sales lead', 'new car booking', 'vehicle booking', 'book a vehicle', 'test drive', 'test-drive', 'showroom', 'booking', 'quotation', 'price list', 'on-road', 'brochure', 'discount', 'financing down payment', 'accessories', 'waiting period', 'luxury sedan', 'suv', 'top suv', 'festival offer', 'token advance', 'down payment options'], 'Sales Agent'),
        # Finance & Billing
        (['monthly gst', 'gst output', 'tax liability', 'payment refund', 'customer payment refund', 'invoice', 'payment', 'receipt', 'gst', 'outstanding', 'billing', 'balance', 'refund', 'credit period', 'credit note', 'reconciliation', 'accountant', 'tax invoice', 'authorization is required', 'partial payment'], 'Finance Assistant'),
        # Parts & Inventory
        (['compatibility of', 'ceramic brake pads', 'part number', 'part', 'parts', 'stock', 'inventory', 'reorder', 'supplier', 'spare', 'sku', 'warehouse', 'oil filter', 'spark plug', 'synthetic', 'lubricant', 'courier delivery', 'physical inventory', 'body panels'], 'Parts Agent'),
        # CRM & Customer Retention
        (['logged a grievance', 'grievance regarding', 'follow up', 'follow-up', 'followup', 'crm', 'call customer', 'customer timeline', 'reminder', 'feedback', 'retention', 'satisfaction', 'csi', 'grievance', 'interaction history', 'callback', 'lost sales', 'retention callback', 'nps', 'feedback call', 'post-service feedback'], 'CRM Agent'),
        # Service & Workshop
        (['engine overheating', 'overheating', 'warning light', 'suspension', 'lower arm', 'shock absorber', 'oil leakage', 'job card', 'job-card', 'service', 'brake', 'braking', 'technician', 'bay', 'inspection', 'maintenance', 'diagnostic', 'diagnose', 'repair', 'ac cooling', 'gas leakage', 'oil change', 'turnaround', 'periodic', 'squealing', 'vibration', 'pulling'], 'Service Advisor Agent'),
    ]

    @classmethod
    def route_agent(cls, prompt: str, user_role: str) -> str:
        prompt_lower = prompt.lower()
        if user_role in ['GENERAL_MANAGER', 'DEALER_PRINCIPAL', 'ENTERPRISE_ADMIN'] and any(w in prompt_lower for w in ['kpi', 'revenue', 'summary', 'today', 'report', 'utilization', 'bottleneck', 'margin', 'satisfaction', 'dashboard', 'overview', 'delayed', 'conversion', 'productivity']):
            return 'Management Copilot'

        best_match = None
        max_match_len = 0

        for keywords, agent_name in cls.SPECIALIST_ROUTING:
            for kw in keywords:
                if kw in prompt_lower and len(kw) > max_match_len:
                    max_match_len = len(kw)
                    best_match = agent_name

        if best_match:
            return best_match

        return 'General Copilot Agent'


class AgentSupervisor:
    """
    Stage 6C Agent Orchestrator:
    Manages dynamic tool planning, multi-step tool execution, high-risk human approval interception,
    and grounded generation with source citations.
    """

    def __init__(self):
        self.retriever = HybridRetriever()

    def plan_tools(self, prompt: str, agent_name: str, user_context: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Determines appropriate tool calls from prompt semantics and agent domain.
        """
        prompt_lower = prompt.lower()
        tools_to_run = []

        # 1. Customer Lookups
        phone_match = re.search(r'\b\d{10}\b', prompt)
        if phone_match:
            tools_to_run.append({'tool': 'get_customer', 'args': {'phone': phone_match.group(0)}})

        # 2. Vehicle / VIN / Reg Lookups
        vin_match = re.search(r'\b[A-Z0-9]{10,17}\b', prompt)
        if vin_match and 'job' not in prompt_lower:
            tools_to_run.append({'tool': 'get_vehicle', 'args': {'vin': vin_match.group(0)}})

        # 3. Job Card Lookups
        jc_match = re.search(r'\b(?:jc|job\s*card)?\s*#?\s*([A-Za-z0-9\-]+)\b', prompt, re.I)
        if 'job card' in prompt_lower or 'job' in prompt_lower or 'delayed' in prompt_lower:
            tools_to_run.append({'tool': 'get_job_card', 'args': {}})

        # 4. Inventory / Low Stock Lookups
        if any(w in prompt_lower for w in ['low stock', 'reorder', 'parts below', 'inventory level']):
            tools_to_run.append({'tool': 'get_inventory_low_stock', 'args': {}})
        elif any(w in prompt_lower for w in ['brake pad', 'oil filter', 'spark plug', 'part availability', 'parts']):
            tools_to_run.append({'tool': 'get_parts_availability', 'args': {'name': 'Brake' if 'brake' in prompt_lower else ''}})

        # 5. Knowledge Search for SOPs / Procedures
        if any(w in prompt_lower for w in ['how to', 'procedure', 'sop', 'policy', 'warranty', 'guideline', 'rule', 'what should i do']):
            tools_to_run.append({'tool': 'search_knowledge', 'args': {'query': prompt}})

        # 6. Action Proposals Interception
        if 'refund' in prompt_lower:
            tools_to_run.append({'tool': 'issue_refund', 'args': {'amount': '3000', 'reason': 'Customer requested refund'}})

        if 'approve estimate' in prompt_lower or 'approve repair' in prompt_lower:
            tools_to_run.append({'tool': 'approve_estimate', 'args': {'amount': '12500', 'reason': 'Customer consented to estimate'}})

        if 'follow up' in prompt_lower or 'schedule reminder' in prompt_lower:
            tools_to_run.append({'tool': 'create_followup', 'args': {'notes': prompt}})

        return tools_to_run[:5] # Max 5 tools per turn

    def route_and_execute(self, user_prompt: str, user_context: Dict[str, Any] = None) -> Dict[str, Any]:
        start_time = time.time()
        user_context = user_context or {}
        user_role = user_context.get('role', 'STAFF')

        # 1. Intent Routing
        assigned_agent = IntentRouter.route_agent(user_prompt, user_role)
        user_context['agent_name'] = assigned_agent

        # 2. Tool Planning
        planned_tools = self.plan_tools(user_prompt, assigned_agent, user_context)
        tool_results = []
        action_proposals = []
        citations = []

        # 3. Multi-Step Tool Execution Loop
        for plan in planned_tools:
            t_name = plan['tool']
            t_args = plan.get('args', {})
            res = tool_registry.execute(t_name, user_context, **t_args)

            if res.get('status') == 'PENDING_APPROVAL':
                action_proposals.append(res)
            elif res.get('status') == 'SUCCESS':
                tool_results.append({'tool': t_name, 'output': res})
                if 'citations' in res:
                    citations.extend(res['citations'])

        # 4. Context Assembly
        erp_context_str = ""
        if tool_results:
            erp_context_str = "\nERP TOOL EXECUTION RESULTS:\n" + "\n".join(
                f"- {item['tool']}: {item['output']}" for item in tool_results
            )

        # 5. RAG Retrieval if procedural question or Service Advisor diagnosis
        if not citations and (assigned_agent == 'Service Advisor Agent' or any(w in user_prompt.lower() for w in ['sop', 'policy', 'warranty', 'procedure', 'how', 'noise', 'what should', 'guide', 'manual'])):
            rag_matches = self.retriever.retrieve(
                query=user_prompt,
                organization_id=user_context.get('organization_id'),
                top_k=2
            )
            rag_block = RAGContextBuilder.build_context(rag_matches)
            if rag_block['has_knowledge']:
                citations.extend(rag_block['citations'])
                erp_context_str += f"\nDEALERSHIP KNOWLEDGE:\n{rag_block['context_text']}"

        # 6. LLM Synthesis
        agent_prompt = (
            f"AGENT: {assigned_agent}\n"
            f"USER QUERY: {user_prompt}\n"
            f"{erp_context_str}\n\n"
            "INSTRUCTIONS:\n"
            "Synthesize a concise, highly professional response based STRICTLY on the ERP and Knowledge data above.\n"
            "If any high-risk action proposals were created, notify the user that human authorization is required."
        )

        gateway_resp = gateway.generate_response(agent_prompt, context=user_context)
        latency_ms = int((time.time() - start_time) * 1000)

        # 7. Telemetry Logging
        try:
            org_id = user_context.get('organization_id')
            if org_id:
                AIUsageLog.objects.create(
                    organization_id=org_id,
                    branch_id=user_context.get('branch_id'),
                    user_email=user_context.get('email', user_context.get('user_name', 'staff')),
                    provider=gateway_resp.get('provider', 'gemini'),
                    model_name=gateway_resp.get('model', 'gemini-1.5-flash'),
                    agent_name=assigned_agent,
                    total_tokens=gateway_resp.get('tokens', 0),
                    latency_ms=latency_ms,
                    status=gateway_resp.get('status', 'SUCCESS'),
                    request_id=f"agent_{int(time.time())}"
                )
        except Exception as e:
            logger.error(f"Failed to record Agent AI usage: {e}")

        return {
            'agent': assigned_agent,
            'response': gateway_resp.get('response', ''),
            'tool_executions': [t['tool'] for t in tool_results],
            'action_proposals': action_proposals,
            'citations': citations,
            'requires_human_approval': len(action_proposals) > 0,
            'provider': gateway_resp.get('provider', ''),
            'model': gateway_resp.get('model', ''),
            'latency_ms': latency_ms,
            'status': gateway_resp.get('status', 'SUCCESS')
        }


supervisor = AgentSupervisor()
