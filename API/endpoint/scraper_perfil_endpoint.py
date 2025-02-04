from flask import Blueprint, jsonify
import os
import json
from scraper.scraper_test import EkhilurScraper

# Crear el blueprint
scraper_perfil_bp = Blueprint('scraper_perfil', __name__)

# Credenciales de usuarios
CREDENTIALS = {
    "alomorga": {"username": "alomorga", "password": "111111"},
    "ilandatxe": {"username": "ilandatxe", "password": "111111"},
    "fotostorres": {"username": "FotosTorres", "password": "123456"}
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
        data_dir = os.path.join('scraper', 'data', 'scraper')
        json_path = os.path.join(data_dir, f'profile_{username}.json')

        # Si el archivo existe, devolver los datos guardados
        if os.path.exists(json_path):
            with open(json_path, 'r', encoding='utf-8') as f:
                profile_data = json.load(f)
                return jsonify({
                    "status": "success",
                    "source": "cache",
                    "data": profile_data
                })

        # Si no existe, hacer scraping
        scraper = EkhilurScraper()
        creds = CREDENTIALS[username.lower()]
        
        if scraper.login(creds["username"], creds["password"]):
            profile_data = scraper.get_profile_data()
            if profile_data:
                # Guardar los datos
                scraper.save_results(profile_data, username)
                return jsonify({
                    "status": "success",
                    "source": "scraping",
                    "data": profile_data
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
        scraper = EkhilurScraper()
        creds = CREDENTIALS[username.lower()]
        
        if scraper.login(creds["username"], creds["password"]):
            profile_data = scraper.get_profile_data()
            if profile_data:
                # Guardar los datos
                scraper.save_results(profile_data, username)
                return jsonify({
                    "status": "success",
                    "message": "Datos actualizados correctamente",
                    "data": profile_data
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