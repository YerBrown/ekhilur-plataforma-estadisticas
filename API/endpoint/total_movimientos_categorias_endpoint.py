from flask import Blueprint, jsonify
import sqlite3
import pandas as pd
import os

# Crear el blueprint
movimientos_categorias_bp = Blueprint('movimientos_categorias', __name__)

# Ruta relativa de la base de datos SQLite
DATABASE_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'db')
DATABASE_PATH = os.path.join(DATABASE_DIR, 'datos_sqlite.db')

# Asegurarnos de que el directorio existe
os.makedirs(DATABASE_DIR, exist_ok=True)

@movimientos_categorias_bp.route('/total_movimientos_categorias/<string:tabla_usuario>', methods=['GET'])
def get_total_movimientos_categorias(tabla_usuario):
    """
    Endpoint para obtener el total de movimientos por categoría
    """
    # Validamos que la tabla esté permitida
    tablas_permitidas = {"ilandatxe", "fotostorres", "alomorga", "categorias"}
    if tabla_usuario not in tablas_permitidas:
        return jsonify({"error": "Nombre de tabla no permitido."}), 400

    try:
        conexion = sqlite3.connect(DATABASE_PATH)
    except sqlite3.Error as e:
        return jsonify({
            "error": "Error de conexión a la base de datos",
            "detalles": str(e)
        }), 500

    try:
        query = f"""
        WITH movimientos_categoria AS (
            SELECT 
                strftime('%Y', i.Fecha) as año,
                strftime('%m', i.Fecha) as mes,
                COALESCE(c."Categoria compra", 'Sin Categoría') as categoria,
                COUNT(*) as total_movimientos,
                SUM(CASE WHEN i.Cantidad > 0 THEN i.Cantidad ELSE 0 END) as total_ingresos,
                SUM(CASE WHEN i.Cantidad < 0 THEN ABS(i.Cantidad) ELSE 0 END) as total_gastos,
                SUM(i.Cantidad) as balance_neto
            FROM {tabla_usuario} i
            LEFT JOIN categorias c ON i."Usuario Asociado" = c.Comercio
            GROUP BY strftime('%Y', i.Fecha), strftime('%m', i.Fecha), c."Categoria compra"
        )
        SELECT 
            año,
            mes,
            categoria,
            total_movimientos,
            ROUND(total_ingresos, 2) as total_ingresos,
            ROUND(total_gastos, 2) as total_gastos,
            ROUND(balance_neto, 2) as balance_neto
        FROM movimientos_categoria
        ORDER BY año DESC, mes DESC, total_movimientos DESC;
        """

        df = pd.read_sql_query(query, conexion)

        if df.empty:
            return jsonify({"message": "No hay datos disponibles."}), 404

        # Formatear los datos según apiJsons.txt
        resultado = []
        for _, row in df.iterrows():
            resultado.append({
                "año": str(row['año']),
                "mes": str(row['mes']).zfill(2),  # Asegura que el mes tenga 2 dígitos
                "categoria": str(row['categoria']),
                "total_movimientos": int(row['total_movimientos']),
                "total_ingresos": float(row['total_ingresos']),
                "total_gastos": float(row['total_gastos']),
                "balance_neto": float(row['balance_neto'])
            })

        return jsonify(resultado)

    except Exception as e:
        return jsonify({
            "error": "Error al ejecutar la consulta",
            "detalles": str(e)
        }), 500

    finally:
        conexion.close()
