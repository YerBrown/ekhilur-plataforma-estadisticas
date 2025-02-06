import { apiRequest } from "./apiRequest.js";
import { response } from "express";
import mockData from "../helpers/mockData.js";

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
                    bonificaciones_emitidas: 0,
                    bonificaciones_recibidas: 0,
                });
            }
        }
    }

    // Unir los datos filtrados con los que faltaban
    return [...dataFiltrada, ...añosCompletos].sort(
        (a, b) => a.año - b.año || a.mes - b.mes
    );
};
const completarAñosFaltantesBonificacionesEmitidas = (
    data,
    anioInicio,
    anioFin
) => {
    // Filtrar objetos con año null y convertir a conjunto para verificar años existentes
    const dataFiltrada = data.filter((item) => item.año !== null);
    const añosExistentes = new Set(dataFiltrada.map((item) => item.año));

    const añosCompletos = [];

    for (let año = anioInicio; año <= anioFin; año++) {
        if (!añosExistentes.has(año.toString())) {
            // Agregar año faltante con valores en 0
            añosCompletos.push({
                año: año.toString(),
                bonificaciones_emitidas: 0,
                bonificaciones_recibidas: 0,
            });
        }
    }

    // Unir los datos filtrados con los años faltantes
    return [...dataFiltrada, ...añosCompletos].sort((a, b) => a.año - b.año);
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
            const bonificaciones = existentes.reduce(
                (sum, item) => sum + item.total_cantidad,
                0
            );

            // Agregar la entrada consolidada
            añosCompletos.push({
                año: año.toString(),
                mes: mesStr,
                bonificaciones: bonificaciones, // Si no hay datos, será 0
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
        const bonificaciones = datosAño.reduce(
            (sum, item) => sum + item.total_cantidad,
            0
        );

        // Agregar al resultado
        resumenAños.push({
            año: año.toString(),
            bonificaciones: bonificaciones,
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

const completarMesesVentas = (data, anioInicio, anioFin) => {
    // Filtrar datos y eliminar claves innecesarias
    const datosFiltrados = data.map(({ total_ventas, año, mes }) => ({
        año,
        mes,
        ventas: total_ventas,
    }));

    const ventasCompletas = [];

    for (let año = anioInicio; año <= anioFin; año++) {
        for (let mes = 1; mes <= 12; mes++) {
            const mesStr = mes.toString().padStart(2, "0"); // Asegura formato "01", "02", etc.

            // Buscar si el mes ya existe en los datos
            const existe = datosFiltrados.find(
                (item) => item.año === año.toString() && item.mes === mesStr
            );

            if (existe) {
                ventasCompletas.push(existe); // Mantener el objeto original si existe
            } else {
                // Agregar objeto con valores en 0 si el mes falta
                ventasCompletas.push({
                    año: año.toString(),
                    mes: mesStr,
                    ventas: 0,
                });
            }
        }
    }

    return ventasCompletas.sort((a, b) => a.año - b.año || a.mes - b.mes);
};
const completarVentasPorAño = (data, anioInicio, anioFin) => {
    // Reducir datos para agrupar por año y sumar total_ventas
    const ventasAgrupadas = data.reduce((acumulado, { año, total_ventas }) => {
        if (!acumulado[año]) {
            acumulado[año] = { año, ventas: 0 };
        }
        acumulado[año].ventas += total_ventas;
        return acumulado;
    }, {});

    // Convertir el objeto en un array y completar los años faltantes
    const ventasCompletas = [];

    for (let año = anioInicio; año <= anioFin; año++) {
        const añoStr = año.toString();
        if (ventasAgrupadas[añoStr]) {
            ventasCompletas.push(ventasAgrupadas[añoStr]);
        } else {
            ventasCompletas.push({ año: añoStr, total_ventas: 0 });
        }
    }

    return ventasCompletas;
};

const completarMesesGastosCategoria = (data, anioInicio, anioFin) => {
    // Filtrar datos y eliminar claves innecesarias
    const datosFiltrados = data.map(({ total_compras, ...item }) => ({
        ...item,
        gasto: parseFloat(total_compras.toFixed(2)), // Renombramos total_compras a gasto
    }));

    const gastosCompletos = [];

    const categoriasUnicas = [
        ...new Set(datosFiltrados.map((item) => item.categoria)),
    ];

    for (let año = anioInicio; año <= anioFin; año++) {
        for (let mes = 1; mes <= 12; mes++) {
            const mesStr = mes.toString().padStart(2, "0"); // Formato "01", "02", etc.

            categoriasUnicas.forEach((categoria) => {
                // Buscar si el mes y la categoría ya existen en los datos
                const existe = datosFiltrados.find(
                    (item) =>
                        item.año === año.toString() &&
                        item.mes === mesStr &&
                        item.categoria === categoria
                );

                if (existe) {
                    gastosCompletos.push(existe); // Mantener el objeto original si existe
                } else {
                    // Agregar objeto con valores en 0 si la categoría no tiene datos en ese mes
                    gastosCompletos.push({
                        año: año.toString(),
                        mes: mesStr,
                        categoria: categoria, // Mantener la categoría
                        gasto: 0, // Se mantiene en 0 si no hay datos
                    });
                }
            });
        }
    }

    return gastosCompletos.sort((a, b) => a.año - b.año || a.mes - b.mes);
};

// TRANSACCIONES
async function getTransactions(req, res) {
    try {
        const response = mockData;
        res.status(200).json(response);
    } catch (error) {
        console.error("Error al obtener las transacciones:", error);
        res.status(500).json({ error: "Error al obtener las transacciones" });
    }
}
async function getTransactionsByMonth(req, res) {
    try {
        const { año, mes } = req.query;
        const response = mockData;

        const filteredResponse = response.filter((item) => {
            const itemDate = new Date(item.fecha);
            const itemYear = itemDate.getFullYear();
            const itemMonth = itemDate.getMonth() + 1; // getMonth() devuelve valores de 0 a 11

            return (!mes || itemMonth === parseInt(mes)) && (!año || itemYear === parseInt(año));
        });

        res.status(200).json(filteredResponse);
    } catch (error) {
        console.error("Error al filtrar las transacciones:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
}

async function getTransactionsCashbacksByMonth(req, res) {
    try {
        const { año, mes } = req.query;
        const response = mockData;

        const goodResponse = response.filter((item) => item.cantidad > 0);

        const filteredResponse = goodResponse.filter((item) => {
            const itemDate = new Date(item.fecha);
            const itemYear = itemDate.getFullYear();
            const itemMonth = itemDate.getMonth() + 1; // getMonth() devuelve valores de 0 a 11

            return (!mes || itemMonth === parseInt(mes)) && (!año || itemYear === parseInt(año));
        });

        res.status(200).json(filteredResponse);
    } catch (error) {
        console.error("Error al filtrar las transacciones:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
}


// USER
async function getUserInfo(req, res) {
    try {
        const response = await apiRequest(
            `/profile/${req.user.username}`,
            "GET"
        );
        res.status(200).json(response.data);
    } catch (error) {
        console.error("Error al obtener el usuario:", error);
        res.status(500).json({ error: "Error al obtener el usuario" });
    }
}
async function getUserAccounts(req, res) {
    try {
        const response = await apiRequest(
            `/cuentas/${req.user.username}`,
            "GET"
        );
        res.status(200).json(response.data);
    } catch (error) {
        console.error("Error al obtener las cuentas:", error);
        res.status(500).json({ error: "Error al obtener las cuentas" });
    }
}

// CASHBACK
async function getCashbacksIssuedByMonth(req, res) {
    try {
        const response = await apiRequest(
            `/cashback_emitido_mes_año/${req.user.username}`,
            "GET"
        );
        const arrayCompleto = completarMesesFaltantesBonificacionesEmitidas(
            response,
            2022,
            2025
        );
        res.status(200).json(arrayCompleto);
    } catch (error) {
        console.error("Error al obtener el cashback:", error);
        res.status(500).json({ error: "Error al obtener el cashback" });
    }
}
async function getCashbacksIssuedByYear(req, res) {
    try {
        const response = await apiRequest(
            `/cashback_emitido_año/${req.user.username}`,
            "GET"
        );
        const arrayCompleto = completarAñosFaltantesBonificacionesEmitidas(
            response,
            2022,
            2025
        );

        res.status(200).json(arrayCompleto);
    } catch (error) {
        console.error("Error al obtener el cashback:", error);
        res.status(500).json({ error: "Error al obtener el cashback" });
    }
}
async function getCashbackGeneratedByMonth(req, res) {
    try {
        const response = await apiRequest(
            `/cashback_generado_total_mes_año/${req.user.username}`,
            "GET"
        );

        const mesesCompletos = completarMesesBonificaciones(
            response,
            2022,
            2025
        ).map((item) => ({
            ...item,
            bonificaciones: parseFloat(item.bonificaciones.toFixed(2)),
        }));
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
        const bonificacionesAnuales = sumarBonificacionesPorAño(
            response,
            2022,
            2025
        ).map((item) => ({
            ...item,
            bonificaciones: parseFloat(item.bonificaciones.toFixed(2)),
        }));
        res.status(200).json(bonificacionesAnuales);
    } catch (error) {
        console.error("Error al obtener el cashback:", error);
        res.status(500).json({ error: "Error al obtener el cashback" });
    }
}

// CATEGORIAS
async function getCategoryExpensesByMonth(req, res) {
    try {
        const { mes, año } = req.query;
        const response = await apiRequest(
            `/compras_categoria_mes_año/${req.user.username}`,
            "GET"
        );
        console.log(response);
        const goodResponse = completarMesesGastosCategoria(
            response,
            2022,
            2025
        );
        const filteredResponse = goodResponse.filter(
            (item) => (!mes || item.mes === mes) && (!año || item.año === año)
        );
        res.status(200).json(filteredResponse);
    } catch (error) {
        console.error("Error al obtener los gastos por categoria:", error);
        res.status(500).json({
            error: "Error al obtener los gastos por categoria",
        });
    }
}

// INGRESOS Y GASTOS
async function getIncomesAndExpensesByMonth(req, res) {
    try {
        const response = await apiRequest(
            `/ingresos_gastos/${req.user.username}`,
            "GET"
        );
        const datosMensuales = completarMesesGastosIngresos(
            response,
            2022,
            2025
        ).map((item) => ({
            ...item,
            ingresos: parseFloat(item.ingresos.toFixed(2)),
            gastos: parseFloat(item.gastos.toFixed(2)),
        }));
        res.status(200).json(datosMensuales);
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
        const datosAnuales = completarAñosGastosIngresos(
            response,
            2022,
            2025
        ).map((item) => ({
            ...item,
            ingresos: parseFloat(item.ingresos.toFixed(2)),
            gastos: parseFloat(item.gastos.toFixed(2)),
        }));
        res.status(200).json(datosAnuales);
    } catch (error) {
        console.error("Error al obtener el cashback:", error);
        res.status(500).json({ error: "Error al obtener el cashback" });
    }
}

// VENTAS
async function getSalesByMonth(req, res) {
    try {
        const response = await apiRequest(
            `/ventas/${req.user.username}`,
            "GET"
        );
        const goodResponse = completarMesesVentas(response, 2022, 2025);
        res.status(200).json(goodResponse);
    } catch (error) {
        console.error("Error al obtener las ventas:", error);
        res.status(500).json({ error: "Error al obtener las ventas" });
    }
}
async function getSalesByYear(req, res) {
    try {
        const response = await apiRequest(
            `/ventas/${req.user.username}`,
            "GET"
        );
        const goodResponse = completarVentasPorAño(response, 2022, 2025);
        res.status(200).json(goodResponse);
    } catch (error) {
        console.error("Error al obtener las ventas:", error);
        res.status(500).json({ error: "Error al obtener las ventas" });
    }
}

async function getHomeDataForUser(req, res) {
    try {
        const [wallet, bonificaciones, gastosIngresos] = await Promise.all([
            apiRequest(`/cuentas/${req.user.username}`, "GET"),
            apiRequest(
                `/cashback_generado_total_mes_año/${req.user.username}`,
                "GET"
            ),
            apiRequest(`/ingresos_gastos/${req.user.username}`, "GET"),
        ]);
        const fullDataObject = { wallet, bonificaciones, gastosIngresos };
        fullDataObject.bonificaciones = completarMesesBonificaciones(
            fullDataObject.bonificaciones,
            2022,
            2025
        );
        fullDataObject.gastosIngresos = completarMesesGastosIngresos(
            fullDataObject.gastosIngresos,
            2022,
            2025
        );
        res.status(200).json(fullDataObject);
    } catch (error) {
        console.error("Error al obtener los datos de home:", error);
        res.status(500).json({ error: "Error al obtener los datos de home" });
    }
}

async function getHomeDataForCommerce(req, res) {
    try {
        const [wallet, bonificaciones, gastosIngresos, ventas] =
            await Promise.all([
                apiRequest(`/cuentas/${req.user.username}`, "GET"),
                apiRequest(
                    `/cashback_emitido_mes_año/${req.user.username}`,
                    "GET"
                ),
                apiRequest(`/ingresos_gastos/${req.user.username}`, "GET"),
                apiRequest(`/ventas/${req.user.username}`, "GET"),
            ]);
        const fullDataObject = {
            wallet,
            bonificaciones,
            gastosIngresos,
            ventas,
        };
        fullDataObject.bonificaciones =
            completarMesesFaltantesBonificacionesEmitidas(
                fullDataObject.bonificaciones,
                2022,
                2025
            );
        fullDataObject.gastosIngresos = completarMesesGastosIngresos(
            fullDataObject.gastosIngresos,
            2022,
            2025
        );
        fullDataObject.ventas = completarMesesVentas(
            fullDataObject.ventas,
            2022,
            2025
        );
        res.status(200).json(fullDataObject);
    } catch (error) {
        console.error("Error al obtener los datos de home:", error);
        res.status(500).json({ error: "Error al obtener los datos de home" });
    }
}

export default {
    getTransactions,
    getTransactionsByMonth,
    getTransactionsCashbacksByMonth,
    getUserInfo,
    getUserAccounts,
    getCashbacksIssuedByMonth,
    getCashbacksIssuedByYear,
    getCashbackGeneratedByMonth,
    getCashbackGeneratedByYear,
    getCategoryExpensesByMonth,
    getIncomesAndExpensesByMonth,
    getIncomesAndExpensesByYear,
    getSalesByYear,
    getSalesByMonth,
    getHomeDataForUser,
    getHomeDataForCommerce,
};
