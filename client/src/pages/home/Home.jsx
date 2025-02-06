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
import UserPage from "../userpage/UserPage.jsx";

const Home = () => {
    const { t, setSpanish, setBasque } = useLanguage();
    const { theme } = useTheme();
    const [selectedPeriod, setSelectedPeriod] = useState({
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
    });
    const [filteredTransactions, setFilteredTransactions] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [userData, setUserData] = useState(null);
    const [showAside, setShowAside] = useState(false);
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
            setIsLoading(true);
            try {
                if (user?.role === "commerce") {
                    const userData = await getCommerceHomeData();
                    setUserData(userData);
                } else {
                    const userData = await getUserHomeData();
                    setUserData(userData);
                }
            } catch (error) {
                console.error("Error al obtener los datos del usuario:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserdata();
    }, [user?.role]);

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
                enabled: false,
            },
            centerText: {
                color: theme === "light" ? "#000000" : "#ffffff",
                total: `${walletTotalValue}€`,
            },
        },
        cutout: "85%",
        radius: "70%",
        elements: {
            arc: {
                borderWidth: 0,
            },
        },
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
                    <div onClick={() => setShowAside(!showAside)}>
                        <ProfileAvatar />
                    </div>
                </div>
            </header>

            {showAside && (
                <>
                    <div
                        className="aside-overlay"
                        onClick={() => setShowAside(false)}
                    />
                    <aside className={`profile-aside ${theme}`}>
                        <button className="close-aside" onClick={() => setShowAside(false)}>
                            ×
                        </button>
                        <UserPage />
                    </aside>
                </>
            )}


            <main>
                <h1>
                    {t.welcome}, {user?.username}!
                </h1>
                <div className="wallet-chart">
                    <DonutChart
                        data={walletData}
                        options={walletOptions}
                        legendValues={legendData}
                    />
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
                        <h3>{t.bonificationTitle}</h3>
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
                        <GraficoLibrerias
                            data={userData.ventas}
                            targetYear={new Date().getFullYear()}
                            targetMonth={new Date().getMonth()}
                            primaryKey={"ventas"}
                            showFilters={false}
                            height={200}
                        />
                    </button>
                )}
            </main>
        </div>
    );
};

export default Home;