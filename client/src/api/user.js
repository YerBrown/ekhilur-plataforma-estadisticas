import { apiRequest } from "./apiRequest";

async function getUser(userId) {
    try {
        const response = await apiRequest(`/user/${userId}`, "GET");
        console.log("Response:", response);
        return response;
    } catch (error) {
        console.error("Error al obtener el usuario:", error);
        throw new Error("Error al obtener el usuario");
    }
}

export { getUser };
