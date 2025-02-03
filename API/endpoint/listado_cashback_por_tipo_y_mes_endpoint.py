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

# Función para obtener el cashback por mes
def get_cashback_por_mes(tabla_usuario):
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
        # Consulta SQL para obtener cashback por mes
        query = f"""
        SELECT 
            strftime('%Y', Fecha) AS anio,
            strftime('%m', Fecha) AS mes, 
            SUM(CASE WHEN Movimiento = 'Descuento automático' THEN 1 ELSE 0 END) AS total_descuento_automatico,
            SUM(CASE WHEN Movimiento = 'Bonificación por compra' THEN 1 ELSE 0 END) AS total_bonificacion_compra
        FROM {tabla_usuario}
        WHERE Movimiento IN ('Descuento automático', 'Bonificación por compra')
        GROUP BY anio, mes
        ORDER BY anio, mes;
        """
        
        # Ejecutar la consulta y obtener los resultados
        df = pd.read_sql_query(query, conexion)
        
        # Cerrar la conexión
        conexion.close()
        
        return df.to_dict(orient='records')
    except Exception as e:
        return {
            "error": "Error al ejecutar la consulta",
            "detalles": str(e)
        }, 500

# Definir el endpoint para obtener cashback por mes
@app.route('/cashback_mes/<string:tabla_usuario>', methods=['GET'])
def cashback_mes(tabla_usuario):
    """
    Endpoint para obtener cashback agrupado por mes.
    """
    resultado = get_cashback_por_mes(tabla_usuario)
    if isinstance(resultado, tuple):
        return jsonify({"error": resultado[0]}), resultado[1]
    return jsonify(resultado)

# Iniciar el servidor Flask
if __name__ == '__main__':
    app.run(debug=True)
