from flask import Flask, jsonify, send_file, request
import sqlite3
import pandas as pd
import matplotlib.pyplot as plt
import io

app = Flask(__name__)

# Define the path to the SQLite database
db_path = "datos_sqlite.db"

@app.route('/ventas_tipo_movimiento_pie', methods=['GET'])
def ventas_tipo_movimiento_pie():
    # Get the "mes" and "anio" parameters from the query string
    mes_param = request.args.get('mes', default=None, type=str)
    anio_param = request.args.get('anio', default=None, type=int)

    # Connect to the SQLite database
    conn = sqlite3.connect(db_path)

    # Query to get sales by movement type, month, and year
    query_ventas_tipo_movimiento = """
    SELECT Año, Mes, Movimiento, SUM(Cantidad) AS Total_Ventas
    FROM fotostorres
    WHERE (Movimiento = 'Pago a usuario' AND Cantidad > 0)
       OR (Movimiento = 'Cobro desde QR' AND Cantidad > 0)
    GROUP BY Año, Mes, Movimiento
    ORDER BY Año, Mes, Movimiento;
    """

    # Execute the query
    ventas_tipo_movimiento_df = pd.read_sql(query_ventas_tipo_movimiento, conn)

    # Close the database connection
    conn.close()

    # Rename the column "Año" to "anio"
    ventas_tipo_movimiento_df.rename(columns={"A\u00f1o": "anio"}, inplace=True)

    # Filter by year and month if parameters are provided
    if mes_param and anio_param:
        # Normalize the month name to lowercase for comparison
        mes_param = mes_param.lower()
        # Filter data for the specified year and month
        ventas_tipo_movimiento_df = ventas_tipo_movimiento_df[
            (ventas_tipo_movimiento_df['anio'] == anio_param) &
            (ventas_tipo_movimiento_df['Mes'].str.lower() == mes_param)
        ]
    elif mes_param:  # If only month is provided
        ventas_tipo_movimiento_df = ventas_tipo_movimiento_df[
            ventas_tipo_movimiento_df['Mes'].str.lower() == mes_param.lower()
        ]
    elif anio_param:  # If only year is provided
        ventas_tipo_movimiento_df = ventas_tipo_movimiento_df[
            ventas_tipo_movimiento_df['anio'] == anio_param
        ]

    # Summing the total sales for each movement type
    ventas_tipo_movimiento_total = ventas_tipo_movimiento_df.groupby('Movimiento')['Total_Ventas'].sum()

    # Plotting the pie chart
    plt.figure(figsize=(8, 8))
    plt.pie(ventas_tipo_movimiento_total, labels=ventas_tipo_movimiento_total.index, autopct='%1.1f%%', startangle=90)
    plt.title(f'Distribución de Ventas por Tipo de Movimiento - Mes: {mes_param.capitalize()} Año: {anio_param}')
    plt.axis('equal')  # Equal aspect ratio ensures that pie chart is drawn as a circle.

    # Save the plot to a BytesIO object so it can be sent as a response
    img = io.BytesIO()
    plt.savefig(img, format='png')
    img.seek(0)  # Move to the beginning of the BytesIO object

    # Send the image as a response
    return send_file(img, mimetype='image/png')

if __name__ == '__main__':
    app.run(debug=True)