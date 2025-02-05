import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext.jsx";
import DonutChart from "../../components/charts/DonutChart";
import ProfileAvatar from "../../components/ProfileAvatar";
import GraficoLibrerias from "../../components/charts/BarChartNew.jsx";
import TransactionList from "../../components/transactions-list/TransactionsList";
import mockData from "../../components/transactions-list/mockData.js";
import { getUserHomeData, getCommerceHomeData } from "../../api/realData.js";
import { useTheme } from "../../contexts/ThemeContext";
import { AuthContext } from "../../contexts/AuthContext";
import "./Home.css";

const Home = () => {
    const { t, setSpanish, setBasque } = useLanguage();
    const { theme } = useTheme();
    const [selectedPeriod, setSelectedPeriod] = useState({
        month: new Date().getMonth + 1,
        year: new Date().getFullYear,
    });
    const [filteredTransactions, setFilteredTransactions] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    useEffect(() => {
        if (!user) {
            navigate("/authentication");
        }
    }, [user, navigate]);

    const handleNavigate = (path) => {
        navigate(path);
    };
    useEffect(() => {
        const fetchUserdata = async () => {
            setIsLoading(true); // Detén el loader
            try {
                if (user?.role === "commerce") {
                    const userData = await getCommerceHomeData(); // Llama a la API para obtener los datos
                    console.log(userData.bonificaciones);
                    setUserData(userData);
                } else {
                    const userData = await getUserHomeData(); // Llama a la API para obtener los datos
                    setUserData(userData);
                }
            } catch (error) {
                console.error("Error al obtener los datos del usuario:", error);
            } finally {
                setIsLoading(false); // Detén el loader
            }
        };

        fetchUserdata();
    }, []);
    if (isLoading) {
        return <>Loading...</>;
    }
    if (userData == null) {
        return <>Failed...</>;
    }
    const filteredData = userData.wallet.data.cuentas.filter(
        (item) => item.saldo > 0
    );
    const walletLabels = filteredData.map((item) => item.tipo);
    const walletValues = filteredData.map((item) => item.saldo);
    const walletColors = ["#FF6384", "#36A2EB", "#FFCE56", "#36A2EB"];
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

    const walletTotalValue = userData.wallet.data.saldo_total;
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

    return (
        <div className="home-page">
            <header>
                <img src="logo_dos.png" alt="Logo Ekhidata" />
                <div className="header-content">
                    <div className="language-button-container">
                        <button
                            className="language-button"
                            onClick={setSpanish}
                        >
                            ES
                        </button>
                        <p>|</p>
                        <button className="language-button" onClick={setBasque}>
                            EU
                        </button>
                    </div>
                    <ProfileAvatar />
                </div>
            </header>
            <main>
                <h1>
                    {t.welcome}, {user?.username}!
                </h1>
                <div className="wallet-chart">
                    <h3>{t.wallet}</h3>
                    <DonutChart data={walletData} options={walletOptions} />
                </div>
                {user?.role === "user" && (
                    <button onClick={() => handleNavigate("/bonifications")}>
                        <h3>{t.bonificationTitle}</h3>
                        <GraficoLibrerias
                            data={userData.bonificaciones}
                            targetYear={new Date().getFullYear()}
                            targetMonth={new Date().getMonth()}
                            primaryKey={"bonificaciones"}
                            showFilters={false}
                            height={200}
                        />
                    </button>
                )}
                {user?.role === "commerce" && (
                    <button
                        onClick={() => handleNavigate("/bonifications-shop")}
                    >
                        <h3>Denda {t.bonificationTitle}</h3>
                        <GraficoLibrerias
                            data={userData.gastosIngresos}
                            targetYear={new Date().getFullYear()}
                            targetMonth={new Date().getMonth()}
                            primaryKey={"bonificaciones_emitidas"}
                            secondaryKey={"bonificaciones_recibidas"}
                            showFilters={false}
                            height={200}
                        />
                    </button>
                )}
                <button onClick={() => handleNavigate("/statistics")}>
                    <h3>{t.statisticsTitle}</h3>
                    <GraficoLibrerias
                        data={userData.gastosIngresos}
                        targetYear={new Date().getFullYear()}
                        targetMonth={new Date().getMonth()}
                        primaryKey={"gastos"}
                        secondaryKey={"ingresos"}
                        showFilters={false}
                        height={200}
                    />
                </button>
                <button onClick={() => handleNavigate("/transactions")}>
                    <h3>{t.transactionTitle}</h3>
                    <TransactionList transactions={mockData.slice(0, 3)} />
                </button>
                {user?.role === "commerce" && (
                    <button onClick={() => handleNavigate("/sales")}>
                        <h3>{t.salesTitle}</h3>
                    </button>
                )}
                {/* <button onClick={() => handleNavigate("/map")}>
                    <h3>Mapa</h3>
                </button> */}
            </main>
        </div>
    );
};

export default Home;
