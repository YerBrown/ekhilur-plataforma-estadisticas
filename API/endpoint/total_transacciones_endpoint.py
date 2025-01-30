from flask import Blueprint, jsonify
import sqlite3
import os
# Crear el blueprint
total_transacciones_bp = Blueprint('total_transacciones', __name__)
# Ruta relativa de la base de datos SQLite
DATABASE_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'db')
DATABASE_PATH = os.path.join(DATABASE_DIR, 'datos_sqlite.db')
# Asegurarnos de que el directorio existe
os.makedirs(DATABASE_DIR, exist_ok=True)
@total_transacciones_bp.route('/total_transacciones/<string:tabla_usuario>', methods=['GET'])
def obtener_total_transacciones(tabla_usuario):
    """
    Endpoint para obtener el total de transacciones por mes
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
            "error": "Error de conexión a la base de datos",
            "detalles": str(e)
        }), 500
    try:
        # Consulta SQL mejorada
        query = f"""
            SELECT
                strftime('%Y', Fecha) AS año,
                strftime('%m', Fecha) AS mes,
                COUNT(*) as total_transacciones,
                SUM(CASE WHEN Cantidad < 0 THEN 1 ELSE 0 END) as num_gastos,
                SUM(CASE WHEN Cantidad > 0 THEN 1 ELSE 0 END) as num_ingresos,
                SUM(CASE WHEN Cantidad < 0 THEN ABS(Cantidad) ELSE 0 END) as total_gastos,
                SUM(CASE WHEN Cantidad > 0 THEN Cantidad ELSE 0 END) as total_ingresos,
                SUM(Cantidad) as balance_neto
            FROM {tabla_usuario}
            GROUP BY año, mes
            ORDER BY año DESC, mes DESC
        """
        cursor.execute(query)
        resultados = cursor.fetchall()
        if not resultados:
            return jsonify({"message": "No hay transacciones disponibles."}), 404
        # Estructurar los datos en formato JSON
        data = [{
            "año": fila[0],
            "mes": fila[1],
            "total_transacciones": int(fila[2]),
            "num_gastos": int(fila[3]),
            "num_ingresos": int(fila[4]),
            "total_gastos": float(fila[5]),
            "total_ingresos": float(fila[6]),
            "balance_neto": float(fila[7])
        } for fila in resultados]
        return jsonify(data)
    except sqlite3.Error as e:
        return jsonify({
            "error": "Error al ejecutar la consulta",
            "detalles": str(e)
        }), 500
    finally:
        cursor.close()
        conexion.close()