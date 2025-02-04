from flask import Blueprint, jsonify
import sqlite3
import pandas as pd
import os #! Importar solo los paquetes necesarios

# Crear el blueprint
ventas_años_bp = Blueprint('ventas_años', __name__)

# Ruta relativa de la base de datos SQLite
DATABASE_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'db')
DATABASE_PATH = os.path.join(DATABASE_DIR, 'datos_sqlite.db')

# Asegurarnos de que el directorio existe
os.makedirs(DATABASE_DIR, exist_ok=True)

@ventas_años_bp.route('/ventas_3años/<string:tabla_usuario>', methods=['GET'])
def get_ventas_3años(tabla_usuario):
    """
    Endpoint para obtener ventas anuales y el total de los últimos 3 años
    """
    # Validamos que la tabla esté permitida
    #! Los nombres de las tablas no pueden coincidir con los de usuarios
    tablas_permitidas = {"ilandatxe", "fotostorres", "alex", "categorias"}  

    if tabla_usuario not in tablas_permitidas:
        return jsonify({"error": "Nombre de tabla no permitido."}), 400

    try:
        # Conectar a la base de datos
        conexion = sqlite3.connect(DATABASE_PATH)
    except sqlite3.Error as e:
        return jsonify({
            "error": "Error de conexión a la base de datos",
            "detalles": str(e)
        }), 500

    try:
        # Query mejorada para obtener ventas por año
        query = f"""
        WITH ventas_anuales AS (
            SELECT 
                strftime('%Y', Fecha) as año,
                SUM(CASE 
                    WHEN Movimiento IN ('Pago a usuario', 'Cobro desde QR') 
                    AND Cantidad > 0 THEN Cantidad 
                    ELSE 0 
                END) as total_ventas,
                COUNT(CASE 
                    WHEN Movimiento IN ('Pago a usuario', 'Cobro desde QR') 
                    AND Cantidad > 0 THEN 1 
                END) as num_ventas
            FROM {tabla_usuario}
            GROUP BY año
        ),
        ventas_con_totales AS (
            SELECT 
                v1.año,
                v1.total_ventas as ventas_año_actual,
                v1.num_ventas as num_ventas_año,
                (
                    ROUND(v1.total_ventas, 2) + 
                    ROUND(IFNULL(v2.total_ventas, 0), 2) + 
                    ROUND(IFNULL(v3.total_ventas, 0), 2)
                ) as total_ultimos_3_años,
                (
                    v1.num_ventas + 
                    IFNULL(v2.num_ventas, 0) + 
                    IFNULL(v3.num_ventas, 0)
                ) as total_ventas_3_años,
                CASE 
                    WHEN v2.año IS NULL THEN 1
                    WHEN v3.año IS NULL THEN 2
                    ELSE 3
                END as años_disponibles
            FROM ventas_anuales v1
            LEFT JOIN ventas_anuales v2 
                ON CAST(v1.año AS INTEGER) = CAST(v2.año AS INTEGER) + 1
            LEFT JOIN ventas_anuales v3 
                ON CAST(v1.año AS INTEGER) = CAST(v3.año AS INTEGER) + 2
        )
        SELECT 
            año,
            ROUND(ventas_año_actual, 2) as ventas_año_actual,
            num_ventas_año,
            ROUND(total_ultimos_3_años, 2) as total_ultimos_3_años,
            total_ventas_3_años,
            años_disponibles
        FROM ventas_con_totales
        ORDER BY año DESC;
        """

        # Ejecutar la consulta
        df = pd.read_sql_query(query, conexion)

        if df.empty:
            return jsonify({"message": "No hay datos de ventas disponibles."}), 404

        # Convertir a diccionario y devolver respuesta
        return jsonify(df.to_dict(orient='records'))

    except Exception as e:
        return jsonify({
            "error": "Error al ejecutar la consulta",
            "detalles": str(e)
        }), 500

    finally:
        conexion.close()