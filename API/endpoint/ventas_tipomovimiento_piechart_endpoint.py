from flask import Blueprint, jsonify, send_file, request
import sqlite3
import pandas as pd
import matplotlib.pyplot as plt
import os #! Importar solo los paquetes necesarios
from datetime import datetime

# Crear el blueprint
ventas_pie_bp = Blueprint('ventas_pie', __name__)

@ventas_pie_bp.route('/ventas_tipo_movimiento_pie/<tabla_usuario>', methods=['GET'])
def get_ventas_tipo_movimiento_pie(tabla_usuario):
    """
    Genera un gráfico de tipo pie para las ventas por tipo de movimiento
    """
    try:
        # Configurar el estilo
        plt.style.use('dark_background')

        # Obtener y convertir parámetros a enteros
        mes = int(request.args.get('mes', datetime.now().month))
        anio = int(request.args.get('anio', datetime.now().year))
        
        # Conexión a la base de datos
        DATABASE = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'db', 'datos_sqlite.db')
        conexion = sqlite3.connect(DATABASE)
        
        query = f"""
        SELECT 
            Movimiento,
            SUM(Cantidad) as Total
        FROM {tabla_usuario}
        WHERE strftime('%Y', Fecha) = '{str(anio)}'
        AND strftime('%m', Fecha) = '{str(mes).zfill(2)}'
        GROUP BY Movimiento
        """
        
        df = pd.read_sql_query(query, conexion)
        
        # Crear el gráfico
        plt.figure(figsize=(10, 8))
        plt.pie(df['Total'], labels=df['Movimiento'], autopct='%1.1f%%')
        plt.title(f'Distribución de Ventas por Tipo - {mes}/{anio}')
        
        # Guardar el gráfico
        img_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'static')
        os.makedirs(img_path, exist_ok=True)
        plt.savefig(os.path.join(img_path, 'ventas_pie.png'))
        plt.close()
        
        return jsonify({
            "status": "success",
            "mensaje": "Gráfico generado correctamente",
            "datos": {
                "total_movimientos": len(df),
                "fecha": f"{mes}/{anio}",
                "ruta_grafico": "static/ventas_pie.png"
            }
        })

    except Exception as e:
        return jsonify({
            "error": "Error al generar el gráfico",
            "tipo": str(type(e)),
            "detalles": str(e)
        }), 500

    finally:
        conexion.close()
