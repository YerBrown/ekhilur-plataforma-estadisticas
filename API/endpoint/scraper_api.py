from flask import Blueprint, jsonify, current_app
from datetime import datetime
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright
import threading
from functools import wraps
import time

# Añadir el directorio raíz al path
sys.path.append(str(Path(__file__).parent.parent))
from scraper.scraper_auto import AutoScraper

scraper_bp = Blueprint('scraper', __name__)
scraper = AutoScraper()

def disable_reloader(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        # Guardar el estado actual del reloader
        current_reloader = current_app.config.get('USE_RELOADER', None)
        # Deshabilitar el reloader temporalmente
        current_app.config['USE_RELOADER'] = False
        try:
            return f(*args, **kwargs)
        finally:
            # Restaurar el estado original del reloader
            current_app.config['USE_RELOADER'] = current_reloader
    return wrapper

def log_progress(message, username=None):
    """Función para mostrar el progreso con timestamp"""
    timestamp = datetime.now().strftime("%H:%M:%S")
    if username:
        print(f"[{timestamp}] {username}: {message}")
    else:
        print(f"[{timestamp}] {message}")

@scraper_bp.route('/api/scraper/all')
@disable_reloader
def scrape_all_users(fecha_inicio: str = "01/01/2020"):
    """
    Extrae datos de todos los usuarios desde una fecha inicial hasta hoy
    """
    try:
        start_time = time.time()
        log_progress("Iniciando extracción de datos para todos los usuarios")
        
        fecha_fin = datetime.now().strftime("%d/%m/%Y")
        log_progress(f"Rango de fechas: {fecha_inicio} - {fecha_fin}")
        
        # Cargar categorías
        categories = scraper.load_categories()
        log_progress(f"Categorías cargadas: {len(categories)}")
        
        results = {}
        total_records = 0
        
        with sync_playwright() as p:
            log_progress("Iniciando navegador...")
            browser = p.chromium.launch(headless=True)
            context = browser.new_context()
            
            for username, creds in scraper.credentials.items():
                user_start_time = time.time()
                log_progress(f"Iniciando extracción", username)
                
                try:
                    page = context.new_page()
                    data = scraper.get_table_data(
                        creds["username"],
                        creds["password"],
                        fecha_inicio,
                        fecha_fin,
                        page=page
                    )
                    
                    if data:
                        for movimiento in data:
                            usuario = movimiento['usuario_asociado']
                            movimiento['categoria'] = categories.get(usuario, 'Sin categoría')
                        
                        total_records += len(data)
                        results[username] = {
                            "status": "success",
                            "total_registros": len(data),
                            "data": data
                        }
                        
                        user_time = time.time() - user_start_time
                        log_progress(f"Completado - {len(data)} registros en {user_time:.2f} segundos", username)
                    else:
                        results[username] = {
                            "status": "error",
                            "message": "No se obtuvieron datos"
                        }
                        log_progress("No se obtuvieron datos", username)
                    
                    page.close()
                        
                except Exception as e:
                    results[username] = {
                        "status": "error",
                        "message": str(e)
                    }
                    log_progress(f"Error: {str(e)}", username)
            
            browser.close()
            log_progress("Navegador cerrado")
        
        total_time = time.time() - start_time
        log_progress(f"Extracción completada - Total registros: {total_records} en {total_time:.2f} segundos")
        
        return jsonify(results)
        
    except Exception as e:
        log_progress(f"Error general: {str(e)}")
        return jsonify({"error": str(e)}), 500

@scraper_bp.route('/api/scraper/<username>')
@disable_reloader
def scrape_single_user(username: str, fecha_inicio: str = "01/01/2020"):
    """
    Extrae datos de un usuario específico
    """
    try:
        start_time = time.time()
        log_progress("Iniciando extracción", username)
        
        if username not in scraper.credentials:
            log_progress("Usuario no válido", username)
            return jsonify({"error": "Usuario no válido"}), 400
        
        fecha_fin = datetime.now().strftime("%d/%m/%Y")
        log_progress(f"Rango de fechas: {fecha_inicio} - {fecha_fin}", username)
        
        categories = scraper.load_categories()
        log_progress(f"Categorías cargadas: {len(categories)}", username)
        
        with sync_playwright() as p:
            log_progress("Iniciando navegador", username)
            browser = p.chromium.launch(headless=True)
            context = browser.new_context()
            page = context.new_page()
            
            data = scraper.get_table_data(
                scraper.credentials[username]["username"],
                scraper.credentials[username]["password"],
                fecha_inicio,
                fecha_fin,
                page=page
            )
            
            browser.close()
            log_progress("Navegador cerrado", username)
            
            if data:
                for movimiento in data:
                    usuario = movimiento['usuario_asociado']
                    movimiento['categoria'] = categories.get(usuario, 'Sin categoría')
                
                total_time = time.time() - start_time
                log_progress(f"Completado - {len(data)} registros en {total_time:.2f} segundos", username)
                
                return jsonify({
                    "status": "success",
                    "total_registros": len(data),
                    "data": data,
                    "tiempo_ejecucion": f"{total_time:.2f} segundos"
                })
            else:
                log_progress("No se encontraron datos", username)
                return jsonify({"error": "No se encontraron datos"}), 404
            
    except Exception as e:
        log_progress(f"Error: {str(e)}", username)
        return jsonify({"error": str(e)}), 500 