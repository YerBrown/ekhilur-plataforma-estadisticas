from flask import Blueprint, jsonify
from sqlite3 import connect, OperationalError
from os.path import join, dirname, exists
from os import makedirs
from pandas import read_sql_query, DataFrame
from datetime import datetime, timedelta

# Crear el blueprint
ventas_años_bp = Blueprint('totalventas_añoactual_totalventas3años', __name__)

# Ruta relativa de la base de datos SQLite
DATABASE_DIR = join(dirname(dirname(__file__)), 'db')
DATABASE_PATH = join(DATABASE_DIR, 'datos_sqlite.db')

# Asegurarnos de que el directorio existe
makedirs(DATABASE_DIR, exist_ok=True)

def get_total_ventas_años(tabla_usuario):
    # Validamos que la tabla esté permitida
    tablas_permitidas = {"fotostorres"}
    if tabla_usuario not in tablas_permitidas:
        return {"error": "Este endpoint solo está disponible para la tabla fotostorres."}, 400
    
    try:
        conexion = connect(DATABASE_PATH)
    except OperationalError as e:
        return {
            "error": "No se pudo conectar a la base de datos",
            "detalles": str(e),
            "ruta_bd": DATABASE_PATH
        }, 500
    
    try:
        # Query mejorada para obtener ventas por año
        query = f"""
        WITH año_actual AS (
            SELECT 
                COUNT(*) as num_ventas,
                SUM(ABS(Cantidad)) as total_ventas
            FROM {tabla_usuario}
            WHERE strftime('%Y', Fecha) = strftime('%Y', 'now')
            AND Movimiento = 'Compra'
        ),
        ultimos_3_años AS (
            SELECT 
                COUNT(*) as num_ventas,
                SUM(ABS(Cantidad)) as total_ventas
            FROM {tabla_usuario}
            WHERE Fecha >= date('now', '-3 years')
            AND Movimiento = 'Compra'
        )
        SELECT 
            aa.num_ventas as ventas_año_actual,
            aa.total_ventas as total_año_actual,
            t3a.num_ventas as ventas_3_años,
            t3a.total_ventas as total_3_años
        FROM año_actual aa, ultimos_3_años t3a;
        """
        
        df = read_sql_query(query, conexion)
        
        if df.empty:
            return {
                "error": "No hay datos disponibles para esta consulta"
            }, 404
        
        row = df.iloc[0]
        resultado = {
            "año_actual": {
                "num_ventas": int(row['ventas_año_actual'] or 0),
                "total_ventas": float(row['total_año_actual'] or 0)
            },
            "ultimos_3_años": {
                "num_ventas": int(row['ventas_3_años'] or 0),
                "total_ventas": float(row['total_3_años'] or 0)
            }
        }
        
        conexion.close()
        return resultado
    except Exception as e:
        return {
            "error": "Error al ejecutar la consulta",
            "detalles": str(e)
        }, 500

@ventas_años_bp.route('/totalventas_años/<string:tabla_usuario>', methods=['GET'])
def get_resumen_ventas_años(tabla_usuario):
    """
    Endpoint para obtener el resumen de ventas del año actual y últimos 3 años.
    """
    resultado = get_total_ventas_años(tabla_usuario)
    if isinstance(resultado, tuple):
        return jsonify({"error": resultado[0]}), resultado[1]
    return jsonify(resultado)