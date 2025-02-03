from flask import Blueprint, jsonify
import sqlite3
import pandas as pd
import os

# Crear el blueprint con un nombre diferente
cashback_emitido_bp = Blueprint('cashback_emitido_mes', __name__)  # Cambiamos el nombre aquí

# Ruta relativa de la base de datos SQLite
DATABASE_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'db')
DATABASE_PATH = os.path.join(DATABASE_DIR, 'datos_sqlite.db')
print(f"Ruta de la base de datos: {DATABASE_PATH}")

# Asegurarnos de que el directorio existe
os.makedirs(DATABASE_DIR, exist_ok=True)

def cashback_emitido_mes_año(tabla_usuario):
    # Validamos que la tabla esté permitida
    tablas_permitidas = {"fotostorres"}  # Solo permitimos fotostorres para este endpoint
    if tabla_usuario not in tablas_permitidas:
        return {"error": "Este endpoint solo está disponible para la tabla fotostorres."}, 400
    
    try:
        conexion = sqlite3.connect(DATABASE_PATH)
    except sqlite3.OperationalError as e:
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
        GROUP BY año, mes
        ORDER BY año, mes;
        """
        
        df = pd.read_sql_query(query, conexion)
        
        resultado = []
        for _, row in df.iterrows():
            resultado.append({
                "año": str(row['año']),
                "mes": str(row['mes']).zfill(2),  # Asegura que el mes tenga 2 dígitos
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

@cashback_emitido_bp.route('/cashback_emitido_mes_año/<string:tabla_usuario>', methods=['GET'])
def get_cashback_emitido_mes(tabla_usuario):
    """
    Endpoint para obtener cashback emitido agrupado por mes y año según la tabla de usuario.
    """
    resultado = cashback_emitido_mes_año(tabla_usuario)
    if isinstance(resultado, tuple):
        return jsonify({"error": resultado[0]}), resultado[1]
    return jsonify(resultado)
