const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

async function apiRequest(route, method = "GET", data = null, headers = {}) {
    try {
        let url = new URL(route, API_BASE_URL);
        const fetchOptions = {
            method,
            headers: {
                "Content-Type": "application/json",
                ...headers,
            },
            credentials: "include",
        };

        if (["POST", "PUT", "PATCH"].includes(method) && data) {
            fetchOptions.body = JSON.stringify(data);
        } else if (data) {
            Object.entries(data).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    url.searchParams.append(key, value);
                }
            });
        }

        const response = await fetch(url.toString(), fetchOptions);
        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(
                responseData.message ||
                    `${response.status}: ${response.statusText}`
            );
        }

        return responseData;
    } catch (error) {
        throw error;
    }
}

export { apiRequest };
