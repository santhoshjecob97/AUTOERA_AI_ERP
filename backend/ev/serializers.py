from rest_framework import serializers
from .models import (
    EVBatteryData, ChargingSession, BatteryHealthScore,
    EVRangeAlert, BatteryReplacementPlan
)


class EVBatteryDataSerializer(serializers.ModelSerializer):
    vehicle_display = serializers.StringRelatedField(source='vehicle', read_only=True)

    class Meta:
        model = EVBatteryData
        fields = '__all__'
        read_only_fields = ('id', 'organization_id', 'branch_id', 'created_at', 'updated_at')


class ChargingSessionSerializer(serializers.ModelSerializer):
    vehicle_display = serializers.StringRelatedField(source='vehicle', read_only=True)

    class Meta:
        model = ChargingSession
        fields = '__all__'
        read_only_fields = ('id', 'organization_id', 'branch_id', 'created_at', 'updated_at')


class BatteryHealthScoreSerializer(serializers.ModelSerializer):
    vehicle_display = serializers.StringRelatedField(source='vehicle', read_only=True)

    class Meta:
        model = BatteryHealthScore
        fields = '__all__'
        read_only_fields = ('id', 'organization_id', 'branch_id', 'created_at', 'updated_at')


class EVRangeAlertSerializer(serializers.ModelSerializer):
    vehicle_display = serializers.StringRelatedField(source='vehicle', read_only=True)

    class Meta:
        model = EVRangeAlert
        fields = '__all__'
        read_only_fields = ('id', 'organization_id', 'branch_id', 'created_at', 'updated_at')


class BatteryReplacementPlanSerializer(serializers.ModelSerializer):
    vehicle_display = serializers.StringRelatedField(source='vehicle', read_only=True)

    class Meta:
        model = BatteryReplacementPlan
        fields = '__all__'
        read_only_fields = ('id', 'organization_id', 'branch_id', 'created_at', 'updated_at')

