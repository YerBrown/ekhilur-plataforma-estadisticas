import { createContext, useState, useEffect } from "react";

// Crear el contexto
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // Cargar usuario desde localStorage (opcional, para persistencia)
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    // Función para guardar el usuario en el contexto
    const loginUser = (userData) => {
        if (!userData) {
            console.error("Error: userData es undefined");
            return;
        }
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData)); // Guardar en localStorage
    };

    // Función para cerrar sesión
    const logoutUser = () => {
        setUser(null);
        localStorage.removeItem("user");
    };

    return (
        <AuthContext.Provider value={{ user, loginUser, logoutUser }}>
            {children}
        </AuthContext.Provider>
    );
};
