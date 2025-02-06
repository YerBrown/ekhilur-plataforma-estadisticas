
from flask import Blueprint, jsonify
from sqlite3 import connect, OperationalError
from os.path import join, dirname, exists
from os import makedirs
from pandas import read_sql_query, DataFrame

# Crear el blueprint
total_transacciones_bp = Blueprint('total_transacciones', __name__)

# Ruta relativa de la base de datos SQLite
DATABASE_DIR = join(dirname(dirname(__file__)), 'db')
DATABASE_PATH = join(DATABASE_DIR, 'datos_sqlite.db')

# Asegurarnos de que el directorio existe
makedirs(DATABASE_DIR, exist_ok=True)

def get_total_transacciones(tabla_usuario):
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
        # Consulta SQL mejorada
        query = f"""
        SELECT 
            COUNT(*) as total_movimientos,
            SUM(ABS(Cantidad)) as importe_total,
            COUNT(CASE WHEN Cantidad > 0 THEN 1 END) as num_ingresos,
            COUNT(CASE WHEN Cantidad < 0 THEN 1 END) as num_gastos,
            SUM(CASE WHEN Cantidad > 0 THEN Cantidad ELSE 0 END) as total_ingresos,
            SUM(CASE WHEN Cantidad < 0 THEN ABS(Cantidad) ELSE 0 END) as total_gastos,
            SUM(Cantidad) as balance_neto,
            MIN(date(Fecha)) as fecha_inicial,
            MAX(date(Fecha)) as fecha_final
        FROM {tabla_usuario};
        """
        
        df = read_sql_query(query, conexion)
        
        if df.empty:
            return {
                "error": "No hay datos disponibles para esta consulta"
            }, 404
        
        row = df.iloc[0]
        resultado = {
            "total_movimientos": int(row['total_movimientos']),
            "importe_total": float(row['importe_total']),
            "num_ingresos": int(row['num_ingresos']),
            "num_gastos": int(row['num_gastos']),
            "total_ingresos": float(row['total_ingresos']),
            "total_gastos": float(row['total_gastos']),
            "balance_neto": float(row['balance_neto']),
            "fecha_inicial": str(row['fecha_inicial']),
            "fecha_final": str(row['fecha_final'])
        }
        
        conexion.close()
        return resultado
    except Exception as e:
        return {
            "error": "Error al ejecutar la consulta",
            "detalles": str(e)
        }, 500

@total_transacciones_bp.route('/total_transacciones/<string:tabla_usuario>', methods=['GET'])
def get_resumen_transacciones(tabla_usuario):
    """
    Endpoint para obtener el resumen total de transacciones.
    """
    resultado = get_total_transacciones(tabla_usuario)
    if isinstance(resultado, tuple):
        return jsonify({"error": resultado[0]}), resultado[1]
    return jsonify(resultado)