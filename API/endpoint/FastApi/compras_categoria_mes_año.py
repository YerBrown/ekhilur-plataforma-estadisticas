from fastapi import APIRouter
from fastapi.responses import JSONResponse
import sqlite3
from os.path import join, dirname, abspath

router = APIRouter()

@router.get("/compras_categoria/{año}/{mes}")
async def get_compras_categoria(año: int, mes: int):
    base_dir = dirname(dirname(abspath(__file__)))
    db_path = join(base_dir, 'db', 'datos_sqlite.db')
    
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        query = """
        SELECT 
            strftime('%Y', fecha) as año,
            strftime('%m', fecha) as mes,
            categoria,
            COUNT(*) as num_compras,
            SUM(CAST(REPLACE(REPLACE(cantidad, ',', '.'), '€', '') AS FLOAT)) as total_gastado
        FROM movimientos 
        WHERE strftime('%Y', fecha) = ? 
        AND strftime('%m', fecha) = ?
        AND movimiento IN ('Pago en comercio', 'Compra en comercio')
        GROUP BY strftime('%Y', fecha), strftime('%m', fecha), categoria
        HAVING total_gastado > 0
        ORDER BY total_gastado DESC
        """
        
        cursor.execute(query, (str(año), str(mes).zfill(2)))
        results = cursor.fetchall()
        
        if results:
            data = [{
                "año": row[0],
                "mes": row[1],
                "categoria": row[2] if row[2] else "Sin categoría",
                "num_compras": row[3],
                "total_gastado": round(float(row[4]), 2)
            } for row in results]
            return JSONResponse(content=data)
        else:
            return JSONResponse(content=[{
                "año": str(año),
                "mes": str(mes).zfill(2),
                "categoria": "Sin datos",
                "num_compras": 0,
                "total_gastado": 0
            }])
            
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"error": f"Error en la consulta: {str(e)}"}
        )
    finally:
        if conn:
            conn.close() 