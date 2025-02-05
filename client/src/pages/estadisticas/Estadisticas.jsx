import { useState, useEffect } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import Layout from "../layout/Layout";
import "./Estadisticas.css";
import GraficoLibrerias from "../../components/charts/BarChartNew";
import DateFilter from "../../components/DateFilter/DateFilter";
import { getIncomesAndExpensesByMonth, getIncomesAndExpensesByYear} from "../../api/realData";
import mockData from "../../components/transactions-list/mockData.js";
import TransactionList from "../../components/transactions-list/TransactionsList";
import CategoryChart from "../../components/charts/CategoryCharts";

const fakeApiData = [
    {
        label: "Alimentación",
        value: 50,
    },
    {
        label: "Moda y Complementos",
        value: 14,
    },
    {
        label: "Salud y Estética",
        value: 67,
    },
    {
        label: "Servicios y Comercio General",
        value: 32,
    },
    {
        label: "Industria y Construcción",
        value: 15,
    },
    {
        label: "Arte y Cultura",
        value: 13,
    },
    {
        label: "Deporte y Ocio",
        value: 6,
    },
    {
        label: "Asociaciones y Cooperativas",
        value: 120,
    },
];

const Estadisticas = () => {
    const { t } = useLanguage();
    const [selectedPeriod, setSelectedPeriod] = useState({
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
    });
    const [statistics, setStatistics] = useState({
        totalIngresos: 0,
        totalGastos: 0,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [apiData, setApiData] = useState([
        { año: "2022", mes: "11", valor: 100, otroValor: 80 },
        { año: "2022", mes: "12", valor: 150, otroValor: 120 },
        { año: "2023", mes: "01", valor: 200, otroValor: 180 },
        { año: "2023", mes: "02", valor: 250, otroValor: 220 },
        { año: "2023", mes: "03", valor: 300, otroValor: 270 },
        { año: "2024", mes: "12", valor: 150, otroValor: 120 },
        { año: "2024", mes: "01", valor: 200, otroValor: 180 },
        { año: "2024", mes: "02", valor: 250, otroValor: 220 },
        { año: "2024", mes: "03", valor: 300, otroValor: 270 },
    ]);

    const loadApiData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await getIncomesAndExpensesByMonth();
            console.log("Hola", data);
            setApiData(data);


            if (selectedPeriod) {
                updateStatisticsFromApiData(data, selectedPeriod);
            }
        } catch (error) {
            console.error("Error al cargar datos:", error);
            setError(
                "No se pudieron cargar los datos. Por favor, intente más tarde."
            );
            setError(
                "No se pudieron cargar los datos. Por favor, intente más tarde."
            );
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadApiData();
    }, []);

    const updateStatisticsFromApiData = (data, period) => {
        if (!data) return;

        const { year, month } = period;
        const monthData = data.find(
            (item) =>
                item.año === year.toString() &&
                parseInt(item.mes, 10) === month + 1
        );

        if (monthData) {
            setStatistics({
                totalIngresos: Number(monthData.ingresos),
                totalGastos: Number(monthData.gastos),
            });
        } else {
            setStatistics({
                totalIngresos: 0,
                totalGastos: 0,
            });
        }
    };

    const formatCurrency = (value) => {
        const num = Number(value);
        return Number.isInteger(num) ? `${num}€` : `${num.toFixed(1)}€`;
    };

    const getAmountStyle = (value, isGasto = false) => {
        if (isGasto && value > 0) {
            return `-${formatCurrency(value)}`;
        }
        return formatCurrency(value);
    };

    const handleDateFilter = ({ year, month }) => {
        setSelectedPeriod({ year, month });
        if (apiData) {
            updateStatisticsFromApiData(apiData, { year, month });
        }
    };

    return (
        <div className="estadisticas-page">
            <Layout title={t.statisticsTitle}>
                <div className="container-date-filter">
                    <DateFilter onDateFilter={handleDateFilter} />
                </div>

                {error && <div className="error-message">{error}</div>}

                {isLoading ? (
                    <div className="loading-message">Cargando datos...</div>
                ) : (
                    <>
                        <div className="container-ingresos-gastos">
                            <div className="item-ingresos-gastos">
                                <p className="label-ingresos">{t.incomes}</p>
                                <span className="amount-ingresos">
                                    {getAmountStyle(statistics.totalIngresos)}
                                </span>
                            </div>
                            <div className="item-ingresos-gastos">
                                <p className="label-gastos">{t.expenses}</p>
                                <span className="amount-gastos">
                                    {getAmountStyle(
                                        statistics.totalGastos,
                                        true
                                    )}
                                </span>
                            </div>
                        </div>
                        <div className="chart-section">
                            <GraficoLibrerias
                                data={apiData}
                                targetYear={selectedPeriod.year}
                                targetMonth={selectedPeriod.month}
                                primaryKey={"gastos"}
                                secondaryKey={"ingresos"}
                                showFilters={true}
                            />
                        </div>
                        <CategoryChart categoryDataJson={fakeApiData} />
                        <TransactionList transactions={mockData} />
                    </>
                )}
            </Layout>
        </div>
    );
};

export default Estadisticas;
