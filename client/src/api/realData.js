import { apiRequest } from "./apiRequest.js";

async function getUserInfo() {
    try {
        const response = await apiRequest("/api/user-info", "GET");
        console.log("Respuesta obtenida de la API externa:", response);
        return response;
    } catch (error) {
        console.error("Error al obtener los datos:", error);
        throw new Error("Error al obtener los datos");
    }
}

async function getUserAccounts() {
    try {
        const response = await apiRequest("/api/user-accounts", "GET");
        console.log("Respuesta obtenida de la API externa:", response);
        return response;
    } catch (error) {
        console.error("Error al obtener los datos:", error);
        throw new Error("Error al obtener los datos");
    }
}

async function getCashbacksByMonth() {
    try {
        const response = await apiRequest(
            "/api/total-cashbacks-by-month",
            "GET"
        );
        console.log("Respuesta obtenida de la API externa:", response);
        return response;
    } catch (error) {
        console.error("Error al obtener los datos:", error);
        throw new Error("Error al obtener los datos");
    }
}
async function getCashbacksByYear() {
    try {
        const response = await apiRequest(
            "/api/total-cashbacks-by-year",
            "GET"
        );
        console.log("Respuesta obtenida de la API externa:", response);
        return response;
    } catch (error) {
        console.error("Error al obtener los datos:", error);
        throw new Error("Error al obtener los datos");
    }
}

async function getCashbackGeneratedByMonth() {
    try {
        const response = await apiRequest(
            "/api/cashback-generated-by-month",
            "GET"
        );
        console.log("Respuesta obtenida de la API externa:", response);
        return response;
    } catch (error) {
        console.error("Error al obtener los datos:", error);
        throw new Error("Error al obtener los datos");
    }
}
async function getCashbackGeneratedByYear() {
    try {
        const response = await apiRequest(
            "/api/cashback-generated-by-year",
            "GET"
        );
        console.log("Respuesta obtenida de la API externa:", response);
        return response;
    } catch (error) {
        console.error("Error al obtener los datos:", error);
        throw new Error("Error al obtener los datos");
    }
}

async function getCategoryExpensesByMonth(mes = "", año = "") {
    try {
        const queryParams = new URLSearchParams();
        if (mes) {
            queryParams.append("mes", mes);
        }
        if (año) {
            queryParams.append("año", año);
        }
        const response = await apiRequest(
            `/api/category-expenses-by-month?mes=${mes
                .toString()
                .padStart(2, "0")}&año=${año}`,
            "GET"
        );
        console.log("Respuesta obtenida de la API externa:", response);
        return response;
    } catch (error) {
        console.error("Error al obtener los datos:", error);
        throw new Error("Error al obtener los datos");
    }
}

async function getIncomesAndExpensesByMonth() {
    try {
        const response = await apiRequest(
            "/api/incomes-and-expenses-by-month",
            "GET"
        );
        console.log("Respuesta obtenida de la API externa:", response);
        return response;
    } catch (error) {
        console.error("Error al obtener los datos:", error);
        throw new Error("Error al obtener los datos");
    }
}
async function getIncomesAndExpensesByYear() {
    try {
        const response = await apiRequest(
            "/api/incomes-and-expenses-by-year",
            "GET"
        );
        console.log("Respuesta obtenida de la API externa:", response);
        return response;
    } catch (error) {
        console.error("Error al obtener los datos:", error);
        throw new Error("Error al obtener los datos");
    }
}

async function getSalesByMonth() {
    try {
        const response = await apiRequest("/api/sales-by-month", "GET");
        console.log("Respuesta obtenida de la API externa:", response);
        return response;
    } catch (error) {
        console.error("Error al obtener los datos:", error);
        throw new Error("Error al obtener los datos");
    }
}

async function getSalesByYear() {
    try {
        const response = await apiRequest("/api/sales-by-year", "GET");
        console.log("Respuesta obtenida de la API externa:", response);
        return response;
    } catch (error) {
        console.error("Error al obtener los datos:", error);
        throw new Error("Error al obtener los datos");
    }
}

async function getUserHomeData() {
    try {
        const response = await apiRequest("api/home-data-user", "GET");
        console.log("Respuesta obtenida de la API externa:", response);
        return response;
    } catch (error) {
        console.error("Error al obtener los datos:", error);
        throw new Error("Error al obtener los datos");
    }
}
async function getCommerceHomeData() {
    try {
        const response = await apiRequest("api/home-data-commerce", "GET");
        console.log("Respuesta obtenida de la API externa:", response);
        return response;
    } catch (error) {
        console.error("Error al obtener los datos:", error);
        throw new Error("Error al obtener los datos");
    }
}
export {
    getUserInfo,
    getUserAccounts,
    getCashbacksByMonth,
    getCashbacksByYear,
    getCashbackGeneratedByMonth,
    getCashbackGeneratedByYear,
    getCategoryExpensesByMonth,
    getIncomesAndExpensesByMonth,
    getIncomesAndExpensesByYear,
    getSalesByMonth,
    getSalesByYear,
    getUserHomeData,
    getCommerceHomeData,
};
