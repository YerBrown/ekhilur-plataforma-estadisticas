from fastapi import APIRouter
from fastapi.responses import JSONResponse
import sqlite3
import pandas as pd
from os.path import join, dirname, abspath

router = APIRouter()

@router.get("/ventas_tipo/{año}/{mes}")
async def get_ventas_tipo_mes_año(año: int, mes: int):
    """
    Obtiene el resumen de ventas por tipo de movimiento para un mes y año específicos
    """
    base_dir = dirname(dirname(abspath(__file__)))
    db_path = join(base_dir, 'db', 'datos_sqlite.db')
    
    try:
        conn = sqlite3.connect(db_path)
        
        query = """
        SELECT 
            strftime('%Y', fecha) as año,
            strftime('%m', fecha) as mes,
            movimiento as tipo_movimiento,
            COUNT(*) as num_operaciones,
            SUM(CAST(REPLACE(REPLACE(cantidad, ',', '.'), '€', '') AS FLOAT)) as total_monto,
            AVG(CAST(REPLACE(REPLACE(cantidad, ',', '.'), '€', '') AS FLOAT)) as promedio_operacion
        FROM movimientos 
        WHERE strftime('%Y', fecha) = ? 
        AND strftime('%m', fecha) = ?
        GROUP BY strftime('%Y', fecha), strftime('%m', fecha), movimiento
        ORDER BY total_monto DESC
        """
        
        df = pd.read_sql_query(query, conn, params=(str(año), str(mes).zfill(2)))
        
        if not df.empty:
            resultado = [{
                "año": str(row['año']),
                "mes": str(row['mes']),
                "tipo_movimiento": row['tipo_movimiento'],
                "num_operaciones": int(row['num_operaciones']),
                "total_monto": round(float(row['total_monto']), 2),
                "promedio_operacion": round(float(row['promedio_operacion']), 2)
            } for _, row in df.iterrows()]
            
            return JSONResponse(content=resultado)
        else:
            return JSONResponse(content=[{
                "año": str(año),
                "mes": str(mes).zfill(2),
                "mensaje": "No hay datos para este período"
            }])
            
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