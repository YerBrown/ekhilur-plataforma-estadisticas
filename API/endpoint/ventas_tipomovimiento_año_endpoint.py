from flask import Blueprint, jsonify
import sqlite3
import pandas as pd
import os #! Importar solo los paquetes necesarios

# Crear el blueprint
ventas_tipo_bp = Blueprint('ventas_tipo', __name__)

# Ruta relativa de la base de datos SQLite
DATABASE_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'db')
DATABASE_PATH = os.path.join(DATABASE_DIR, 'datos_sqlite.db')

# Asegurarnos de que el directorio existe
os.makedirs(DATABASE_DIR, exist_ok=True)

@ventas_tipo_bp.route('/ventas_tipo_movimiento/<string:tabla_usuario>', methods=['GET'])
def get_ventas_tipo_movimiento_anio(tabla_usuario):
    """
    Endpoint para obtener ventas por tipo de movimiento y año
    """
    # Validamos que la tabla esté permitida
    #! Los nombres de las tablas no pueden coincidir con los de usuarios
    tablas_permitidas = {"ilandatxe", "fotostorres", "alex", "categorias"}  

    if tabla_usuario not in tablas_permitidas:
        return jsonify({"error": "Nombre de tabla no permitido."}), 400

    try:
        # Conectar a la base de datos
        conexion = sqlite3.connect(DATABASE_PATH)
    except sqlite3.Error as e:
        return jsonify({
            "error": "Error de conexión a la base de datos",
            "detalles": str(e)
        }), 500

    try:
        # Query mejorada para obtener ventas por tipo de movimiento
        query = f"""
        WITH ventas_tipo AS (
            SELECT 
                strftime('%Y', Fecha) as anio,
                Movimiento,
                SUM(CASE 
                    WHEN Cantidad > 0 THEN Cantidad 
                    ELSE 0 
                END) as total_ventas,
                COUNT(CASE 
                    WHEN Cantidad > 0 THEN 1 
                END) as num_transacciones,
                AVG(CASE 
                    WHEN Cantidad > 0 THEN Cantidad 
                END) as venta_promedio
            FROM {tabla_usuario}
            WHERE Movimiento IN ('Pago a usuario', 'Cobro desde QR')
            GROUP BY anio, Movimiento
        )
        SELECT 
            anio,
            Movimiento as tipo_movimiento,
            ROUND(total_ventas, 2) as total_ventas,
            num_transacciones,
            ROUND(venta_promedio, 2) as venta_promedio,
            ROUND(total_ventas / CASE 
                WHEN num_transacciones = 0 THEN 1 
                ELSE num_transacciones 
            END, 2) as ticket_promedio
        FROM ventas_tipo
        ORDER BY anio DESC, tipo_movimiento;
        """

        # Ejecutar la consulta
        df = pd.read_sql_query(query, conexion)

        if df.empty:
            return jsonify({"message": "No hay datos de ventas disponibles."}), 404

        # Convertir todos los datos a tipos simples
        resultado = []
        for _, row in df.iterrows():
            # Manejar valores NaN
            venta_promedio = 0.0 if pd.isna(row['venta_promedio']) else float(row['venta_promedio'])
            ticket_promedio = 0.0 if pd.isna(row['ticket_promedio']) else float(row['ticket_promedio'])
            
            resultado.append({
                "anio": str(row['anio']),
                "tipo_movimiento": str(row['tipo_movimiento']),
                "total_ventas": float(row['total_ventas']),
                "num_transacciones": int(row['num_transacciones']),
                "venta_promedio": venta_promedio,
                "ticket_promedio": ticket_promedio
            })

        # Devolver respuesta
        return jsonify({
            "status": "success",
            "data": resultado
        })

    except Exception as e:
        return jsonify({
            "error": "Error al ejecutar la consulta",
            "detalles": str(e)
        }), 500

    finally:
        conexion.close()