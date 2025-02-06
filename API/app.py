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
from endpoint.total_ventas_mesactual_totalventas3meses_endpoint import total_ventas_bp
from endpoint.ventas_año_endpoint import ventas_año_bp
from endpoint.scraper_perfil_endpoint import scraper_perfil_bp
from endpoint.scraper_cuentas_endpoint import scraper_cuentas_bp
from endpoint.Mod_prediccion_Hernani import prediccion_hernani_bp
from endpoint.Mod_prediccion_NO_Hernani import prediccion_no_hernani_bp
from flask_cors import CORS
from endpoint.scraper_api import scraper_bp

app = Flask(__name__)
CORS(app)

# Registrar blueprints
app.register_blueprint(scraper_bp)
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
app.register_blueprint(total_ventas_bp)
app.register_blueprint(ventas_año_bp)
app.register_blueprint(scraper_perfil_bp)
app.register_blueprint(scraper_cuentas_bp)
app.register_blueprint(prediccion_hernani_bp)
app.register_blueprint(prediccion_no_hernani_bp)

# Ruta raíz que muestra la documentación de la API
@app.route("/")
def root():
    """Endpoint raíz que muestra la documentación de la API"""
    endpoints = {
        "message": "Bienvenido a la API de Ekhilur Analytics",
        "version": "1.0.0",
        "endpoints": {
            "Scraping de Datos": {
                "/api/scraper/all": {
                    "método": "GET",
                    "descripción": "Extrae datos de todos los usuarios autorizados",
                    "parámetros": {
                        "fecha_inicio": "Fecha inicial en formato DD/MM/YYYY (default: 01/01/2020)"
                    },
                    "ejemplo": "/api/scraper/all?fecha_inicio=01/01/2024"
                },
                "/api/scraper/{usuario}": {
                    "método": "GET",
                    "descripción": "Extrae datos de un usuario específico",
                    "parámetros": {
                        "usuario": "ID del usuario autorizado",
                        "fecha_inicio": "Fecha inicial en formato DD/MM/YYYY (default: 01/01/2020)"
                    },
                    "ejemplo": "/api/scraper/user1?fecha_inicio=01/01/2024"
                }
            },
            "Análisis de Cashback": {
                "/cashback_emitido_año/{tabla_usuario}": {
                    "método": "GET",
                    "descripción": "Obtiene el cashback emitido por año",
                    "parámetros": {
                        "tabla_usuario": "Nombre de la tabla del usuario"
                    },
                    "ejemplo": "/cashback_emitido_año/tabla_alomorga"
                },
                "/cashback_emitido_mes_año/{tabla_usuario}": {
                    "método": "GET",
                    "descripción": "Obtiene el cashback emitido por mes y año",
                    "parámetros": {
                        "tabla_usuario": "Nombre de la tabla del usuario"
                    },
                    "ejemplo": "/cashback_emitido_mes_año/tabla_alomorga"
                }
            },
            "Análisis de Ventas y Transacciones": {
                "/ventas_mes_año/{tabla_usuario}": {
                    "método": "GET",
                    "descripción": "Obtiene las ventas por mes y año",
                    "parámetros": {
                        "tabla_usuario": "Nombre de la tabla del usuario"
                    },
                    "ejemplo": "/ventas_mes_año/tabla_alomorga"
                },
                "/ventas_tipomovimiento_año/{tabla_usuario}": {
                    "método": "GET",
                    "descripción": "Obtiene las ventas por tipo de movimiento y año",
                    "parámetros": {
                        "tabla_usuario": "Nombre de la tabla del usuario"
                    },
                    "ejemplo": "/ventas_tipomovimiento_año/tabla_alomorga"
                }
            },
            "Análisis de Transacciones": {
                "/todas_transacciones_sin_filtro/{tabla_usuario}": {
                    "método": "GET",
                    "descripción": "Obtiene todas las transacciones sin filtrar",
                    "parámetros": {
                        "tabla_usuario": "Nombre de la tabla del usuario"
                    },
                    "ejemplo": "/todas_transacciones_sin_filtro/tabla_alomorga"
                }
            }
        },
        "notas": [
            "Todos los endpoints devuelven datos en formato JSON",
            "Las fechas deben proporcionarse en formato DD/MM/YYYY",
            "Los datos son actualizados diariamente",
            "El parámetro {tabla_usuario} debe ser el nombre de la tabla en la base de datos"
        ]
    }
    
    return jsonify(endpoints)

if __name__ == "__main__":
    app.run(debug=True, use_reloader=False)  # Deshabilitar el reloader globalmente
