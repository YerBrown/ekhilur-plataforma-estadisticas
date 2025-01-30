from flask import Flask, jsonify
import sqlite3
import pandas as pd

app = Flask(__name__)

# Ruta de la base de datos SQLite
db_path = r"C:\Users\AMAIA.LAPTOP-8V03DE51\The_Bridge\Repositorios\Ekhilur\Intake 5 FT (Ekhilur)-20250122T113507Z-001\Funciones\datos_sqlite.db"

# Función para calcular cashback emitido agrupado por mes y año
def cashback_emitido_mes_año(tabla_usuario):
    # Validamos que la tabla esté permitida
    tablas_permitidas = {"ilandatxe", "fotostorres", "alex", "categorias"}  

    if tabla_usuario not in tablas_permitidas:
        return {"error": "Nombre de tabla no permitido."}, 400

    # Conectar a la base de datos
    conexion = sqlite3.connect(db_path)

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
