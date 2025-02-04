from flask import Blueprint, jsonify
from sqlite3 import connect, OperationalError
from os.path import join, dirname, exists
from os import makedirs
from pandas import read_sql_query, DataFrame

# Crear el blueprint
ventas_mes_bp = Blueprint('ventas_mes_año', __name__)

# Ruta relativa de la base de datos SQLite
DATABASE_DIR = join(dirname(dirname(__file__)), 'db')
DATABASE_PATH = join(DATABASE_DIR, 'datos_sqlite.db')

# Asegurarnos de que el directorio existe
makedirs(DATABASE_DIR, exist_ok=True)

def get_ventas_mes_año(tabla_usuario):
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
        query = f"""
        SELECT 
            strftime('%Y', Fecha) AS año,
            strftime('%m', Fecha) AS mes,
            COUNT(*) as num_ventas,
            SUM(ABS(Cantidad)) as total_ventas,
            COUNT(CASE WHEN Cantidad > 0 THEN 1 END) as num_ingresos,
            COUNT(CASE WHEN Cantidad < 0 THEN 1 END) as num_gastos,
            SUM(CASE WHEN Cantidad > 0 THEN Cantidad ELSE 0 END) as total_ingresos,
            SUM(CASE WHEN Cantidad < 0 THEN ABS(Cantidad) ELSE 0 END) as total_gastos
        FROM {tabla_usuario}
        WHERE Movimiento = 'Compra'
        GROUP BY año, mes
        ORDER BY año DESC, mes DESC;
        """
        
        df = read_sql_query(query, conexion)
        
        resultado = []
        for _, row in df.iterrows():
            resultado.append({
                "año": str(row['año']),
                "mes": str(row['mes']).zfill(2),
                "num_ventas": int(row['num_ventas']),
                "total_ventas": float(row['total_ventas']),
                "num_ingresos": int(row['num_ingresos']),
                "num_gastos": int(row['num_gastos']),
                "total_ingresos": float(row['total_ingresos']),
                "total_gastos": float(row['total_gastos'])
            })
        
        conexion.close()
        return resultado
    except Exception as e:
        return {
            "error": "Error al ejecutar la consulta",
            "detalles": str(e)
        }, 500

@ventas_mes_bp.route('/ventas/<string:tabla_usuario>', methods=['GET'])
def get_ventas_por_mes(tabla_usuario):
    """
    Endpoint para obtener el resumen de ventas por mes y año.
    """
    resultado = get_ventas_mes_año(tabla_usuario)
    if isinstance(resultado, tuple):
        return jsonify({"error": resultado[0]}), resultado[1]
    return jsonify(resultado)