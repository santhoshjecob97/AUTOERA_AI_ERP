from rest_framework import serializers
from .models import FleetVehicle, OBDTelemetry, DriverScore, Geofence, FleetTrip, FuelTheftIncident, FleetMaintenanceCalendar


class FleetVehicleSerializer(serializers.ModelSerializer):
    vehicle_display = serializers.StringRelatedField(source='vehicle', read_only=True)
    driver_name = serializers.CharField(source='driver.get_full_name', read_only=True, default='')

    class Meta:
        model = FleetVehicle
        fields = '__all__'
        read_only_fields = ('id', 'organization_id', 'branch_id', 'created_at', 'updated_at')


class OBDTelemetrySerializer(serializers.ModelSerializer):
    class Meta:
        model = OBDTelemetry
        fields = '__all__'
        read_only_fields = ('id', 'organization_id', 'branch_id', 'created_at', 'updated_at')


class DriverScoreSerializer(serializers.ModelSerializer):
    vehicle_tag = serializers.CharField(source='fleet_vehicle.fleet_tag', read_only=True)

    class Meta:
        model = DriverScore
        fields = '__all__'
        read_only_fields = ('id', 'organization_id', 'branch_id', 'created_at', 'updated_at')


class GeofenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Geofence
        fields = '__all__'
        read_only_fields = ('id', 'organization_id', 'branch_id', 'created_at', 'updated_at')


class FleetTripSerializer(serializers.ModelSerializer):
    vehicle_tag = serializers.CharField(source='fleet_vehicle.fleet_tag', read_only=True)

    class Meta:
        model = FleetTrip
        fields = '__all__'
        read_only_fields = ('id', 'organization_id', 'branch_id', 'created_at', 'updated_at')


class FuelTheftIncidentSerializer(serializers.ModelSerializer):
    vehicle_tag = serializers.CharField(source='fleet_vehicle.fleet_tag', read_only=True)

    class Meta:
        model = FuelTheftIncident
        fields = '__all__'
        read_only_fields = ('id', 'organization_id', 'branch_id', 'created_at', 'updated_at')


class FleetMaintenanceCalendarSerializer(serializers.ModelSerializer):
    vehicle_tag = serializers.CharField(source='fleet_vehicle.fleet_tag', read_only=True)

    class Meta:
        model = FleetMaintenanceCalendar
        fields = '__all__'
        read_only_fields = ('id', 'organization_id', 'branch_id', 'created_at', 'updated_at')
