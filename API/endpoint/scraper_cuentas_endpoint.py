from flask import Blueprint, jsonify
import os
import json
from scraper.scraper_cuentas import EkhilurCuentasScraper

# Crear el blueprint
scraper_cuentas_bp = Blueprint('scraper_cuentas', __name__)

# Credenciales de usuarios
CREDENTIALS = {
    "alomorga": {"username": "alomorga", "password": "111111"},
    "ilandatxe": {"username": "ilandatxe", "password": "111111"},
    "fotostorres": {"username": "FotosTorres", "password": "123456"}
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
        data_dir = os.path.join('scraper', 'data', 'scraper')
        json_path = os.path.join(data_dir, f'cuentas_{username}.json')

        # Si el archivo existe, devolver los datos guardados
        if os.path.exists(json_path):
            with open(json_path, 'r', encoding='utf-8') as f:
                cuentas_data = json.load(f)
                return jsonify({
                    "status": "success",
                    "source": "cache",
                    "data": cuentas_data
                })

        # Si no existe, hacer scraping
        scraper = EkhilurCuentasScraper()
        creds = CREDENTIALS[username.lower()]
        
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
        creds = CREDENTIALS[username.lower()]
        
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