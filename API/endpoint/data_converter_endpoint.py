from flask import Blueprint, jsonify
import sqlite3
import pandas as pd
import os #! Importar solo los paquetes necesarios
import json
from datetime import datetime

# Crear el blueprint
converter_bp = Blueprint('converter', __name__)

# Ruta relativa de la base de datos SQLite
DATABASE_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'db')
DATABASE_PATH = os.path.join(DATABASE_DIR, 'datos_sqlite.db')

# Directorio para los archivos JSON
JSON_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'json_data')
os.makedirs(JSON_DIR, exist_ok=True)

@converter_bp.route('/convert/<string:tabla_usuario>', methods=['GET'])
def convert_sqlite_to_json(tabla_usuario):
    """
    Convierte los datos de SQLite a JSON y los guarda en un archivo
    """
    # Validamos que la tabla esté permitida
    tablas_permitidas = {"ilandatxe", "fotostorres", "alex", "categorias"}  

    if tabla_usuario not in tablas_permitidas:
        return jsonify({"error": "Nombre de tabla no permitido."}), 400

    try:
        # Conectar a la base de datos
        conexion = sqlite3.connect(DATABASE_PATH)
        
        # Query para obtener todos los datos
        query = f"""
        SELECT 
            strftime('%Y-%m-%d', Fecha) as fecha,
            Movimiento as tipo_movimiento,
            Cantidad as monto,
            Descripcion as descripcion,
            strftime('%Y', Fecha) as año,
            strftime('%m', Fecha) as mes
        FROM {tabla_usuario}
        ORDER BY Fecha DESC;
        """
        
        # Leer datos en un DataFrame
        df = pd.read_sql_query(query, conexion)
        
        # Generar nombre de archivo con timestamp
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        json_filename = f"{tabla_usuario}_data_{timestamp}.json"
        json_path = os.path.join(JSON_DIR, json_filename)
        
        # Convertir a JSON con formato específico
        json_data = {
            "metadata": {
                "tabla": tabla_usuario,
                "fecha_exportacion": datetime.now().isoformat(),
                "numero_registros": len(df)
            },
            "datos": df.to_dict(orient='records')
        }
        
        # Guardar en archivo JSON
        with open(json_path, 'w', encoding='utf-8') as f:
            json.dump(json_data, f, ensure_ascii=False, indent=2)
        
        return jsonify({
            "status": "success",
            "mensaje": "Datos convertidos exitosamente",
            "detalles": {
                "archivo": json_filename,
                "registros": len(df),
                "ruta": json_path
            }
        })

    except Exception as e:
        return jsonify({
            "error": "Error en la conversión",
            "detalles": str(e)
        }), 500

    finally:
        conexion.close()

@converter_bp.route('/latest/<string:tabla_usuario>', methods=['GET'])
def get_latest_json(tabla_usuario):
    """
    Obtiene el archivo JSON más reciente para una tabla
    """
    try:
        # Buscar el archivo más reciente
        files = [f for f in os.listdir(JSON_DIR) if f.startswith(f"{tabla_usuario}_data_")]
        if not files:
            return jsonify({"message": "No hay archivos JSON disponibles"}), 404
        
        latest_file = max(files)
        json_path = os.path.join(JSON_DIR, latest_file)
        
        # Leer y devolver el JSON
        with open(json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        return jsonify(data)

    except Exception as e:
        return jsonify({
            "error": "Error al obtener JSON",
            "detalles": str(e)
        }), 500 