from flask import Blueprint, jsonify
import sqlite3
import pandas as pd
import os #! Importar solo los paquetes necesarios

# Crear el blueprint
cashback_listado_bp = Blueprint('cashback_listado', __name__)

# Ruta relativa de la base de datos SQLite
DATABASE_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'db')
DATABASE_PATH = os.path.join(DATABASE_DIR, 'datos_sqlite.db')
print(f"Ruta de la base de datos: {DATABASE_PATH}")

# Asegurarnos de que el directorio existe
os.makedirs(DATABASE_DIR, exist_ok=True)

# Función para obtener el cashback por mes
def get_cashback_por_mes(tabla_usuario):
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
        # Query mejorada para obtener cashback por mes
        query = f"""
        SELECT 
            strftime('%Y', Fecha) AS año,
            strftime('%m', Fecha) AS mes,
            Movimiento as tipo_movimiento,
            COUNT(*) as total_operaciones,
            SUM(ABS(Cantidad)) as importe_total
        FROM {tabla_usuario}
        WHERE Movimiento IN ('Descuento automático', 'Bonificación por compra')
        GROUP BY año, mes, tipo_movimiento
        ORDER BY año DESC, mes DESC, tipo_movimiento;
        """
        
        df = pd.read_sql_query(query, conexion)
        
        resultado = []
        for _, row in df.iterrows():
            resultado.append({
                "año": str(row['año']),
                "mes": str(row['mes']).zfill(2),  # Asegura que el mes tenga 2 dígitos
                "tipo_movimiento": str(row['tipo_movimiento']),
                "total_operaciones": int(row['total_operaciones']),
                "importe_total": float(row['importe_total'])
            })
        
        conexion.close()
        return resultado
    except Exception as e:
        return {
            "error": "Error al ejecutar la consulta",
            "detalles": str(e)
        }, 500

# Definir el endpoint para obtener cashback por mes
@cashback_listado_bp.route('/listado_cashback_por_tipo_y_mes/<string:tabla_usuario>', methods=['GET'])
def cashback_mes(tabla_usuario):
    """
    Endpoint para obtener listado de cashback por tipo y mes.
    """
    resultado = get_cashback_por_mes(tabla_usuario)
    if isinstance(resultado, tuple):
        return jsonify({"error": resultado[0]}), resultado[1]
    return jsonify(resultado)
