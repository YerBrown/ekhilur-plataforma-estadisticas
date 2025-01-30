
from flask import Flask, jsonify
import sqlite3
import pandas as pd
import os
app = Flask(__name__)
# Añadir ruta raíz
@app.route('/', methods=['GET'])
def home():
    """
    Página de inicio que muestra información sobre cómo usar la API
    """
    return jsonify({
        "mensaje": "Bienvenido a la API de Cashback",
        "endpoints_disponibles": {
            "cashback_emitido_mes_año": "/cashback_emitido_mes_año/<tabla_usuario>",
            "tablas_permitidas": list({"ilandatxe", "fotostorres", "alex", "categorias"})
        },
        "ejemplo_uso": "/cashback_emitido_mes_año/ilandatxe"
    })
# Ruta relativa de la base de datos SQLite
DATABASE_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'db')
DATABASE_PATH = os.path.join(DATABASE_DIR, 'datos_sqlite.db')
print(f"Ruta de la base de datos: {DATABASE_PATH}")
# Asegurarnos de que el directorio existe
os.makedirs(DATABASE_DIR, exist_ok=True)
# Función para calcular cashback emitido agrupado por mes y año
def cashback_emitido_mes_año(tabla_usuario):
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
            SUM(CASE WHEN Movimiento = 'Bonificación por compra' THEN Cantidad ELSE 0 END) AS total_cashback_recibido,
            SUM(CASE WHEN Movimiento = 'Descuento automático' THEN ABS(Cantidad) ELSE 0 END) AS total_cashback_emitido
        FROM {tabla_usuario}
        WHERE Movimiento IN ('Descuento automático', 'Bonificación por compra')
        GROUP BY anio, mes
        ORDER BY anio, mes;
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
# Definir el endpoint para obtener cashback emitido
@app.route('/cashback_emitido_mes_año/<string:tabla_usuario>', methods=['GET'])
def get_cashback_emitido(tabla_usuario):
    """
    Endpoint para obtener cashback emitido agrupado por mes y año según la tabla de usuario.
    """
    resultado = cashback_emitido_mes_año(tabla_usuario)
    # Si la función devuelve un error, lo retornamos como JSON
    if isinstance(resultado, tuple):
        return jsonify({"error": resultado[0]}), resultado[1]
    return jsonify(resultado)
# Iniciar el servidor Flask
if __name__ == '__main__':
    app.run(debug=True)