from fastapi import APIRouter
from fastapi.responses import JSONResponse
import sqlite3
from os.path import join, dirname, abspath

router = APIRouter()

@router.get("/cashback_emitido/{año}")
async def get_cashback_emitido(año: int):
    # Configurar la ruta de la base de datos
    base_dir = dirname(dirname(abspath(__file__)))
    db_path = join(base_dir, 'db', 'datos_sqlite.db')
    
    try:
        # Conectar a la base de datos
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Ejecutar la consulta
        query = """
        SELECT strftime('%Y', fecha) as año,
               SUM(CASE 
                   WHEN movimiento = 'Descuento automático' 
                   THEN CAST(REPLACE(REPLACE(cantidad, ',', '.'), '€', '') AS FLOAT)
                   ELSE 0 
               END) as total_cashback
        FROM movimientos 
        WHERE strftime('%Y', fecha) = ?
        GROUP BY strftime('%Y', fecha)
        """
        
        cursor.execute(query, (str(año),))
        result = cursor.fetchone()
        
        if result:
            return JSONResponse(content={
                "año": result[0],
                "total_cashback": round(float(result[1]), 2)
            })
        else:
            return JSONResponse(content={
                "año": str(año),
                "total_cashback": 0
            })
            
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"error": f"Error en la consulta: {str(e)}"}
        )
    finally:
        conn.close() 