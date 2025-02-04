from flask import Blueprint, jsonify
from sqlite3 import connect, OperationalError
from os.path import join, dirname, exists
from os import makedirs
from pandas import read_sql_query, DataFrame
from datetime import datetime, timedelta

# Crear el blueprint
total_ventas_bp = Blueprint('total_ventas_mesactual_totalventas3meses', __name__)

# Ruta relativa de la base de datos SQLite
DATABASE_DIR = join(dirname(dirname(__file__)), 'db')
DATABASE_PATH = join(DATABASE_DIR, 'datos_sqlite.db')

# Asegurarnos de que el directorio existe
makedirs(DATABASE_DIR, exist_ok=True)

def get_total_ventas(tabla_usuario):
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
        # Obtener fecha actual y hace 3 meses
        fecha_actual = datetime.now()
        fecha_3_meses = fecha_actual - timedelta(days=90)
        
        query = f"""
        WITH mes_actual AS (
            SELECT 
                COUNT(*) as num_ventas,
                SUM(ABS(Cantidad)) as total_ventas
            FROM {tabla_usuario}
            WHERE strftime('%Y-%m', Fecha) = strftime('%Y-%m', 'now')
            AND Movimiento = 'Compra'
        ),
        ultimos_3_meses AS (
            SELECT 
                COUNT(*) as num_ventas,
                SUM(ABS(Cantidad)) as total_ventas
            FROM {tabla_usuario}
            WHERE Fecha >= date('now', '-3 months')
            AND Movimiento = 'Compra'
        )
        SELECT 
            ma.num_ventas as ventas_mes_actual,
            ma.total_ventas as total_mes_actual,
            t3m.num_ventas as ventas_3_meses,
            t3m.total_ventas as total_3_meses
        FROM mes_actual ma, ultimos_3_meses t3m;
        """
        
        df = read_sql_query(query, conexion)
        
        if df.empty:
            return {
                "error": "No hay datos disponibles para esta consulta"
            }, 404
        
        row = df.iloc[0]
        resultado = {
            "mes_actual": {
                "num_ventas": int(row['ventas_mes_actual'] or 0),
                "total_ventas": float(row['total_mes_actual'] or 0)
            },
            "ultimos_3_meses": {
                "num_ventas": int(row['ventas_3_meses'] or 0),
                "total_ventas": float(row['total_3_meses'] or 0)
            }
        }
        
        conexion.close()
        return resultado
    except Exception as e:
        return {
            "error": "Error al ejecutar la consulta",
            "detalles": str(e)
        }, 500

@total_ventas_bp.route('/total_ventas/<string:tabla_usuario>', methods=['GET'])
def get_resumen_ventas(tabla_usuario):
    """
    Endpoint para obtener el resumen de ventas del mes actual y últimos 3 meses.
    """
    resultado = get_total_ventas(tabla_usuario)
    if isinstance(resultado, tuple):
        return jsonify({"error": resultado[0]}), resultado[1]
    return jsonify(resultado)