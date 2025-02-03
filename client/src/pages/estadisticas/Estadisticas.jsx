import React, { useState, useEffect } from "react";
import Layout from "../layout/Layout";
import "./Estadisticas.css";
import BarChartComponent from "../../components/charts/BarChart";
import DateFilter from "../../components/DateFilter/DateFilter";
import { getIncomesAndExpensesByMonth } from "../../api/realData";
import mockData from "../../components/transactions-list/mockData.js";
import TransactionList from "../../components/transactions-list/TransactionsList";
import MonthYearFilter from "../../components/month-year-filter/MonthYearFilter.jsx";
import {
    FaAppleAlt,
    FaCoffee,
    FaTshirt,
    FaHeart,
    FaStore,
    FaIndustry,
    FaPaintBrush,
    FaFutbol,
    FaHandsHelping,
} from "react-icons/fa";
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
    const [selectedPeriod, setSelectedPeriod] = useState(null);
    const [statistics, setStatistics] = useState({
        totalIngresos: 0,
        totalGastos: 0,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [apiData, setApiData] = useState(null);

    const loadApiData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await getIncomesAndExpensesByMonth();
            setApiData(data);

            if (selectedPeriod) {
                updateStatisticsFromApiData(data, selectedPeriod);
            }
        } catch (error) {
            console.error("Error al cargar datos:", error);
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
            <Layout title="Estadísticas">
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
                                <p className="label-ingresos">INGRESOS</p>
                                <span className="amount-ingresos">
                                    {getAmountStyle(statistics.totalIngresos)}
                                </span>
                            </div>
                            <div className="item-ingresos-gastos">
                                <p className="label-gastos">GASTOS</p>
                                <span className="amount-gastos">
                                    {getAmountStyle(
                                        statistics.totalGastos,
                                        true
                                    )}
                                </span>
                            </div>
                        </div>
                        <div className="chart-section">
                            <BarChartComponent
                                selectedPeriod={selectedPeriod}
                                dataBars={apiData || []}
                                dataKeys={{
                                    primary: "ingresos",
                                    secondary: "gastos",
                                }}
                                colors={{
                                    primary: "var(--color-grafico-naranja)",
                                    secondary:
                                        "var(--color-grafico-naranja-claro)",
                                }}
                                mappingKeys={{
                                    year: "año",
                                    month: "mes",
                                }}
                                showSecondaryBar={true}
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
