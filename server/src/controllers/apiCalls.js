import { apiRequest } from "./apiRequest.js";
import {
    movimientos,
    bonificacionesPorAño,
    bonificacionesPorMes,
    bonificacionesPorAñoVendedor,
    bonificacionesPorMesVendedor,
    gastosIngresosAño,
    gastosIngresosMes,
    gastosCategoryFalsos,
    ventasAño,
    ventasMes,
} from "../helpers/mockup.js";
import { response } from "express";
// TOTAL DE TRANSACCIONES
// - Cuenta el número total de transacciones por mes
// - Separa entre transacciones de ingreso y gasto
// - Incluye montos totales y balance
async function getTotalTransactions(req, res) {
    try {
        // const response = await apiRequest(`/total_transacciones/${req.user.username}`, "GET");
        const response = movimientos;
        res.status(200).json(response);
    } catch (error) {
        console.error("Error al obtener las transacciones:", error);
        res.status(500).json({ error: "Error al obtener las transacciones" });
    }
}

// CASHBACK EMITIDO POR MES Y AÑO
// - Calcula el cashback emitido y recibido agrupado por mes y año
// - Muestra totales de cashback recibido por bonificaciones y emitido por descuentos
// - Permite analizar el flujo de cashback a lo largo del tiempo
async function getCashbackIssuedByMonth(req, res) {
    try {
        // const response = await apiRequest(`/cashback_emitido_mes_año/${req.user.username}`, "GET");
        const response = bonificacionesPorMesVendedor;
        res.status(200).json(response);
    } catch (error) {
        console.error("Error al obtener el cashback:", error);
        res.status(500).json({ error: "Error al obtener el cashback" });
    }
}

async function getCashbackIssuedByYear(req, res) {
    try {
        // const response = await apiRequest(`/cashback_emitido_mes_año/${req.user.username}`, "GET");
        const response = bonificacionesPorAñoVendedor;
        res.status(200).json(response);
    } catch (error) {
        console.error("Error al obtener el cashback:", error);
        res.status(500).json({ error: "Error al obtener el cashback" });
    }
}

// CASHBACK GENERADO POR TIPO, MES Y AÑO
// - Calcula el cashback generado por cada tipo de movimiento (descuentos, bonificaciones, campañas)
// - Agrupa los datos por mes y año
// - Permite ver la distribución del cashback según su origen
async function getCashbackGeneratedByMonth(req, res) {
    try {
        // const response = await apiRequest(`/cashback_generado_tipo_mes_año/${req.user.username}`, "GET");
        const response = bonificacionesPorMes;
        res.status(200).json(response);
    } catch (error) {
        console.error("Error al obtener el cashback:", error);
        res.status(500).json({ error: "Error al obtener el cashback" });
    }
}

async function getCashbackGeneratedByYear(req, res) {
    try {
        const response = bonificacionesPorAño;
        res.status(200).json(response);
    } catch (error) {
        console.error("Error al obtener el cashback:", error);
        res.status(500).json({ error: "Error al obtener el cashback" });
    }
}

// CASHBACK TOTAL POR MES Y AÑO
//- Calcula el total de cashback generado agrupado por mes y año
//- Suma todos los tipos de cashback (descuentos, bonificaciones, campañas)
//- Proporciona una vista consolidada del cashback total
async function getTotalCashbackByMonthAndYear(req, res) {
    try {
        // const response = await apiRequest(`/cashback_generado_total_mes_año/${req.user.username}`, "GET");
        res.status(200).json(response);
    } catch (error) {
        console.error("Error al obtener el cashback:", error);
        res.status(500).json({ error: "Error al obtener el cashback" });
    }
}

// INGRESOS Y GASTOS
// - Calcula ingresos y gastos mensuales
// - Incluye balance neto mensual
// - Agrupa los datos por mes y año
async function getIncomesAndExpensesByMonth(req, res) {
    try {
        // const response = await apiRequest(`/ingresos_gastos/${req.user.username}`, "GET");
        const response = gastosIngresosMes;
        res.status(200).json(response);
    } catch (error) {
        console.error("Error al obtener el cashback:", error);
        res.status(500).json({ error: "Error al obtener el cashback" });
    }
}
async function getIncomesAndExpensesByYear(req, res) {
    try {
        // const response = await apiRequest(`/ingresos_gastos/${req.user.username}`, "GET");
        const response = gastosIngresosAño;
        res.status(200).json(response);
    } catch (error) {
        console.error("Error al obtener el cashback:", error);
        res.status(500).json({ error: "Error al obtener el cashback" });
    }
}

// RESUMEN DE INGRESOS Y GASTOS
// - Proporciona un resumen mensual de ingresos y gastos
// - Incluye totales y balance neto
// - Ordenado por año y mes descendente
async function getExpensesSummary(req, res) {
    try {
        const { month, year } = req.params;
        // const response = await apiRequest(`/resumen/${req.user.username}`, "GET");
        console.log(month, year);
        const movimientosFiltrados = movimientos.filter((mov) =>
            mov.fecha.startsWith(`${year}-${month.toString().padStart(2, "0")}`)
        );

        // Reducir para agrupar por categoría y sumar los gastos
        const resumen = movimientosFiltrados.reduce((acc, mov) => {
            if (mov.cantidad < 0) {
                // Solo contar gastos (negativos)
                const categoriaExistente = acc.find(
                    (c) => c.categoria === mov.categoria
                );
                if (categoriaExistente) {
                    categoriaExistente.gastos += Math.abs(mov.cantidad);
                } else {
                    acc.push({
                        categoria: mov.categoria,
                        gastos: Math.abs(mov.cantidad),
                    });
                }
            }
            return acc;
        }, []);

        const response = resumen;
        res.status(200).json(response);
    } catch (error) {
        console.error("Error al obtener el resumen:", error);
        res.status(500).json({ error: "Error al obtener el resumen" });
    }
}

// VENTAS POR MES Y AÑO
// - Calcula ventas totales por mes y año
// - Incluye número de ventas y promedios
// - Calcula ticket promedio
async function getSalesByYear(req, res) {
    try {
        // const response = await apiRequest(`/ventas/${req.user.username}`, "GET");
        const response = ventasAño;
        res.status(200).json(response);
    } catch (error) {
        console.error("Error al obtener las ventas:", error);
        res.status(500).json({ error: "Error al obtener las ventas" });
    }
}

async function getSalesByMonth(req, res) {
    try {
        // const response = await apiRequest(`/ventas/${req.user.username}`, "GET");
        const response = ventasMes;
        res.status(200).json(response);
    } catch (error) {
        console.error("Error al obtener las ventas:", error);
        res.status(500).json({ error: "Error al obtener las ventas" });
    }
}

// VENTAS POR TIPO DE MOVIMIENTO Y AÑO
// - Analiza ventas según tipo de movimiento por año
// - Incluye estadísticas como total, número de transacciones y promedios
// - Diferencia entre pagos de usuario y cobros QR
async function getSalesByTypeAndYear(req, res) {
    try {
        // const response = await apiRequest(`/ventas_tipo_movimiento/${req.user.username}`, "GET");
        res.status(200).json(response);
    } catch (error) {
        console.error("Error al obtener las ventas:", error);
        res.status(500).json({ error: "Error al obtener las ventas" });
    }
}

// VENTAS POR TIPO DE MOVIMIENTO, MES Y AÑO
// - Similar al anterior pero con detalle mensual
// - Proporciona estadísticas detalladas por tipo de movimiento
// - Incluye promedios y tickets promedio
async function getSalesByTypeMonthAndYear(req, res) {
    try {
        // const response = await apiRequest(`/ventas_tipo_movimiento_mes/${req.user.username}`, "GET");
        res.status(200).json(response);
    } catch (error) {
        console.error("Error al obtener las ventas:", error);
        res.status(500).json({ error: "Error al obtener las ventas" });
    }
}

export default {
    getTotalTransactions,
    getCashbackIssuedByMonth,
    getCashbackIssuedByYear,
    getCashbackGeneratedByMonth,
    getCashbackGeneratedByYear,
    getTotalCashbackByMonthAndYear,
    getIncomesAndExpensesByMonth,
    getIncomesAndExpensesByYear,
    getExpensesSummary,
    getSalesByYear,
    getSalesByMonth,
    getSalesByTypeMonthAndYear,
};
