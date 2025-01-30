from flask import Flask, jsonify
import sqlite3
import pandas as pd

app = Flask(__name__)

# Define the path to the SQLite database
db_path = "datos_sqlite.db"

@app.route('/ventas', methods=['GET'])
def get_ventas():
    # Connect to the SQLite database
    conn = sqlite3.connect(db_path)

    # Query to get all sales transactions by month and year
    query_ventas_mes_anio = """
    SELECT Año, Mes, SUM(Cantidad) AS Total_Ventas
    FROM fotostorres
    WHERE (Movimiento = 'Pago a usuario' AND Cantidad > 0)
       OR (Movimiento = 'Cobro desde QR' AND Cantidad > 0)
    GROUP BY Año, Mes
    ORDER BY Año, Mes;
    """

    # Execute the query
    ventas_mes_anio_df = pd.read_sql(query_ventas_mes_anio, conn)

    # Close the database connection
    conn.close()

    # Rename the "Año" column to "anio"
    ventas_mes_anio_df.rename(columns={"A\u00f1o": "anio"}, inplace=True)
    # Convert the dataframe to a JSON response
    return jsonify(ventas_mes_anio_df.to_dict(orient='records'))

if __name__ == '__main__':
    app.run(debug=True)