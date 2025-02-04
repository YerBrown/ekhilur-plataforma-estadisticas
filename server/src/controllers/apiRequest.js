
async function apiRequest(route, method = "GET", data = null) {
    try {
        let url = new URL(route, "http://api_ekhidata:5000");
        const fetchOptions = {
            method,
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        };

        if ((method === "POST" || method === "PUT") && data) {
            fetchOptions.body = JSON.stringify(data);
        } else if (data) {
            Object.entries(data).forEach(([key, value]) => {
                if (
                    (typeof value === "string" ||
                        typeof value === "number" ||
                        typeof value === "boolean") &&
                    value !== undefined &&
                    value !== null
                ) {
                    console.log("key value", key, "|", value);
                    url.searchParams.append(key, value);
                }
            });
        }
        const response = await fetch(url.toString(), fetchOptions);
        if (!response.ok) {
            throw new Error("Error en la petición");
        }
        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error("Error en apiRequest:", error);
        throw error;
    }
}

export { apiRequest };