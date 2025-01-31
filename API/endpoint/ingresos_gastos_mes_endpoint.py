from flask import Blueprint, jsonify
import sqlite3
import os

# Crear el blueprint
ingresos_gastos_mes_bp = Blueprint('ingresos_gastos_mes', __name__)

# Ruta relativa de la base de datos SQLite
DATABASE_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'db')
DATABASE_PATH = os.path.join(DATABASE_DIR, 'datos_sqlite.db')

# Asegurarnos de que el directorio existe
os.makedirs(DATABASE_DIR, exist_ok=True)

def obtener_resumen(tabla_usuario):
    """
    Función para obtener el resumen de ingresos y gastos mes a mes
    """
    # Validamos que la tabla esté permitida
    tablas_permitidas = {"ilandatxe", "fotostorres", "alex", "categorias"}  

    if tabla_usuario not in tablas_permitidas:
        return {"error": "Nombre de tabla no permitido."}, 400

    try:
        conexion = sqlite3.connect(DATABASE_PATH)
        cursor = conexion.cursor()
    except sqlite3.Error as e:
        return {
            "error": "Error de conexión a la base de datos",
            "detalles": str(e)
        }, 500

    try:
        query = f"""
            SELECT 
                strftime('%Y', Fecha) AS año,
                strftime('%m', Fecha) AS mes,
                SUM(CASE WHEN Cantidad > 0 THEN Cantidad ELSE 0 END) AS ingresos,
                ABS(SUM(CASE WHEN Cantidad < 0 THEN Cantidad ELSE 0 END)) AS gastos,
                SUM(Cantidad) as balance_neto
            FROM {tabla_usuario}
            GROUP BY año, mes
            ORDER BY año DESC, mes DESC
        """
        
        cursor.execute(query)
        resultados = cursor.fetchall()

        if not resultados:
            return {"message": "No hay datos disponibles para el período solicitado."}, 404

        # Procesar los resultados
        resumen = [{
            "año": fila[0],
            "mes": fila[1],
            "ingresos": float(fila[2]),
            "gastos": float(fila[3]),
            "balance_neto": float(fila[4])
        } for fila in resultados]

        return resumen, 200

    except sqlite3.Error as e:
        return {
            "error": "Error al ejecutar la consulta",
            "detalles": str(e)
        }, 500
    finally:
        cursor.close()
        conexion.close()

@ingresos_gastos_mes_bp.route('/resumen/<string:tabla_usuario>', methods=['GET'])
def resumen(tabla_usuario):
    """
    Endpoint para obtener el resumen de ingresos y gastos mensuales
    """
    resultado, status_code = obtener_resumen(tabla_usuario)
    return jsonify(resultado), status_code