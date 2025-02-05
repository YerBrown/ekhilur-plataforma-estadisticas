from flask import Blueprint, request, jsonify
from joblib import load
from os.path import join
from numpy import float64
from pandas import date_range
from datetime import datetime
from models.config import MODEL_DIR, HERNANI_MODEL

# Crear el blueprint
prediccion_hernani_bp = Blueprint('prediccion_hernani', __name__)

# Cargar el modelo
model_path = join(MODEL_DIR, HERNANI_MODEL)
model = load(model_path)

@prediccion_hernani_bp.route('/predict/hernani', methods=['GET'])
def predict():
    """
    Endpoint para predicciones de series temporales de Hernani
    Parámetros:
        steps (int): Número de pasos a predecir (default: 1)
        format (str): Formato de salida ('list' o 'detailed', default: 'list')
    """
    try:
        # Validar y obtener parámetros
        steps = min(int(request.args.get("steps", 1)), 12)  # Limitar a 12 meses máximo
        output_format = request.args.get("format", "list")

        # Realizar predicción
        forecast = model.get_forecast(steps=steps)
        pred_mean = forecast.predicted_mean
        conf_int = forecast.conf_int()

        # Generar fechas para las predicciones
        last_date = datetime.now()
        future_dates = date_range(start=last_date, periods=steps, freq='M')
        
        if output_format == "detailed":
            predictions = [{
                "fecha": date.strftime("%Y-%m"),
                "prediccion": float(mean),
                "intervalo_inferior": float(conf_int.iloc[i, 0]),
                "intervalo_superior": float(conf_int.iloc[i, 1])
            } for i, (date, mean) in enumerate(zip(future_dates, pred_mean))]
            
            response = {
                "status": "success",
                "predictions": predictions,
                "metadata": {
                    "steps": steps,
                    "model": "SARIMA",
                    "timestamp": datetime.now().isoformat()
                }
            }
        else:
            # Formato simple pero con fechas
            response = {
                "status": "success",
                "forecast": {
                    date.strftime("%Y-%m"): float(mean)
                    for date, mean in zip(future_dates, pred_mean)
                }
            }
        
        return jsonify(response)
    
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e),
            "timestamp": datetime.now().isoformat()
        }), 500