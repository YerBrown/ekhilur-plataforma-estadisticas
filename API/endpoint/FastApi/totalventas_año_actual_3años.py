from fastapi import APIRouter
from fastapi.responses import JSONResponse
import sqlite3
from datetime import datetime, timedelta
from os.path import join, dirname, abspath

router = APIRouter()

@router.get("/total_ventas_años")
async def get_total_ventas_años():
    """
    Obtiene el total de ventas del año actual y los últimos 3 años
    """
    base_dir = dirname(dirname(abspath(__file__)))
    db_path = join(base_dir, 'db', 'datos_sqlite.db')
    
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Obtener año actual y hace 3 años
        año_actual = datetime.now().year
        año_3_atras = año_actual - 3
        
        query = """
        SELECT 
            strftime('%Y', fecha) as año,
            SUM(CASE 
                WHEN movimiento IN ('Pago en comercio', 'Compra en comercio') 
                THEN CAST(REPLACE(REPLACE(cantidad, ',', '.'), '€', '') AS FLOAT)
                ELSE 0 
            END) as total_ventas
        FROM movimientos 
        WHERE strftime('%Y', fecha) >= ?
        GROUP BY strftime('%Y', fecha)
        ORDER BY año DESC
        """
        
        cursor.execute(query, (str(año_3_atras),))
        results = cursor.fetchall()
        
        if results:
            data = {
                "año_actual": {
                    "año": results[0][0],
                    "total_ventas": round(float(results[0][1]), 2)
                },
                "ultimos_3_años": [{
                    "año": row[0],
                    "total_ventas": round(float(row[1]), 2)
                } for row in results[1:4]]  # Excluimos el año actual
            }
            return JSONResponse(content=data)
        else:
            return JSONResponse(
                status_code=404,
                content={"mensaje": "No se encontraron datos de ventas"}
            )
            
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"error": f"Error en la consulta: {str(e)}"}
        )
    finally:
        if conn:
            conn.close() 