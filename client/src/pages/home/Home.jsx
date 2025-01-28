import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import "./Home.css";
import { verify } from "../../api/auth";
import Navbar from "../../components/navbar/Navbar";
import Example from "../../components/charts/DonutChart";
const Home = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchUserdata = async () => {
            try {
                const userData = await verify(); // Llama a la API para obtener los datos
                setUser(userData);
            } catch (error) {
                console.error("Error al obtener los datos del usuario:", error);
                setError(true); // Marca un error si no está autenticado
            } finally {
                setLoading(false); // Detén el loader
            }
        };

        fetchUserdata();
    }, []);

    if (loading) {
        return <></>; // Loader mientras se obtienen los datos
    }

    if (error) {
        return <Navigate to="/authentication" />; // Redirige al login si hay un error
    }

    return (
        <>
            <header>
                <Navbar />
            </header>
            <main>
                <h1>Bienvenido, {user?.username}!</h1>
                <p>Esta es la pagina principal</p>
                <Example />
            </main>
            <footer>Footer</footer>
        </>
    );
};

export default Home;
