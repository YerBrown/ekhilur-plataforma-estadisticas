from flask import Flask, jsonify
import sqlite3
import pandas as pd
import os

app = Flask(__name__)

# Ruta relativa de la base de datos SQLite
DATABASE_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'db')
DATABASE_PATH = os.path.join(DATABASE_DIR, 'datos_sqlite.db')
print(f"Ruta de la base de datos: {DATABASE_PATH}")

# Asegurarnos de que el directorio existe
os.makedirs(DATABASE_DIR, exist_ok=True)

# Función para obtener ventas agrupadas por año
def get_ventas_anio():
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
        # Consulta SQL para obtener los datos de ventas por año
        query_ventas_anio = """
        SELECT Año AS anio, printf('%.2f', SUM(Cantidad)) AS total_ventas
        FROM fotostorres
        WHERE (Movimiento = 'Pago a usuario' AND Cantidad > 0)
            OR (Movimiento = 'Cobro desde QR' AND Cantidad > 0)
        GROUP BY Año;
        """
        
        # Ejecutar la consulta y obtener los resultados
        df = pd.read_sql_query(query_ventas_anio, conexion)
        
        # Cerrar la conexión
        conexion.close()
        
        return df.to_dict(orient='records')
    except Exception as e:
        return {
            "error": "Error al ejecutar la consulta",
            "detalles": str(e)
        }, 500

# Definir el endpoint para obtener ventas por año
@app.route('/ventas_anio', methods=['GET'])
def ventas_anio_endpoint():
    """
    Endpoint para obtener ventas agrupadas por año.
    """
    resultado = get_ventas_anio()
    if isinstance(resultado, tuple):
        return jsonify({"error": resultado[0]}), resultado[1]
    return jsonify(resultado)

# Iniciar el servidor Flask
if __name__ == '__main__':
    app.run(debug=True)
