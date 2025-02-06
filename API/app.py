from flask import Flask, jsonify
from endpoint.cashback_emitido_año_endpoint import cashback_emitido_bp as cashback_emitido_año_bp
from endpoint.cashback_emitido_mes_año_endpoint import cashback_emitido_bp as cashback_emitido_mes_bp
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
from endpoint.data_converter_endpoint import converter_bp
from endpoint.compras_categoria_mes_año_endpoint import compras_categoria_bp
from endpoint.listado_cashback_por_tipo_y_mes_endpoint import cashback_listado_bp
from endpoint.todas_transacciones_sin_filtro_endpoint import transacciones_bp
from endpoint.total_movimientos_categorias_endpoint import movimientos_categorias_bp
from endpoint.totalventas_mesactual_totalventas3meses_endpoint import ventas_bp
from endpoint.ventas_año_endpoint import ventas_año_bp
from endpoint.scraper_perfil_endpoint import scraper_perfil_bp
from endpoint.scraper_cuentas_endpoint import scraper_cuentas_bp

app = Flask(__name__)


# Registrar los blueprints
app.register_blueprint(cashback_emitido_año_bp)
app.register_blueprint(cashback_emitido_mes_bp)
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
app.register_blueprint(converter_bp)
app.register_blueprint(compras_categoria_bp)
app.register_blueprint(cashback_listado_bp)
app.register_blueprint(transacciones_bp)
app.register_blueprint(movimientos_categorias_bp)
app.register_blueprint(ventas_bp)
app.register_blueprint(ventas_año_bp)
app.register_blueprint(scraper_perfil_bp)
app.register_blueprint(scraper_cuentas_bp)

# Ruta raíz que muestra todos los endpoints disponibles
@app.route('/', methods=['GET'])
def home():
    """
    Página de inicio que muestra información sobre cómo usar la API
    """
    return jsonify({
        "mensaje": "Bienvenido a la API de Cashback",
        "endpoints_disponibles": {
            "cashback_emitido_año": "/cashback_emitido_año/<tabla_usuario>",
            "cashback_emitido_mes_año": "/cashback_emitido_mes_año/<tabla_usuario>",
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
            "convertir_datos": "/convert/<tabla_usuario>",
            "obtener_json": "/latest/<tabla_usuario>",
            "compras_categoria": "/compras_categoria_mes_año/<tabla_usuario>",
            "listado_cashback": "/listado_cashback_por_tipo_y_mes/<tabla_usuario>",
            "todas_transacciones": "/todas_transacciones_sin_filtro/<tabla_usuario>",
            "movimientos_categorias": "/total_movimientos_categorias/<tabla_usuario>",
            "ventas_3meses": "/ventas_3meses/<tabla_usuario>",
            "ventas_año": "/ventas/<tabla_usuario>",
            "perfil": "/profile/<username>",
            "actualizar_perfil": "/profile/refresh/<username>",
            "cuentas": "/cuentas/<username>",
            "actualizar_cuentas": "/cuentas/refresh/<username>",
            "tablas_permitidas": list({"ilandatxe", "fotostorres", "alomorga", "categorias"})
        },
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True) 