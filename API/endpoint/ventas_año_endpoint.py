from flask import Blueprint, jsonify
import sqlite3
import pandas as pd
import os

# Crear el blueprint
ventas_año_bp = Blueprint('ventas_año', __name__)

# Ruta relativa de la base de datos SQLite
DATABASE_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'db')
DATABASE_PATH = os.path.join(DATABASE_DIR, 'datos_sqlite.db')
print(f"Ruta de la base de datos: {DATABASE_PATH}")

# Asegurarnos de que el directorio existe
os.makedirs(DATABASE_DIR, exist_ok=True)

@ventas_año_bp.route('/ventas/<string:tabla_usuario>', methods=['GET'])
def ventas_año_endpoint(tabla_usuario):
    """
    Endpoint para obtener ventas agrupadas por año.
    """
    # Validamos que la tabla sea fotostorres
    if tabla_usuario != "fotostorres":
        return jsonify({"error": "Este endpoint solo está disponible para fotostorres."}), 400

    try:
        conexion = sqlite3.connect(DATABASE_PATH)
    except sqlite3.Error as e:
        return jsonify({
            "error": "Error de conexión a la base de datos",
            "detalles": str(e)
        }), 500

    try:
        query = f"""
        SELECT 
            strftime('%Y', Fecha) as año,
            COUNT(*) as total_operaciones,
            SUM(CASE 
                WHEN Movimiento IN ('Pago a usuario', 'Cobro desde QR') 
                AND Cantidad > 0 THEN Cantidad 
                ELSE 0 
            END) as total_ventas
        FROM {tabla_usuario}
        GROUP BY año
        ORDER BY año DESC;
        """
        
        df = pd.read_sql_query(query, conexion)
        
        if df.empty:
            return jsonify({"message": "No hay datos de ventas disponibles."}), 404

        # Formatear los datos según apiJsons.txt
        resultado = []
        for _, row in df.iterrows():
            resultado.append({
                "año": str(row['año']),
                "total_operaciones": int(row['total_operaciones']),
                "total_ventas": float(row['total_ventas'])
            })

        return jsonify(resultado)

    except Exception as e:
        return jsonify({
            "error": "Error al ejecutar la consulta",
            "detalles": str(e)
        }), 500

    finally:
        conexion.close()
