from flask import Blueprint, jsonify, send_file, request
import sqlite3
import pandas as pd
import matplotlib.pyplot as plt
import os
from datetime import datetime

# Crear el blueprint
ventas_pie_bp = Blueprint('ventas_pie', __name__)

@ventas_pie_bp.route('/ventas_tipo_movimiento_pie/<string:tabla_usuario>', methods=['GET'])
def get_ventas_tipo_movimiento_pie(tabla_usuario):
    """
    Genera un gráfico de tipo pie para las ventas por tipo de movimiento
    """
    # Validamos que la tabla sea fotostorres
    if tabla_usuario != "fotostorres":
        return jsonify({"error": "Este endpoint solo está disponible para fotostorres."}), 400

    try:
        # Configurar el estilo
        plt.style.use('dark_background')

        # Obtener y convertir parámetros a enteros
        mes = int(request.args.get('mes', datetime.now().month))
        año = int(request.args.get('anio', datetime.now().year))
        
        # Conexión a la base de datos
        DATABASE = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'db', 'datos_sqlite.db')
        conexion = sqlite3.connect(DATABASE)
        
        query = f"""
        SELECT 
            Movimiento as tipo_movimiento,
            ROUND(SUM(Cantidad), 2) as total
        FROM {tabla_usuario}
        WHERE strftime('%Y', Fecha) = '{str(año)}'
        AND strftime('%m', Fecha) = '{str(mes).zfill(2)}'
        GROUP BY Movimiento
        """
        
        df = pd.read_sql_query(query, conexion)
        
        # Crear el gráfico
        plt.figure(figsize=(10, 8))
        plt.pie(df['total'], labels=df['tipo_movimiento'], autopct='%1.1f%%')
        plt.title(f'Distribución de Ventas por Tipo - {str(mes).zfill(2)}/{año}')
        
        # Guardar el gráfico
        img_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'static')
        os.makedirs(img_path, exist_ok=True)
        plt.savefig(os.path.join(img_path, 'ventas_pie.png'))
        plt.close()

        # Formatear los datos según apiJsons.txt
        resultado = {
            "año": str(año),
            "mes": str(mes).zfill(2),
            "total_movimientos": len(df),
            "datos": [
                {
                    "tipo_movimiento": str(row['tipo_movimiento']),
                    "total": float(row['total'])
                } for _, row in df.iterrows()
            ],
            "ruta_grafico": "static/ventas_pie.png"
        }
        
        return jsonify(resultado)

    except Exception as e:
        return jsonify({
            "error": "Error al generar el gráfico",
            "detalles": str(e)
        }), 500

    finally:
        conexion.close()

