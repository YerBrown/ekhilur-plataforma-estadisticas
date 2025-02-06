from fastapi import APIRouter
from fastapi.responses import JSONResponse
import sqlite3
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from datetime import datetime
from os.path import join, dirname, abspath

router = APIRouter()

@router.get("/prediccion_no_hernani/{año}/{mes}")
async def get_prediccion_no_hernani(año: int, mes: int):
    base_dir = dirname(dirname(abspath(__file__)))
    db_path = join(base_dir, 'db', 'datos_sqlite.db')
    
    try:
        conn = sqlite3.connect(db_path)
        
        # Obtener datos históricos
        query = """
        SELECT 
            strftime('%Y', fecha) as año,
            strftime('%m', fecha) as mes,
            SUM(CASE 
                WHEN movimiento IN ('Pago en comercio', 'Compra en comercio') 
                AND descripcion NOT LIKE '%HERNANI%'
                THEN CAST(REPLACE(REPLACE(cantidad, ',', '.'), '€', '') AS FLOAT)
                ELSE 0 
            END) as total_ventas
        FROM movimientos 
        GROUP BY strftime('%Y', fecha), strftime('%m', fecha)
        ORDER BY año, mes
        """
        
        df = pd.read_sql_query(query, conn)
        
        if len(df) < 12:  # Necesitamos al menos 12 meses de datos
            return JSONResponse(
                status_code=400,
                content={"error": "No hay suficientes datos históricos para la predicción"}
            )
            
        # Preparar datos para el modelo
        df['periodo'] = range(len(df))
        X = df[['periodo']]
        y = df['total_ventas']
        
        # Entrenar modelo
        model = LinearRegression()
        model.fit(X, y)
        
        # Calcular próximo período
        next_period = len(df)
        prediction = model.predict([[next_period]])[0]
        
        return JSONResponse(content={
            "año": str(año),
            "mes": str(mes).zfill(2),
            "prediccion_ventas": round(float(prediction), 2),
            "tendencia": "positiva" if model.coef_[0] > 0 else "negativa",
            "confianza": round(float(model.score(X, y) * 100), 2)
        })
            
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"error": f"Error en la predicción: {str(e)}"}
        )
    finally:
        if conn:
            conn.close() 