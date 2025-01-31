from flask import Blueprint, jsonify
import sqlite3
import pandas as pd
import os

# Crear el blueprint
ventas_bp = Blueprint('ventas', __name__)

# Ruta relativa de la base de datos SQLite
DATABASE_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'db')
DATABASE_PATH = os.path.join(DATABASE_DIR, 'datos_sqlite.db')

# Asegurarnos de que el directorio existe
os.makedirs(DATABASE_DIR, exist_ok=True)

@ventas_bp.route('/ventas_3meses/<string:tabla_usuario>', methods=['GET'])
def get_ventas_3meses(tabla_usuario):
    """
    Endpoint para obtener ventas mensuales y el total de los últimos 3 meses
    """
    # Validamos que la tabla esté permitida
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
        # Query mejorada para obtener ventas
        query = f"""
        WITH ventas_mensuales AS (
            SELECT 
                strftime('%Y', Fecha) as año,
                strftime('%m', Fecha) as mes,
                SUM(CASE 
                    WHEN Movimiento IN ('Pago a usuario', 'Cobro desde QR') 
                    AND Cantidad > 0 THEN Cantidad 
                    ELSE 0 
                END) as total_ventas
            FROM {tabla_usuario}
            GROUP BY año, mes
        ),
        ventas_con_totales AS (
            SELECT 
                v1.año,
                v1.mes,
                v1.total_ventas as ventas_mes_actual,
                (
                    v1.total_ventas + 
                    IFNULL(v2.total_ventas, 0) + 
                    IFNULL(v3.total_ventas, 0)
                ) as total_ultimos_3_meses,
                COUNT(*) OVER (
                    PARTITION BY v1.año
                    ORDER BY v1.mes
                    ROWS BETWEEN CURRENT ROW AND 2 FOLLOWING
                ) as meses_disponibles
            FROM ventas_mensuales v1
            LEFT JOIN ventas_mensuales v2 
                ON (v1.año = v2.año AND CAST(v1.mes AS INTEGER) = CAST(v2.mes AS INTEGER) + 1)
                OR (v1.año = CAST(v2.año AS INTEGER) + 1 AND v1.mes = '01' AND v2.mes = '12')
            LEFT JOIN ventas_mensuales v3 
                ON (v1.año = v3.año AND CAST(v1.mes AS INTEGER) = CAST(v3.mes AS INTEGER) + 2)
                OR (v1.año = CAST(v3.año AS INTEGER) + 1 AND v1.mes = '01' AND v3.mes = '11')
                OR (v1.año = CAST(v3.año AS INTEGER) + 1 AND v1.mes = '02' AND v3.mes = '12')
        )
        SELECT 
            año,
            mes,
            ROUND(ventas_mes_actual, 2) as ventas_mes_actual,
            ROUND(total_ultimos_3_meses, 2) as total_ultimos_3_meses,
            meses_disponibles
        FROM ventas_con_totales
        WHERE año >= '2022'
        ORDER BY año DESC, mes DESC;
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