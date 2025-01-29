import { apiRequest } from "./apiRequest";

async function register(userData) {
    try {
        const response = await apiRequest("/auth/register", "POST", userData);
        console.log("Response:", response);
        return response;
    } catch (error) {
        throw new Error(error);
    }
}

async function login(credentials) {
    try {
        const response = await apiRequest("/auth/login", "POST", credentials);
        console.log("Response:", response);
        return response;
    } catch (error) {
        throw new Error(error);
    }
}

async function logout() {
    try {
        const response = await apiRequest("/auth/logout", "POST");
        console.log("Response:", response);
        return response;
    } catch (error) {
        throw new Error("Error al cerrar sesión");
    }
}

async function verify() {
    try {
        const response = await apiRequest("/auth/verify", "GET");
        console.log("Response:", response);
        return response;
    } catch (error) {
        throw new Error("Error al comprobar inicio de sesion");
    }
}

export { register, login, logout, verify };
