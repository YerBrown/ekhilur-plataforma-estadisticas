from flask import Flask, request, jsonify
import pickle
import pandas as pd

# Load the trained SARIMA model
with open("hernani.pkl", "rb") as pkl:
    model = pickle.load(pkl)

app = Flask(__name__)

@app.route('/predict', methods=['GET'])
def predict():
    try:
        # Get the number of steps to forecast
        steps = int(request.args.get("steps", 1))  # Default to predicting 1 step ahead
        
        # Forecast future values
        forecast = model.get_forecast(steps=steps)
        pred_mean = forecast.predicted_mean.tolist()  # Extract predicted mean as a list
        
        # Response format
        response = {
            "forecast": pred_mean  # Forecasted values
        }
        
        return jsonify(response)
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)