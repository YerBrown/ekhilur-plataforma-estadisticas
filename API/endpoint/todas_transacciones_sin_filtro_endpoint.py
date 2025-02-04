from flask import Blueprint, jsonify
from sqlite3 import connect, OperationalError
from os.path import join, dirname, exists
from os import makedirs
from pandas import read_sql_query, DataFrame

# Crear el blueprint
transacciones_bp = Blueprint('todas_transacciones_sin_filtro', __name__)

# Ruta relativa de la base de datos SQLite
DATABASE_DIR = join(dirname(dirname(__file__)), 'db')
DATABASE_PATH = join(DATABASE_DIR, 'datos_sqlite.db')

# Asegurarnos de que el directorio existe
makedirs(DATABASE_DIR, exist_ok=True)

def get_listado_todas_sin(tabla_usuario):
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
            date(Fecha) AS fecha,
            Movimiento as tipo_movimiento,
            Cantidad as importe,
            "Usuario Asociado" as usuario_asociado,
            Saldo as saldo_actual,
            Cuenta as cuenta
        FROM {tabla_usuario}
        ORDER BY fecha DESC;
        """
        
        df = read_sql_query(query, conexion)
        
        resultado = []
        for _, row in df.iterrows():
            resultado.append({
                "año": str(row['año']),
                "mes": str(row['mes']).zfill(2),
                "fecha": str(row['fecha']),
                "tipo_movimiento": str(row['tipo_movimiento']),
                "importe": float(row['importe']),
                "usuario_asociado": str(row['usuario_asociado']),
                "saldo_actual": float(row['saldo_actual']),
                "cuenta": str(row['cuenta'])
            })
        
        conexion.close()
        return resultado
    except Exception as e:
        return {
            "error": "Error al ejecutar la consulta",
            "detalles": str(e)
        }, 500

@transacciones_bp.route('/todas_transacciones_sin_filtro/<string:tabla_usuario>', methods=['GET'])
def get_todas_transacciones(tabla_usuario):
    """
    Endpoint para obtener el listado completo de transacciones.
    """
    resultado = get_listado_todas_sin(tabla_usuario)
    if isinstance(resultado, tuple):
        return jsonify({"error": resultado[0]}), resultado[1]
    return jsonify(resultado)
