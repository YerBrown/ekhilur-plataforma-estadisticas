from flask import Blueprint, jsonify
from sqlite3 import connect
from os.path import join, dirname, exists
from datetime import datetime
from scraper.scraper_cuentas import EkhilurCuentasScraper
from utils.crypto_utils import cipher, data_cipher

# Crear el blueprint
scraper_cuentas_bp = Blueprint('scraper_cuentas', __name__)

# Credenciales cifradas
CREDENTIALS = {
    "alomorga": {
        "username": cipher.encrypt("alomorga"),
        "password": cipher.encrypt("111111")
    },
    "ilandatxe": {
        "username": cipher.encrypt("ilandatxe"),
        "password": cipher.encrypt("111111")
    },
    "fotostorres": {
        "username": cipher.encrypt("FotosTorres"),
        "password": cipher.encrypt("123456")
    }
}

@scraper_cuentas_bp.route('/cuentas/<string:username>', methods=['GET'])
def get_cuentas(username):
    """
    Endpoint para obtener los datos de las cuentas de un usuario
    """
    # Validar usuario
    if username.lower() not in CREDENTIALS:
        return jsonify({
            "status": "error",
            "message": f"Usuario {username} no válido"
        }), 400

    try:
        # Primero intentar leer del archivo JSON
        data_dir = join('scraper', 'data', 'scraper')
        json_path = join(data_dir, f'cuentas_{username}.json')

        # Si el archivo existe, devolver los datos guardados descifrados
        if exists(json_path):
            decrypted_data = data_cipher.load_encrypted_json(json_path)
            if decrypted_data:
                return jsonify({
                    "status": "success",
                    "source": "cache",
                    "data": decrypted_data
                })

        # Si no existe, hacer scraping
        scraper = EkhilurCuentasScraper()
        creds = {
            "username": cipher.decrypt(CREDENTIALS[username.lower()]["username"]),
            "password": cipher.decrypt(CREDENTIALS[username.lower()]["password"])
        }
        
        if scraper.login(creds["username"], creds["password"]):
            cuentas_data = scraper.get_cuentas_data()
            if cuentas_data:
                # Guardar los datos
                scraper.save_results(cuentas_data, username)
                return jsonify({
                    "status": "success",
                    "source": "scraping",
                    "data": cuentas_data
                })
            else:
                return jsonify({
                    "status": "error",
                    "message": "Error obteniendo datos de las cuentas"
                }), 500
        else:
            return jsonify({
                "status": "error",
                "message": "Error en el login"
            }), 500

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": "Error en el proceso",
            "details": str(e)
        }), 500

@scraper_cuentas_bp.route('/cuentas/refresh/<string:username>', methods=['GET'])
def refresh_cuentas(username):
    """
    Endpoint para forzar la actualización de los datos de las cuentas
    """
    if username.lower() not in CREDENTIALS:
        return jsonify({
            "status": "error",
            "message": f"Usuario {username} no válido"
        }), 400

    try:
        scraper = EkhilurCuentasScraper()
        creds = {
            "username": cipher.decrypt(CREDENTIALS[username.lower()]["username"]),
            "password": cipher.decrypt(CREDENTIALS[username.lower()]["password"])
        }
        
        if scraper.login(creds["username"], creds["password"]):
            cuentas_data = scraper.get_cuentas_data()
            if cuentas_data:
                # Guardar los datos
                scraper.save_results(cuentas_data, username)
                return jsonify({
                    "status": "success",
                    "message": "Datos actualizados correctamente",
                    "data": cuentas_data
                })
            else:
                return jsonify({
                    "status": "error",
                    "message": "Error obteniendo datos de las cuentas"
                }), 500
        else:
            return jsonify({
                "status": "error",
                "message": "Error en el login"
            }), 500

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": "Error en el proceso",
            "details": str(e)
        }), 500 