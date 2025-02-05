from flask import Blueprint, jsonify, request
from sqlite3 import connect, OperationalError
from os.path import join, dirname, exists
from os import makedirs
from pandas import read_sql_query, DataFrame
from datetime import datetime

# Crear el blueprint
ventas_pie_bp = Blueprint('ventas_tipomovimiento_piechart', __name__)

# Ruta relativa de la base de datos SQLite
DATABASE_DIR = join(dirname(dirname(__file__)), 'db')
DATABASE_PATH = join(DATABASE_DIR, 'datos_sqlite.db')

# Asegurarnos de que el directorio existe
makedirs(DATABASE_DIR, exist_ok=True)

def get_ventas_piechart(tabla_usuario, mes=None, anio=None):
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
        # Si no se proporcionan mes y año, usar el mes y año actual
        if not mes or not anio:
            fecha_actual = datetime.now()
            mes = mes or fecha_actual.month
            anio = anio or fecha_actual.year
        
        query = f"""
        SELECT 
            Movimiento as tipo_movimiento,
            COUNT(*) as num_operaciones,
            SUM(ABS(Cantidad)) as importe_total,
            COUNT(CASE WHEN Cantidad > 0 THEN 1 END) as num_ingresos,
            COUNT(CASE WHEN Cantidad < 0 THEN 1 END) as num_gastos,
            SUM(CASE WHEN Cantidad > 0 THEN Cantidad ELSE 0 END) as total_ingresos,
            SUM(CASE WHEN Cantidad < 0 THEN ABS(Cantidad) ELSE 0 END) as total_gastos
        FROM {tabla_usuario}
        WHERE strftime('%Y', Fecha) = ? 
        AND strftime('%m', Fecha) = ?
        GROUP BY tipo_movimiento
        ORDER BY importe_total DESC;
        """
        
        df = read_sql_query(query, conexion, params=(str(anio), str(mes).zfill(2)))
        
        resultado = []
        for _, row in df.iterrows():
            resultado.append({
                "tipo_movimiento": str(row['tipo_movimiento']),
                "num_operaciones": int(row['num_operaciones']),
                "importe_total": float(row['importe_total']),
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

@ventas_pie_bp.route('/ventas_tipo_movimiento_pie/<string:tabla_usuario>', methods=['GET'])
def get_ventas_por_tipo_pie(tabla_usuario):
    """
    Endpoint para obtener datos para gráfico circular de ventas por tipo de movimiento.
    Parámetros opcionales:
    - mes: número del mes (1-12)
    - anio: año en formato YYYY
    """
    mes = request.args.get('mes', type=int)
    anio = request.args.get('anio', type=int)
    
    resultado = get_ventas_piechart(tabla_usuario, mes, anio)
    if isinstance(resultado, tuple):
        return jsonify({"error": resultado[0]}), resultado[1]
    return jsonify(resultado)

