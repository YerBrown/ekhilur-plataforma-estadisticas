import { apiRequest } from "./apiRequest.js";

// TOTAL DE TRANSACCIONES
// - Cuenta el número total de transacciones por mes
// - Separa entre transacciones de ingreso y gasto
// - Incluye montos totales y balance
async function getTotalTransactions(req, res) {
    try {
        const response = await apiRequest("/total_transacciones/ilandatxe", "GET");
        console.log("Respuesta obtenida de la API externa:", response);
        res.status(200).json(response);
    } catch (error) {
        console.error("Error al obtener las transacciones:", error);
        res.status(500).json({ error: "Error al obtener las transacciones" });
    }
};

// CASHBACK EMITIDO POR MES Y AÑO
// - Calcula el cashback emitido y recibido agrupado por mes y año
// - Muestra totales de cashback recibido por bonificaciones y emitido por descuentos
// - Permite analizar el flujo de cashback a lo largo del tiempo
async function getCashbackIssuedByMonthAndYear(req, res) {
    try {
        const response = await apiRequest("/cashback_emitido_mes_año/ilandatxe", "GET");
        console.log("Respuesta obtenida de la API externa:", response);
        res.status(200).json(response);
    } catch (error) {
        console.error("Error al obtener el cashback:", error);
        res.status(500).json({ error: "Error al obtener el cashback" });
    }
};

// CASHBACK GENERADO POR TIPO, MES Y AÑO
// - Calcula el cashback generado por cada tipo de movimiento (descuentos, bonificaciones, campañas)
// - Agrupa los datos por mes y año
// - Permite ver la distribución del cashback según su origen
async function getCashbackGeneratedByTypeMonthAndYear(req, res) {
    try {
        const response = await apiRequest("/cashback_generado_tipo_mes_año/ilandatxe", "GET");
        console.log("Respuesta obtenida de la API externa:", response);
        res.status(200).json(response);
    } catch (error) {
        console.error("Error al obtener el cashback:", error);
        res.status(500).json({ error: "Error al obtener el cashback" });
    }
};

// CASHBACK TOTAL POR MES Y AÑO
//- Calcula el total de cashback generado agrupado por mes y año
//- Suma todos los tipos de cashback (descuentos, bonificaciones, campañas)
//- Proporciona una vista consolidada del cashback total
async function getTotalCashbackByMonthAndYear(req, res) {
    try {
        const response = await apiRequest("/cashback_generado_total_mes_año/ilandatxe", "GET");
        console.log("Respuesta obtenida de la API externa:", response);
        res.status(200).json(response);
    } catch (error) {
        console.error("Error al obtener el cashback:", error);
        res.status(500).json({ error: "Error al obtener el cashback" });
    }
};

// INGRESOS Y GASTOS
// - Calcula ingresos y gastos mensuales
// - Incluye balance neto mensual
// - Agrupa los datos por mes y año
async function getIncomesAndExpensesByMonth(req, res) {
    try {
        const response = await apiRequest("/ingresos_gastos/ilandatxe", "GET");
        console.log("Respuesta obtenida de la API externa:", response);
        res.status(200).json(response);
    } catch (error) {
        console.error("Error al obtener el cashback:", error);
        res.status(500).json({ error: "Error al obtener el cashback" });
    }
};

// RESUMEN DE INGRESOS Y GASTOS
// - Proporciona un resumen mensual de ingresos y gastos
// - Incluye totales y balance neto
// - Ordenado por año y mes descendente
async function getIncomesAndExpensesSummary(req, res) {
    try {
        const response = await apiRequest("/resumen/ilandatxe", "GET");
        console.log("Respuesta obtenida de la API externa:", response);
        res.status(200).json(response);
    } catch (error) {
        console.error("Error al obtener el resumen:", error);
        res.status(500).json({ error: "Error al obtener el resumen" });
    }
};

// VENTAS POR MES Y AÑO
// - Calcula ventas totales por mes y año
// - Incluye número de ventas y promedios
// - Calcula ticket promedio
async function getSalesByMonthAndYear(req, res) {
    try {
        const response = await apiRequest("/ventas/ilandatxe", "GET");
        console.log("Respuesta obtenida de la API externa:", response);
        res.status(200).json(response);
    } catch (error) {
        console.error("Error al obtener las ventas:", error);
        res.status(500).json({ error: "Error al obtener las ventas" });
    }
};

// VENTAS POR TIPO DE MOVIMIENTO Y AÑO
// - Analiza ventas según tipo de movimiento por año
// - Incluye estadísticas como total, número de transacciones y promedios
// - Diferencia entre pagos de usuario y cobros QR
async function getSalesByTypeAndYear(req, res) {
    try {
        const response = await apiRequest("/ventas_tipo_movimiento/ilandatxe", "GET");
        console.log("Respuesta obtenida de la API externa:", response);
        res.status(200).json(response);
    } catch (error) {
        console.error("Error al obtener las ventas:", error);
        res.status(500).json({ error: "Error al obtener las ventas" });
    }
};

// VENTAS POR TIPO DE MOVIMIENTO, MES Y AÑO
// - Similar al anterior pero con detalle mensual
// - Proporciona estadísticas detalladas por tipo de movimiento
// - Incluye promedios y tickets promedio
async function getSalesByTypeMonthAndYear(req, res) {
    try {
        const response = await apiRequest("/ventas_tipo_movimiento_mes/ilandatxe", "GET");
        console.log("Respuesta obtenida de la API externa:", response);
        res.status(200).json(response);
    } catch (error) {
        console.error("Error al obtener las ventas:", error);
        res.status(500).json({ error: "Error al obtener las ventas" });
    }
};

export default {
    getTotalTransactions,
    getCashbackIssuedByMonthAndYear,
    getCashbackGeneratedByTypeMonthAndYear,
    getTotalCashbackByMonthAndYear,
    getIncomesAndExpensesByMonth,
    getIncomesAndExpensesSummary,
    getSalesByMonthAndYear,
    getSalesByTypeAndYear,
    getSalesByTypeMonthAndYear
}