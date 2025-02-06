from fastapi import APIRouter
from fastapi.responses import JSONResponse
import sqlite3
from os.path import join, dirname, abspath

router = APIRouter()

@router.get("/cashback_generado_total/{año}/{mes}")
async def get_cashback_generado_total(año: int, mes: int):
    base_dir = dirname(dirname(abspath(__file__)))
    db_path = join(base_dir, 'db', 'datos_sqlite.db')
    
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        query = """
        SELECT 
            strftime('%Y', fecha) as año,
            strftime('%m', fecha) as mes,
            SUM(CASE 
                WHEN movimiento = 'Descuento automático' 
                THEN CAST(REPLACE(REPLACE(cantidad, ',', '.'), '€', '') AS FLOAT)
                ELSE 0 
            END) as total_cashback
        FROM movimientos 
        WHERE strftime('%Y', fecha) = ? 
        AND strftime('%m', fecha) = ?
        GROUP BY strftime('%Y', fecha), strftime('%m', fecha)
        """
        
        cursor.execute(query, (str(año), str(mes).zfill(2)))
        result = cursor.fetchone()
        
        if result:
            return JSONResponse(content={
                "año": result[0],
                "mes": result[1],
                "total_cashback": round(float(result[2]), 2)
            })
        else:
            return JSONResponse(content={
                "año": str(año),
                "mes": str(mes).zfill(2),
                "total_cashback": 0
            })
            
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"error": f"Error en la consulta: {str(e)}"}
        )
    finally:
        if conn:
            conn.close() 