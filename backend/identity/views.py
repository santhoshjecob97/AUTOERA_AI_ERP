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
