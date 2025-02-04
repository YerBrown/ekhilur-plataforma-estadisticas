from flask import Blueprint, jsonify
import sqlite3
import pandas as pd
import os

# Crear el blueprint
ventas_mes_bp = Blueprint('ventas_mes', __name__)

# Ruta relativa de la base de datos SQLite
DATABASE_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'db')
DATABASE_PATH = os.path.join(DATABASE_DIR, 'datos_sqlite.db')

# Asegurarnos de que el directorio existe
os.makedirs(DATABASE_DIR, exist_ok=True)

@ventas_mes_bp.route('/ventas/<string:tabla_usuario>', methods=['GET'])
def get_ventas(tabla_usuario):
    """
    Endpoint para obtener todas las ventas agrupadas por mes y año
    """
    # Validamos que la tabla sea fotostorres
    if tabla_usuario != "fotostorres":
        return jsonify({"error": "Este endpoint solo está disponible para fotostorres."}), 400

    try:
        conexion = sqlite3.connect(DATABASE_PATH)
    except sqlite3.Error as e:
        return jsonify({
            "error": "Error de conexión a la base de datos",
            "detalles": str(e)
        }), 500

    try:
        query = f"""
        WITH ventas_mensuales AS (
            SELECT 
                strftime('%Y', Fecha) as año,
                strftime('%m', Fecha) as mes,
                SUM(CASE 
                    WHEN Movimiento IN ('Pago a usuario', 'Cobro desde QR') 
                    AND Cantidad > 0 THEN Cantidad 
                    ELSE 0 
                END) as total_ventas,
                COUNT(CASE 
                    WHEN Movimiento IN ('Pago a usuario', 'Cobro desde QR') 
                    AND Cantidad > 0 THEN 1 
                END) as num_ventas,
                AVG(CASE 
                    WHEN Movimiento IN ('Pago a usuario', 'Cobro desde QR') 
                    AND Cantidad > 0 THEN Cantidad 
                END) as venta_promedio
            FROM {tabla_usuario}
            GROUP BY año, mes
        )
        SELECT 
            año,
            mes,
            ROUND(total_ventas, 2) as total_ventas,
            num_ventas,
            ROUND(venta_promedio, 2) as venta_promedio,
            ROUND(total_ventas / CASE WHEN num_ventas = 0 THEN 1 ELSE num_ventas END, 2) as ticket_promedio
        FROM ventas_mensuales
        ORDER BY año DESC, mes DESC;
        """

        df = pd.read_sql_query(query, conexion)

        if df.empty:
            return jsonify({"message": "No hay datos de ventas disponibles."}), 404

        # Formatear los datos según apiJsons.txt
        resultado = []
        for _, row in df.iterrows():
            # Manejar valores NaN
            venta_promedio = 0.0 if pd.isna(row['venta_promedio']) else float(row['venta_promedio'])
            ticket_promedio = 0.0 if pd.isna(row['ticket_promedio']) else float(row['ticket_promedio'])
            
            resultado.append({
                "año": str(row['año']),
                "mes": str(row['mes']).zfill(2),  # Asegura que el mes tenga 2 dígitos
                "total_ventas": float(row['total_ventas']),
                "num_ventas": int(row['num_ventas']),
                "venta_promedio": venta_promedio,
                "ticket_promedio": ticket_promedio
            })

        return jsonify(resultado)

    except Exception as e:
        return jsonify({
            "error": "Error al ejecutar la consulta",
            "detalles": str(e)
        }), 500

    finally:
        conexion.close()