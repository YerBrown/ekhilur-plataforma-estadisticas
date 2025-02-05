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
    const { user } = useContext(AuthContext);
    const [filteredTransactions, setFilteredTransactions] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();

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
                    console.log("datos home", userData);
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
    const legendData = walletLabels.map((label, index) => ({
        label,
        value: walletValues[index],
        color: walletColors[index],
    }));
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
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            datalabels: {
                display: false,
            },
            tooltip: {
                enabled: false, // Desactiva tooltip si solo quieres mostrar valores en la leyenda
            },
            centerText: {
                color: theme === "light" ? "#000000" : "#ffffff",
                total: `${walletTotalValue}€`, // Pasar el total calculado
            },
        },
        cutout: "85%", // Ajusta el tamaño del agujero central del donut
        radius: "70%",
        elements: {
            arc: {
                borderWidth: 0,
            },
        },
    };

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // Mes actual (1-12)
    const currentYear = currentDate.getFullYear();
    const previousMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const previousYear = currentMonth === 1 ? currentYear - 1 : currentYear;

    // BUSCAR BONIFICACIONES
    const currentBonus = userData.bonificaciones.find(
        (b) => parseInt(b.mes) === currentMonth && parseInt(b.año) === currentYear
    )?.bonificaciones || 0;

    const previousBonus = userData.bonificaciones.find(
        (b) => parseInt(b.mes) === previousMonth && parseInt(b.año) === previousYear
    )?.bonificaciones || 0;

    // BUSCAR BONIFICACIONES DE COMERCIO
    const emmitedShopBonus = userData.bonificaciones.find(
        (b) => parseInt(b.mes) === currentMonth && parseInt(b.año) === currentYear
    )?.bonificaciones_emitidas || 0;

    const receivedShopBonus = userData.bonificaciones.find(
        (b) => parseInt(b.mes) === currentMonth && parseInt(b.año) === currentYear
    )?.bonificaciones_recibidas || 0;

    // BUSCAR GASTOS E INGRESOS
    const expenses = userData.bonificaciones.find(
        (b) => parseInt(b.mes) === currentMonth && parseInt(b.año) === currentYear
    )?.gastos || 0;

    const income = userData.bonificaciones.find(
        (b) => parseInt(b.mes) === currentMonth && parseInt(b.año) === currentYear
    )?.ingresos || 0;

    // BUSCAR VENTAS
    const currentSales = userData.bonificaciones.find(
        (b) => parseInt(b.mes) === currentMonth && parseInt(b.año) === currentYear
    )?.ventas || 0;

    const previousSales = userData.bonificaciones.find(
        (b) => parseInt(b.mes) === previousMonth && parseInt(b.año) === previousYear
    )?.ventas || 0;

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
                <div className="wallet-chart">
                    <DonutChart
                        data={walletData}
                        options={walletOptions}
                        legendValues={legendData}
                    />
                </div>
                {user?.role === "user" && (
                    <div className="user-bonifications-section">
                        <button onClick={() => handleNavigate("/bonifications")}>
                            <h3>{t.bonificationTitle}</h3>
                            <h4>{currentBonus.toFixed(2)} €</h4>
                        </button>
                        <button onClick={() => handleNavigate("/bonifications")}>
                            <h3>{t.bonificationTitle}</h3>
                            <h4>{previousBonus.toFixed(2)} €</h4>
                        </button>
                    </div>
                )}
                {user?.role === "commerce" && (
                    <div className="commerce-bonifications-section">
                        <button
                            onClick={() => handleNavigate("/bonifications-shop")}>
                            <h3>{t.bonificationTitle}</h3>
                            <h4>{emmitedShopBonus.toFixed(2)} €</h4>
                        </button>
                        <button
                            onClick={() => handleNavigate("/bonifications-shop")}>
                            <h3>{t.bonificationTitle}</h3>
                            <h4>{receivedShopBonus.toFixed(2)} €</h4>
                        </button>
                    </div>
                )}
                <div className="statistics-section">
                    <button onClick={() => handleNavigate("/statistics")}>
                        <h3>{t.statisticsTitle}</h3>
                        <h4>{income.toFixed(2)} €</h4>
                    </button>
                    <button onClick={() => handleNavigate("/statistics")}>
                        <h3>{t.statisticsTitle}</h3>
                        <h4>{expenses.toFixed(2)} €</h4>
                    </button>
                </div>
                <button onClick={() => handleNavigate("/transactions")}>
                    <h3>{t.transactionTitle}</h3>
                    <TransactionList transactions={mockData.slice(0, 3)} />
                </button>
                {user?.role === "commerce" && (
                    <div className="sales-section">
                        <button onClick={() => handleNavigate("/sales")}>
                            <h3>{t.salesTitle}</h3>
                            <h4>{currentSales.toFixed(2)} €</h4>
                        </button>
                        <button onClick={() => handleNavigate("/sales")}>
                            <h3>{t.salesTitle}</h3>
                            <h4>{previousSales.toFixed(2)} €</h4>
                        </button>
                    </div>
                )}
                {/* <button onClick={() => handleNavigate("/map")}>
                    <h3>Mapa</h3>
                </button> */}
            </main>
        </div>
    );
};

export default Home;
