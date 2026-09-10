"""
AutoEra AI ERP — Technician Skill Matrix & Automated Dispatch Engine
Master Architecture Section 06 (Service Engineering & Workshop Bay Optimization)

Technician Skill Hierarchy:
  - L1 (Periodic Service): Oil changes, filter replacements, fluid top-ups, wheel balancing, brake pads
  - L2 (Intermediate Repair): Suspension overhaul, electrical wiring, AC compressor, steering rack, clutch
  - L3 (Master / High-Voltage): Engine rebuild, automatic transmission overhaul, EV battery pack & inverter diagnostics
"""
import logging
from typing import Optional, Tuple, Dict, Any
from workshop.models import Technician
from .models import JobCard

logger = logging.getLogger('autoera.technician_assignment')


class TechnicianSkillMatrix:
    """
    Evaluates job card complexity and auto-assigns qualified technician.
    """
    TIER_RANK = {'L1': 1, 'L2': 2, 'L3': 3}

    # Keyword heuristics for skill tier classification
    L3_KEYWORDS = [
        'engine overhaul', 'engine knocking', 'transmission', 'gearbox', 'ev battery',
        'inverter', 'high voltage', 'bms fault', 'cylinder head', 'crankshaft', 'p0300'
    ]
    L2_KEYWORDS = [
        'brake shudder', 'suspension', 'strut', 'alternator', 'starter motor', 'ac cooling',
        'radiator', 'steering rack', 'abs fault', 'airbag', 'clutch slipping', 'fuel injector'
    ]

    @classmethod
    def infer_required_tier(cls, complaints: str, ai_diagnosis: Optional[Dict[str, Any]] = None) -> str:
        """Determines required technician tier L1, L2, or L3."""
        text = (complaints or '').lower()
        if ai_diagnosis:
            text += ' ' + str(ai_diagnosis.get('primary_fault', '')).lower()
            text += ' ' + str(ai_diagnosis.get('root_cause_analysis', '')).lower()

        for kw in cls.L3_KEYWORDS:
            if kw in text:
                return 'L3'

        for kw in cls.L2_KEYWORDS:
            if kw in text:
                return 'L2'

        return 'L1'

    @classmethod
    def auto_assign_technician(cls, job_card: JobCard) -> Tuple[bool, str, Optional[Technician]]:
        """
        Selects the best available technician matching or exceeding the required skill tier.
        Sorts candidates by:
          1. Lowest active load (active_jobs_count)
          2. Highest efficiency rating
        """
        required_tier = job_card.required_skill_tier or cls.infer_required_tier(
            job_card.customer_complaints, job_card.ai_diagnosis
        )
        job_card.required_skill_tier = required_tier

        # Find eligible skill tiers
        min_rank = cls.TIER_RANK.get(required_tier, 1)
        eligible_tiers = [t for t, r in cls.TIER_RANK.items() if r >= min_rank]

        # Query qualified technicians in the same branch/org
        candidates = Technician.objects.filter(
            organization_id=job_card.organization_id,
            is_available=True,
            skill_tier__in=eligible_tiers,
        )

        if job_card.branch_id:
            branch_candidates = candidates.filter(branch_id=job_card.branch_id)
            if branch_candidates.exists():
                candidates = branch_candidates

        # Filter out technicians at maximum capacity
        candidates = [t for t in candidates if t.active_jobs_count < t.max_concurrent_jobs]

        if not candidates:
            logger.warning(f"No available {required_tier}+ technician found for JobCard #{job_card.job_card_number}")
            job_card.save(update_fields=['required_skill_tier'])
            return False, f"No available technician with required skill tier {required_tier} at capacity", None

        # Best candidate: least loaded, then highest efficiency
        best_tech = min(candidates, key=lambda t: (t.active_jobs_count, -float(t.efficiency_rating)))

        # Update previous technician if reassigned
        if job_card.assigned_technician and job_card.assigned_technician != best_tech:
            prev_tech = job_card.assigned_technician
            if prev_tech.active_jobs_count > 0:
                prev_tech.active_jobs_count -= 1
                prev_tech.save(update_fields=['active_jobs_count'])

        # Assign and update counter
        job_card.assigned_technician = best_tech
        job_card.save(update_fields=['assigned_technician', 'required_skill_tier'])

        best_tech.active_jobs_count += 1
        best_tech.save(update_fields=['active_jobs_count'])

        logger.info(f"Assigned Tech {best_tech.name} ({best_tech.skill_tier}) to JobCard #{job_card.job_card_number}")
        return True, f"Assigned to {best_tech.name} ({best_tech.get_skill_tier_display()})", best_tech
