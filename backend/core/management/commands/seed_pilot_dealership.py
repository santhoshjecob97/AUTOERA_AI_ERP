import uuid
from decimal import Decimal
from django.core.management.base import BaseCommand
from django.utils import timezone
from organization.models import Organization, DealerGroup, Branch, BusinessSettings, Department
from identity.models import User
from customers.models import Customer, CustomerTimeline
from vehicles.models import Vehicle, VehicleStock
from sales.models import Lead, LeadFollowUp, TestDrive, Quotation, Booking, Appointment
from service.models import JobCard, ServiceCheckIn, ServiceInspection, InspectionItem, JobCardPart, JobCardLabour
from workshop.models import WorkshopBay, Technician
from inventory.models import Part, Supplier, StockMovement, PurchaseOrder, PurchaseOrderItem
from finance.models import Invoice, Payment, FinanceApplication
from insurance.models import InsurancePolicy, InsuranceRenewal, InsuranceClaim
from ai_platform.models import KnowledgeDocument, KnowledgeChunk


class Command(BaseCommand):
    help = 'Seeds realistic multi-branch Dealership Pilot Demo dataset for AutoEra ERP Stage 6A.'

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE('Starting Dealership Pilot Dataset Seeding...'))

        # 1. Organization & Hierarchy
        org, _ = Organization.objects.get_or_create(
            slug='apex-mobility',
            defaults={'name': 'Apex Mobility Group', 'logo_url': 'https://autoera.ai/logos/apex.png'}
        )

        group, _ = DealerGroup.objects.get_or_create(
            organization=org, name='Apex Premium Cars',
            defaults={'brand': 'Hyundai & Kia'}
        )

        branch_downtown, _ = Branch.objects.get_or_create(
            dealer_group=group, code='APX-DT01',
            defaults={
                'name': 'Apex Downtown Showroom & Workshop',
                'city': 'Bangalore', 'state': 'Karnataka',
                'address': '100 Feet Road, Indiranagar',
                'phone': '+91-80-25251234', 'email': 'downtown@apexmobility.in',
                'is_main_branch': True
            }
        )

        branch_north, _ = Branch.objects.get_or_create(
            dealer_group=group, code='APX-NR02',
            defaults={
                'name': 'Apex North Hub',
                'city': 'Bangalore', 'state': 'Karnataka',
                'address': 'Bellary Road, Hebbal',
                'phone': '+91-80-29295678', 'email': 'north@apexmobility.in',
                'is_main_branch': False
            }
        )

        # Settings
        BusinessSettings.objects.get_or_create(
            organization_id=org.id, branch_id=branch_downtown.id,
            defaults={
                'dealership_name': 'Apex Mobility Indiranagar',
                'gstin': '29ABCDE1234F1Z5',
                'pan': 'ABCDE1234F',
                'default_labour_rate_per_hour': Decimal('850.00'),
                'tax_gst_percentage': Decimal('18.00')
            }
        )

        # 2. Users & Roles
        roles_to_create = [
            ('dp_apex', 'dp@apex.in', 'DEALER_PRINCIPAL', 'Vikram', 'Singhania'),
            ('gm_apex', 'gm@apex.in', 'GENERAL_MANAGER', 'Anand', 'Nambiar'),
            ('sm_apex', 'sm@apex.in', 'SERVICE_MANAGER', 'Raghav', 'Menon'),
            ('sa_apex', 'sa@apex.in', 'SERVICE_ADVISOR', 'Karthik', 'Swaminathan'),
            ('salesm_apex', 'salesm@apex.in', 'SALES_MANAGER', 'Priya', 'Sharma'),
            ('se_apex', 'se@apex.in', 'SALES_EXECUTIVE', 'Arjun', 'Reddy'),
            ('tech_apex', 'tech@apex.in', 'TECHNICIAN', 'Suresh', 'Babu'),
            ('parts_apex', 'parts@apex.in', 'PARTS_MANAGER', 'Manish', 'Gupta'),
            ('fin_apex', 'fin@apex.in', 'FINANCE_MANAGER', 'Deepak', 'Shenoy'),
            ('ins_apex', 'ins@apex.in', 'INSURANCE_MANAGER', 'Sneha', 'Patel'),
        ]

        for username, email, role, first_name, last_name in roles_to_create:
            if not User.objects.filter(username=username).exists():
                User.objects.create_user(
                    username=username, email=email, password='Password@123',
                    role=role, first_name=first_name, last_name=last_name,
                    organization=org, branch=branch_downtown
                )

        # 3. Suppliers & Parts
        supplier, _ = Supplier.objects.get_or_create(
            organization_id=org.id, branch_id=branch_downtown.id, name='Mobis Genuine Auto Parts',
            defaults={'contact_person': 'Ramesh Kumar', 'phone': '9845012345', 'email': 'orders@mobisparts.in', 'payment_terms': 'NET_30'}
        )

        sample_parts = [
            ('HY-FLT-OIL-01', 'Engine Oil Filter Cartridge', 'FILTERS', Decimal('220.00'), Decimal('450.00'), 50, 10, 'A-01'),
            ('HY-FLT-AIR-02', 'Engine Air Filter Element', 'FILTERS', Decimal('350.00'), Decimal('680.00'), 35, 8, 'A-02'),
            ('HY-BRK-PAD-F', 'Front Disc Brake Pad Set', 'BRAKES', Decimal('1200.00'), Decimal('2200.00'), 25, 5, 'B-04'),
            ('HY-BRK-PAD-R', 'Rear Disc Brake Pad Set', 'BRAKES', Decimal('950.00'), Decimal('1750.00'), 20, 5, 'B-05'),
            ('HY-BAT-45AH', '12V 45Ah Maintenance Free Battery', 'ELECTRICAL', Decimal('3800.00'), Decimal('5600.00'), 12, 3, 'C-01'),
            ('HY-OIL-SYN-5W30', 'Fully Synthetic 5W-30 Engine Oil (3.5L)', 'FLUIDS', Decimal('1400.00'), Decimal('2400.00'), 40, 10, 'D-01'),
            ('HY-WPR-BLD-SET', 'Frameless Wiper Blade Set (Front)', 'BODY', Decimal('450.00'), Decimal('950.00'), 30, 6, 'A-05'),
            ('HY-SPK-PLG-IR', 'Iridium Spark Plug Set (Pack of 4)', 'ENGINE', Decimal('1600.00'), Decimal('2800.00'), 15, 4, 'B-01'),
        ]

        for pno, pname, pcat, cost, price, stock, reorder, bin_loc in sample_parts:
            Part.objects.get_or_create(
                organization_id=org.id, branch_id=branch_downtown.id, part_number=pno,
                defaults={'name': pname, 'category': pcat, 'supplier': supplier, 'cost_price': cost, 'selling_price': price, 'stock_quantity': stock, 'reorder_level': reorder, 'bin_location': bin_loc}
            )

        # 4. Workshop Bays & Technicians
        bays_data = [
            ('Bay 1 - Express Lube', 'EXPRESS'),
            ('Bay 2 - General Repair', 'GENERAL'),
            ('Bay 3 - Diagnostics & Electrical', 'GENERAL'),
            ('Bay 4 - 3D Wheel Alignment', 'ALIGMENT'),
            ('Bay 5 - Automated Wash & Detailing', 'WASH'),
        ]
        for bname, btype in bays_data:
            WorkshopBay.objects.get_or_create(
                organization_id=org.id, branch_id=branch_downtown.id, name=bname,
                defaults={'bay_type': btype, 'is_occupied': False}
            )

        techs_data = [
            ('Suresh Babu', 'Engine & Mechanical Overhaul', Decimal('98.50')),
            ('Manoj Nair', 'Electrical & Diagnostics', Decimal('94.00')),
            ('Abdul Rahim', 'Suspension & Brakes', Decimal('96.20')),
            ('Pradeep Patil', 'Periodic Maintenance & Express', Decimal('99.00')),
        ]
        for tname, tspec, teff in techs_data:
            Technician.objects.get_or_create(
                organization_id=org.id, branch_id=branch_downtown.id, name=tname,
                defaults={'specialization': tspec, 'efficiency_rating': teff, 'is_available': True}
            )

        # 5. Vehicle Stock (Showroom Yard)
        stock_vehicles = [
            ('VINAPEX001HYCRETA', 'Hyundai', 'Creta', 'SX(O) Turbo DCT', 'Abyss Black', 'PETROL', 'DCT', 'Showroom Floor', Decimal('1650000.00'), Decimal('1950000.00'), 'AVAILABLE'),
            ('VINAPEX002HYVENUE', 'Hyundai', 'Venue', 'SX Plus MT', 'Atlas White', 'PETROL', 'MANUAL', 'Yard Bay A', Decimal('950000.00'), Decimal('1180000.00'), 'AVAILABLE'),
            ('VINAPEX003HYVERNA', 'Hyundai', 'Verna', 'SX(O) Turbo AT', 'Fiery Red', 'PETROL', 'AUTOMATIC', 'Yard Bay B', Decimal('1400000.00'), Decimal('1720000.00'), 'RESERVED'),
            ('VINAPEX004HYIONIQ', 'Hyundai', 'Ioniq 5', 'Long Range AWD', 'Gravity Gold Matte', 'EV', 'EV_DIRECT', 'Showroom Floor', Decimal('4200000.00'), Decimal('4800000.00'), 'AVAILABLE'),
            ('VINAPEX005KISELTOS', 'Kia', 'Seltos', 'GTX Plus Diesel AT', 'Imperial Blue', 'DIESEL', 'AUTOMATIC', 'Yard Bay C', Decimal('1700000.00'), Decimal('2050000.00'), 'AVAILABLE'),
        ]
        for svin, smake, smodel, svar, scolor, sfuel, strans, syard, scost, sprice, sstatus in stock_vehicles:
            VehicleStock.objects.get_or_create(
                organization_id=org.id, branch_id=branch_downtown.id, vin=svin,
                defaults={
                    'make': smake, 'model': smodel, 'variant': svar, 'color': scolor,
                    'fuel_type': sfuel, 'transmission_type': strans, 'yard_location': syard,
                    'purchase_cost': scost, 'selling_price': sprice, 'status': sstatus,
                    'arrival_date': timezone.now().date()
                }
            )

        # 6. Customers, Vehicles, Leads, and Service Job Cards
        sample_customers = [
            ('Rajesh', 'Kumar', '9845123456', 'rajesh.kumar@gmail.com', 'KA-01-MJ-9988', 'VIN9988HY001', 'Hyundai', 'Creta 1.5 SX', 2023, 24500),
            ('Ananya', 'Deshmukh', '9820198765', 'ananya.d@outlook.com', 'KA-04-NB-4422', 'VIN4422HY002', 'Hyundai', 'Venue 1.0 Turbo', 2022, 38200),
            ('Siddharth', 'Mehta', '9711456789', 'siddharth@mehtafinance.com', 'KA-05-PQ-7711', 'VIN7711HY003', 'Hyundai', 'Tucson 2.0 4WD', 2024, 11000),
            ('Kavita', 'Krishnan', '9900234567', 'kavita.k@techcorp.in', 'KA-03-ZZ-3300', 'VIN3300HY004', 'Hyundai', 'i20 N-Line DCT', 2023, 19400),
        ]

        tech_instance = Technician.objects.filter(organization_id=org.id).first()
        bay_instance = WorkshopBay.objects.filter(organization_id=org.id).first()
        part_instance = Part.objects.filter(organization_id=org.id).first()

        for idx, (cfname, clname, cphone, cemail, vreg, vvin, vmake, vmodel, vyear, vodometer) in enumerate(sample_customers, start=1):
            cust, _ = Customer.objects.get_or_create(
                organization_id=org.id, branch_id=branch_downtown.id, phone=cphone,
                defaults={'first_name': cfname, 'last_name': clname, 'email': cemail, 'city': 'Bangalore', 'state': 'Karnataka'}
            )

            veh, _ = Vehicle.objects.get_or_create(
                organization_id=org.id, branch_id=branch_downtown.id, vin=vvin,
                defaults={'customer': cust, 'registration_number': vreg, 'make': vmake, 'model': vmodel, 'year': vyear, 'odometer_reading': vodometer}
            )

            # Lead
            Lead.objects.get_or_create(
                organization_id=org.id, branch_id=branch_downtown.id, customer=cust, interested_vehicle_model=f"{vmake} {vmodel}",
                defaults={'status': 'QUALIFIED', 'source': 'WALK_IN', 'ai_score': 85, 'assigned_sales_rep': 'Arjun Reddy'}
            )

            # Job Card
            jc, _ = JobCard.objects.get_or_create(
                organization_id=org.id, branch_id=branch_downtown.id, job_card_number=f"JC-2026-00{idx}",
                defaults={
                    'customer': cust, 'vehicle': veh, 'allocated_bay': bay_instance,
                    'assigned_technician': tech_instance, 'status': 'IN_PROGRESS',
                    'customer_complaints': 'Periodic 20,000 km general service and brake inspection',
                    'diagnosis_notes': 'All fluids topped up, front brake pads replaced.'
                }
            )

            # Add part to JC
            JobCardPart.objects.get_or_create(
                organization_id=org.id, branch_id=branch_downtown.id, job_card=jc, part=part_instance,
                defaults={'quantity_requested': 1, 'quantity_issued': 1, 'unit_price': part_instance.selling_price}
            )
            # Add labour to JC
            JobCardLabour.objects.get_or_create(
                organization_id=org.id, branch_id=branch_downtown.id, job_card=jc, technician=tech_instance,
                defaults={'operation_name': 'Periodic Service & Brake Overhaul', 'standard_hours': Decimal('2.00'), 'actual_hours': Decimal('2.00'), 'hourly_rate': Decimal('850.00')}
            )
            jc.recalculate_totals()

            # Insurance Policy
            InsurancePolicy.objects.get_or_create(
                organization_id=org.id, branch_id=branch_downtown.id, policy_number=f"POL-2026-00{idx}",
                defaults={
                    'customer': cust, 'vehicle': veh, 'insurer_name': 'HDFC ERGO',
                    'policy_type': 'COMPREHENSIVE', 'premium_amount': Decimal('28500.00'),
                    'start_date': timezone.now().date(), 'expiry_date': timezone.now().date() + timezone.timedelta(days=365),
                    'status': 'ACTIVE'
                }
            )

        # 7. Knowledge Documents (RAG Foundation)
        doc, _ = KnowledgeDocument.objects.get_or_create(
            organization_id=org.id, branch_id=branch_downtown.id, title='AutoEra Dealership Workshop SOP Manual 2026',
            defaults={'document_type': 'SOP', 'version': 1, 'status': 'READY', 'total_chunks': 3, 'created_by_user': 'gm_apex'}
        )
        KnowledgeChunk.objects.get_or_create(
            organization_id=org.id, branch_id=branch_downtown.id, document=doc, chunk_index=1,
            defaults={'content_text': 'All customer vehicles must undergo a 40-point walkaround check-in and inventory scan before workshop bay allocation.', 'token_count': 22}
        )

        self.stdout.write(self.style.SUCCESS('Successfully seeded complete Dealership Pilot Demo dataset!'))
