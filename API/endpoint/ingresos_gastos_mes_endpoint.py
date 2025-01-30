from flask import Flask, jsonify
import sqlite3

app = Flask(__name__)

# Función para obtener el resumen de ingresos y gastos mes a mes
def obtener_resumen():
    conexion = sqlite3.connect(r"Data Total\datos_sqlite.db")
    cursor = conexion.cursor()

    try:
        cursor.execute("""
            SELECT strftime('%Y-%m', Fecha) AS mes,
                   SUM(CASE WHEN Cantidad > 0 THEN Cantidad ELSE 0 END) AS ingresos,
                   SUM(CASE WHEN Cantidad < 0 THEN Cantidad ELSE 0 END) AS gastos
            FROM ilandatxe
            GROUP BY mes
            ORDER BY mes
        """)
        
        resultados = cursor.fetchall()
        conexion.close()

        if resultados:
            resumen = [{"mes": fila[0], "ingresos": fila[1], "gastos": fila[2]} for fila in resultados]
            return resumen
        else:
            return []
    
    except sqlite3.Error as e:
        print(f"Error al consultar la tabla: {e}")
        return []

# Endpoint para obtener el resumen de ingresos y gastos
@app.route('/resumen', methods=['GET'])
def resumen():
    datos = obtener_resumen()
    return jsonify(datos)

# Ejecutar la aplicación
if __name__ == '__main__':
    app.run(debug=True)