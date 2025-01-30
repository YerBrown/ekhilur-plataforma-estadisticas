from flask import Flask, jsonify
from endpoint.cashback_emitido_mes_año_endpoint import cashback_emitido_bp
from endpoint.cashback_generado_tipo_mes_año_endpoint import cashback_generado_bp
from endpoint.cashback_generado_total_mes_año_endpoint import cashback_total_bp
from endpoint.ingresos_gastos_endpoint import ingresos_gastos_bp
from endpoint.ingresos_gastos_mes_endpoint import ingresos_gastos_mes_bp
from endpoint.total_transacciones_endpoint import total_transacciones_bp
from endpoint.totalventas_añoactual_totalventas3años_endpoint import ventas_años_bp
from endpoint.ventas_mes_año_endpoint import ventas_mes_bp
from endpoint.ventas_tipomovimiento_año_endpoint import ventas_tipo_bp
from endpoint.ventas_tipomovimiento_mes_año_endpoint import ventas_tipo_mes_bp
from endpoint.ventas_tipomovimiento_piechart_endpoint import ventas_pie_bp
app = Flask(__name__)
# Registrar los blueprints
app.register_blueprint(cashback_emitido_bp)
app.register_blueprint(cashback_generado_bp)
app.register_blueprint(cashback_total_bp)
app.register_blueprint(ingresos_gastos_bp)
app.register_blueprint(ingresos_gastos_mes_bp)
app.register_blueprint(total_transacciones_bp)
app.register_blueprint(ventas_años_bp)
app.register_blueprint(ventas_mes_bp)
app.register_blueprint(ventas_tipo_bp)
app.register_blueprint(ventas_tipo_mes_bp)
app.register_blueprint(ventas_pie_bp)
# Ruta raíz que muestra todos los endpoints disponibles
@app.route('/', methods=['GET'])
def home():
    """
    Página de inicio que muestra información sobre cómo usar la API
    """
    return jsonify({
        "mensaje": "Bienvenido a la API de Cashback",
        "endpoints_disponibles": {
            "cashback_emitido": "/cashback_emitido_mes_año/<tabla_usuario>",
            "cashback_generado": "/cashback_generado_tipo_mes_año/<tabla_usuario>",
            "cashback_total": "/cashback_generado_total_mes_año/<tabla_usuario>",
            "ingresos_gastos": "/ingresos_gastos/<tabla_usuario>",
            "ingresos_gastos_mes": "/resumen/<tabla_usuario>",
            "total_transacciones": "/total_transacciones/<tabla_usuario>",
            "ventas_3años": "/ventas_3años/<tabla_usuario>",
            "ventas_mensuales": "/ventas/<tabla_usuario>",
            "ventas_tipo": "/ventas_tipo_movimiento/<tabla_usuario>",
            "ventas_tipo_mes": "/ventas_tipo_movimiento_mes/<tabla_usuario>",
            "ventas_pie": "/ventas_tipo_movimiento_pie/<tabla_usuario>?mes=<mes>&anio=<anio>",
            "tablas_permitidas": list({"ilandatxe", "fotostorres", "alex", "categorias"})
        },
        "ejemplos_uso": {
            "cashback_emitido": "/cashback_emitido_mes_año/ilandatxe",
            "cashback_generado": "/cashback_generado_tipo_mes_año/ilandatxe",
            "cashback_total": "/cashback_generado_total_mes_año/ilandatxe",
            "ingresos_gastos": "/ingresos_gastos/ilandatxe",
            "ingresos_gastos_mes": "/resumen/ilandatxe",
            "total_transacciones": "/total_transacciones/ilandatxe",
            "ventas_3años": "/ventas_3años/fotostorres",
            "ventas_mensuales": "/ventas/fotostorres",
            "ventas_tipo": "/ventas_tipo_movimiento/fotostorres",
            "ventas_tipo_mes": "/ventas_tipo_movimiento_mes/fotostorres",
            "ventas_pie": "/ventas_tipo_movimiento_pie/fotostorres?mes=1&anio=2024"
        }
    })
if __name__ == '__main__':
    app.run(debug=True)