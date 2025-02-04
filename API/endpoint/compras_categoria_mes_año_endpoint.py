from flask import Blueprint, jsonify
from sqlite3 import connect, OperationalError
from os.path import join, dirname, exists
from os import makedirs
from pandas import read_sql_query, DataFrame

# Crear el blueprint
compras_categoria_bp = Blueprint('compras_categoria_mes_año', __name__)

# Ruta relativa de la base de datos SQLite
DATABASE_DIR = join(dirname(dirname(__file__)), 'db')
DATABASE_PATH = join(DATABASE_DIR, 'datos_sqlite.db')

# Asegurarnos de que el directorio existe
makedirs(DATABASE_DIR, exist_ok=True)

def compras_categoria_mes_año(tabla_usuario):
    # Validamos que la tabla esté permitida
    tablas_permitidas = {"fotostorres"}
    if tabla_usuario not in tablas_permitidas:
        return {"error": "Este endpoint solo está disponible para la tabla fotostorres."}, 400
    
    try:
        conexion = connect(DATABASE_PATH)
    except OperationalError as e:
        return {
            "error": "No se pudo conectar a la base de datos",
            "detalles": str(e),
            "ruta_bd": DATABASE_PATH
        }, 500
    
    try:
        query = f"""
        SELECT 
            strftime('%Y', t.Fecha) AS año,
            strftime('%m', t.Fecha) AS mes,
            c.Categoria as categoria,
            COUNT(*) as numero_compras,
            SUM(ABS(t.Cantidad)) as total_gastado
        FROM {tabla_usuario} t
        JOIN categorias c ON t."Usuario Asociado" = c."Usuario Asociado"
        WHERE t.Movimiento = 'Compra'
        GROUP BY año, mes, categoria
        ORDER BY año, mes, categoria;
        """
        
        df = read_sql_query(query, conexion)
        
        resultado = []
        for _, row in df.iterrows():
            resultado.append({
                "año": str(row['año']),
                "mes": str(row['mes']).zfill(2),
                "categoria": str(row['categoria']),
                "numero_compras": int(row['numero_compras']),
                "total_gastado": float(row['total_gastado'])
            })
        
        conexion.close()
        return resultado
    except Exception as e:
        return {
            "error": "Error al ejecutar la consulta",
            "detalles": str(e)
        }, 500

@compras_categoria_bp.route('/compras_categoria_mes_año/<string:tabla_usuario>', methods=['GET'])
def get_compras_categoria_mes_año(tabla_usuario):
    """
    Endpoint para obtener las compras por categoría, mes y año.
    """
    resultado = compras_categoria_mes_año(tabla_usuario)
    if isinstance(resultado, tuple):
        return jsonify({"error": resultado[0]}), resultado[1]
    return jsonify(resultado)
