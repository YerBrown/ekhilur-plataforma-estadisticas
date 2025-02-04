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

const completarMesesFaltantesBonificacionesEmitidas = (
    data,
    anioInicio,
    anioFin
) => {
    // Filtrar objetos con año null
    const dataFiltrada = data.filter((item) => item.año !== null);

    const añosCompletos = [];

    for (let año = anioInicio; año <= anioFin; año++) {
        for (let mes = 1; mes <= 12; mes++) {
            const mesStr = mes.toString().padStart(2, "0");

            // Buscar si el mes ya existe en el array filtrado
            const existe = dataFiltrada.find(
                (item) => item.año === año.toString() && item.mes === mesStr
            );

            if (!existe) {
                // Si no existe, agregar un objeto con valores en 0
                añosCompletos.push({
                    año: año.toString(),
                    mes: mesStr,
                    total_cashback_emitido: 0,
                    total_cashback_recibido: 0,
                });
            }
        }
    }

    // Unir los datos filtrados con los que faltaban
    return [...dataFiltrada, ...añosCompletos].sort(
        (a, b) => a.año - b.año || a.mes - b.mes
    );
};
const agruparPorAñoBonificacionesEmitidas = (data) => {
    const dataFiltrada = data.filter((item) => item.año !== null);
    return dataFiltrada.reduce(
        (acc, { año, total_cashback_emitido, total_cashback_recibido }) => {
            // Buscar si el año ya está en el resultado
            let anioExistente = acc.find((item) => item.año === año);

            if (anioExistente) {
                // Sumar valores si el año ya existe
                anioExistente.total_cashback_emitido += total_cashback_emitido;
                anioExistente.total_cashback_recibido +=
                    total_cashback_recibido;
            } else {
                // Si no existe, agregar el año con los valores actuales
                acc.push({
                    año,
                    total_cashback_emitido,
                    total_cashback_recibido,
                });
            }

            return acc;
        },
        []
    );
};
const completarMesesBonificaciones = (data, anioInicio, anioFin) => {
    const dataFiltrada = data.filter((item) => item.año !== null);

    const añosCompletos = [];

    for (let año = anioInicio; año <= anioFin; año++) {
        for (let mes = 1; mes <= 12; mes++) {
            const mesStr = mes.toString().padStart(2, "0"); // Formato "01", "02", etc.

            // Filtrar los datos existentes para el año y mes actual
            const existentes = dataFiltrada.filter(
                (item) => item.año === año.toString() && item.mes === mesStr
            );

            // Sumar total_cantidad de los movimientos existentes
            const total_cantidad = existentes.reduce(
                (sum, item) => sum + item.total_cantidad,
                0
            );

            // Agregar la entrada consolidada
            añosCompletos.push({
                año: año.toString(),
                mes: mesStr,
                total_cantidad: total_cantidad, // Si no hay datos, será 0
            });
        }
    }

    return añosCompletos;
};

const sumarBonificacionesPorAño = (data, anioInicio, anioFin) => {
    const dataFiltrada = data.filter((item) => item.año !== null);
    const resumenAños = [];

    for (let año = anioInicio; año <= anioFin; año++) {
        // Filtrar los datos por año
        const datosAño = dataFiltrada.filter(
            (item) => item.año === año.toString()
        );

        // Sumar total_cantidad de todos los meses del año
        const total_cantidad = datosAño.reduce(
            (sum, item) => sum + item.total_cantidad,
            0
        );

        // Agregar al resultado
        resumenAños.push({
            año: año.toString(),
            total_cantidad: total_cantidad,
        });
    }

    return resumenAños;
};

const completarMesesGastosIngresos = (data, anioInicio, anioFin) => {
    const datosFiltrados = data.map(({ balance_neto, ...rest }) => rest); // Eliminar la clave "saldo"

    const movimientosCompletos = [];

    for (let año = anioInicio; año <= anioFin; año++) {
        for (let mes = 1; mes <= 12; mes++) {
            const mesStr = mes.toString().padStart(2, "0"); // Formato "01", "02", etc.

            // Buscar si el mes ya existe en el array
            const existe = datosFiltrados.find(
                (item) => item.año === año.toString() && item.mes === mesStr
            );

            if (existe) {
                movimientosCompletos.push(existe); // Mantener el objeto original si existe
            } else {
                // Agregar objeto con valores en 0 si el mes falta
                movimientosCompletos.push({
                    año: año.toString(),
                    mes: mesStr,
                    ingresos: 0,
                    gastos: 0,
                });
            }
        }
    }

    return movimientosCompletos.sort((a, b) => a.año - b.año || a.mes - b.mes);
};
const completarAñosGastosIngresos = (data, anioInicio, anioFin) => {
    // Filtrar objetos que tengan año válido (no null) y eliminar "saldo" si existe
    const datosFiltrados = data
        .filter((item) => item.año !== null)
        .map(({ saldo, ...rest }) => rest); // Elimina "saldo" si existe

    const resumenAños = [];

    for (let año = anioInicio; año <= anioFin; año++) {
        // Filtrar solo los datos del año actual en el bucle
        const datosAño = datosFiltrados.filter(
            (item) => item.año === año.toString()
        );

        // Sumar ingresos y gastos del año
        const ingresos = datosAño.reduce(
            (sum, item) => sum + (item.ingresos || 0),
            0
        );
        const gastos = datosAño.reduce(
            (sum, item) => sum + (item.gastos || 0),
            0
        );

        // Agregar al resultado
        resumenAños.push({
            año: año.toString(),
            ingresos: ingresos,
            gastos: gastos,
        });
    }

    return resumenAños;
};
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

async function getBonificationTransactions(req, res) {
    try {
        const response = movimientos;
        const bonificaciones = response.filter((item) => item.cantidad > 0);
        res.status(200).json(bonificaciones);
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
        const response = await apiRequest(
            `/cashback_emitido_mes_año/${req.user.username}`,
            "GET"
        );
        const nuevoArray = response.map(({ anio, ...rest }) => ({
            año: anio, // Cambiar "anio" por "año"
            ...rest,
        }));
        const arrayCompleto = completarMesesFaltantesBonificacionesEmitidas(
            nuevoArray,
            2022,
            2025
        );
        res.status(200).json(arrayCompleto);
    } catch (error) {
        console.error("Error al obtener el cashback:", error);
        res.status(500).json({ error: "Error al obtener el cashback" });
    }
}

async function getCashbackIssuedByYear(req, res) {
    try {
        // const response = await apiRequest(`/cashback_emitido_mes_año/${req.user.username}`, "GET");
        const response = await apiRequest(
            `/cashback_emitido_mes_año/${req.user.username}`,
            "GET"
        );
        const nuevoArray = response.map(({ anio, ...rest }) => ({
            año: anio, // Cambiar "anio" por "año"
            ...rest,
        }));
        const bonificacionesAnuales =
            agruparPorAñoBonificacionesEmitidas(nuevoArray);

        res.status(200).json(bonificacionesAnuales);
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
        const response = await apiRequest(
            `/cashback_generado_total_mes_año/${req.user.username}`,
            "GET"
        );
        const nuevoArray = response.map(({ anio, ...rest }) => ({
            año: anio, // Cambiar "anio" por "año"
            ...rest,
        }));

        const mesesCompletos = completarMesesBonificaciones(
            nuevoArray,
            2022,
            2025
        );
        res.status(200).json(mesesCompletos);
    } catch (error) {
        console.error("Error al obtener el cashback:", error);
        res.status(500).json({ error: "Error al obtener el cashback" });
    }
}

async function getCashbackGeneratedByYear(req, res) {
    try {
        const response = await apiRequest(
            `/cashback_generado_total_mes_año/${req.user.username}`,
            "GET"
        );
        const nuevoArray = response.map(({ anio, ...rest }) => ({
            año: anio, // Cambiar "anio" por "año"
            ...rest,
        }));
        const binificacionesAnuales = sumarBonificacionesPorAño(
            nuevoArray,
            2022,
            2025
        );
        res.status(200).json(binificacionesAnuales);
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
        const response = await apiRequest(
            `/ingresos_gastos/${req.user.username}`,
            "GET"
        );
        const nuevoArray = response.map(({ anio, ...rest }) => ({
            año: anio, // Cambiar "anio" por "año"
            ...rest,
        }));
        const datosMenusales = completarMesesGastosIngresos(
            nuevoArray,
            2022,
            2025
        );
        res.status(200).json(datosMenusales);
    } catch (error) {
        console.error("Error al obtener el gasto e ingreso:", error);
        res.status(500).json({ error: "Error al obtener el gasto e ingreso" });
    }
}
async function getIncomesAndExpensesByYear(req, res) {
    try {
        const response = await apiRequest(
            `/ingresos_gastos/${req.user.username}`,
            "GET"
        );
        const nuevoArray = response.map(({ anio, ...rest }) => ({
            año: anio, // Cambiar "anio" por "año"
            ...rest,
        }));
        const datosAnuales = completarAñosGastosIngresos(
            nuevoArray,
            2022,
            2025
        );
        // const response = gastosIngresosAño;
        res.status(200).json(datosAnuales);
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
        const response = await apiRequest(
            `/total_transacciones//${req.user.username}`,
            "GET"
        );
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

        // const response = resumen;
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
    getBonificationTransactions,
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
