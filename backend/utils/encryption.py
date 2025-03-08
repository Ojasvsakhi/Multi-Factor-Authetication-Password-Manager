from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
import base64
import os

class PasswordEncryption:
    @staticmethod
    def generate_key(master_password: str, salt: bytes = None) -> tuple[bytes, bytes]:
        """Generate an encryption key from master password using PBKDF2"""
        if not salt:
            salt = os.urandom(16)
        
        kdf = PBKDF2HMAC(
            algorithm=hashes.SHA256(),
            length=32,
            salt=salt,
            iterations=100000,
        )
        
        key = base64.urlsafe_b64encode(kdf.derive(master_password.encode()))
        return key, salt

    @staticmethod
    def encrypt_password(password: str, encryption_key: bytes) -> str:
        """Encrypt a password using Fernet symmetric encryption"""
        f = Fernet(encryption_key)
        encrypted_data = f.encrypt(password.encode())
        return base64.urlsafe_b64encode(encrypted_data).decode()

    @staticmethod
    def decrypt_password(encrypted_password: str, encryption_key: bytes) -> str:
        """Decrypt a password using Fernet symmetric encryption"""
        f = Fernet(encryption_key)
        decrypted_data = f.decrypt(base64.urlsafe_b64decode(encrypted_password.encode()))
        return decrypted_data.decode()