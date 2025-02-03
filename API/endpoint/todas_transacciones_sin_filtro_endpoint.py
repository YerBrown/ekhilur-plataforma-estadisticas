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

# Función para obtener listado de todas las transacciones
def get_listado_todas_sin(tabla_usuario):
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
        # Consulta SQL para obtener los datos de todas las transacciones
        query_listado_todas_sin = f"""
        SELECT 
            a.Año AS anio, 
            a.Mes, 
            a.Fecha, 
            a.Movimiento, 
            a.Cantidad, 
            a."Usuario Asociado" AS usuario_asociado, 
            a.Saldo, 
            a.Cuenta 
        FROM {tabla_usuario} a
        ORDER BY a.Fecha;
        """
        
        # Ejecutar la consulta y obtener los resultados
        df = pd.read_sql_query(query_listado_todas_sin, conexion)
        
        # Cerrar la conexión
        conexion.close()
        
        return df.to_dict(orient='records')
    except Exception as e:
        return {
            "error": "Error al ejecutar la consulta",
            "detalles": str(e)
        }, 500

# Definir el endpoint para obtener listado de todas las transacciones
@app.route('/todas_transacciones_sin_filtro/<string:tabla_usuario>', methods=['GET'])
def listado_todas_sin_endpoint(tabla_usuario):
    """
    Endpoint para obtener listado de todas las transacciones.
    """
    resultado = get_listado_todas_sin(tabla_usuario)
    if isinstance(resultado, tuple):
        return jsonify({"error": resultado[0]}), resultado[1]
    return jsonify(resultado)

# Iniciar el servidor Flask
if __name__ == '__main__':
    app.run(debug=True)
