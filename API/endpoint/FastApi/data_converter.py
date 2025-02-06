from fastapi import APIRouter
from fastapi.responses import JSONResponse
import sqlite3
import pandas as pd
import os
import json
from datetime import datetime
from os.path import join, dirname, abspath

router = APIRouter()

# Configurar directorios
base_dir = dirname(dirname(abspath(__file__)))
DATABASE_PATH = join(base_dir, 'db', 'datos_sqlite.db')
JSON_DIR = join(base_dir, 'json_data')
os.makedirs(JSON_DIR, exist_ok=True)

@router.get('/convert/{tabla_usuario}')
async def convert_sqlite_to_json(tabla_usuario: str):
    """
    Convierte los datos de SQLite a JSON y los guarda en un archivo
    """
    # Validar tabla
    tablas_permitidas = {"ilandatxe", "fotostorres", "alex", "categorias"}
    if tabla_usuario not in tablas_permitidas:
        return JSONResponse(
            status_code=400,
            content={"error": "Nombre de tabla no permitido."}
        )

    try:
        # Conectar a la base de datos
        conexion = sqlite3.connect(DATABASE_PATH)
        
        query = f"""
        SELECT 
            strftime('%Y-%m-%d', Fecha) as fecha,
            Movimiento as tipo_movimiento,
            Cantidad as monto,
            Descripcion as descripcion,
            strftime('%Y', Fecha) as año,
            strftime('%m', Fecha) as mes
        FROM {tabla_usuario}
        ORDER BY Fecha DESC;
        """
        
        df = pd.read_sql_query(query, conexion)
        
        # Generar archivo JSON
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        json_filename = f"{tabla_usuario}_data_{timestamp}.json"
        json_path = join(JSON_DIR, json_filename)
        
        json_data = {
            "metadata": {
                "tabla": tabla_usuario,
                "fecha_exportacion": datetime.now().isoformat(),
                "numero_registros": len(df)
            },
            "datos": df.to_dict(orient='records')
        }
        
        with open(json_path, 'w', encoding='utf-8') as f:
            json.dump(json_data, f, ensure_ascii=False, indent=2)
        
        return JSONResponse(content={
            "status": "success",
            "mensaje": "Datos convertidos exitosamente",
            "detalles": {
                "archivo": json_filename,
                "registros": len(df),
                "ruta": json_path
            }
        })

    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={
                "error": "Error en la conversión",
                "detalles": str(e)
            }
        )
    finally:
        conexion.close()

@router.get('/latest/{tabla_usuario}')
async def get_latest_json(tabla_usuario: str):
    """
    Obtiene el archivo JSON más reciente para una tabla
    """
    try:
        files = [f for f in os.listdir(JSON_DIR) if f.startswith(f"{tabla_usuario}_data_")]
        if not files:
            return JSONResponse(
                status_code=404,
                content={"message": "No hay archivos JSON disponibles"}
            )
        
        latest_file = max(files)
        json_path = join(JSON_DIR, latest_file)
        
        with open(json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        return JSONResponse(content=data)

    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={
                "error": "Error al obtener JSON",
                "detalles": str(e)
            }
        ) 