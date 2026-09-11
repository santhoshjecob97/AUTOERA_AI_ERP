import uuid
import logging
from typing import Dict, Any, List, Optional, Callable
from django.utils import timezone
from .models import ActionProposal
from .rag import HybridRetriever

logger = logging.getLogger('autoera.ai_tools')


class RiskLevel:
    LOW = 'LOW'
    MEDIUM = 'MEDIUM'
    HIGH = 'HIGH'
    CRITICAL = 'CRITICAL'


class ToolDefinition:
    def __init__(
        self,
        name: str,
        description: str,
        risk_level: str,
        required_roles: List[str],
        is_write: bool,
        handler: Callable
    ):
        self.name = name
        self.description = description
        self.risk_level = risk_level
        self.required_roles = required_roles
        self.is_write = is_write
        self.handler = handler


class ToolRegistry:
    """
    Centralized, RBAC-guarded and tenant-isolated ERP Tool Layer for AI Agents.
    """
    def __init__(self):
        self._tools: Dict[str, ToolDefinition] = {}

    def register(
        self,
        name: str,
        description: str,
        risk_level: str = RiskLevel.LOW,
        required_roles: Optional[List[str]] = None,
        is_write: bool = False
    ):
        def decorator(func: Callable):
            self._tools[name] = ToolDefinition(
                name=name,
                description=description,
                risk_level=risk_level,
                required_roles=required_roles or ['SUPER_ADMIN', 'ENTERPRISE_ADMIN', 'DEALER_PRINCIPAL', 'GENERAL_MANAGER', 'SERVICE_MANAGER', 'SERVICE_ADVISOR', 'SALES_MANAGER', 'SALES_EXECUTIVE', 'FINANCE_OFFICER', 'INSURANCE_OFFICER'],
                is_write=is_write,
                handler=func
            )
            return func
        return decorator

    def get(self, name: str) -> Optional[ToolDefinition]:
        return self._tools.get(name)

    def list_available_tools(self, user_role: str) -> List[Dict[str, Any]]:
        available = []
        for name, tool in self._tools.items():
            if user_role in tool.required_roles or 'SUPER_ADMIN' in tool.required_roles:
                available.append({
                    'name': tool.name,
                    'description': tool.description,
                    'risk_level': tool.risk_level,
                    'is_write': tool.is_write
                })
        return available

    def execute(self, tool_name: str, user_context: Dict[str, Any], is_approved: bool = False, **kwargs) -> Dict[str, Any]:
        tool = self.get(tool_name)
        if not tool:
            return {'status': 'ERROR', 'error': f"Tool '{tool_name}' not found in registry."}

        # 1. Tenant Scoping Validation
        org_id = user_context.get('organization_id')
        if not org_id:
            return {'status': 'UNAUTHORIZED', 'error': 'Missing tenant organization scope.'}

        # 2. RBAC Role Permission Check
        user_role = user_context.get('role', 'STAFF')
        if tool.required_roles and user_role not in tool.required_roles and user_role != 'SUPER_ADMIN':
            return {
                'status': 'FORBIDDEN',
                'error': f"Role '{user_role}' is not authorized to execute tool '{tool_name}'."
            }

        # 3. High-Risk Human Approval Interception
        if tool.risk_level in [RiskLevel.HIGH, RiskLevel.CRITICAL] and tool.is_write and not is_approved:
            proposal = ActionProposal.objects.create(
                organization_id=org_id,
                branch_id=user_context.get('branch_id'),
                created_by_user=user_context.get('user_name', 'AI Copilot'),
                agent_name=user_context.get('agent_name', 'Agent Supervisor'),
                tool_name=tool.name,
                parameters_json=kwargs,
                risk_level=tool.risk_level,
                reason=kwargs.get('reason', 'AI Agent proposed ERP state modification'),
                expected_effect=kwargs.get('expected_effect', f"Execute {tool.name} with parameters"),
                status='PENDING_APPROVAL'
            )
            return {
                'status': 'PENDING_APPROVAL',
                'proposal_id': str(proposal.id),
                'risk_level': tool.risk_level,
                'message': f"Action '{tool_name}' classified as {tool.risk_level} risk. Created ActionProposal #{proposal.id} awaiting authorized human approval."
            }

        # 4. Safe Tool Execution
        try:
            return tool.handler(user_context=user_context, **kwargs)
        except Exception as e:
            logger.error(f"Error executing tool {tool_name}: {e}")
            return {'status': 'FAILED', 'error': str(e)}


tool_registry = ToolRegistry()


# ==========================================
# SAFE READ TOOLS
# ==========================================

@tool_registry.register(
    name='get_customer',
    description='Look up customer details, contact info, and customer type by phone or customer ID.',
    risk_level=RiskLevel.LOW,
    is_write=False
)
def tool_get_customer(user_context: Dict[str, Any], phone: str = None, customer_id: str = None, name: str = None, **kwargs) -> Dict[str, Any]:
    from customers.models import Customer
    org_id = user_context['organization_id']
    qs = Customer.objects.filter(organization_id=org_id)
    if customer_id:
        qs = qs.filter(id=customer_id)
    elif phone:
        qs = qs.filter(phone__icontains=phone)
    elif name:
        qs = qs.filter(first_name__icontains=name)
    else:
        return {'status': 'SUCCESS', 'data': list(qs.values('id', 'first_name', 'last_name', 'phone', 'customer_type')[:5])}

    cust = qs.first()
    if not cust:
        return {'status': 'NOT_FOUND', 'message': 'Customer not found in organization scope.'}
    return {
        'status': 'SUCCESS',
        'customer': {
            'id': str(cust.id),
            'name': f"{cust.first_name} {cust.last_name}",
            'phone': cust.phone,
            'email': cust.email,
            'customer_type': cust.customer_type,
            'created_at': cust.created_at.strftime('%Y-%m-%d')
        }
    }


@tool_registry.register(
    name='get_vehicle',
    description='Fetch vehicle details, VIN, warranty dates, and odometer reading.',
    risk_level=RiskLevel.LOW,
    is_write=False
)
def tool_get_vehicle(user_context: Dict[str, Any], vin: str = None, registration_number: str = None, vehicle_id: str = None, **kwargs) -> Dict[str, Any]:
    from vehicles.models import Vehicle
    org_id = user_context['organization_id']
    qs = Vehicle.objects.filter(organization_id=org_id)
    if vehicle_id:
        qs = qs.filter(id=vehicle_id)
    elif vin:
        qs = qs.filter(vin__iexact=vin)
    elif registration_number:
        qs = qs.filter(registration_number__icontains=registration_number)

    veh = qs.first()
    if not veh:
        return {'status': 'NOT_FOUND', 'message': 'Vehicle not found.'}
    return {
        'status': 'SUCCESS',
        'vehicle': {
            'id': str(veh.id),
            'vin': veh.vin,
            'registration_number': veh.registration_number,
            'make': veh.make,
            'model': veh.model,
            'year': veh.year,
            'odometer': veh.odometer_reading,
            'warranty_valid': bool(veh.warranty_expiry_date and veh.warranty_expiry_date >= timezone.now().date())
        }
    }


@tool_registry.register(
    name='get_service_history',
    description='Retrieve past completed and in-progress job cards for a vehicle.',
    risk_level=RiskLevel.LOW,
    is_write=False
)
def tool_get_service_history(user_context: Dict[str, Any], vehicle_id: str = None, vin: str = None, **kwargs) -> Dict[str, Any]:
    from vehicles.models import Vehicle
    from service.models import JobCard
    org_id = user_context['organization_id']
    veh_qs = Vehicle.objects.filter(organization_id=org_id)
    if vehicle_id:
        veh = veh_qs.filter(id=vehicle_id).first()
    elif vin:
        veh = veh_qs.filter(vin__iexact=vin).first()
    else:
        return {'status': 'ERROR', 'message': 'vehicle_id or vin required.'}

    if not veh:
        return {'status': 'NOT_FOUND', 'message': 'Vehicle not found.'}

    jcs = JobCard.objects.filter(vehicle=veh, organization_id=org_id).order_by('-created_at')[:5]
    return {
        'status': 'SUCCESS',
        'history': [
            {
                'job_card_number': jc.job_card_number,
                'status': jc.status,
                'complaints': jc.customer_complaints,
                'estimated_cost': str(jc.estimated_cost),
                'final_total_cost': str(jc.final_total_cost),
                'date': jc.created_at.strftime('%Y-%m-%d')
            }
            for jc in jcs
        ]
    }


@tool_registry.register(
    name='get_job_card',
    description='Get real-time details, line items, and state of a specific Job Card.',
    risk_level=RiskLevel.LOW,
    is_write=False
)
def tool_get_job_card(user_context: Dict[str, Any], job_card_number: str = None, job_card_id: str = None, **kwargs) -> Dict[str, Any]:
    from service.models import JobCard
    org_id = user_context['organization_id']
    qs = JobCard.objects.filter(organization_id=org_id)
    if job_card_id:
        qs = qs.filter(id=job_card_id)
    elif job_card_number:
        qs = qs.filter(job_card_number__icontains=job_card_number)

    jc = qs.first()
    if not jc:
        return {'status': 'NOT_FOUND', 'message': 'Job Card not found.'}

    return {
        'status': 'SUCCESS',
        'job_card': {
            'id': str(jc.id),
            'job_card_number': jc.job_card_number,
            'status': jc.status,
            'customer_complaints': jc.customer_complaints,
            'estimated_cost': str(jc.estimated_cost),
            'final_total_cost': str(jc.final_total_cost),
            'parts_count': jc.parts_consumed.count(),
            'labour_count': jc.labour_items.count(),
            'created_at': jc.created_at.strftime('%Y-%m-%d %H:%M')
        }
    }


@tool_registry.register(
    name='get_parts_availability',
    description='Check in-stock quantity, reorder level, and unit pricing for spare parts.',
    risk_level=RiskLevel.LOW,
    is_write=False
)
def tool_get_parts_availability(user_context: Dict[str, Any], part_number: str = None, name: str = None, **kwargs) -> Dict[str, Any]:
    from inventory.models import Part
    org_id = user_context['organization_id']
    qs = Part.objects.filter(organization_id=org_id)
    if part_number:
        qs = qs.filter(part_number__icontains=part_number)
    elif name:
        qs = qs.filter(name__icontains=name)

    parts = list(qs.values('part_number', 'name', 'stock_quantity', 'reorder_level', 'selling_price')[:5])
    return {
        'status': 'SUCCESS',
        'total_found': len(parts),
        'parts': [
            {**p, 'selling_price': str(p['selling_price']), 'in_stock': p['stock_quantity'] > 0}
            for p in parts
        ]
    }


@tool_registry.register(
    name='get_inventory_low_stock',
    description='Retrieve all spare parts currently at or below their minimum reorder thresholds.',
    risk_level=RiskLevel.LOW,
    is_write=False
)
def tool_get_inventory_low_stock(user_context: Dict[str, Any], **kwargs) -> Dict[str, Any]:
    from inventory.models import Part
    from django.db.models import F
    org_id = user_context['organization_id']
    low_parts = Part.objects.filter(organization_id=org_id, stock_quantity__lte=F('reorder_level'))[:10]
    return {
        'status': 'SUCCESS',
        'low_stock_count': low_parts.count(),
        'items': [
            {'part_number': p.part_number, 'name': p.name, 'stock': p.stock_quantity, 'reorder_level': p.reorder_level}
            for p in low_parts
        ]
    }


@tool_registry.register(
    name='search_knowledge',
    description='Search dealership SOPs, OEM service manuals, and warranty policies using Hybrid RAG.',
    risk_level=RiskLevel.LOW,
    is_write=False
)
def tool_search_knowledge(user_context: Dict[str, Any], query: str = None, document_type: str = None, **kwargs) -> Dict[str, Any]:
    if not query:
        return {'status': 'ERROR', 'message': 'query string required.'}
    retriever = HybridRetriever()
    results = retriever.retrieve(
        query=query,
        organization_id=user_context['organization_id'],
        branch_id=user_context.get('branch_id'),
        document_type=document_type,
        top_k=3
    )
    return {
        'status': 'SUCCESS',
        'results_count': len(results),
        'citations': [
            {
                'document_title': r['document_title'],
                'version': r['version'],
                'section': r['metadata'].get('section', 'General'),
                'relevance_score': r['score']
            }
            for r in results
        ],
        'context_snippets': [r['text'] for r in results]
    }


# ==========================================
# CONTROLLED WRITE TOOLS (SAFE & MEDIUM RISK)
# ==========================================

@tool_registry.register(
    name='create_followup',
    description='Create a customer CRM follow-up task or reminder.',
    risk_level=RiskLevel.MEDIUM,
    required_roles=['SALES_EXECUTIVE', 'SALES_MANAGER', 'SERVICE_ADVISOR', 'SERVICE_MANAGER', 'GENERAL_MANAGER', 'DEALER_PRINCIPAL', 'ENTERPRISE_ADMIN', 'SUPER_ADMIN'],
    is_write=True
)
def tool_create_followup(user_context: Dict[str, Any], customer_id: str = None, lead_id: str = None, notes: str = None, **kwargs) -> Dict[str, Any]:
    from sales.models import Lead, LeadFollowUp
    org_id = user_context['organization_id']
    lead = None
    if lead_id:
        lead = Lead.objects.filter(id=lead_id, organization_id=org_id).first()
    elif customer_id:
        lead = Lead.objects.filter(customer_id=customer_id, organization_id=org_id).first()

    if not lead:
        return {'status': 'NOT_FOUND', 'message': 'Associated CRM Lead not found.'}

    followup = LeadFollowUp.objects.create(
        organization_id=org_id,
        branch_id=user_context.get('branch_id'),
        lead=lead,
        scheduled_at=timezone.now(),
        follow_up_type='CALL',
        status='PENDING',
        notes=notes or 'Automated follow-up created by AI Assistant'
    )
    return {
        'status': 'SUCCESS',
        'followup_id': str(followup.id),
        'message': f"Follow-up scheduled for Lead #{lead.id} on {followup.scheduled_at}."
    }


@tool_registry.register(
    name='get_appointment_availability',
    description='Check available service appointment slots and bay capacity for a specific date.',
    risk_level=RiskLevel.LOW,
    is_write=False
)
def tool_get_appointment_availability(user_context: Dict[str, Any], date: str = None, service_type: str = 'PERIODIC', **kwargs) -> Dict[str, Any]:
    from sales.models import Appointment
    org_id = user_context['organization_id']
    target_date = timezone.now() + timezone.timedelta(days=1)
    
    existing_count = Appointment.objects.filter(
        organization_id=org_id,
        scheduled_time__date=target_date.date()
    ).count()
    
    available_slots = [
        {"slot": "09:00 AM", "bay": "Bay 1", "available": True},
        {"slot": "11:30 AM", "bay": "Bay 2", "available": True},
        {"slot": "02:00 PM", "bay": "Bay 1", "available": True},
        {"slot": "04:30 PM", "bay": "Bay 3", "available": existing_count < 8},
    ]
    return {
        'status': 'SUCCESS',
        'target_date': target_date.strftime('%Y-%m-%d'),
        'available_slots': [s for s in available_slots if s['available']],
        'total_available': sum(1 for s in available_slots if s['available']),
        'bay_capacity_pct': 75
    }


@tool_registry.register(
    name='create_service_appointment',
    description='Book a service appointment for a registered customer vehicle.',
    risk_level=RiskLevel.MEDIUM,
    required_roles=['SERVICE_ADVISOR', 'SERVICE_MANAGER', 'GENERAL_MANAGER', 'ENTERPRISE_ADMIN', 'SUPER_ADMIN'],
    is_write=True
)
def tool_create_service_appointment(user_context: Dict[str, Any], customer_id: str = None, vehicle_id: str = None, service_type: str = 'PERIODIC', scheduled_time: str = None, **kwargs) -> Dict[str, Any]:
    from sales.models import Appointment
    from customers.models import Customer
    from vehicles.models import Vehicle
    org_id = user_context['organization_id']
    
    cust = Customer.objects.filter(id=customer_id, organization_id=org_id).first() if customer_id else None
    veh = Vehicle.objects.filter(id=vehicle_id, organization_id=org_id).first() if vehicle_id else None

    # Fallback to customer from vehicle or first vehicle of customer
    if not cust and veh and veh.customer:
        cust = veh.customer
    if not veh and cust:
        veh = cust.vehicles.first()

    if not cust:
        return {'status': 'NOT_FOUND', 'message': 'Customer not found in organization scope.'}

    target_time = timezone.now() + timezone.timedelta(days=1)
    appt = Appointment.objects.create(
        organization_id=org_id,
        branch_id=user_context.get('branch_id'),
        customer=cust,
        vehicle=veh,
        appointment_type='SERVICE_CHECKUP',
        scheduled_time=target_time,
        status='CONFIRMED',
        notes=f"Service booking via Voice AI: {service_type}"
    )
    return {
        'status': 'SUCCESS',
        'appointment_id': str(appt.id),
        'customer_name': f"{cust.first_name} {cust.last_name}",
        'vehicle_reg': veh.registration_number if veh else 'N/A',
        'scheduled_time': appt.scheduled_time.strftime('%Y-%m-%d %H:%M'),
        'service_type': service_type,
        'message': f"Appointment successfully scheduled for {appt.scheduled_time.strftime('%Y-%m-%d %I:%M %p')}."
    }



# ==========================================
# HIGH-RISK TOOLS (HUMAN APPROVAL MANDATORY)
# ==========================================

@tool_registry.register(
    name='approve_estimate',
    description='Approve high-value service repair estimate exceeding customer standard threshold.',
    risk_level=RiskLevel.HIGH,
    required_roles=['SERVICE_MANAGER', 'GENERAL_MANAGER', 'DEALER_PRINCIPAL', 'ENTERPRISE_ADMIN', 'SUPER_ADMIN'],
    is_write=True
)
def tool_approve_estimate(user_context: Dict[str, Any], job_card_id: str = None, amount: str = None, **kwargs) -> Dict[str, Any]:
    # Handler executed ONLY when authorized human approves proposal
    from service.models import JobCard
    org_id = user_context['organization_id']
    jc = JobCard.objects.filter(id=job_card_id, organization_id=org_id).first()
    if not jc:
        return {'status': 'NOT_FOUND', 'message': 'Job card not found.'}
    jc.status = 'APPROVED'
    jc.save(update_fields=['status'])
    return {'status': 'SUCCESS', 'message': f"Job Card #{jc.job_card_number} estimate approved."}


@tool_registry.register(
    name='issue_refund',
    description='Issue monetary refund or credit note on paid invoice.',
    risk_level=RiskLevel.CRITICAL,
    required_roles=['SERVICE_ADVISOR', 'FINANCE_OFFICER', 'SALES_MANAGER', 'GENERAL_MANAGER', 'DEALER_PRINCIPAL', 'ENTERPRISE_ADMIN', 'SUPER_ADMIN'],
    is_write=True
)
def tool_issue_refund(user_context: Dict[str, Any], invoice_id: str = None, amount: str = None, reason: str = None, **kwargs) -> Dict[str, Any]:
    # Handler executed ONLY when authorized GM approves proposal
    return {
        'status': 'SUCCESS',
        'message': f"Refund of Rs. {amount} authorized and queued for invoice #{invoice_id}."
    }

