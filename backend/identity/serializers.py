from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User


class UserSerializer(serializers.ModelSerializer):
    organization_name = serializers.CharField(source='organization.name', read_only=True)
    branch_name = serializers.CharField(source='branch.name', read_only=True)

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'role', 'phone', 'avatar_url', 'organization', 'organization_name',
            'branch', 'branch_name', 'is_active', 'date_joined'
        ]
        read_only_fields = ['id', 'date_joined']


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    password = serializers.CharField(required=True, write_only=True)

    def validate(self, attrs):
        login_identifier = attrs.get('username', '').strip()
        password = attrs.get('password')

        # Check if user passed an email address
        resolved_username = login_identifier
        if '@' in login_identifier:
            try:
                user_obj = User.objects.filter(email__iexact=login_identifier).first()
                if user_obj:
                    resolved_username = user_obj.username
            except Exception:
                pass

        user = authenticate(username=resolved_username, password=password)
        if not user and resolved_username != login_identifier:
            # Fallback to direct username authenticate if email lookup had a different username
            user = authenticate(username=login_identifier, password=password)

        if not user:
            raise serializers.ValidationError('Invalid username/email or password.')
        if not user.is_active:
            raise serializers.ValidationError('User account is disabled.')

        attrs['user'] = user
        return attrs


class PasswordChangeSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True, write_only=True)
    new_password = serializers.CharField(required=True, min_length=8, write_only=True)

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError('Current password is incorrect.')
        return value
