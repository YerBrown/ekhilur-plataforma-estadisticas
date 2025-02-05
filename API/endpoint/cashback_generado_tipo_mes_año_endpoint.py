from flask import Blueprint, jsonify
from sqlite3 import connect, OperationalError
from os.path import join, dirname, exists
from os import makedirs
from pandas import read_sql_query, DataFrame

# Crear el blueprint
cashback_generado_bp = Blueprint('cashback_generado_tipo_mes_año', __name__)

# Ruta relativa de la base de datos SQLite
DATABASE_DIR = join(dirname(dirname(__file__)), 'db')
DATABASE_PATH = join(DATABASE_DIR, 'datos_sqlite.db')

# Asegurarnos de que el directorio existe
makedirs(DATABASE_DIR, exist_ok=True)

# Función para calcular cashback generado
def cashback_generado_tipo_mes_año(tabla_usuario):
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
        # Construcción de la consulta SQL
        query = f"""
        SELECT 
            strftime('%Y', Fecha) AS anio,
            strftime('%m', Fecha) AS mes,
            "Usuario Asociado" as tipo_comercio,
            SUM(CASE 
                WHEN Movimiento = 'Bonificación por compra' THEN ABS(Cantidad) 
                ELSE 0 
            END) AS bonificaciones_recibidas
        FROM {tabla_usuario}
        WHERE Movimiento = 'Bonificación por compra'
        GROUP BY año, mes, tipo_comercio
        ORDER BY año, mes, tipo_comercio;
        """
        
        df = read_sql_query(query, conexion)
        
        resultado = []
        for _, row in df.iterrows():
            resultado.append({
                "año": str(row['año']),
                "mes": str(row['mes']).zfill(2),
                "tipo_comercio": str(row['tipo_comercio']),
                "bonificaciones_recibidas": float(row['bonificaciones_recibidas'])
            })
        
        conexion.close()

        return df.to_dict(orient='records')
    except Exception as e:
        return {
            "error": "Error al ejecutar la consulta",
            "detalles": str(e)
        }, 500

# Definir el endpoint
@cashback_generado_bp.route('/cashback_generado_tipo_mes_año/<string:tabla_usuario>', methods=['GET'])
def get_cashback_generado_tipo_mes_año(tabla_usuario):
    """
    Endpoint para obtener cashback generado por tipo de comercio, mes y año.
    """
    resultado = cashback_generado_tipo_mes_año(tabla_usuario)

    # Si la función devuelve un error, lo retornamos como JSON
    if isinstance(resultado, tuple):
        return jsonify({"error": resultado[0]}), resultado[1]

    return jsonify(resultado)
