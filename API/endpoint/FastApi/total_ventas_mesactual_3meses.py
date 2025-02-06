from fastapi import APIRouter
from fastapi.responses import JSONResponse
import sqlite3
from datetime import datetime, timedelta
from os.path import join, dirname, abspath

router = APIRouter()

@router.get("/total_ventas_comparativa")
async def get_total_ventas_comparativa():
    """
    Obtiene el total de ventas del mes actual y los últimos 3 meses
    """
    base_dir = dirname(dirname(abspath(__file__)))
    db_path = join(base_dir, 'db', 'datos_sqlite.db')
    
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Obtener fecha actual y hace 3 meses
        fecha_actual = datetime.now()
        fecha_3_meses = fecha_actual - timedelta(days=90)
        
        query = """
        SELECT 
            strftime('%Y', fecha) as año,
            strftime('%m', fecha) as mes,
            SUM(CASE 
                WHEN movimiento IN ('Pago en comercio', 'Compra en comercio') 
                THEN CAST(REPLACE(REPLACE(cantidad, ',', '.'), '€', '') AS FLOAT)
                ELSE 0 
            END) as total_ventas
        FROM movimientos 
        WHERE fecha >= ?
        GROUP BY strftime('%Y', fecha), strftime('%m', fecha)
        ORDER BY año DESC, mes DESC
        """
        
        cursor.execute(query, (fecha_3_meses.strftime('%Y-%m-%d'),))
        results = cursor.fetchall()
        
        if results:
            data = {
                "mes_actual": {
                    "año": results[0][0],
                    "mes": results[0][1],
                    "total_ventas": round(float(results[0][2]), 2)
                },
                "ultimos_3_meses": [{
                    "año": row[0],
                    "mes": row[1],
                    "total_ventas": round(float(row[2]), 2)
                } for row in results[1:4]]  # Excluimos el mes actual
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