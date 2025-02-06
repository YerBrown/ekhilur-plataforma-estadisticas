from fastapi import APIRouter
from fastapi.responses import JSONResponse
import sqlite3
from os.path import join, dirname, abspath

router = APIRouter()

@router.get("/listado_cashback/{año}/{mes}")
async def get_listado_cashback(año: int, mes: int):
    base_dir = dirname(dirname(abspath(__file__)))
    db_path = join(base_dir, 'db', 'datos_sqlite.db')
    
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        query = """
        SELECT 
            strftime('%Y', fecha) as año,
            strftime('%m', fecha) as mes,
            fecha,
            descripcion,
            movimiento as tipo_movimiento,
            CAST(REPLACE(REPLACE(cantidad, ',', '.'), '€', '') AS FLOAT) as monto
        FROM movimientos 
        WHERE strftime('%Y', fecha) = ? 
        AND strftime('%m', fecha) = ?
        AND movimiento = 'Descuento automático'
        ORDER BY fecha DESC
        """
        
        cursor.execute(query, (str(año), str(mes).zfill(2)))
        results = cursor.fetchall()
        
        if results:
            data = [{
                "año": row[0],
                "mes": row[1],
                "fecha": row[2],
                "descripcion": row[3],
                "tipo_movimiento": row[4],
                "monto": round(float(row[5]), 2)
            } for row in results]
            return JSONResponse(content=data)
        else:
            return JSONResponse(content=[{
                "año": str(año),
                "mes": str(mes).zfill(2),
                "mensaje": "No hay registros de cashback para este período"
            }])
            
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"error": f"Error en la consulta: {str(e)}"}
        )
    finally:
        if conn:
            conn.close() 