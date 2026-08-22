#!/usr/bin/env python3
"""
AutoEra Voice AI Testing Dataset Processor
==========================================

This script processes the voice AI test dataset and simulates bulk calling campaigns.
It demonstrates how to:
1. Load customer data from CSV
2. Segment customers by priority and type
3. Simulate voice AI calling campaigns
4. Track metrics and results
5. Generate reports

Usage:
    python voice_ai_dataset_processor.py --csv voice_ai_complete_test_dataset.csv --campaign morning
"""

import csv
import json
import random
import argparse
from datetime import datetime, timedelta
from typing import List, Dict, Any
from dataclasses import dataclass, asdict
from enum import Enum

class CustomerSegment(Enum):
    VIP = "VIP"
    REGULAR = "Regular"
    NEW = "New"

class CommunicationPreference(Enum):
    SMS = "SMS"
    WHATSAPP = "WhatsApp"
    EMAIL = "Email"

@dataclass
class Customer:
    id: str
    customer_name: str
    phone: str
    email: str
    vehicle_make: str
    vehicle_model: str
    vehicle_year: int
    registration_number: str
    service_type: str
    last_service_date: str
    next_service_due: str
    communication_preference: CommunicationPreference
    is_repeat_customer: bool
    loyalty_points: int
    customer_segment: CustomerSegment
    preferred_language: str
    location_city: str
    location_area: str
    emergency_contact: str
    preferred_time_slots: str
    vehicle_condition_notes: str
    service_history_count: int
    last_service_feedback: str

    # Simulation fields
    call_attempted: bool = False
    call_answered: bool = False
    appointment_booked: bool = False
    communication_sent: bool = False
    satisfaction_score: int = 0
    call_duration: int = 0
    notes: str = ""

class VoiceAICampaign:
    def __init__(self, campaign_name: str):
        self.campaign_name = campaign_name
        self.customers: List[Customer] = []
        self.start_time = datetime.now()
        self.metrics = {
            'total_calls': 0,
            'calls_answered': 0,
            'appointments_booked': 0,
            'communications_sent': 0,
            'average_satisfaction': 0.0,
            'average_call_duration': 0.0,
            'success_rate': 0.0
        }

    def add_customer(self, customer: Customer):
        self.customers.append(customer)

    def simulate_campaign(self):
        """Simulate the voice AI calling campaign"""
        print(f"\n🚀 Starting {self.campaign_name} Campaign")
        print(f"📞 Total customers to call: {len(self.customers)}")

        for customer in self.customers:
            self._simulate_customer_call(customer)

        self._calculate_metrics()
        self._generate_report()

    def _simulate_customer_call(self, customer: Customer):
        """Simulate calling a single customer"""
        customer.call_attempted = True
        self.metrics['total_calls'] += 1

        # Simulate call answer probability (based on customer segment)
        answer_probability = {
            CustomerSegment.VIP: 0.85,
            CustomerSegment.REGULAR: 0.75,
            CustomerSegment.NEW: 0.60
        }

        if random.random() < answer_probability[customer.customer_segment]:
            customer.call_answered = True
            self.metrics['calls_answered'] += 1

            # Simulate conversation and booking
            self._simulate_conversation(customer)

            # Simulate communication sending
            customer.communication_sent = True
            self.metrics['communications_sent'] += 1

        print(f"📞 Called {customer.customer_name} ({customer.phone}): {'✅ Answered' if customer.call_answered else '❌ No Answer'}")

    def _simulate_conversation(self, customer: Customer):
        """Simulate AI conversation based on customer type"""
        base_success_rate = {
            CustomerSegment.VIP: 0.80,
            CustomerSegment.REGULAR: 0.70,
            CustomerSegment.NEW: 0.55
        }

        # Simulate call duration (2-8 minutes)
        customer.call_duration = random.randint(120, 480)
        self.metrics['average_call_duration'] = (
            (self.metrics['average_call_duration'] * (self.metrics['calls_answered'] - 1)) +
            customer.call_duration
        ) / self.metrics['calls_answered']

        # Simulate booking success
        if random.random() < base_success_rate[customer.customer_segment]:
            customer.appointment_booked = True
            self.metrics['appointments_booked'] += 1

            # Simulate satisfaction score (3-5 stars)
            customer.satisfaction_score = random.randint(3, 5)
            self.metrics['average_satisfaction'] = (
                (self.metrics['average_satisfaction'] * (self.metrics['appointments_booked'] - 1)) +
                customer.satisfaction_score
            ) / self.metrics['appointments_booked']

            customer.notes = f"Successfully booked {customer.service_type} for {customer.vehicle_make} {customer.vehicle_model}"
        else:
            customer.satisfaction_score = random.randint(1, 4)
            customer.notes = f"Call completed but no booking - {customer.last_service_feedback}"

    def _calculate_metrics(self):
        """Calculate final campaign metrics"""
        if self.metrics['total_calls'] > 0:
            self.metrics['success_rate'] = (self.metrics['appointments_booked'] / self.metrics['total_calls']) * 100

    def _generate_report(self):
        """Generate campaign report"""
        print(f"\n📊 {self.campaign_name} Campaign Results")
        print("=" * 50)
        print(f"Total Calls Made: {self.metrics['total_calls']}")
        print(f"Calls Answered: {self.metrics['calls_answered']} ({self.metrics['calls_answered']/self.metrics['total_calls']*100:.1f}%)")
        print(f"Appointments Booked: {self.metrics['appointments_booked']} ({self.metrics['success_rate']:.1f}%)")
        print(f"Communications Sent: {self.metrics['communications_sent']}")
        print(f"Average Satisfaction: {self.metrics['average_satisfaction']:.1f}/5.0")
        print(f"Average Call Duration: {self.metrics['average_call_duration']/60:.1f} minutes")
        print(f"Campaign Duration: {(datetime.now() - self.start_time).total_seconds()/60:.1f} minutes")

def load_customers_from_csv(csv_file: str) -> List[Customer]:
    """Load customer data from CSV file"""
    customers = []

    with open(csv_file, 'r', encoding='utf-8') as file:
        reader = csv.DictReader(file)

        for row in reader:
            try:
                customer = Customer(
                    id=row['id'],
                    customer_name=row['customer_name'],
                    phone=row['phone'],
                    email=row['email'],
                    vehicle_make=row['vehicle_make'],
                    vehicle_model=row['vehicle_model'],
                    vehicle_year=int(row['vehicle_year']),
                    registration_number=row['registration_number'],
                    service_type=row['service_type'],
                    last_service_date=row['last_service_date'],
                    next_service_due=row['next_service_due'],
                    communication_preference=CommunicationPreference(row['communication_preference']),
                    is_repeat_customer=row['is_repeat_customer'].lower() == 'true',
                    loyalty_points=int(row['loyalty_points']),
                    customer_segment=CustomerSegment(row['customer_segment']),
                    preferred_language=row['preferred_language'],
                    location_city=row['location_city'],
                    location_area=row['location_area'],
                    emergency_contact=row['emergency_contact'],
                    preferred_time_slots=row['preferred_time_slots'],
                    vehicle_condition_notes=row['vehicle_condition_notes'],
                    service_history_count=int(row['service_history_count']),
                    last_service_feedback=row['last_service_feedback']
                )
                customers.append(customer)
            except (KeyError, ValueError) as e:
                print(f"Error parsing customer {row.get('id', 'unknown')}: {e}")
                continue

    return customers

def segment_customers_by_campaign(customers: List[Customer], campaign_type: str) -> List[Customer]:
    """Segment customers based on campaign type and preferences"""

    if campaign_type == 'morning':
        # Morning campaign: 9 AM - 12 PM slots
        return [c for c in customers if 'Morning' in c.preferred_time_slots or '9-12' in c.preferred_time_slots]
    elif campaign_type == 'afternoon':
        # Afternoon campaign: 2 PM - 5 PM slots
        return [c for c in customers if 'Afternoon' in c.preferred_time_slots or '2-5' in c.preferred_time_slots]
    elif campaign_type == 'evening':
        # Evening campaign: 4 PM - 7 PM slots
        return [c for c in customers if 'Evening' in c.preferred_time_slots or '4-7' in c.preferred_time_slots]
    elif campaign_type == 'vip':
        # VIP customers only
        return [c for c in customers if c.customer_segment == CustomerSegment.VIP]
    elif campaign_type == 'emergency':
        # High priority customers (recent service needed)
        return [c for c in customers if c.service_history_count < 3 or not c.is_repeat_customer]
    else:
        return customers

def save_campaign_results(campaign: VoiceAICampaign, output_file: str):
    """Save campaign results to JSON file"""
    results = {
        'campaign_name': campaign.campaign_name,
        'timestamp': datetime.now().isoformat(),
        'metrics': campaign.metrics,
        'customers': [asdict(customer) for customer in campaign.customers]
    }

    with open(output_file, 'w', encoding='utf-8') as file:
        json.dump(results, file, indent=2, ensure_ascii=False)

    print(f"\n💾 Results saved to {output_file}")

def main():
    parser = argparse.ArgumentParser(description='AutoEra Voice AI Testing Dataset Processor')
    parser.add_argument('--csv', required=True, help='Path to CSV dataset file')
    parser.add_argument('--campaign', default='all', choices=['morning', 'afternoon', 'evening', 'vip', 'emergency', 'all'],
                       help='Type of campaign to run')
    parser.add_argument('--output', default='campaign_results.json', help='Output file for results')

    args = parser.parse_args()

    # Load customer data
    print(f"📂 Loading customer data from {args.csv}")
    customers = load_customers_from_csv(args.csv)
    print(f"✅ Loaded {len(customers)} customers")

    # Segment customers
    segmented_customers = segment_customers_by_campaign(customers, args.campaign)

    # Create campaign
    campaign_name = f"{args.campaign.title()} Campaign ({len(segmented_customers)} customers)"
    campaign = VoiceAICampaign(campaign_name)

    # Add customers to campaign
    for customer in segmented_customers:
        campaign.add_customer(customer)

    # Run campaign simulation
    campaign.simulate_campaign()

    # Save results
    save_campaign_results(campaign, args.output)

if __name__ == '__main__':
    main()
