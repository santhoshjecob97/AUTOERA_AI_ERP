from rest_framework import serializers
from core.serializers import TenantScopedSerializer
from .models import Invoice, Payment, FinanceApplication


class PaymentSerializer(TenantScopedSerializer):
    invoice_number = serializers.CharField(source='invoice.invoice_number', read_only=True)

    class Meta(TenantScopedSerializer.Meta):
        model = Payment
        fields = '__all__'


class InvoiceSerializer(TenantScopedSerializer):
    customer_name = serializers.CharField(source='customer.__str__', read_only=True)
    job_card_number = serializers.CharField(source='job_card.job_card_number', read_only=True)
    payments = PaymentSerializer(many=True, read_only=True)

    class Meta(TenantScopedSerializer.Meta):
        model = Invoice
        fields = '__all__'


class FinanceApplicationSerializer(TenantScopedSerializer):
    customer_name = serializers.CharField(source='customer.__str__', read_only=True)

    class Meta(TenantScopedSerializer.Meta):
        model = FinanceApplication
        fields = '__all__'


class SubventionSchemeSerializer(TenantScopedSerializer):
    class Meta(TenantScopedSerializer.Meta):
        from .models import SubventionScheme
        model = SubventionScheme
        fields = '__all__'


class NACHMandateSerializer(TenantScopedSerializer):
    class Meta(TenantScopedSerializer.Meta):
        from .models import NACHMandate
        model = NACHMandate
        fields = '__all__'

