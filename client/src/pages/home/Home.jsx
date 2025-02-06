import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext.jsx";
import { GoPlusCircle } from "react-icons/go";
import { TbPigMoney } from "react-icons/tb";
import DonutChart from "../../components/charts/DonutChart";
import ProfileAvatar from "../../components/ProfileAvatar";
import TransactionList from "../../components/transactions-list/TransactionsList";
import {
    getUserHomeData,
    getCommerceHomeData,
    getTransactions,
} from "../../api/realData.js";
import { useTheme } from "../../contexts/ThemeContext";
import { AuthContext } from "../../contexts/AuthContext";
import "./Home.css";

const Home = () => {
    const { t } = useLanguage();
    const { theme } = useTheme();
    const { user } = useContext(AuthContext);
    const [filteredTransactions, setFilteredTransactions] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [userData, setUserData] = useState(null);
    const [transData, setTransData] = useState([]);
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
                    const transData = await getTransactions();
                    setUserData(userData);
                    setTransData(transData);
                } else {
                    const userData = await getUserHomeData(); // Llama a la API para obtener los datos
                    const transData = await getTransactions();
                    console.log("transdata", transData);
                    setUserData(userData);
                    setTransData(transData);
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
    const walletColors = ["#0047ba", "#FF9012"];
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
        radius: "90%",
        elements: {
            arc: {
                borderWidth: 0,
            },
        },
    };

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // Mes actual (1-12)
    const currentYear = currentDate.getFullYear(); // Obtener el año completo

    const previousMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const previousYear = currentMonth === 1 ? currentYear - 1 : currentYear;

    // Obtener los últimos dos dígitos del año
    const currentYearShort = (currentYear % 100).toString().padStart(2, "0");
    const previousYearShort = (previousYear % 100).toString().padStart(2, "0");

    // Obtener la abreviatura del mes en español
    const getMonthAbbreviation = (monthNumber) => {
        const date = new Date(2025, monthNumber - 1); // Crear una fecha con el mes dado
        const monthShort = date
            .toLocaleString("es-ES", { month: "short" })
            .toLowerCase()
            .replace(".", ""); // Quitar el punto si existe
        return t.monthsAbbreviations[monthShort] || monthShort; // Usar la traducción o la abreviatura original
    };

    // Formatear las fechas correctamente
    const previousMonthFormatted = `${getMonthAbbreviation(
        previousMonth
    )} ${previousYearShort}`;
    const currentMonthFormatted = `${getMonthAbbreviation(
        currentMonth
    )} ${currentYearShort}`;

    // BUSCAR BONIFICACIONES
    const currentBonus =
        userData.bonificaciones.find(
            (b) =>
                parseInt(b.mes) === currentMonth &&
                parseInt(b.año) === currentYear
        )?.bonificaciones || 0;

    const previousBonus =
        userData.bonificaciones.find(
            (b) =>
                parseInt(b.mes) === previousMonth &&
                parseInt(b.año) === previousYear
        )?.bonificaciones || 0;

    // BUSCAR BONIFICACIONES DE COMERCIO
    const emmitedShopBonus =
        userData.bonificaciones.find(
            (b) =>
                parseInt(b.mes) === currentMonth &&
                parseInt(b.año) === currentYear
        )?.bonificaciones_emitidas || 0;

    const receivedShopBonus =
        userData.bonificaciones.find(
            (b) =>
                parseInt(b.mes) === currentMonth &&
                parseInt(b.año) === currentYear
        )?.bonificaciones_recibidas || 0;

    // BUSCAR GASTOS E INGRESOS
    const expenses =
        userData.bonificaciones.find(
            (b) =>
                parseInt(b.mes) === currentMonth &&
                parseInt(b.año) === currentYear
        )?.gastos || 0;

    const income =
        userData.bonificaciones.find(
            (b) =>
                parseInt(b.mes) === currentMonth &&
                parseInt(b.año) === currentYear
        )?.ingresos || 0;

    // BUSCAR VENTAS
    const currentSales =
        userData.bonificaciones.find(
            (b) =>
                parseInt(b.mes) === currentMonth &&
                parseInt(b.año) === currentYear
        )?.ventas || 0;

    const previousSales =
        userData.bonificaciones.find(
            (b) =>
                parseInt(b.mes) === previousMonth &&
                parseInt(b.año) === previousYear
        )?.ventas || 0;

    return (
        <div className="home-page">
            <header>
                <img src="logo_dos.png" alt="Logo Ekhidata" />
                <div className="header-content">
                    <ProfileAvatar />
                </div>
            </header>
            <main>
                <div className="wallet-chart">
                    <div className="wallet-icon">
                        <TbPigMoney size={50} />
                    </div>
                    <DonutChart
                        data={walletData}
                        options={walletOptions}
                        legendValues={legendData}
                    />
                </div>
                {user?.role === "user" && (
                    <div className="bonifications-section">
                        <button
                            className="square-button-bonifications"
                            onClick={() => handleNavigate("/bonifications")}
                        >
                            <div className="info">
                                <h3>{t.bonificationTitle}</h3>
                                <p>{previousMonthFormatted}</p>
                            </div>
                            <div className="value">
                                <GoPlusCircle />
                                <h4>
                                    {previousBonus.toFixed(2).replace(".", ",")}
                                </h4>
                            </div>
                        </button>
                        <button
                            className="square-button-bonifications"
                            onClick={() => handleNavigate("/bonifications")}
                        >
                            <div className="info">
                                <h3>{t.bonificationTitle}</h3>
                                <p>{currentMonthFormatted}</p>
                            </div>
                            <div className="value">
                                <GoPlusCircle />
                                <h4>
                                    {currentBonus.toFixed(2).replace(".", ",")}
                                </h4>
                            </div>
                        </button>
                    </div>
                )}
                {user?.role === "commerce" && (
                    <div className="sales-section">
                        <button
                            className="square-button-sales"
                            onClick={() => handleNavigate("/sales")}
                        >
                            <div className="info">
                                <h3>{t.salesTitle}</h3>
                                <p>{previousMonthFormatted}</p>
                            </div>
                            <div className="value">
                                <GoPlusCircle />
                                <h4>
                                    {previousSales.toFixed(2).replace(".", ",")}
                                </h4>
                            </div>
                        </button>
                        <button
                            className="square-button-sales"
                            onClick={() => handleNavigate("/sales")}
                        >
                            <div className="info">
                                <h3>{t.salesTitle}</h3>
                                <p>{currentMonthFormatted}</p>
                            </div>
                            <div className="value">
                                <GoPlusCircle />
                                <h4>
                                    {currentSales.toFixed(2).replace(".", ",")}
                                </h4>
                            </div>
                        </button>
                    </div>
                )}
                {user?.role === "commerce" && (
                    <div className="bonifications-section">
                        <button
                            className="square-button-bonifications"
                            onClick={() =>
                                handleNavigate("/bonifications-shop")
                            }
                        >
                            <div className="info">
                                <h3>
                                    {t.bonificationTitle} {t.emmited}
                                </h3>
                            </div>
                            <div className="value">
                                <GoPlusCircle />
                                <h4>
                                    {emmitedShopBonus
                                        .toFixed(2)
                                        .replace(".", ",")}
                                </h4>
                            </div>
                        </button>
                        <button
                            className="square-button-bonifications"
                            onClick={() =>
                                handleNavigate("/bonifications-shop")
                            }
                        >
                            <div className="info">
                                <h3>
                                    {t.bonificationTitle} {t.received}
                                </h3>
                            </div>
                            <div className="value">
                                <GoPlusCircle />
                                <h4>
                                    {receivedShopBonus
                                        .toFixed(2)
                                        .replace(".", ",")}
                                </h4>
                            </div>
                        </button>
                    </div>
                )}
                <div className="statistics-section">
                    <div className="mobile-statistics">
                        <button
                            className="square-button-statistics"
                            onClick={() => handleNavigate("/statistics")}
                        >
                            <div className="info">
                                <h3>{t.incomes}</h3>
                            </div>
                            <div className="value">
                                <GoPlusCircle />
                                <h4>
                                    {income
                                        .toFixed(2)
                                        .replace(".", ",")
                                        .replace(".", ",")}
                                </h4>
                            </div>
                        </button>
                        <button
                            className="square-button-statistics"
                            onClick={() => handleNavigate("/statistics")}
                        >
                            <div className="info">
                                <h3>{t.expenses}</h3>
                            </div>
                            <div className="value">
                                <GoPlusCircle />
                                <h4>{expenses.toFixed(2).replace(".", ",")}</h4>
                            </div>
                        </button>
                    </div>
                </div>
                {/* <div className="transactions-section">
                    <button className="transactions-home-button" onClick={() => handleNavigate("/transactions")}>
                        <TransactionList transactions={transData.slice(0, 3)} />
                        <button className="add-button">
                            <GoPlusCircle size={32} />
                        </button>
                    </button>
                </div> */}
                {/* <button onClick={() => handleNavigate("/map")}>
                    <h3>Mapa</h3>
                </button> */}
            </main>
        </div>
    );
};

export default Home;
