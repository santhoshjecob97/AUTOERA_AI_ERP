"""
AutoEra AI — Field-Level Encryption (AES-256-GCM) (Section 14 — Security)

Implements authenticated symmetric encryption (AEAD) for sensitive customer PII:
- Aadhaar numbers
- PAN numbers
- Bank account details
- Driver license numbers

Format: `ENC_V1$<b64_iv>$<b64_tag>$<b64_ciphertext>`
"""
import os
import base64
import hashlib
import logging
from typing import Optional
from django.conf import settings
from django.db import models

logger = logging.getLogger('autoera.crypto')


class FieldEncryptionEngine:
    """
    AES-256-GCM Authenticated Encryption Engine.
    Uses cryptography.hazmat.primitives.ciphers.aead.AESGCM when available,
    with an authenticated HMAC-SHA256 fallback when the C-extension is absent.
    """
    PREFIX = "ENC_V1"
    _default_engine = None

    @classmethod
    def get_default_engine(cls):
        if cls._default_engine is None:
            cls._default_engine = cls()
        return cls._default_engine

    @classmethod
    def encrypt(cls, plaintext: str) -> str:
        return cls.get_default_engine()._encrypt_impl(plaintext)

    @classmethod
    def decrypt(cls, envelope: str) -> str:
        return cls.get_default_engine()._decrypt_impl(envelope)

    @classmethod
    def is_encrypted(cls, value: str) -> bool:
        return isinstance(value, str) and value.startswith(cls.PREFIX + "$")

    def __init__(self, secret_key: Optional[str] = None):
        raw_secret = secret_key or getattr(settings, 'FIELD_ENCRYPTION_KEY', '') or getattr(settings, 'SECRET_KEY', 'autoera-default-secret-salt-key-2026')
        # Derive 256-bit (32 byte) symmetric key using PBKDF2
        salt = b'autoera_pii_encryption_salt_v1'
        self._key = hashlib.pbkdf2_hmac('sha256', raw_secret.encode('utf-8'), salt, iterations=100000)
        self._has_cryptography = False

        try:
            from cryptography.hazmat.primitives.ciphers.aead import AESGCM
            self._aesgcm = AESGCM(self._key)
            self._has_cryptography = True
        except ImportError:
            self._has_cryptography = False
            logger.info("cryptography package not installed. Using authenticated HMAC-SHA256 envelope.")

    def _encrypt_impl(self, plaintext: str) -> str:
        """
        Encrypts plaintext string into authenticated envelope: `ENC_V1$<b64_iv>$<b64_tag>$<b64_ciphertext>`
        """
        if not plaintext:
            return plaintext

        # Do not re-encrypt already encrypted string
        if isinstance(plaintext, str) and plaintext.startswith(self.PREFIX + "$"):
            return plaintext

        data_bytes = plaintext.encode('utf-8')


        if self._has_cryptography:
            from cryptography.hazmat.primitives.ciphers.aead import AESGCM
            iv = os.urandom(12)  # 96-bit nonce for GCM
            # AESGCM.encrypt appends 16-byte authentication tag to ciphertext
            encrypted_data = self._aesgcm.encrypt(iv, data_bytes, None)
            ciphertext = encrypted_data[:-16]
            tag = encrypted_data[-16:]

            b64_iv = base64.b64encode(iv).decode('utf-8')
            b64_tag = base64.b64encode(tag).decode('utf-8')
            b64_ct = base64.b64encode(ciphertext).decode('utf-8')

            return f"{self.PREFIX}${b64_iv}${b64_tag}${b64_ct}"
        else:
            # Fallback authenticated XOR-stream + HMAC-SHA256
            iv = os.urandom(16)
            stream_key = hashlib.sha256(self._key + iv).digest()
            # Cyclic XOR
            ct_bytes = bytes(b ^ stream_key[i % len(stream_key)] for i, b in enumerate(data_bytes))
            import hmac
            tag = hmac.new(self._key, iv + ct_bytes, hashlib.sha256).digest()[:16]

            b64_iv = base64.b64encode(iv).decode('utf-8')
            b64_tag = base64.b64encode(tag).decode('utf-8')
            b64_ct = base64.b64encode(ct_bytes).decode('utf-8')

            return f"{self.PREFIX}${b64_iv}${b64_tag}${b64_ct}"

    def _decrypt_impl(self, envelope: str) -> str:
        """
        Decrypts authenticated envelope and verifies integrity tag.
        """
        if not envelope or not isinstance(envelope, str) or not envelope.startswith(self.PREFIX + "$"):
            return envelope  # Unencrypted or empty

        parts = envelope.split('$')
        if len(parts) != 4:
            logger.warning("Malformed encrypted envelope format.")
            return envelope

        _, b64_iv, b64_tag, b64_ct = parts

        try:
            iv = base64.b64decode(b64_iv)
            tag = base64.b64decode(b64_tag)
            ciphertext = base64.b64decode(b64_ct)

            if self._has_cryptography:
                encrypted_payload = ciphertext + tag
                decrypted_bytes = self._aesgcm.decrypt(iv, encrypted_payload, None)
                return decrypted_bytes.decode('utf-8')
            else:
                import hmac
                expected_tag = hmac.new(self._key, iv + ciphertext, hashlib.sha256).digest()[:16]
                if not hmac.compare_digest(tag, expected_tag):
                    raise ValueError("Authentication tag mismatch! Data corrupted or tampered.")

                stream_key = hashlib.sha256(self._key + iv).digest()
                pt_bytes = bytes(b ^ stream_key[i % len(stream_key)] for i, b in enumerate(ciphertext))
                return pt_bytes.decode('utf-8')
        except Exception as err:
            logger.error(f"Decryption failed: {err}")
            raise ValueError(f"Failed to decrypt field: {err}")


crypto_engine = FieldEncryptionEngine()


class EncryptedCharField(models.CharField):
    """
    Django model field that transparently encrypts data on write and decrypts on read.
    """
    def from_db_value(self, value, expression, connection):
        if value is None:
            return value
        return crypto_engine.decrypt(value)

    def to_python(self, value):
        if value is None:
            return value
        return crypto_engine.decrypt(value)

    def get_prep_value(self, value):
        if value is None:
            return value
        return crypto_engine.encrypt(str(value))
