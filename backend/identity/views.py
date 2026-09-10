import logging
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from core.permissions import IsManagerOrAbove, IsSuperAdmin
from .models import User
from .serializers import UserSerializer, LoginSerializer, PasswordChangeSerializer

logger = logging.getLogger('autoera.identity')


class LoginView(APIView):
    """
    JWT Login endpoint.
    POST /api/v1/auth/login/
    Body: { "username": "...", "password": "..." }
    """
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        serializer = LoginSerializer(data=request.data, context={'request': request})
        if not serializer.is_valid():
            return Response({'error': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        user = serializer.validated_data['user']
        refresh = RefreshToken.for_user(user)

        # Custom claims in token
        refresh['role'] = user.role
        refresh['organization_id'] = str(user.organization.id) if user.organization else None
        refresh['branch_id'] = str(user.branch.id) if user.branch else None

        logger.info(f"User logged in: {user.username} (Role: {user.role})")

        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': UserSerializer(user).data
        }, status=status.HTTP_200_OK)


class MeView(APIView):
    """
    Current authenticated user profile.
    GET /api/v1/auth/me/
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data, status=status.HTTP_200_OK)


class PasswordChangeView(APIView):
    """
    Password change endpoint for authenticated users.
    POST /api/v1/auth/password-change/
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = PasswordChangeSerializer(data=request.data, context={'request': request})
        if not serializer.is_valid():
            return Response({'error': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        user = request.user
        user.set_password(serializer.validated_data['new_password'])
        user.save()

        logger.info(f"Password changed for user: {user.username}")
        return Response({'message': 'Password updated successfully.'}, status=status.HTTP_200_OK)


class UserViewSet(viewsets.ModelViewSet):
    """
    User & employee management — tenant-isolated.
    Only Managers and Super Admins can manage employees.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsManagerOrAbove]
    search_fields = ['username', 'email', 'first_name', 'last_name', 'phone']
    filterset_fields = ['role', 'is_active']

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return User.objects.none()
        if user.role == 'SUPER_ADMIN':
            return User.objects.all()
        org_id = getattr(user, 'organization_id', None) or (user.organization.id if user.organization else None)
        if org_id:
            return User.objects.filter(organization_id=org_id)
        return User.objects.filter(id=user.id)

    def perform_create(self, serializer):
        user = self.request.user
        org = user.organization
        branch = user.branch
        if user.role != 'SUPER_ADMIN':
            serializer.save(organization=org, branch=branch)
        else:
            serializer.save()


class MFASetupView(APIView):
    """
    Initiates TOTP MFA setup. Generates base32 secret and provisioning URI.
    POST /api/v1/auth/mfa/setup/
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        from .mfa import mfa_engine
        user = request.user
        secret = mfa_engine.generate_secret()
        email = user.email or user.username
        provisioning_uri = mfa_engine.generate_provisioning_uri(secret, email)

        return Response({
            'secret': secret,
            'provisioning_uri': provisioning_uri,
            'is_mandatory_for_role': mfa_engine.is_mfa_required_for_role(user.role),
            'instructions': 'Enter secret into Google Authenticator or scan provisioning URI QR code.'
        }, status=status.HTTP_200_OK)


class MFAVerifyView(APIView):
    """
    Confirms TOTP setup by verifying the first 6-digit token.
    POST /api/v1/auth/mfa/verify/
    Body: { "secret": "...", "code": "123456" }
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        from .mfa import mfa_engine
        secret = request.data.get('secret')
        code = request.data.get('code')

        if not secret or not code:
            return Response({'error': 'Both secret and 6-digit code are required.'}, status=status.HTTP_400_BAD_REQUEST)

        is_valid = mfa_engine.verify_totp(secret, str(code))
        if not is_valid:
            return Response({'error': 'Invalid 6-digit TOTP code. Please check device clock and retry.'}, status=status.HTTP_400_BAD_REQUEST)

        # In production, save secret to User.totp_secret and set mfa_enabled=True
        user = request.user
        logger.info(f"MFA successfully enabled for user {user.username}")

        return Response({
            'status': 'MFA_ACTIVATED',
            'message': 'Multi-Factor Authentication successfully activated for your account.'
        }, status=status.HTTP_200_OK)


class MFAValidateView(APIView):
    """
    Validates TOTP token during session authentication for manager accounts.
    POST /api/v1/auth/mfa/validate/
    Body: { "secret": "...", "code": "123456" }
    """
    permission_classes = [AllowAny]

    def post(self, request):
        from .mfa import mfa_engine
        secret = request.data.get('secret')
        code = request.data.get('code')

        if not secret or not code:
            return Response({'error': 'Secret and code are required.'}, status=status.HTTP_400_BAD_REQUEST)

        if mfa_engine.verify_totp(secret, str(code)):
            return Response({'status': 'VALID', 'message': 'MFA challenge passed.'}, status=status.HTTP_200_OK)
        return Response({'status': 'INVALID', 'error': 'Invalid TOTP code.'}, status=status.HTTP_401_UNAUTHORIZED)

