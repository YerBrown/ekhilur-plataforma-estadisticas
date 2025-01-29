import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import "./Root.css";

const Root = () => {
    return (
        <div className="root">
            <header>
                <Navbar />
            </header>
            <main>
                <Outlet /> {/* Renderiza las rutas hijas aquí */}
            </main>
            <footer>
                <p>© 2025 Mi Aplicación - Todos los derechos reservados</p>
            </footer>
        </div>
    );
};

export default Root;
