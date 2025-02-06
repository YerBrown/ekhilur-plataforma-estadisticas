from fastapi import APIRouter
from fastapi.responses import JSONResponse
import sqlite3
import pandas as pd
from os.path import join, dirname, abspath

router = APIRouter()

@router.get("/ventas_piechart/{año}/{mes}")
async def get_ventas_piechart(año: int, mes: int):
    """
    Obtiene datos para gráfico circular de ventas por tipo de movimiento
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
            ABS(SUM(CAST(REPLACE(REPLACE(cantidad, ',', '.'), '€', '') AS FLOAT))) as total_monto
        FROM movimientos 
        WHERE strftime('%Y', fecha) = ? 
        AND strftime('%m', fecha) = ?
        AND movimiento IN ('Pago en comercio', 'Compra en comercio', 'Ingreso', 'Ingreso en cuenta')
        GROUP BY strftime('%Y', fecha), strftime('%m', fecha), movimiento
        ORDER BY total_monto DESC
        """
        
        df = pd.read_sql_query(query, conn, params=(str(año), str(mes).zfill(2)))
        
        if not df.empty:
            total_general = df['total_monto'].sum()
            
            resultado = [{
                "año": str(row['año']),
                "mes": str(row['mes']),
                "tipo_movimiento": row['tipo_movimiento'],
                "num_operaciones": int(row['num_operaciones']),
                "total_monto": round(float(row['total_monto']), 2),
                "porcentaje": round((float(row['total_monto']) / total_general * 100), 2)
            } for _, row in df.iterrows()]
            
            return JSONResponse(content={
                "datos": resultado,
                "total_general": round(float(total_general), 2)
            })
        else:
            return JSONResponse(content={
                "datos": [{
                    "año": str(año),
                    "mes": str(mes).zfill(2),
                    "mensaje": "No hay datos para este período"
                }],
                "total_general": 0
            })
            
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