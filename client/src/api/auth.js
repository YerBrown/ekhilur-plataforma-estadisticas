import { apiRequest } from "./apiRequest";

async function register(userData) {
    try {
        const response = await apiRequest("/auth/register", "POST", userData);
        console.log("Response:", response);
        return response;
    } catch (error) {
        console.error("Error al registrar al usuario:", error);
        throw new Error("Error al registrar al usuario");
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
        const response = await apiRequest("/logout", "POST");
        console.log("Response:", response);
        return response;
    } catch (error) {
        console.error("Error al cerrar sesión:", error);
        throw new Error("Error al cerrar sesión");
    }
}

export { register, login, logout };
