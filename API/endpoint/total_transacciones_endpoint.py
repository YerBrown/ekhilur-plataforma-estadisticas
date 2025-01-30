from flask import Flask, jsonify
import sqlite3

app = Flask(__name__)

# Ruta para obtener el total de transacciones por mes
@app.route('/total_transacciones', methods=['GET'])
def obtener_total_transacciones():
    try:
        # Conectar a la base de datos
        conexion = sqlite3.connect(r"Data Total\datos_sqlite.db")
        cursor = conexion.cursor()

        # Consulta SQL
        cursor.execute("""
            SELECT strftime('%Y-%m', fecha) AS mes, 
                   SUM(Cantidad) AS total_gastos, 
                   SUM(Saldo) AS total_ingresos
            FROM ilandatxe
            GROUP BY mes
            ORDER BY mes
        """)

        resultados = cursor.fetchall()
        conexion.close()

        # Estructurar los datos en formato JSON
        data = []
        for fila in resultados:
            data.append({
                "mes": fila[0],
                "total_gastos": fila[1],
                "total_ingresos": fila[2]
            })

        return jsonify(data)  # Devolver los datos en formato JSON

    except sqlite3.Error as e:
        return jsonify({"error": str(e)}), 500  # Error interno del servidor

# Ejecutar la aplicación
if __name__ == '__main__':
    app.run(debug=True)