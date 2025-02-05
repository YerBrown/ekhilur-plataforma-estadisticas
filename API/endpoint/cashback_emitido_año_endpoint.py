from flask import Blueprint, jsonify
from sqlite3 import connect, OperationalError
from os.path import join, dirname, exists
from os import makedirs
import pandas as pd

# Crear el blueprint con un nombre diferente
cashback_emitido_bp = Blueprint('cashback_emitido_año', __name__)

# Ruta relativa de la base de datos SQLite
DATABASE_DIR = join(dirname(dirname(__file__)), 'db')
DATABASE_PATH = join(DATABASE_DIR, 'datos_sqlite.db')
print(f"Ruta de la base de datos: {DATABASE_PATH}")

# Asegurarnos de que el directorio existe
makedirs(DATABASE_DIR, exist_ok=True)

def cashback_emitido_año(tabla_usuario):
    # Validamos que la tabla esté permitida
    tablas_permitidas = {"fotostorres"}  # Solo permitimos fotostorres para este endpoint
    #! Los nombres de las tablas no pueden coincidir con los de usuarios
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
            SUM(CASE 
                WHEN Movimiento = 'Bonificación por compra' THEN ABS(Cantidad) 
                ELSE 0 
            END) AS bonificaciones_recibidas,
            SUM(CASE 
                WHEN Movimiento = 'Descuento automático' THEN -ABS(Cantidad) 
                ELSE 0 
            END) AS bonificaciones_emitidas
        FROM {tabla_usuario}
        WHERE Movimiento IN ('Descuento automático', 'Bonificación por compra')
        GROUP BY año
        ORDER BY año;
        """
        
        df = pd.read_sql_query(query, conexion)
        
        resultado = []
        for _, row in df.iterrows():
            resultado.append({
                "año": str(row['año']),
                "bonificaciones_recibidas": int(row['bonificaciones_recibidas']),  # Valores positivos
                "bonificaciones_emitidas": int(row['bonificaciones_emitidas'])     # Valores negativos
            })
        
        conexion.close()
        return resultado
    except Exception as e:
        return {
            "error": "Error al ejecutar la consulta",
            "detalles": str(e)
        }, 500

@cashback_emitido_bp.route('/cashback_emitido_año/<string:tabla_usuario>', methods=['GET'])
def get_cashback_emitido_año(tabla_usuario):
    """
    Endpoint para obtener cashback emitido agrupado por año según la tabla de usuario.
    """
    resultado = cashback_emitido_año(tabla_usuario)
    if isinstance(resultado, tuple):
        return jsonify({"error": resultado[0]}), resultado[1]
    return jsonify(resultado)
