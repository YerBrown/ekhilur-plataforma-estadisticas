<<<<<<< HEAD
from flask import Blueprint, jsonify, send_file, request
import sqlite3
import pandas as pd
import matplotlib
# Configurar backend no interactivo antes de importar pyplot
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import io
import os
# Crear el blueprint
ventas_pie_bp = Blueprint('ventas_pie', __name__)
# Ruta relativa de la base de datos SQLite
DATABASE_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'db')
DATABASE_PATH = os.path.join(DATABASE_DIR, 'datos_sqlite.db')
# Asegurarnos de que el directorio existe
os.makedirs(DATABASE_DIR, exist_ok=True)
@ventas_pie_bp.route('/ventas_tipo_movimiento_pie/<string:tabla_usuario>', methods=['GET'])
def ventas_tipo_movimiento_pie(tabla_usuario):
    """
    Endpoint para generar gráfico de pie de ventas por tipo de movimiento
    """
    try:
        # Validamos que la tabla esté permitida
        tablas_permitidas = {"ilandatxe", "fotostorres", "alomorga", "categorias"}
        if tabla_usuario not in tablas_permitidas:
            return jsonify({"error": "Nombre de tabla no permitido."}), 400
        # Obtener y validar parámetros de la URL
        mes_param = request.args.get('mes', default=None, type=str)
        anio_param = request.args.get('anio', default=None, type=int)
        print(f"Parámetros recibidos - mes: {mes_param}, año: {anio_param}")  # Debug
        # Conectar a la base de datos
        conexion = sqlite3.connect(DATABASE_PATH)
        print(f"Conexión establecida con: {DATABASE_PATH}")  # Debug
        # Query mejorada para obtener ventas
        query = f"""
        WITH ventas_tipo AS (
            SELECT
                strftime('%Y', Fecha) as anio,
                strftime('%m', Fecha) as mes,
                Movimiento,
                SUM(CASE
                    WHEN Cantidad > 0 THEN Cantidad
                    ELSE 0
                END) as total_ventas
            FROM {tabla_usuario}
            WHERE Movimiento IN ('Pago a usuario', 'Cobro desde QR')
            GROUP BY anio, mes, Movimiento
        )
        SELECT
            anio,
            mes,
            Movimiento,
            ROUND(total_ventas, 2) as total_ventas
        FROM ventas_tipo
        WHERE 1=1
        {f"AND anio = '{anio_param}'" if anio_param else ""}
        {f"AND mes = '{int(mes_param):02d}'" if mes_param else ""}
        ORDER BY anio DESC, mes DESC, Movimiento;
        """
        print(f"Ejecutando query: {query}")  # Debug
        # Ejecutar la consulta
        df = pd.read_sql_query(query, conexion)
        print(f"Datos obtenidos: {len(df)} filas")  # Debug
        if df.empty:
            return jsonify({"message": "No hay datos de ventas disponibles."}), 404
        # Calcular totales por tipo de movimiento
        ventas_por_tipo = df.groupby('Movimiento')['total_ventas'].sum()
        print(f"Ventas por tipo: {ventas_por_tipo}")  # Debug
        # Asegurarse de que no hay figuras abiertas
        plt.switch_backend('Agg')
        plt.clf()
        plt.close('all')
        # Configurar el estilo y tema del gráfico
        plt.style.use('seaborn-darkgrid')
        # Crear figura con fondo transparente
        fig = plt.figure(figsize=(12, 8), facecolor='white')
        ax = fig.add_subplot(111)
        # Definir colores personalizados
        colors = ['#2ECC71', '#3498DB', '#E74C3C', '#F1C40F', '#9B59B6']
        # Crear el gráfico de pie con mejoras visuales
        wedges, texts, autotexts = plt.pie(
            ventas_por_tipo,
            labels=ventas_por_tipo.index,
            autopct='%1.1f%%',
            startangle=90,
            shadow=True,
            explode=[0.05] * len(ventas_por_tipo),
            colors=colors,
            textprops={'fontsize': 12},
            wedgeprops={
                'edgecolor': 'white',
                'linewidth': 2,
                'antialiased': True
            }
        )
        # Mejorar el aspecto de los textos
        plt.setp(autotexts, size=10, weight="bold", color="white")
        plt.setp(texts, size=12)
        # Configurar título y aspecto
        titulo = 'Distribución de Ventas por Tipo de Movimiento'
        if mes_param and anio_param:
            titulo += f'\n{int(mes_param):02d}/{anio_param}'
        elif anio_param:
            titulo += f'\nAño {anio_param}'
        plt.title(titulo, pad=20, size=16, weight='bold')
        # Añadir leyenda
        total_ventas = ventas_por_tipo.sum()
        legend_labels = [
            f'{tipo}\n{valor:,.2f}€ ({(valor/total_ventas)*100:.1f}%)'
            for tipo, valor in ventas_por_tipo.items()
        ]
        plt.legend(
            wedges,
            legend_labels,
            title="Tipos de Movimiento",
            loc="center left",
            bbox_to_anchor=(1, 0, 0.5, 1)
        )
        # Ajustar el layout para que quepa la leyenda
        plt.tight_layout()
        # Guardar el gráfico en memoria con alta calidad
        img = io.BytesIO()
        plt.savefig(
            img,
            format='png',
            bbox_inches='tight',
            dpi=300,
            facecolor='white',
            edgecolor='none',
            pad_inches=0.3
        )
        # Asegurarse de cerrar la figura y liberar memoria
        img.seek(0)
        plt.close(fig)
        return send_file(
            img,
            mimetype='image/png',
            as_attachment=False,
            download_name='ventas_pie_chart.png'
        )
    except Exception as e:
        plt.close('all')  # Cerrar todas las figuras en caso de error
        print(f"Error detallado: {str(e)}")
        import traceback
        print(f"Traceback: {traceback.format_exc()}")
        return jsonify({
            "error": "Error al generar el gráfico",
            "detalles": str(e),
            "tipo": str(type(e))
        }), 500
    finally:
        try:
            conexion.close()
            plt.close('all')  # Asegurarse de cerrar todas las figuras
        except:
            pass
=======
from flask import Blueprint, jsonify, send_file, request
import sqlite3
import pandas as pd
import matplotlib.pyplot as plt
import os
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
>>>>>>> ba553d3cfd7891a4d8f67f85d5eb8e3b363df839
