import React, { useState, useEffect } from "react";
import Layout from "../layout/Layout";
import "./BonificationsShop.css";
import BarChartComponent from "../../components/charts/BarChart";
import DateFilter from "../../components/DateFilter/DateFilter";
import { getCashbackIssuedByMonthAndYear } from "../../api/realData";
import { useLanguage } from "../../contexts/LanguageContext.jsx";


const Estadisticas = () => {
    const { t } = useLanguage();
    const [selectedPeriod, setSelectedPeriod] = useState(null);
    const [statistics, setStatistics] = useState({
        totalRecibidos: 0,
        totalEmitidos: 0,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [apiData, setApiData] = useState(null);

    // Función para cargar los datos de la API
    const loadApiData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await getCashbackIssuedByMonthAndYear();
            setApiData(data);

            // Si hay un período seleccionado, actualizar las estadísticas
            if (selectedPeriod) {
                updateStatisticsFromApiData(data, selectedPeriod);
            }
        } catch (error) {
            console.error("Error al cargar datos:", error);
            setError("No se pudieron cargar los datos. Por favor, intente más tarde.");
        } finally {
            setIsLoading(false);
        }
    };

    // Cargar datos cuando el componente se monta
    useEffect(() => {
        loadApiData();
    }, []);

    // Función para actualizar estadísticas basadas en los datos de la API
    const updateStatisticsFromApiData = (data, period) => {
        if (!data) return;

        const { year, month } = period;
        // Buscar el dato correspondiente al mes y año seleccionados
        const monthData = data.find(item =>
            item.anio === year.toString() &&
            parseInt(item.mes, 10) === month + 1
        );

        if (monthData) {
            setStatistics({
                totalRecibidos: Number(monthData.recibido),
                totalEmitidos: Number(monthData.total_cashback_emitido)
            });
        } else {
            setStatistics({
                totalRecibidos: 0,
                totalEmitidos: 0
            });
        }
    };

    // Función para formatear números
    const formatCurrency = (value) => {
        const num = Number(value);
        return Number.isInteger(num) ? `${num}€` : `${num.toFixed(1)}€`;
    };

    // Función para determinar el estilo de la cantidad
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
        <Layout title="Estadísticas">
            <div className="container-date-filter">
                <DateFilter onDateFilter={handleDateFilter} />
            </div>

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            {isLoading ? (
                <div className="loading-message">
                    Cargando datos...
                </div>
            ) : (
                <>
                    <div className="container-recibidos-emitidos">
                        <div className="item-recibidos-emitidos">
                            <p className="label-recibidos">RECIBIDO</p>
                            <span className="amount-recibidos">
                                {getAmountStyle(statistics.totalRecibidos)}
                            </span>
                        </div>
                        <div className="item-recibidos-emitidos">
                            <p className="label-emitidos">EMITIDO</p>
                            <span className="amount-emitidos">
                                {getAmountStyle(statistics.totalEmitidos, true)}
                            </span>
                        </div>
                    </div>
                    <div className="chart-section">
                        <BarChartComponent
                            selectedPeriod={selectedPeriod}
                            dataBars={apiData || []}
                        />
                    </div>
                </>
            )}
        </Layout>
    );
};

export default Estadisticas;