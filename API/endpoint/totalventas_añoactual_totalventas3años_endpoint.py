from flask import Flask, jsonify
import sqlite3
import pandas as pd

app = Flask(__name__)

# Define the path to the SQLite database
db_path = "datos_sqlite.db"

@app.route('/ventas_3años', methods=['GET'])
def get_ventas_3años():
    # Connect to the SQLite database
    conn = sqlite3.connect(db_path)

    # Query to get sales by year and calculate the total of the last 3 years
    query_ventas_3años = """
    WITH ventas_acumuladas_anio AS (
        SELECT Año, SUM(Cantidad) AS Total_Ventas
        FROM fotostorres
        WHERE (Movimiento = 'Pago a usuario' AND Cantidad > 0)
            OR (Movimiento = 'Cobro desde QR' AND Cantidad > 0)
        GROUP BY Año
    )
    SELECT A.Año, A.Total_Ventas,
           IFNULL(B.Total_Ventas, 0) + IFNULL(C.Total_Ventas, 0) + A.Total_Ventas AS Total_3_Anios
    FROM ventas_acumuladas_anio A
    LEFT JOIN ventas_acumuladas_anio B
        ON A.Año = B.Año + 1
    LEFT JOIN ventas_acumuladas_anio C
        ON A.Año = C.Año + 2
    ORDER BY A.Año;
    """

    # Execute the query
    ventas_3años_df = pd.read_sql(query_ventas_3años, conn)

    # Close the database connection
    conn.close()

    # Rename the columns to match the preferred names
    ventas_3años_df.rename(columns={"A\u00f1o": "anio"}, inplace=True)

    # Convert the dataframe to a JSON response
    return jsonify(ventas_3años_df.to_dict(orient='records'))

if __name__ == '__main__':
    app.run(debug=True)