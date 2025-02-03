<<<<<<< HEAD
from flask import Blueprint, jsonify
import sqlite3
import pandas as pd
import os
# Crear el blueprint
cashback_generado_bp = Blueprint('cashback_generado', __name__)
# Ruta relativa de la base de datos SQLite
DATABASE_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'db')
DATABASE_PATH = os.path.join(DATABASE_DIR, 'datos_sqlite.db')
# Asegurarnos de que el directorio existe
os.makedirs(DATABASE_DIR, exist_ok=True)
# Función para calcular cashback generado
def cashback_generado_tipo_mes_año(tabla_usuario):
    # Validamos que la tabla esté permitida
    tablas_permitidas = {"ilandatxe", "fotostorres", "alomorga", "categorias"}
    if tabla_usuario not in tablas_permitidas:
        return {"error": "Nombre de tabla no permitido."}, 400
    try:
        # Conectar a la base de datos
        conexion = sqlite3.connect(DATABASE_PATH)
    except sqlite3.OperationalError as e:
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
            Movimiento,
            SUM(CASE
                WHEN Movimiento = 'Descuento automático' THEN ABS(Cantidad)
                ELSE Cantidad
            END) AS total_cantidad
        FROM {tabla_usuario}
        WHERE Movimiento IN ('Descuento automático', 'Bonificación por compra', 'Campaña')
        GROUP BY anio, mes, Movimiento
        ORDER BY anio, mes, Movimiento;
        """
        # Ejecutar la consulta
        df = pd.read_sql_query(query, conexion)
        # Cerrar la conexión
        conexion.close()
        return df.to_dict(orient='records')
    except Exception as e:
        return {
            "error": "Error al ejecutar la consulta",
            "detalles": str(e)
        }, 500
# Definir el endpoint
@cashback_generado_bp.route('/cashback_generado_tipo_mes_año/<string:tabla_usuario>', methods=['GET'])
def get_cashback(tabla_usuario):
    """
    Endpoint para obtener cashback agrupado por mes y año según la tabla de usuario.
    """
    resultado = cashback_generado_tipo_mes_año(tabla_usuario)
    # Si la función devuelve un error, lo retornamos como JSON
    if isinstance(resultado, tuple):
        return jsonify({"error": resultado[0]}), resultado[1]
    return jsonify(resultado)

=======
from flask import Blueprint, jsonify
import sqlite3
import pandas as pd
import os

# Crear el blueprint
cashback_generado_bp = Blueprint('cashback_generado', __name__)

# Ruta relativa de la base de datos SQLite
DATABASE_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'db')
DATABASE_PATH = os.path.join(DATABASE_DIR, 'datos_sqlite.db')

# Asegurarnos de que el directorio existe
os.makedirs(DATABASE_DIR, exist_ok=True)

# Función para calcular cashback generado
def cashback_generado_tipo_mes_año(tabla_usuario):
    # Validamos que la tabla esté permitida
    tablas_permitidas = {"ilandatxe", "fotostorres", "alex", "categorias"}  

    if tabla_usuario not in tablas_permitidas:
        return {"error": "Nombre de tabla no permitido."}, 400

    try:
        # Conectar a la base de datos
        conexion = sqlite3.connect(DATABASE_PATH)
    except sqlite3.OperationalError as e:
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
            Movimiento,
            SUM(CASE 
                WHEN Movimiento = 'Descuento automático' THEN ABS(Cantidad)
                ELSE Cantidad 
            END) AS total_cantidad
        FROM {tabla_usuario}
        WHERE Movimiento IN ('Descuento automático', 'Bonificación por compra', 'Campaña')
        GROUP BY anio, mes, Movimiento
        ORDER BY anio, mes, Movimiento;
        """

        # Ejecutar la consulta
        df = pd.read_sql_query(query, conexion)

        # Cerrar la conexión
        conexion.close()

        return df.to_dict(orient='records')
    except Exception as e:
        return {
            "error": "Error al ejecutar la consulta",
            "detalles": str(e)
        }, 500

# Definir el endpoint
@cashback_generado_bp.route('/cashback_generado_tipo_mes_año/<string:tabla_usuario>', methods=['GET'])
def get_cashback(tabla_usuario):
    """
    Endpoint para obtener cashback agrupado por mes y año según la tabla de usuario.
    """
    resultado = cashback_generado_tipo_mes_año(tabla_usuario)

    # Si la función devuelve un error, lo retornamos como JSON
    if isinstance(resultado, tuple):
        return jsonify({"error": resultado[0]}), resultado[1]

    return jsonify(resultado)
>>>>>>> 5dfb0e9fcb2766b3660f8bdddcf1748e799818b6
