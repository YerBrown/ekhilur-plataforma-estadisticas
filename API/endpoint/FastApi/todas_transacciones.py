from fastapi import APIRouter
from fastapi.responses import JSONResponse
import sqlite3
from os.path import join, dirname, abspath

router = APIRouter()

@router.get("/todas_transacciones")
async def get_todas_transacciones():
    """
    Obtiene todas las transacciones sin filtros
    """
    base_dir = dirname(dirname(abspath(__file__)))
    db_path = join(base_dir, 'db', 'datos_sqlite.db')
    
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        query = """
        SELECT 
            strftime('%Y-%m-%d', fecha) as fecha,
            movimiento as tipo_movimiento,
            descripcion,
            categoria,
            CAST(REPLACE(REPLACE(cantidad, ',', '.'), '€', '') AS FLOAT) as monto
        FROM movimientos 
        ORDER BY fecha DESC
        """
        
        cursor.execute(query)
        results = cursor.fetchall()
        
        if results:
            data = [{
                "fecha": row[0],
                "tipo_movimiento": row[1],
                "descripcion": row[2],
                "categoria": row[3] if row[3] else "Sin categoría",
                "monto": round(float(row[4]), 2)
            } for row in results]
            return JSONResponse(content=data)
        else:
            return JSONResponse(
                status_code=404,
                content={"mensaje": "No se encontraron transacciones"}
            )
            
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"error": f"Error en la consulta: {str(e)}"}
        )
    finally:
        if conn:
            conn.close()