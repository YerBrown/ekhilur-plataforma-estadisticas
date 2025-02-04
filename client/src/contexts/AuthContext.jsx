import { createContext, useState, useEffect } from "react";
import { verify } from "../api/auth";

// Crear el contexto
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // Verificar el token en la cookie al cargar la aplicación
    useEffect(() => {
        const checkUser = async () => {
            try {
                const verifiedUser = await verify();
                if (verifiedUser) {
                    setUser(verifiedUser);
                }
            } catch (error) {
                console.error("Error al verificar el usuario", error);
                setUser(null);
            }
        };

        checkUser();
    }, []);

    // Función para guardar el usuario en el contexto
    const loginUser = (userData) => {
        if (!userData) {
            console.error("Error: userData es undefined");
            return;
        }
        setUser(userData);
    };

    // Función para cerrar sesión
    const logoutUser = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loginUser, logoutUser }}>
            {children}
        </AuthContext.Provider>
    );
};
