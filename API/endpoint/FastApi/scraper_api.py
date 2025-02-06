from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from datetime import datetime
import uvicorn
from typing import Optional
import sys
from pathlib import Path

# Añadir el directorio raíz al path
sys.path.append(str(Path(__file__).parent.parent))
from scraper.scraper_auto import AutoScraper

router = APIRouter()
scraper = AutoScraper()

@router.get("/all")
async def scrape_all_users(fecha_inicio: Optional[str] = "01/01/2020"):
    """
    Extrae datos de todos los usuarios desde una fecha inicial hasta hoy
    
    - fecha_inicio: Fecha inicial en formato DD/MM/YYYY (default: 01/01/2020)
    """
    try:
        # Configurar fechas
        fecha_fin = datetime.now().strftime("%d/%m/%Y")
        
        # Cargar categorías
        categories = scraper.load_categories()
        results = {}
        
        for username, creds in scraper.credentials.items():
            try:
                # Extraer datos
                data = scraper.get_table_data(
                    creds["username"],
                    creds["password"],
                    fecha_inicio,
                    fecha_fin
                )
                
                if data:
                    # Añadir categoría a cada movimiento
                    for movimiento in data:
                        usuario = movimiento['usuario_asociado']
                        movimiento['categoria'] = categories.get(usuario, 'Sin categoría')
                    
                    results[username] = {
                        "status": "success",
                        "total_registros": len(data),
                        "data": data
                    }
                else:
                    results[username] = {
                        "status": "error",
                        "message": "No se obtuvieron datos"
                    }
                    
            except Exception as e:
                results[username] = {
                    "status": "error",
                    "message": str(e)
                }
        
        return JSONResponse(content=results)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{username}")
async def scrape_single_user(
    username: str,
    fecha_inicio: Optional[str] = "01/01/2020"
):
    """
    Extrae datos de un usuario específico
    
    - username: Nombre del usuario (alomorga/ilandatxe/fotostorres)
    - fecha_inicio: Fecha inicial en formato DD/MM/YYYY (default: 01/01/2020)
    """
    try:
        if username not in scraper.credentials:
            raise HTTPException(status_code=400, detail="Usuario no válido")
        
        # Configurar fechas
        fecha_fin = datetime.now().strftime("%d/%m/%Y")
        
        # Cargar categorías
        categories = scraper.load_categories()
        
        # Extraer datos
        data = scraper.get_table_data(
            scraper.credentials[username]["username"],
            scraper.credentials[username]["password"],
            fecha_inicio,
            fecha_fin
        )
        
        if data:
            # Añadir categoría a cada movimiento
            for movimiento in data:
                usuario = movimiento['usuario_asociado']
                movimiento['categoria'] = categories.get(usuario, 'Sin categoría')
            
            return JSONResponse(content={
                "status": "success",
                "total_registros": len(data),
                "data": data
            })
        else:
            raise HTTPException(status_code=404, detail="No se encontraron datos")
            
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(router, host="0.0.0.0", port=8000) 