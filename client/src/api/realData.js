import { apiRequest } from "./apiRequest.js";

async function getTotalTransactions () {
    try {
        const response = await apiRequest("/api/total-transactions", "GET");
        console.log("Respuesta obtenida de la API externa:", response);
        return response;
    } catch (error) {
        console.error("Error al obtener los datos:", error);
        throw new Error("Error al obtener los datos");
    }
};

async function getCashbackIssuedByMonthAndYear () {
    try {
        const response = await apiRequest("/api/cashback-issued-by-month-and-year", "GET");
        console.log("Respuesta obtenida de la API externa:", response);
        return response;
    } catch (error) {
        console.error("Error al obtener los datos:", error);
        throw new Error("Error al obtener los datos");
    }
};

async function getCashbackGeneratedByTypeMonthAndYear () {
    try {
        const response = await apiRequest("/api/cashback-generated-by-type-month-and-year", "GET");
        console.log("Respuesta obtenida de la API externa:", response);
        return response;
    } catch (error) {
        console.error("Error al obtener los datos:", error);
        throw new Error("Error al obtener los datos");
    }
};

async function getTotalCashbackByMonthAndYear () {
    try {
        const response = await apiRequest("/api/total-cashback-by-month-and-year", "GET");
        console.log("Respuesta obtenida de la API externa:", response);
        return response;
    } catch (error) {
        console.error("Error al obtener los datos:", error);
        throw new Error("Error al obtener los datos");
    }
};

async function getIncomesAndExpensesByMonth () {
    try {
        const response = await apiRequest("/api/incomes-and-expenses-by-month", "GET");
        console.log("Respuesta obtenida de la API externa:", response);
        return response;
    } catch (error) {
        console.error("Error al obtener los datos:", error);
        throw new Error("Error al obtener los datos");
    }
};

async function getIncomesAndExpensesSummary () {
    try {
        const response = await apiRequest("/api/incomes-and-expenses-summary", "GET");
        console.log("Respuesta obtenida de la API externa:", response);
        return response;
    } catch (error) {
        console.error("Error al obtener los datos:", error);
        throw new Error("Error al obtener los datos");
    }
};

async function getSalesByMonthAndYear () {
    try {
        const response = await apiRequest("/api/sales-by-month-and-year", "GET");
        console.log("Respuesta obtenida de la API externa:", response);
        return response;
    } catch (error) {
        console.error("Error al obtener los datos:", error);
        throw new Error("Error al obtener los datos");
    }
};

async function getSalesByTypeAndYear () {
    try {
        const response = await apiRequest("/api/sales-by-type-and-year", "GET");
        console.log("Respuesta obtenida de la API externa:", response);
        return response;
    } catch (error) {
        console.error("Error al obtener los datos:", error);
        throw new Error("Error al obtener los datos");
    }
};

async function getSalesByTypeMonthAndYear () {
    try {
        const response = await apiRequest("/api/sales-by-type-month-and-year", "GET");
        console.log("Respuesta obtenida de la API externa:", response);
        return response;
    } catch (error) {
        console.error("Error al obtener los datos:", error);
        throw new Error("Error al obtener los datos");
    }
};

export {
    getTotalTransactions,
    getCashbackIssuedByMonthAndYear,
    getCashbackGeneratedByTypeMonthAndYear,
    getTotalCashbackByMonthAndYear,
    getIncomesAndExpensesByMonth,
    getIncomesAndExpensesSummary,
    getSalesByMonthAndYear,
    getSalesByTypeAndYear,
    getSalesByTypeMonthAndYear
};