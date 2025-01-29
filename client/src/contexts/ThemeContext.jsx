import React, { createContext, useState, useContext, useEffect } from "react";

// Crear el contexto del tema
const ThemeContext = createContext();

// Proveedor del tema
export const ThemeProvider = ({ children }) => {
    // Detectar el tema del sistema operativo al cargar la página
    const getSystemTheme = () => {
        return window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light";
    };

    // Estado del tema, inicializado con el tema del sistema
    const [theme, setTheme] = useState(getSystemTheme());

    // Actualizar el tema si el usuario cambia la configuración del sistema
    useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

        const handleChange = () => {
            setTheme(mediaQuery.matches ? "dark" : "light");
        };

        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
    }, []);

    return (
        <ThemeContext.Provider value={{ theme }}>
            {children}
        </ThemeContext.Provider>
    );
};

// Hook para acceder al contexto
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme debe ser usado dentro de un ThemeProvider");
    }
    return context;
};
