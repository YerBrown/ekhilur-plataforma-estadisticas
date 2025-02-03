<<<<<<< HEAD
from flask import Blueprint, jsonify
import sqlite3
import os
# Crear el blueprint
ingresos_gastos_bp = Blueprint('ingresos_gastos', __name__)
# Ruta relativa de la base de datos SQLite
DATABASE_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'db')
DATABASE_PATH = os.path.join(DATABASE_DIR, 'datos_sqlite.db')
# Asegurarnos de que el directorio existe
os.makedirs(DATABASE_DIR, exist_ok=True)
@ingresos_gastos_bp.route('/ingresos_gastos/<string:tabla_usuario>', methods=['GET'])
def obtener_ingresos_gastos(tabla_usuario):
    """
    Endpoint para obtener ingresos y gastos mensuales
    """
    # Validamos que la tabla esté permitida
    tablas_permitidas = {"ilandatxe", "fotostorres", "alomorga", "categorias"}
    if tabla_usuario not in tablas_permitidas:
        return jsonify({"error": "Nombre de tabla no permitido."}), 400
    try:
        # Conectar a la base de datos
        conexion = sqlite3.connect(DATABASE_PATH)
        cursor = conexion.cursor()
    except sqlite3.Error as e:
        return jsonify({
            "error": "No se pudo conectar a la base de datos",
            "detalles": str(e)
        }), 500
    try:
        # Consulta mejorada para obtener los ingresos y gastos mes a mes
        query = f"""
            SELECT
                strftime('%Y', Fecha) AS año,
                strftime('%m', Fecha) AS mes,
                SUM(CASE WHEN Cantidad > 0 THEN Cantidad ELSE 0 END) AS ingresos,
                ABS(SUM(CASE WHEN Cantidad < 0 THEN Cantidad ELSE 0 END)) AS gastos,
                SUM(Cantidad) as balance_neto
            FROM {tabla_usuario}
            GROUP BY año, mes
            ORDER BY año, mes;
        """
        cursor.execute(query)
        resultados = cursor.fetchall()
        if not resultados:
            return jsonify({"message": "No hay datos de ingresos o gastos."}), 404
        # Procesar los resultados
        ingresos_gastos = [{
            "año": fila[0],
            "mes": fila[1],
            "ingresos": float(fila[2]),  # Convertir a float para precisión
            "gastos": float(fila[3]),
            "balance_neto": float(fila[4])
        } for fila in resultados]
        return jsonify(ingresos_gastos)
    except sqlite3.Error as e:
        return jsonify({
            "error": "Error al ejecutar la consulta",
            "detalles": str(e)
        }), 500
    finally:
        cursor.close()
=======
from flask import Blueprint, jsonify
import sqlite3
import os

# Crear el blueprint
ingresos_gastos_bp = Blueprint('ingresos_gastos', __name__)

# Ruta relativa de la base de datos SQLite
DATABASE_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'db')
DATABASE_PATH = os.path.join(DATABASE_DIR, 'datos_sqlite.db')

# Asegurarnos de que el directorio existe
os.makedirs(DATABASE_DIR, exist_ok=True)

@ingresos_gastos_bp.route('/ingresos_gastos/<string:tabla_usuario>', methods=['GET'])
def obtener_ingresos_gastos(tabla_usuario):
    """
    Endpoint para obtener ingresos y gastos mensuales
    """
    # Validamos que la tabla esté permitida
    tablas_permitidas = {"ilandatxe", "fotostorres", "alex", "categorias"}  

    if tabla_usuario not in tablas_permitidas:
        return jsonify({"error": "Nombre de tabla no permitido."}), 400

    try:
        # Conectar a la base de datos
        conexion = sqlite3.connect(DATABASE_PATH)
        cursor = conexion.cursor()
    except sqlite3.Error as e:
        return jsonify({
            "error": "No se pudo conectar a la base de datos",
            "detalles": str(e)
        }), 500

    try:
        # Consulta mejorada para obtener los ingresos y gastos mes a mes
        query = f"""
            SELECT 
                strftime('%Y', Fecha) AS año,
                strftime('%m', Fecha) AS mes,
                SUM(CASE WHEN Cantidad > 0 THEN Cantidad ELSE 0 END) AS ingresos,
                ABS(SUM(CASE WHEN Cantidad < 0 THEN Cantidad ELSE 0 END)) AS gastos,
                SUM(Cantidad) as balance_neto
            FROM {tabla_usuario}
            GROUP BY año, mes
            ORDER BY año, mes;
        """
        
        cursor.execute(query)
        resultados = cursor.fetchall()

        if not resultados:
            return jsonify({"message": "No hay datos de ingresos o gastos."}), 404

        # Procesar los resultados
        ingresos_gastos = [{
            "año": fila[0],
            "mes": fila[1],
            "ingresos": float(fila[2]),  # Convertir a float para precisión
            "gastos": float(fila[3]),
            "balance_neto": float(fila[4])
        } for fila in resultados]

        return jsonify(ingresos_gastos)

    except sqlite3.Error as e:
        return jsonify({
            "error": "Error al ejecutar la consulta",
            "detalles": str(e)
        }), 500

    finally:
        cursor.close()
>>>>>>> ba553d3cfd7891a4d8f67f85d5eb8e3b363df839
        conexion.close()