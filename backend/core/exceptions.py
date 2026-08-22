"""
AutoEra AI ERP — Custom Exception Handler
Standardized error responses across all API endpoints.
"""
import logging
from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
from django.core.exceptions import ValidationError as DjangoValidationError
from django.http import Http404

logger = logging.getLogger('autoera.exceptions')


def autoera_exception_handler(exc, context):
    """
    Custom exception handler that returns consistent error responses
    and logs errors with request context for debugging.
    """
    request = context.get('request')
    request_id = getattr(request, 'request_id', '') if request else ''

    # Let DRF handle it first
    response = exception_handler(exc, context)

    if response is not None:
        error_data = {
            'error': True,
            'status_code': response.status_code,
            'detail': response.data,
            'request_id': request_id,
        }
        response.data = error_data

        if response.status_code >= 500:
            logger.error(
                f"Server error: {exc}",
                extra={'request_id': request_id, 'path': getattr(request, 'path', '')},
                exc_info=True,
            )
        elif response.status_code in (401, 403):
            logger.warning(
                f"Auth error: {exc}",
                extra={'request_id': request_id, 'path': getattr(request, 'path', '')},
            )

        return response

    # Handle unhandled exceptions
    if isinstance(exc, DjangoValidationError):
        return Response(
            {'error': True, 'status_code': 400, 'detail': exc.messages, 'request_id': request_id},
            status=status.HTTP_400_BAD_REQUEST,
        )

    logger.error(
        f"Unhandled exception: {exc}",
        extra={'request_id': request_id},
        exc_info=True,
    )
    return Response(
        {'error': True, 'status_code': 500, 'detail': 'Internal server error', 'request_id': request_id},
        status=status.HTTP_500_INTERNAL_SERVER_ERROR,
    )
