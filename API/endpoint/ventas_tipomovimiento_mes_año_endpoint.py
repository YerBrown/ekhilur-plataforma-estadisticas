from flask import Flask, jsonify
import sqlite3
import pandas as pd

app = Flask(__name__)

# Define the path to the SQLite database
db_path = "datos_sqlite.db"

@app.route('/ventas_tipo_movimiento', methods=['GET'])
def get_ventas_tipo_movimiento():
    # Connect to the SQLite database
    conn = sqlite3.connect(db_path)

    # Query to get sales by movement type, month and year
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

    ventas_tipo_movimiento_df.rename(columns={"A\u00f1o": "anio"}, inplace=True)

    # Convert the dataframe to a JSON response
    return jsonify(ventas_tipo_movimiento_df.to_dict(orient='records'))

if __name__ == '__main__':
    app.run(debug=True)