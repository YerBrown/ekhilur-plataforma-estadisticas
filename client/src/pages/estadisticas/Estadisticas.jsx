import { useState, useEffect } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import Layout from "../layout/Layout";
import "./Estadisticas.css";
import GraficoLibrerias from "../../components/charts/BarChartNew";
import DateFilter from "../../components/DateFilter/DateFilter";
import {
    getIncomesAndExpensesByMonth,
    getCategoryExpensesByMonth,
} from "../../api/realData";
import TransactionList from "../../components/transactions-list/TransactionsList";
import CategoryChart from "../../components/charts/CategoryCharts";
import mockData from "../../api/mockDataUser.js";


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
    const [isLoading, setIsLoading] = useState(true);
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
    const [categorydata, setCategoryData] = useState([]);
    const [filteredTransactions, setFilteredTransactions] = useState(mockData);

    useEffect(() => {
        // Filtrar las transacciones basadas en el periodo seleccionado
        const filteredData = mockData.filter((transaction) => {
            const transactionYear = parseInt(transaction.año, 10);
            const transactionMonth = parseInt(transaction.mes, 10);

            return (
                transactionYear === selectedPeriod.year &&
                transactionMonth === selectedPeriod.month + 1
            );
        });

        setFilteredTransactions(filteredData);
    }, [selectedPeriod]);

    const loadApiData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await getIncomesAndExpensesByMonth();
            const categorydata = await getCategoryExpensesByMonth(
                new Date().getMonth() + 1,
                new Date().getFullYear()
            );

            setApiData(data);
            setCategoryData(categorydata);
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

    const updateStatisticsFromApiData = async (data, period) => {
        if (!data) return;

        const { year, month } = period;
        setIsLoading(true);
        const categoryData = await getCategoryExpensesByMonth(month + 1, year);
        setCategoryData(categoryData);
        setIsLoading(false);
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
        <Layout title={t.statisticsTitle}>
            <div className="statistics-content-container">
                <DateFilter onDateFilter={handleDateFilter} />

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
                        <div className="chart-container">
                            <GraficoLibrerias
                                data={apiData}
                                targetYear={selectedPeriod.year}
                                targetMonth={selectedPeriod.month}
                                primaryKey={"gastos"}
                                secondaryKey={"ingresos"}
                                showFilters={true}
                            />
                        </div>
                        <CategoryChart categoryDataJson={categorydata} />
                        {filteredTransactions.length === 0 ? (
                            <>
                            </>
                        ) : (
                            <TransactionList transactions={filteredTransactions} />
                        )}
                    </>
                )}
            </div>
        </Layout>
    );
};

export default Estadisticas;
