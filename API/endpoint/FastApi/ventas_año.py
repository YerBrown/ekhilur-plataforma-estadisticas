from fastapi import APIRouter
from fastapi.responses import JSONResponse
import sqlite3
import pandas as pd
from os.path import join, dirname, abspath, exists
from os import makedirs

router = APIRouter()

# Configurar directorios
base_dir = dirname(dirname(abspath(__file__)))
DATABASE_DIR = join(base_dir, 'db')
DATABASE_PATH = join(DATABASE_DIR, 'datos_sqlite.db')

# Asegurar que existe el directorio
makedirs(DATABASE_DIR, exist_ok=True)

@router.get("/ventas/{tabla_usuario}")
async def get_ventas_por_año(tabla_usuario: str):
    """
    Obtiene el resumen de ventas por año
    
    - tabla_usuario: Nombre de la tabla (solo disponible para fotostorres)
    """
    # Validar tabla
    tablas_permitidas = {"fotostorres"}
    if tabla_usuario not in tablas_permitidas:
        return JSONResponse(
            status_code=400,
            content={"error": "Este endpoint solo está disponible para la tabla fotostorres."}
        )
    
    try:
        conn = sqlite3.connect(DATABASE_PATH)
        
        query = f"""
        SELECT 
            strftime('%Y', Fecha) AS año,
            COUNT(*) as num_ventas,
            SUM(ABS(Cantidad)) as total_ventas,
            COUNT(CASE WHEN Cantidad > 0 THEN 1 END) as num_ingresos,
            COUNT(CASE WHEN Cantidad < 0 THEN 1 END) as num_gastos,
            SUM(CASE WHEN Cantidad > 0 THEN Cantidad ELSE 0 END) as total_ingresos,
            SUM(CASE WHEN Cantidad < 0 THEN ABS(Cantidad) ELSE 0 END) as total_gastos
        FROM {tabla_usuario}
        WHERE Movimiento = 'Compra'
        GROUP BY año
        ORDER BY año DESC
        """
        
        df = pd.read_sql_query(query, conn)
        
        if not df.empty:
            resultado = [{
                "año": str(row['año']),
                "num_ventas": int(row['num_ventas']),
                "total_ventas": float(row['total_ventas']),
                "num_ingresos": int(row['num_ingresos']),
                "num_gastos": int(row['num_gastos']),
                "total_ingresos": float(row['total_ingresos']),
                "total_gastos": float(row['total_gastos'])
            } for _, row in df.iterrows()]
            
            return JSONResponse(content=resultado)
        else:
            return JSONResponse(
                status_code=404,
                content={"mensaje": "No se encontraron datos de ventas"}
            )
            
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={
                "error": "Error en la consulta",
                "detalles": str(e)
            }
        )
    finally:
        if 'conn' in locals():
            conn.close() 