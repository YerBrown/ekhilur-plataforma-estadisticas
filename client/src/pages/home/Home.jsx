import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { verify } from "../../api/auth";
import DonutChart from "../../components/charts/DonutChart";
import ProfileAvatar from "../../components/ProfileAvatar";
import { useTheme } from "../../contexts/ThemeContext";
import "./Home.css";

const walletDataJson = [
    { label: "Euro", value: 400, color: "#FF6384" },
    { label: "Ekhi", value: 300, color: "#36A2EB" },
    { label: "Ekhi Hernani", value: 300, color: "#FFCE56" },
];

const Home = () => {
    const { theme } = useTheme();
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
    const walletLabels = walletDataJson.map((item) => item.label);
    const walletValues = walletDataJson.map((item) => item.value);
    const walletColors = walletDataJson.map((item) => item.color);
    const walletData = {
        labels: walletLabels,
        datasets: [
            {
                label: "Wallet",
                data: walletValues,
                backgroundColor: walletColors,
                hoverBackgroundColor: walletColors,
            },
        ],
    };

    const walletTotalValue = walletDataJson.reduce(
        (acc, item) => acc + item.value,
        0
    );
    const walletOptions = {
        responsive: true,
        maintainAspectRatio: false, // Permitir personalizar ancho y alto
        plugins: {
            legend: {
                display: false, // Oculta completamente la leyenda
                labels: {
                    usePointStyle: true, // Cambia los cuadrados a puntos (si no deseas ocultarlos)
                },
            },
            tooltip: {
                enabled: false,
                callbacks: {
                    label: function (tooltipItem) {
                        return `${tooltipItem.label}: ${tooltipItem.raw} €`;
                    },
                },
            },
            datalabels: {
                color: theme === "light" ? "#000000" : "#ffffff", // Color del texto
                font: {
                    size: 14,
                    family: "Noway",
                },
                formatter: (value, context) => {
                    const label = context.chart.data.labels[context.dataIndex];
                    return `${label}\n ${value} €`; // Muestra label y valor
                },
                anchor: "end", // Posicionar fuera del gráfico
                align: "end", // Alineación externa
                offset: 10,
            },
            centerText: {
                color: theme === "light" ? "#000000" : "#ffffff",
                total: `${walletTotalValue}€`, // Pasar el total calculado
            },
        },
        elements: {
            arc: {
                borderWidth: 0, // Grosor del borde del arco
            },
        },

        cutout: "70%", // Ajusta el tamaño del agujero central del donut (más grande o más pequeño)
        radius: "60%",
    };

    if (loading) {
        return <></>; // Loader mientras se obtienen los datos
    }

    if (error) {
        return <Navigate to="/authentication" />; // Redirige al login si hay un error
    }

    return (
        <div className="home-page">
            <header>
                <img
                    src="/public/ekhilur/Ekhilur_isotipo.png"
                    alt="Logo Ekhidata"
                />
                <ProfileAvatar />
            </header>
            <main>
                <h1>Bienvenido, {user?.username}!</h1>
                <div className="wallet-chart">
                    <h3>Monedero</h3>
                    <DonutChart data={walletData} options={walletOptions} />
                </div>
                <div>Bonificaciones</div>
                <div>Estadisticas</div>
                <div>Transacciones</div>
            </main>
        </div>
    );
};

export default Home;
