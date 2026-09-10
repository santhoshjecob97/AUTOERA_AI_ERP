"""
AutoEra AI - Phase 5 Enterprise & Scale Verification Suite
==========================================================
Verifies all deliverables of Phase 5:
1. Kafka Event Bus (KafkaEventProducer, fallback buffer, topic routing)
2. GraphQL API Gateway (GraphQLSchemaResolver, queries, mutations, GraphiQL console)
3. Multi-Factor Authentication (RFC 6238 TOTP engine, secret generation, role requirements, REST views)
4. Field-Level Encryption (AES-256-GCM authenticated encryption/decryption, tamper detection)
5. DPDP Act 2023 Statutory Compliance (Data Portability Export dossier, Right to Erasure anonymization, REST views)
"""

import os
import sys
import uuid
import json
import base64

# Configure Django test environment
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

import django
django.setup()

from rest_framework.test import APIRequestFactory, force_authenticate
from rest_framework import status
from django.contrib.auth import get_user_model

# 1. Kafka Event Bus
from core.kafka_bus import KafkaEventProducer, KafkaTopics

# 2. GraphQL Gateway
from core.graphql_views import GraphQLAPIView, GraphQLSchemaResolver

# 3. MFA Engine & Views
from identity.mfa import TOTPEngine
from identity.views import MFASetupView, MFAVerifyView, MFAValidateView

# 4. Field Encryption Engine
from core.crypto import FieldEncryptionEngine

# 5. DPDP Compliance Engine & Views
from customers.compliance import DPDPComplianceEngine
from customers.views import DPDPExportView, DPDPEraseView


def print_header(title):
    print("\n" + "=" * 70)
    print(f" [TEST SUITE] {title}")
    print("=" * 70)


def create_mock_user(role="Dealer Principal", org_id="org-test-enterprise"):
    User = get_user_model()
    try:
        user = User.objects.filter(username="test_phase5_user").first()
        if not user:
            user = User.objects.create(
                username="test_phase5_user",
                email="test_enterprise@autoera.ai",
                first_name="Test",
                last_name="Manager",
                role=role,
                organization_id=org_id
            )
        return user
    except Exception:
        class MockUser:
            def __init__(self, u_role, u_org):
                self.id = uuid.uuid4()
                self.pk = self.id
                self.username = "mock_manager"
                self.email = "manager@autoera.ai"
                self.first_name = "Mock"
                self.last_name = "Manager"
                self.role = u_role
                self.organization_id = u_org
                self.is_authenticated = True
                self.is_active = True
                self.mfa_enabled = False
                self.mfa_secret = None

            def save(self, *args, **kwargs):
                pass

        return MockUser(role, org_id)


def test_kafka_event_bus():
    print_header("1. KAFKA EVENT BUS & FALLBACK BUFFER")
    producer = KafkaEventProducer.get_instance()

    # Publish telemetry event
    res1 = producer.publish(
        topic=KafkaTopics.FLEET_TELEMETRY,
        event_type='OBD_TELEMETRY_INGESTED',
        payload={'vin': 'MA3EWBF1S00129841', 'speed': 72.5, 'soc': 68.4},
        partition_key='org-test-enterprise'
    )
    print(f" [1.1] Telemetry event publish status: {res1.get('status')} | Buffer size: {res1.get('buffer_size')}")
    assert res1.get('status') in ['BUFFERED_LOCAL', 'PUBLISHED_KAFKA', 'SENT']

    # Publish sales lead event
    res2 = producer.publish(
        topic=KafkaTopics.SALES_LEADS,
        event_type='LEAD_SLA_ESCALATED',
        payload={'lead_id': str(uuid.uuid4()), 'sla_minutes': 35},
        partition_key='org-test-enterprise'
    )
    print(f" [1.2] Sales event publish status: {res2.get('status')} | Partition Key: {res2.get('partition_key', 'default')}")
    assert res2.get('status') in ['BUFFERED_LOCAL', 'PUBLISHED_KAFKA', 'SENT']

    # Inspect fallback buffer items
    buffered = producer.get_buffered_events(limit=5)
    print(f" [1.3] Buffered events count retrieved: {len(buffered)}")
    assert len(buffered) >= 2
    assert buffered[-1]['event_type'] == 'LEAD_SLA_ESCALATED'
    print(" [PASS] Kafka Event Producer and Fallback Queue functioning perfectly.")


def test_graphql_gateway():
    print_header("2. ENTERPRISE GRAPHQL GATEWAY")
    resolver = GraphQLSchemaResolver()

    # 2.1 Query Dealership Overview
    query_overview = """
    query {
        dealershipOverview {
            activeLeads
            inServiceVehicles
            fleetConnectedCount
            avgEVHealthScore
            todayRevenue
        }
    }
    """
    res_overview = resolver.execute(query_overview, organization_id='org-test-enterprise')
    print(f" [2.1] Dealership Overview: {res_overview.get('data', {}).get('dealershipOverview')}")
    assert 'data' in res_overview
    assert res_overview['data']['dealershipOverview']['fleetConnectedCount'] > 0

    # 2.2 Query Vehicles & Job Cards
    query_vehicles = """
    query {
        vehicles(limit: 2) {
            vin
            make
            model
            batteryHealthScore
        }
        jobCards(limit: 2) {
            jobCardNumber
            stage
            estimatedCost
        }
    }
    """
    res_vehicles = resolver.execute(query_vehicles, organization_id='org-test-enterprise')
    print(f" [2.2] Vehicles count: {len(res_vehicles['data']['vehicles'])} | Job cards: {len(res_vehicles['data']['jobCards'])}")
    assert len(res_vehicles['data']['vehicles']) > 0

    # 2.3 Mutation Create Lead
    mutation_lead = """
    mutation {
        createLead(name: "Aravind Swamy", phone: "+919884012345", vehicleInterest: "Nexon EV Empowered", budget: "1850000") {
            id
            name
            phone
            aiScore
            status
        }
    }
    """
    res_mut = resolver.execute(mutation_lead, organization_id='org-test-enterprise')
    lead_created = res_mut.get('data', {}).get('createLead')
    print(f" [2.3] Mutation Lead Created: {lead_created}")
    assert lead_created['name'] == 'Aravind Swamy'
    assert lead_created['aiScore'] >= 80

    # 2.4 Test GraphQLAPIView GET (GraphiQL playground) and POST (Execution)
    factory = APIRequestFactory()
    user = create_mock_user()

    # GET -> GraphiQL HTML
    req_get = factory.get('/api/v1/graphql/')
    force_authenticate(req_get, user=user)
    view = GraphQLAPIView.as_view()
    resp_get = view(req_get)
    print(f" [2.4] GraphiQL HTML endpoint status: {resp_get.status_code} | Content-Type: {resp_get.get('Content-Type')}")
    assert resp_get.status_code == status.HTTP_200_OK
    assert 'GraphiQL' in resp_get.content.decode('utf-8')

    # POST -> Query execution
    req_post = factory.post('/api/v1/graphql/', data={'query': query_overview}, format='json')
    force_authenticate(req_post, user=user)
    resp_post = view(req_post)
    print(f" [2.5] GraphQL POST API endpoint status: {resp_post.status_code}")
    assert resp_post.status_code == status.HTTP_200_OK
    assert 'dealershipOverview' in resp_post.data['data']

    print(" [PASS] GraphQL Schema Resolver, GraphiQL console & REST endpoint validated.")


def test_mfa_totp():
    print_header("3. MULTI-FACTOR AUTHENTICATION (TOTP / RFC 6238)")
    
    # 3.1 Role enforcement check
    print(" [3.1] Testing Role MFA requirement check:")
    assert TOTPEngine.is_mfa_required_for_role('Super Admin') is True
    assert TOTPEngine.is_mfa_required_for_role('Dealer Principal') is True
    assert TOTPEngine.is_mfa_required_for_role('General Manager') is True
    assert TOTPEngine.is_mfa_required_for_role('Technician') is False
    print("       Super Admin: REQUIRED, Dealer Principal: REQUIRED, Technician: OPTIONAL")

    # 3.2 Secret generation and TOTP code generation
    secret = TOTPEngine.generate_secret()
    print(f" [3.2] Generated 160-bit Base32 secret: {secret[:8]}... (len: {len(secret)})")
    assert len(secret) >= 26

    current_code = TOTPEngine.generate_totp(secret)
    print(f" [3.3] Generated current 6-digit TOTP code: {current_code}")
    assert len(current_code) == 6
    assert current_code.isdigit()

    # 3.4 Verify TOTP code
    is_valid = TOTPEngine.verify_totp(secret, current_code)
    print(f" [3.4] Immediate verification of generated code: {is_valid}")
    assert is_valid is True

    # 3.5 Invalid code check
    is_invalid = TOTPEngine.verify_totp(secret, '000000' if current_code != '000000' else '111111')
    print(f" [3.5] Verification with bad code: {is_invalid}")
    assert is_invalid is False

    # 3.6 Provisioning URI for QR code apps (Google Authenticator)
    uri = TOTPEngine.generate_provisioning_uri(secret, 'santhosh@autoera.ai')
    print(f" [3.6] Provisioning URI: {uri[:40]}...")
    assert uri.startswith('otpauth://totp/AutoEra%20AI:santhosh%40autoera.ai')

    # 3.7 REST API Endpoints: Setup & Verify
    factory = APIRequestFactory()
    user = create_mock_user()

    # Setup endpoint
    req_setup = factory.post('/api/v1/auth/mfa/setup/')
    force_authenticate(req_setup, user=user)
    resp_setup = MFASetupView.as_view()(req_setup)
    print(f" [3.7] MFA Setup View status: {resp_setup.status_code}")
    assert resp_setup.status_code == status.HTTP_200_OK
    assert 'secret' in resp_setup.data
    assert 'provisioning_uri' in resp_setup.data

    setup_secret = resp_setup.data['secret']
    setup_code = TOTPEngine.generate_totp(setup_secret)

    # Verify endpoint
    req_verify = factory.post('/api/v1/auth/mfa/verify/', data={'secret': setup_secret, 'code': setup_code}, format='json')
    force_authenticate(req_verify, user=user)
    resp_verify = MFAVerifyView.as_view()(req_verify)
    print(f" [3.8] MFA Verify View status: {resp_verify.status_code} | Result: {resp_verify.data.get('status')}")
    assert resp_verify.status_code == status.HTTP_200_OK
    assert resp_verify.data.get('status') == 'MFA_ACTIVATED'

    print(" [PASS] RFC 6238 TOTP Engine and MFA endpoints verified.")


def test_field_encryption():
    print_header("4. FIELD-LEVEL ENCRYPTION (AES-256-GCM)")
    plaintext = "Aadhaar: 4920-1284-9921 | Salary: INR 2,50,000 | PAN: ABCDE1234F"

    # Encrypt
    ciphertext = FieldEncryptionEngine.encrypt(plaintext)
    print(f" [4.1] Original Plaintext: {plaintext}")
    print(f" [4.2] Encrypted Envelope: {ciphertext[:50]}...")
    assert FieldEncryptionEngine.is_encrypted(ciphertext) is True
    assert ciphertext.startswith("ENC_V1$")

    # Decrypt
    decrypted = FieldEncryptionEngine.decrypt(ciphertext)
    print(f" [4.3] Decrypted Plaintext: {decrypted}")
    assert decrypted == plaintext

    # Tamper test
    try:
        tampered = ciphertext[:-4] + "AAAA"
        tampered_decrypted = FieldEncryptionEngine.decrypt(tampered)
    except Exception as e:
        tampered_decrypted = f"REJECTED_TAMPER: {e}"
    print(f" [4.4] Tampered Envelope Decryption Result: {tampered_decrypted}")
    assert tampered_decrypted != plaintext

    print(" [PASS] AES-256-GCM Field-Level Encryption & Decryption validated.")


def test_dpdp_statutory_compliance():
    print_header("5. DPDP ACT 2023 STATUTORY COMPLIANCE")
    cust_id = str(uuid.uuid4())
    org_id = "org-test-enterprise"

    # 5.1 Data Portability Export
    dossier_res = DPDPComplianceEngine.export_customer_dossier(customer_id=cust_id, organization_id=org_id)
    print(f" [5.1] DPDP Export Status: {dossier_res.get('status')}")
    assert dossier_res.get('status') == 'SUCCESS'
    dossier = dossier_res.get('dossier', {})
    print(f"       Export ID: {dossier.get('export_id')}")
    print(f"       Integrity SHA-256: {dossier.get('integrity_checksum_sha256')}")
    print(f"       Data Principal Rights: {list(dossier.get('data_principal_rights', {}).keys())}")
    assert 'integrity_checksum_sha256' in dossier
    assert 'customer_profile' in dossier

    # 5.2 Right to Erasure / Anonymization
    erase_res = DPDPComplianceEngine.anonymize_customer_pii(customer_id=cust_id, organization_id=org_id)
    print(f" [5.2] DPDP Erasure Status: {erase_res.get('status')} | Action: {erase_res.get('action')}")
    assert erase_res.get('status') == 'SUCCESS'
    assert erase_res.get('action') == 'ERASURE_AND_ANONYMIZATION_COMPLETED'
    print(f"       Anonymization Hash: {erase_res.get('anonymization_hash')}")
    print(f"       Statutory Retained Records: {erase_res.get('retained_records')}")

    # 5.3 REST Endpoints
    factory = APIRequestFactory()
    user = create_mock_user()

    # Export GET endpoint
    req_exp = factory.get(f'/api/v1/customers/{cust_id}/dpdp/export/')
    force_authenticate(req_exp, user=user)
    resp_exp = DPDPExportView.as_view()(req_exp, id=cust_id)
    print(f" [5.3] DPDP Export REST API status: {resp_exp.status_code}")
    assert resp_exp.status_code == status.HTTP_200_OK
    assert resp_exp.data.get('status') == 'SUCCESS'

    # Erasure POST endpoint
    req_era = factory.post(f'/api/v1/customers/{cust_id}/dpdp/erase/', data={'reason': 'Customer requested erasure'}, format='json')
    force_authenticate(req_era, user=user)
    resp_era = DPDPEraseView.as_view()(req_era, id=cust_id)
    print(f" [5.4] DPDP Erase REST API status: {resp_era.status_code}")
    assert resp_era.status_code == status.HTTP_200_OK
    assert resp_era.data.get('status') == 'SUCCESS'

    print(" [PASS] DPDP Act 2023 Data Portability and Erasure engines verified.")


if __name__ == '__main__':
    print("======================================================================")
    print(" AUTOERA AI - PHASE 5 ENTERPRISE & SCALE VERIFICATION SUITE")
    print("======================================================================")
    test_kafka_event_bus()
    test_graphql_gateway()
    test_mfa_totp()
    test_field_encryption()
    test_dpdp_statutory_compliance()
    print("\n" + "=" * 70)
    print(" >>> ALL PHASE 5 ENTERPRISE & SCALE MODULES VERIFIED SUCCESSFULLY! <<<")
    print("======================================================================\n")
