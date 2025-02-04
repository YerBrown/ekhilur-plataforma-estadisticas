from flask import Blueprint, jsonify
import sqlite3
import pandas as pd
import os

# Crear el blueprint
cashback_total_bp = Blueprint('cashback_total', __name__)

# Ruta relativa de la base de datos SQLite
DATABASE_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'db')
DATABASE_PATH = os.path.join(DATABASE_DIR, 'datos_sqlite.db')

# Asegurarnos de que el directorio existe
os.makedirs(DATABASE_DIR, exist_ok=True)

def cashback_generado_total_mes_año(tabla_usuario):
    # Validamos que la tabla esté permitida
    tablas_permitidas = {"ilandatxe", "fotostorres", "alomorga", "categorias"}
    if tabla_usuario not in tablas_permitidas:
        return {"error": "Nombre de tabla no permitido."}, 400

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
                WHEN Movimiento = 'Descuento automático' THEN ABS(Cantidad)
                ELSE Cantidad 
            END) AS total_cantidad
        FROM {tabla_usuario}
        WHERE Movimiento IN ('Descuento automático', 'Bonificación por compra', 'Campaña')
        GROUP BY año, mes
        ORDER BY año DESC, mes DESC;
        """

        df = pd.read_sql_query(query, conexion)
        
        resultado = []
        for _, row in df.iterrows():
            resultado.append({
                "año": str(row['año']),
                "mes": str(row['mes']).zfill(2),  # Asegura que el mes tenga 2 dígitos
                "total_cantidad": float(row['total_cantidad'])  # Convertimos a float para mantener decimales
            })
        
        conexion.close()
        return resultado
    except Exception as e:
        return {
            "error": "Error al ejecutar la consulta",
            "detalles": str(e)
        }, 500

@cashback_total_bp.route('/cashback_generado_total_mes_año/<string:tabla_usuario>', methods=['GET'])
def get_cashback_total(tabla_usuario):
    """
    Endpoint para obtener cashback total agrupado por mes y año según la tabla de usuario.
    """
    resultado = cashback_generado_total_mes_año(tabla_usuario)
    if isinstance(resultado, tuple):
        return jsonify({"error": resultado[0]}), resultado[1]
    return jsonify(resultado)

