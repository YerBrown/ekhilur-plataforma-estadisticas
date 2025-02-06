from flask import Blueprint, jsonify
from os.path import join, dirname, exists
from os import makedirs
from datetime import datetime
from scraper.scraper_test import EkhilurScraper as EkhilurPerfilScraper
from utils.crypto_utils import cipher, data_cipher

# Crear el blueprint
scraper_perfil_bp = Blueprint('scraper_perfil', __name__)

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

@scraper_perfil_bp.route('/profile/<string:username>', methods=['GET'])
def get_profile(username):
    """
    Endpoint para obtener los datos del perfil de un usuario
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
        json_path = join(data_dir, f'perfil_{username}.json')

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
        scraper = EkhilurPerfilScraper()
        creds = {
            "username": cipher.decrypt(CREDENTIALS[username.lower()]["username"]),
            "password": cipher.decrypt(CREDENTIALS[username.lower()]["password"])
        }
        
        if scraper.login(creds["username"], creds["password"]):
            perfil_data = scraper.get_perfil_data()
            if perfil_data:
                # Guardar los datos
                scraper.save_results(perfil_data, username)
                return jsonify({
                    "status": "success",
                    "source": "scraping",
                    "data": perfil_data
                })
            else:
                return jsonify({
                    "status": "error",
                    "message": "Error obteniendo datos del perfil"
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

@scraper_perfil_bp.route('/profile/refresh/<string:username>', methods=['GET'])
def refresh_profile(username):
    """
    Endpoint para forzar la actualización de los datos del perfil
    """
    if username.lower() not in CREDENTIALS:
        return jsonify({
            "status": "error",
            "message": f"Usuario {username} no válido"
        }), 400

    try:
        scraper = EkhilurPerfilScraper()
        creds = {
            "username": cipher.decrypt(CREDENTIALS[username.lower()]["username"]),
            "password": cipher.decrypt(CREDENTIALS[username.lower()]["password"])
        }
        
        if scraper.login(creds["username"], creds["password"]):
            perfil_data = scraper.get_perfil_data()
            if perfil_data:
                # Guardar los datos
                scraper.save_results(perfil_data, username)
                return jsonify({
                    "status": "success",
                    "message": "Datos actualizados correctamente",
                    "data": perfil_data
                })
            else:
                return jsonify({
                    "status": "error",
                    "message": "Error obteniendo datos del perfil"
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