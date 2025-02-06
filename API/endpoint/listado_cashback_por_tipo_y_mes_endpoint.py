from flask import Blueprint, jsonify
from sqlite3 import connect, OperationalError
from os.path import join, dirname, exists
from os import makedirs
from pandas import read_sql_query, DataFrame

# Crear el blueprint
cashback_listado_bp = Blueprint('listado_cashback_por_tipo_y_mes', __name__)

# Ruta relativa de la base de datos SQLite
DATABASE_DIR = join(dirname(dirname(__file__)), 'db')
DATABASE_PATH = join(DATABASE_DIR, 'datos_sqlite.db')

# Asegurarnos de que el directorio existe
makedirs(DATABASE_DIR, exist_ok=True)

def listado_cashback_por_tipo_y_mes(tabla_usuario):
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
            Movimiento as tipo_movimiento,
            "Usuario Asociado" as comercio,
            ABS(Cantidad) as cantidad,
            date(Fecha) as fecha_exacta
        FROM {tabla_usuario}
        WHERE Movimiento IN ('Bonificación por compra', 'Descuento automático')
        ORDER BY fecha_exacta DESC;
        """
        
        df = read_sql_query(query, conexion)
        
        resultado = []
        for _, row in df.iterrows():
            resultado.append({
                "año": str(row['año']),
                "mes": str(row['mes']).zfill(2),
                "tipo_movimiento": str(row['tipo_movimiento']),
                "comercio": str(row['comercio']),
                "cantidad": float(row['cantidad']),
                "fecha": str(row['fecha_exacta'])
            })
        
        conexion.close()
        return resultado
    except Exception as e:
        return {
            "error": "Error al ejecutar la consulta",
            "detalles": str(e)
        }, 500

@cashback_listado_bp.route('/listado_cashback_por_tipo_y_mes/<string:tabla_usuario>', methods=['GET'])
def get_listado_cashback_por_tipo_y_mes(tabla_usuario):
    """
    Endpoint para obtener el listado detallado de cashback por tipo y mes.
    """
    resultado = listado_cashback_por_tipo_y_mes(tabla_usuario)
    if isinstance(resultado, tuple):
        return jsonify({"error": resultado[0]}), resultado[1]
    return jsonify(resultado)
