from flask import Blueprint, jsonify
import sqlite3
import pandas as pd
import os #! Importar solo los paquetes necesarios

# Crear el blueprint
compras_categoria_bp = Blueprint('compras_categoria', __name__)

# Ruta relativa de la base de datos SQLite
DATABASE_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'db')
DATABASE_PATH = os.path.join(DATABASE_DIR, 'datos_sqlite.db')

# Asegurarnos de que el directorio existe
os.makedirs(DATABASE_DIR, exist_ok=True)

def compras_por_categoria(tabla_usuario):
    # Validamos que la tabla esté permitida
    tablas_permitidas = {"ilandatxe", "fotostorres", "alomorga", "categorias"}
    if tabla_usuario not in tablas_permitidas:
        return {"error": "Nombre de tabla no permitido."}, 400

    try:
        conexion = sqlite3.connect(DATABASE_PATH)
    except sqlite3.OperationalError as e:
        return {
            "error": "No se pudo conectar a la base de datos",
            "detalles": str(e),
            "ruta_bd": DATABASE_PATH
        }, 500

    try:
        query = f"""
        SELECT 
            strftime('%Y', i.Fecha) AS año,
            strftime('%m', i.Fecha) AS mes,
            c."Categoria compra" AS categoria,
            ABS(SUM(CASE 
                WHEN i.Cantidad < 0 THEN i.Cantidad 
                ELSE 0 
            END)) AS total_compras
        FROM {tabla_usuario} i
        JOIN categorias c ON i."Usuario Asociado" = c."Comercio"
        WHERE i.Movimiento = 'Pago a usuario'
        GROUP BY año, mes, categoria
        ORDER BY año DESC, mes DESC, categoria;
        """

        df = pd.read_sql_query(query, conexion)
        
        resultado = []
        for _, row in df.iterrows():
            resultado.append({
                "año": str(row['año']),
                "mes": str(row['mes']).zfill(2),  # Asegura que el mes tenga 2 dígitos
                "categoria": str(row['categoria']),
                "total_compras": float(row['total_compras'])  # Convertimos a float para mantener decimales
            })
        
        conexion.close()
        return resultado
    except Exception as e:
        return {
            "error": "Error al ejecutar la consulta",
            "detalles": str(e)
        }, 500

@compras_categoria_bp.route('/compras_categoria_mes_año/<string:tabla_usuario>', methods=['GET'])
def get_compras_por_categoria(tabla_usuario):
    """
    Endpoint para obtener las compras agrupadas por categoría, mes y año.
    """
    resultado = compras_por_categoria(tabla_usuario)
    if isinstance(resultado, tuple):
        return jsonify({"error": resultado[0]}), resultado[1]
    return jsonify(resultado)
