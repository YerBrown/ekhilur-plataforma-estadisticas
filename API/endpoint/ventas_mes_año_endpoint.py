<<<<<<< HEAD
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
    # Validamos que la tabla esté permitida
    tablas_permitidas = {"ilandatxe", "fotostorres", "alomorga", "categorias"}
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
        # Query mejorada para obtener ventas mensuales
        query = f"""
        WITH ventas_mensuales AS (
            SELECT
                strftime('%Y', Fecha) as anio,
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
            GROUP BY anio, mes
        )
        SELECT
            anio,
            mes,
            ROUND(total_ventas, 2) as total_ventas,
            num_ventas,
            ROUND(venta_promedio, 2) as venta_promedio,
            ROUND(total_ventas / CASE WHEN num_ventas = 0 THEN 1 ELSE num_ventas END, 2) as ticket_promedio
        FROM ventas_mensuales
        ORDER BY anio DESC, mes DESC;
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
                "mes": str(row['mes']),
                "total_ventas": float(row['total_ventas']),
                "num_ventas": int(row['num_ventas']),
                "venta_promedio": venta_promedio,
                "ticket_promedio": ticket_promedio
            })
        # Intentar serializar para verificar si hay problemas
        try:
            return jsonify({
                "status": "success",
                "data": resultado
            })
        except Exception as e:
            print("Error en serialización:", str(e))
            return jsonify({
                "error": "Error en serialización de datos",
                "detalles": str(e)
            }), 500
    except Exception as e:
        return jsonify({
            "error": "Error al ejecutar la consulta",
            "detalles": str(e)
        }), 500
    finally:
=======
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
    # Validamos que la tabla esté permitida
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
        # Query mejorada para obtener ventas mensuales
        query = f"""
        WITH ventas_mensuales AS (
            SELECT 
                strftime('%Y', Fecha) as anio,
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
            GROUP BY anio, mes
        )
        SELECT 
            anio,
            mes,
            ROUND(total_ventas, 2) as total_ventas,
            num_ventas,
            ROUND(venta_promedio, 2) as venta_promedio,
            ROUND(total_ventas / CASE WHEN num_ventas = 0 THEN 1 ELSE num_ventas END, 2) as ticket_promedio
        FROM ventas_mensuales
        ORDER BY anio DESC, mes DESC;
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
                "mes": str(row['mes']),
                "total_ventas": float(row['total_ventas']),
                "num_ventas": int(row['num_ventas']),
                "venta_promedio": venta_promedio,
                "ticket_promedio": ticket_promedio
            })

        # Intentar serializar para verificar si hay problemas
        try:
            return jsonify({
                "status": "success",
                "data": resultado
            })
        except Exception as e:
            print("Error en serialización:", str(e))
            return jsonify({
                "error": "Error en serialización de datos",
                "detalles": str(e)
            }), 500

    except Exception as e:
        return jsonify({
            "error": "Error al ejecutar la consulta",
            "detalles": str(e)
        }), 500

    finally:
>>>>>>> 5dfb0e9fcb2766b3660f8bdddcf1748e799818b6
        conexion.close()