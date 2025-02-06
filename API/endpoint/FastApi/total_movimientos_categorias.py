from fastapi import APIRouter
from fastapi.responses import JSONResponse
import sqlite3
from os.path import join, dirname, abspath

router = APIRouter()

@router.get("/total_movimientos_categorias/{año}/{mes}")
async def get_total_movimientos_categorias(año: int, mes: int):
    """
    Obtiene el total de movimientos por categorías para un mes y año específicos
    """
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
            COUNT(*) as num_movimientos,
            SUM(CAST(REPLACE(REPLACE(cantidad, ',', '.'), '€', '') AS FLOAT)) as total_monto
        FROM movimientos 
        WHERE strftime('%Y', fecha) = ? 
        AND strftime('%m', fecha) = ?
        GROUP BY strftime('%Y', fecha), strftime('%m', fecha), categoria
        ORDER BY total_monto DESC
        """
        
        cursor.execute(query, (str(año), str(mes).zfill(2)))
        results = cursor.fetchall()
        
        if results:
            data = [{
                "año": row[0],
                "mes": row[1],
                "categoria": row[2] if row[2] else "Sin categoría",
                "num_movimientos": row[3],
                "total_monto": round(float(row[4]), 2)
            } for row in results]
            return JSONResponse(content=data)
        else:
            return JSONResponse(content=[{
                "año": str(año),
                "mes": str(mes).zfill(2),
                "mensaje": "No hay movimientos para este período"
            }])
            
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"error": f"Error en la consulta: {str(e)}"}
        )
    finally:
        if conn:
            conn.close() 