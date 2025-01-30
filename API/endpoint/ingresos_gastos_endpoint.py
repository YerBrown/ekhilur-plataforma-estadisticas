from flask import Flask, jsonify
import sqlite3

# Crear la aplicación Flask
app = Flask(__name__)

@app.route('/api/ingresos_gastos', methods=['GET'])
def obtener_ingresos_gastos():
    # Conectar a la base de datos
    conexion = sqlite3.connect(r'C:\Users\Usuario\Desktop\PROY. TRIP\Ekhilur\Data Total\datos_sqlite.db')
    cursor = conexion.cursor()

    # Consulta para obtener los ingresos y gastos mes a mes
    try:
        cursor.execute("""
            SELECT strftime('%Y-%m', Fecha) AS mes,
                   SUM(CASE WHEN Cantidad > 0 THEN Cantidad ELSE 0 END) AS ingresos,
                   SUM(CASE WHEN Cantidad < 0 THEN Cantidad ELSE 0 END) AS gastos
            FROM ilandatxe
            GROUP BY mes
            ORDER BY mes
        """)
        
        resultados = cursor.fetchall()  # Obtener todos los resultados

        # Verificar si hay datos
        if resultados:
            ingresos_gastos = []
            for fila in resultados:
                mes = fila[0]
                ingresos = fila[1]
                gastos = fila[2]
                ingresos_gastos.append({
                    "mes": mes,
                    "ingresos": ingresos,
                    "gastos": gastos
                })
            # Devolver los datos como un JSON
            return jsonify(ingresos_gastos)
        else:
            return jsonify({"message": "No hay datos para los ingresos o gastos."}), 404
        
    except sqlite3.Error as e:
        return jsonify({"error": f"Error al consultar la tabla: {e}"}), 500

    finally:
        # Cerrar la conexión
        conexion.close()

# Ejecutar el servidor Flask
if __name__ == '__main__':
    app.run(debug=True)