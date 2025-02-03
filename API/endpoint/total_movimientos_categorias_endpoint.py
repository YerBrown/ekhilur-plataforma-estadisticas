from flask import Flask, jsonify
import sqlite3
import pandas as pd
import os

app = Flask(__name__)

# Ruta de la base de datos SQLite
DATABASE_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'db')
DATABASE_PATH = os.path.join(DATABASE_DIR, 'datos_sqlite.db')
print(f"Ruta de la base de datos: {DATABASE_PATH}")

# Asegurar que el directorio de la BD existe
os.makedirs(DATABASE_DIR, exist_ok=True)

# Página de inicio
@app.route('/', methods=['GET'])
def home():
    """
    Página de inicio que muestra información sobre cómo usar la API.
    """
    return jsonify({
        "mensaje": "Bienvenido a la API de Total Movimientos por Categorias",
        "endpoints_disponibles": {
            "datos_completos_ilandatxe": "/total_movimientos_categorias/<tabla_usuario>",
            "tablas_permitidas": list({"ilandatxe", "fotostorres", "alex", "categorias"})  # Agregar las tablas permitidas aquí
        },
        "ejemplo_uso": "/total_movimientos_categorias/ilandatxe"
    })

# Función para obtener la tabla completa con la categoría de compra
def total_movimientos_categorias(tabla_usuario):
    # Lista de tablas permitidas
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
        # Consulta SQL
        query = f"""
        SELECT 
            i.*,  -- Selecciona todas las columnas de ilandatxe
            c."Categoria compra" AS categoria_compra  -- Añade la categoría de la compra
        FROM ilandatxe i
        LEFT JOIN categorias c 
        ON i."Usuario Asociado" = c."Comercio";
        """


        # Ejecutar la consulta con Pandas
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
@app.route('/total_movimientos_categorias/<string:tabla_usuario>', methods=['GET'])
def get_total_movimientos_categorias(tabla_usuario):
    """
    Endpoint para obtener toda la tabla ilandatxe con la categoría de compra.
    """
    resultado = total_movimientos_categorias(tabla_usuario)

    # Si la función devuelve un error, lo retornamos como JSON
    if isinstance(resultado, tuple):
        return jsonify({"error": resultado[0]}), resultado[1]

    return jsonify(resultado)

# Iniciar el servidor Flask
if __name__ == '__main__':
    app.run(debug=True)
