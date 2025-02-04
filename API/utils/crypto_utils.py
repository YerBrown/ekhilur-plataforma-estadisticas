from cryptography.fernet import Fernet
import os
import base64
import json
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC

class CredentialsCipher:
    def __init__(self):
        self.key = os.getenv('MASTER_KEY')
        if not self.key:
            kdf = PBKDF2HMAC(
                algorithm=hashes.SHA256(),
                length=32,
                salt=b'ekhilur_salt',
                iterations=100000,
            )
            self.key = base64.urlsafe_b64encode(kdf.derive(b'ekhilur_secret_key'))
            
        self.cipher_suite = Fernet(self.key)

    def encrypt(self, text):
        """Cifra un texto"""
        return self.cipher_suite.encrypt(text.encode()).decode()

    def decrypt(self, encrypted_text):
        """Descifra un texto"""
        return self.cipher_suite.decrypt(encrypted_text.encode()).decode()

class DataCipher:
    def __init__(self):
        # Usar una clave maestra del entorno o generarla
        self.key = os.getenv('MASTER_KEY')
        if not self.key:
            kdf = PBKDF2HMAC(
                algorithm=hashes.SHA256(),
                length=32,
                salt=b'ekhilur_salt',
                iterations=100000,
            )
            self.key = base64.urlsafe_b64encode(kdf.derive(b'ekhilur_secret_key'))
            
        self.cipher_suite = Fernet(self.key)

    def encrypt_data(self, data):
        """Cifra cualquier dato serializable"""
        if isinstance(data, (dict, list)):
            data = json.dumps(data)
        return self.cipher_suite.encrypt(str(data).encode()).decode()

    def decrypt_data(self, encrypted_data):
        """Descifra datos"""
        try:
            decrypted = self.cipher_suite.decrypt(encrypted_data.encode()).decode()
            try:
                return json.loads(decrypted)
            except:
                return decrypted
        except:
            return None

    def save_encrypted_json(self, data, filepath):
        """Guarda datos cifrados en un archivo JSON"""
        encrypted_data = self.encrypt_data(data)
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump({"encrypted_data": encrypted_data}, f)

    def load_encrypted_json(self, filepath):
        """Carga y descifra datos de un archivo JSON"""
        if os.path.exists(filepath):
            with open(filepath, 'r', encoding='utf-8') as f:
                data = json.load(f)
                if "encrypted_data" in data:
                    return self.decrypt_data(data["encrypted_data"])
        return None

# Instancias globales
cipher = CredentialsCipher()
data_cipher = DataCipher() 