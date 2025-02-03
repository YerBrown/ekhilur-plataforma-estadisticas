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
        "mensaje": "Bienvenido a la API de Compras por Categoría",
        "endpoints_disponibles": {
            "compras_por_categoria": "/compras_por_categoria/<tabla_usuario>",
            "tablas_permitidas": list({"ilandatxe", "fotostorres", "alex", "categorias"})  # Agregar las tablas permitidas aquí
        },
        "ejemplo_uso": "/compras_por_categoria/ilandatxe"
    })

# Función para obtener los gastos por categoría
def compras_por_categoria(tabla_usuario):
    # Lista de tablas permitidas
    tablas_permitidas = {"ilandatxe", "fotostorres", "alex", "categorias"}  # Agrega más si es necesario
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
        # Consulta SQL corregida
        query = f"""
        SELECT
            strftime('%Y', i.Fecha) AS anio,
            strftime('%m', i.Fecha) AS mes,
            c."Categoria compra" AS categoria_compra,
            SUM(CASE WHEN i.Cantidad < 0 THEN i.Cantidad ELSE 0 END) AS total_compras
        FROM {tabla_usuario} i
        JOIN categorias c ON i."Usuario Asociado" = c."Comercio"
        WHERE i.Movimiento = 'Pago a usuario'
        GROUP BY anio, mes, categoria_compra
        ORDER BY anio, mes, categoria_compra;
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

# Definir el endpoint para obtener gastos por categoría
@app.route('/compras_por_categoria/<string:tabla_usuario>', methods=['GET'])
def get_compras_por_categoria(tabla_usuario):
    """
    Endpoint para obtener las compras agrupados por categoría.
    """
    resultado = compras_por_categoria(tabla_usuario)

    # Si la función devuelve un error, lo retornamos como JSON
    if isinstance(resultado, tuple):
        return jsonify({"error": resultado[0]}), resultado[1]

    return jsonify(resultado)

# Iniciar el servidor Flask
if __name__ == '__main__':
    app.run(debug=True)
