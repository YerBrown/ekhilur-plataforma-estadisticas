from flask import Blueprint, jsonify
import sqlite3
import pandas as pd
import os

# Crear el blueprint
transacciones_bp = Blueprint('transacciones', __name__)

# Ruta relativa de la base de datos SQLite
DATABASE_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'db')
DATABASE_PATH = os.path.join(DATABASE_DIR, 'datos_sqlite.db')
print(f"Ruta de la base de datos: {DATABASE_PATH}")

# Asegurarnos de que el directorio existe
os.makedirs(DATABASE_DIR, exist_ok=True)

# Función para obtener listado de todas las transacciones
def get_listado_todas_sin(tabla_usuario):
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
        # Query mejorada para obtener todas las transacciones
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
        
        df = pd.read_sql_query(query, conexion)
        
        resultado = []
        for _, row in df.iterrows():
            resultado.append({
                "año": str(row['año']),
                "mes": str(row['mes']).zfill(2),  # Asegura que el mes tenga 2 dígitos
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

# Definir el endpoint para obtener listado de todas las transacciones
@transacciones_bp.route('/todas_transacciones_sin_filtro/<string:tabla_usuario>', methods=['GET'])
def listado_todas_sin_endpoint(tabla_usuario):
    """
    Endpoint para obtener listado de todas las transacciones.
    """
    resultado = get_listado_todas_sin(tabla_usuario)
    if isinstance(resultado, tuple):
        return jsonify({"error": resultado[0]}), resultado[1]
    return jsonify(resultado)
