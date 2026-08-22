from django.core.management.base import BaseCommand
from organization.models import Organization, DealerGroup, Branch
from customers.models import Customer
from vehicles.models import Vehicle
from sales.models import Lead, Appointment
from service.models import JobCard
from workshop.models import WorkshopBay, Technician
from inventory.models import Part
from finance.models import Invoice, Payment
import uuid

class Command(BaseCommand):
    help = 'Seeds initial ERP demonstration data for AutoEra AI'

    def handle(self, *args, **options):
        self.stdout.write('Seeding AutoEra ERP Data...')

        # 1. Organization & Branch
        org, _ = Organization.objects.get_or_create(
            slug='autoera-motors',
            defaults={'name': 'AutoEra Motors Group'}
        )
        group, _ = DealerGroup.objects.get_or_create(
            organization=org,
            name='AutoEra South',
            defaults={'brand': 'Multi-Brand'}
        )
        branch, _ = Branch.objects.get_or_create(
            dealer_group=group,
            code='BLR01',
            defaults={'name': 'Bangalore Flagship', 'city': 'Bangalore', 'state': 'Karnataka'}
        )

        org_id = org.id
        branch_id = branch.id

        # 2. Customers
        c1, _ = Customer.objects.get_or_create(
            phone='9876543210',
            defaults={
                'organization_id': org_id, 'branch_id': branch_id,
                'first_name': 'Rahul', 'last_name': 'Sharma', 'email': 'rahul.sharma@example.com',
                'city': 'Bangalore', 'state': 'Karnataka'
            }
        )
        c2, _ = Customer.objects.get_or_create(
            phone='9876543211',
            defaults={
                'organization_id': org_id, 'branch_id': branch_id,
                'first_name': 'Priya', 'last_name': 'Patel', 'email': 'priya.patel@example.com',
                'city': 'Bangalore', 'state': 'Karnataka'
            }
        )

        # 3. Vehicles
        v1, _ = Vehicle.objects.get_or_create(
            vin='MA3EYD11S00123456',
            defaults={
                'organization_id': org_id, 'branch_id': branch_id,
                'customer': c1, 'registration_number': 'KA-01-MJ-1234',
                'make': 'Hyundai', 'model': 'Creta', 'year': 2023, 'fuel_type': 'PETROL'
            }
        )
        v2, _ = Vehicle.objects.get_or_create(
            vin='MB3EYD11S00654321',
            defaults={
                'organization_id': org_id, 'branch_id': branch_id,
                'customer': c2, 'registration_number': 'KA-05-MM-5678',
                'make': 'Tata', 'model': 'Nexon EV', 'year': 2024, 'fuel_type': 'EV'
            }
        )

        # 4. Job Cards
        j1, _ = JobCard.objects.get_or_create(
            job_card_number='JC-2026-001',
            defaults={
                'organization_id': org_id, 'branch_id': branch_id,
                'customer': c1, 'vehicle': v1, 'status': 'IN_PROGRESS',
                'customer_complaints': 'Periodic 10,000 KM service, brake noise check',
                'estimated_cost': 4500.00
            }
        )

        # 5. Workshop Bays & Technicians
        b1, _ = WorkshopBay.objects.get_or_create(
            name='Bay 1 (General Service)',
            defaults={'organization_id': org_id, 'branch_id': branch_id, 'bay_type': 'GENERAL', 'is_occupied': True, 'current_job_card': j1}
        )
        t1, _ = Technician.objects.get_or_create(
            name='Amit Kumar',
            defaults={'organization_id': org_id, 'branch_id': branch_id, 'specialization': 'Brake & Engine Systems'}
        )

        # 6. Inventory Parts
        p1, _ = Part.objects.get_or_create(
            part_number='OIL-FIL-HYU-01',
            defaults={'organization_id': org_id, 'branch_id': branch_id, 'name': 'Engine Oil Filter', 'cost_price': 250.00, 'selling_price': 450.00, 'stock_quantity': 45}
        )

        self.stdout.write(self.style.SUCCESS('Successfully seeded AutoEra ERP demonstration data!'))
