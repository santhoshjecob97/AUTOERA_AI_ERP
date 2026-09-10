"""
AutoEra AI — Multi-Factor Authentication (TOTP / RFC 6238) (Section 14 — Security)

Implements:
- RFC 6238 Time-Based One-Time Password (TOTP) using standard library (hmac, hashlib, base64)
- Google Authenticator / Microsoft Authenticator provisioning URI format
- Secret generation (160-bit Base32)
- Clock drift tolerance (+/- 30s window)
- Manager role MFA enforcement
"""
import time
import hmac
import hashlib
import base64
import os
import struct
import logging
from typing import Tuple, Optional
from urllib.parse import quote

logger = logging.getLogger('autoera.identity.mfa')

# Roles that strictly require Multi-Factor Authentication
MFA_MANDATORY_ROLES = [
    'SUPER_ADMIN',
    'ENTERPRISE_ADMIN',
    'DEALER_PRINCIPAL',
    'GENERAL_MANAGER',
    'SALES_MANAGER',
    'SERVICE_MANAGER',
    'FINANCE_MANAGER',
    'PARTS_MANAGER'
]


class TOTPEngine:
    """
    Pure Python RFC 6238 / RFC 4226 TOTP generation and verification engine.
    Zero external dependencies required.
    """
    TIME_STEP_SECONDS = 30
    CODE_DIGITS = 6

    @classmethod
    def generate_secret(cls) -> str:
        """Generates a random 20-byte (160-bit) base32 secret."""
        random_bytes = os.urandom(20)
        return base64.b32encode(random_bytes).decode('utf-8').replace('=', '')

    @classmethod
    def generate_provisioning_uri(cls, secret: str, user_email: str, issuer: str = "AutoEra AI") -> str:
        """
        Builds the standard otpauth:// QR code URL for Google Authenticator / Authy.
        """
        encoded_issuer = quote(issuer)
        encoded_email = quote(user_email)
        return f"otpauth://totp/{encoded_issuer}:{encoded_email}?secret={secret}&issuer={encoded_issuer}&algorithm=SHA1&digits={cls.CODE_DIGITS}&period={cls.TIME_STEP_SECONDS}"

    @classmethod
    def compute_totp(cls, secret: str, for_time: Optional[int] = None) -> str:
        """Computes the 6-digit TOTP code for a given timestamp."""
        current_time = for_time if for_time is not None else int(time.time())
        time_counter = current_time // cls.TIME_STEP_SECONDS

        # Pad secret with '=' if necessary for base32 decoding
        padding = (8 - len(secret) % 8) % 8
        secret_padded = secret.upper() + ('=' * padding)
        key_bytes = base64.b32decode(secret_padded)

        # Pack counter into 8-byte big-endian integer (RFC 4226)
        counter_bytes = struct.pack('>Q', time_counter)

        # Compute HMAC-SHA1
        hmac_digest = hmac.new(key_bytes, counter_bytes, hashlib.sha1).digest()

        # Dynamic truncation
        offset = hmac_digest[-1] & 0x0F
        binary_code = struct.unpack('>I', hmac_digest[offset:offset + 4])[0] & 0x7FFFFFFF
        token = binary_code % (10 ** cls.CODE_DIGITS)

        return str(token).zfill(cls.CODE_DIGITS)

    @classmethod
    def verify_totp(cls, secret: str, user_code: str, window: int = 1) -> bool:
        """
        Verifies user-supplied 6-digit code against secret.
        Allows +/- 1 time step window (60s total tolerance) for clock drift.
        """
        if not secret or not user_code or len(user_code.strip()) != cls.CODE_DIGITS:
            return False

        user_code = user_code.strip()
        now = int(time.time())

        # Check current time, previous step, and next step
        for step in range(-window, window + 1):
            eval_time = now + (step * cls.TIME_STEP_SECONDS)
            expected_code = cls.compute_totp(secret, for_time=eval_time)
            if hmac.compare_digest(expected_code, user_code):
                return True

        return False

    @classmethod
    def generate_totp(cls, secret: str, for_time: Optional[int] = None) -> str:
        """Alias for compute_totp."""
        return cls.compute_totp(secret, for_time=for_time)

    @classmethod
    def is_mfa_required_for_role(cls, role: str) -> bool:
        """Checks if a user role is in the mandatory MFA tier."""
        if not role:
            return False
        normalized = str(role).upper().replace(' ', '_').replace('-', '_')
        return normalized in MFA_MANDATORY_ROLES


mfa_engine = TOTPEngine()

