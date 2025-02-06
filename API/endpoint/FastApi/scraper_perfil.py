from fastapi import APIRouter
from fastapi.responses import JSONResponse
from typing import Optional
from datetime import datetime
import sqlite3
from os.path import join, dirname, abspath
from scraper.scraper_auto import AutoScraper

router = APIRouter()
scraper = AutoScraper()

@router.get("/perfil/{username}")
async def get_perfil(username: str, fecha_inicio: Optional[str] = "01/01/2020"):
    """
    Obtiene los datos del perfil de un usuario específico
    
    - username: Nombre del usuario (alomorga/ilandatxe/fotostorres)
    - fecha_inicio: Fecha inicial en formato DD/MM/YYYY (default: 01/01/2020)
    """
    try:
        if username not in scraper.credentials:
            return JSONResponse(
                status_code=400,
                content={"error": "Usuario no válido"}
            )
        
        # Configurar fechas
        fecha_fin = datetime.now().strftime("%d/%m/%Y")
        
        # Obtener datos del perfil
        perfil_data = scraper.get_perfil_data(
            scraper.credentials[username]["username"],
            scraper.credentials[username]["password"]
        )
        
        if perfil_data:
            return JSONResponse(content={
                "status": "success",
                "username": username,
                "fecha_consulta": datetime.now().isoformat(),
                "perfil": perfil_data
            })
        else:
            return JSONResponse(
                status_code=404,
                content={"error": "No se encontraron datos del perfil"}
            )
            
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"error": f"Error al obtener datos del perfil: {str(e)}"}
        ) 