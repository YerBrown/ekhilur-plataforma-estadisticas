import React from "react";
import { Link } from "react-router-dom";
import "./ErrorBoundary.css"; // Importa el archivo de estilos

const ErrorBoundary = () => {
    return (
        <div className="error-boundary">
            <h1 className="error-boundary-title">404 - Página no encontrada</h1>
            <p className="error-boundary-description">
                La página que estás buscando no existe. Verifica la URL o vuelve
                al inicio.
            </p>
            <Link to="/" className="error-boundary-link">
                Volver al inicio
            </Link>
        </div>
    );
};

export default ErrorBoundary;
