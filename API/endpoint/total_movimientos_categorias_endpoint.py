from flask import Blueprint, jsonify
from sqlite3 import connect, OperationalError
from os.path import join, dirname, exists
from os import makedirs
from pandas import read_sql_query, DataFrame

# Crear el blueprint
movimientos_categorias_bp = Blueprint('total_movimientos_categorias', __name__)

# Ruta relativa de la base de datos SQLite
DATABASE_DIR = join(dirname(dirname(__file__)), 'db')
DATABASE_PATH = join(DATABASE_DIR, 'datos_sqlite.db')

# Asegurarnos de que el directorio existe
makedirs(DATABASE_DIR, exist_ok=True)

def get_total_movimientos_categorias(tabla_usuario):
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
            c.Categoria as categoria,
            COUNT(*) as total_movimientos,
            SUM(ABS(t.Cantidad)) as importe_total,
            COUNT(CASE WHEN t.Cantidad > 0 THEN 1 END) as num_ingresos,
            COUNT(CASE WHEN t.Cantidad < 0 THEN 1 END) as num_gastos,
            SUM(CASE WHEN t.Cantidad > 0 THEN t.Cantidad ELSE 0 END) as total_ingresos,
            SUM(CASE WHEN t.Cantidad < 0 THEN ABS(t.Cantidad) ELSE 0 END) as total_gastos
        FROM {tabla_usuario} t
        JOIN categorias c ON t."Usuario Asociado" = c."Usuario Asociado"
        GROUP BY categoria
        ORDER BY total_movimientos DESC;
        """
        
        df = read_sql_query(query, conexion)
        
        resultado = []
        for _, row in df.iterrows():
            resultado.append({
                "categoria": str(row['categoria']),
                "total_movimientos": int(row['total_movimientos']),
                "importe_total": float(row['importe_total']),
                "num_ingresos": int(row['num_ingresos']),
                "num_gastos": int(row['num_gastos']),
                "total_ingresos": float(row['total_ingresos']),
                "total_gastos": float(row['total_gastos'])
            })
        
        conexion.close()
        return resultado
    except Exception as e:
        return {
            "error": "Error al ejecutar la consulta",
            "detalles": str(e)
        }, 500

@movimientos_categorias_bp.route('/total_movimientos_categorias/<string:tabla_usuario>', methods=['GET'])
def get_movimientos_categorias(tabla_usuario):
    """
    Endpoint para obtener el total de movimientos por categoría.
    """
    resultado = get_total_movimientos_categorias(tabla_usuario)
    if isinstance(resultado, tuple):
        return jsonify({"error": resultado[0]}), resultado[1]
    return jsonify(resultado)
