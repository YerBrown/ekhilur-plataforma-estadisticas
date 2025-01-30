from flask import Flask, jsonify
import sqlite3
import pandas as pd

app = Flask(__name__)

# Define the path to the SQLite database
db_path = "datos_sqlite.db"

@app.route('/ventas_3meses', methods=['GET'])
def get_ventas_3meses():
    # Connect to the SQLite database
    conn = sqlite3.connect(db_path)

    # Query to get sales from January 2022 to January 2025 and calculate the total of the last 3 months
    query_ventas_3meses_detalle_fecha = """
    WITH ventas_acumuladas AS (
        SELECT Año, 
               CASE Mes
                   WHEN 'enero' THEN 1
                   WHEN 'febrero' THEN 2
                   WHEN 'marzo' THEN 3
                   WHEN 'abril' THEN 4
                   WHEN 'mayo' THEN 5
                   WHEN 'junio' THEN 6
                   WHEN 'julio' THEN 7
                   WHEN 'agosto' THEN 8
                   WHEN 'septiembre' THEN 9
                   WHEN 'octubre' THEN 10
                   WHEN 'noviembre' THEN 11
                   WHEN 'diciembre' THEN 12
                   ELSE 0
               END AS Mes_Num,
               Mes,
               Año,
               SUM(Cantidad) AS Total_Ventas
        FROM fotostorres
        WHERE (Movimiento = 'Pago a usuario' AND Cantidad > 0)
            OR (Movimiento = 'Cobro desde QR' AND Cantidad > 0)
        GROUP BY Año, Mes
    )
    SELECT A.Año, A.Mes, A.Total_Ventas,
           CASE
               WHEN A.Mes = 'diciembre' THEN 
                   IFNULL(A.Total_Ventas, 0) + 
                   IFNULL((SELECT Total_Ventas FROM ventas_acumuladas 
                           WHERE Año = A.Año AND Mes_Num = 11), 0) + 
                   IFNULL((SELECT Total_Ventas FROM ventas_acumuladas 
                           WHERE Año = A.Año AND Mes_Num = 10), 0)
               WHEN A.Mes = 'enero' THEN 
                   IFNULL(A.Total_Ventas, 0) + 
                   IFNULL((SELECT Total_Ventas FROM ventas_acumuladas 
                           WHERE Año = A.Año - 1 AND Mes_Num = 12), 0) + 
                   IFNULL((SELECT Total_Ventas FROM ventas_acumuladas 
                           WHERE Año = A.Año - 1 AND Mes_Num = 11), 0)
               ELSE
                   IFNULL(A.Total_Ventas, 0) + 
                   IFNULL((SELECT Total_Ventas FROM ventas_acumuladas 
                           WHERE Año = A.Año AND Mes_Num = A.Mes_Num - 1), 0) + 
                   IFNULL((SELECT Total_Ventas FROM ventas_acumuladas 
                           WHERE Año = A.Año AND Mes_Num = A.Mes_Num - 2), 0)
           END AS Total_3_Meses
    FROM ventas_acumuladas A
    WHERE A.Año >= 2022
    ORDER BY A.Año, A.Mes_Num;
    """

    # Execute the query
    ventas_3meses_detalle_fecha_df = pd.read_sql(query_ventas_3meses_detalle_fecha, conn)

    # Close the database connection
    conn.close()

    # Rename the "Año" column to "anio"
    ventas_3meses_detalle_fecha_df.rename(columns={"A\u00f1o": "anio"}, inplace=True)

    # Convert the dataframe to a JSON response
    return jsonify(ventas_3meses_detalle_fecha_df.to_dict(orient='records'))

if __name__ == '__main__':
    app.run(debug=True)
Contraer



17:38
Arman
Consulta para obtener ventas por año y calcular el total de los últimos 3 años
ventas_3anios.py
 
from flask import Flask, jsonify
import sqlite3
import pandas as pd

app = Flask(__name__)
Haz clic para expandir contenido en línea (48 líneas)