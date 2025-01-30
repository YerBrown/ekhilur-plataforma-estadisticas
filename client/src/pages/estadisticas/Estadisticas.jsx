import React, { useState, useEffect } from "react";
import Layout from "../layout/Layout";
import "./Estadisticas.css";
import BarChartComponent from "../../components/charts/BarChart";
import DateFilter from "../../components/DateFilter/DateFilter";
import { dataMonths } from "../../api/dataPruebas";

const Estadisticas = () => {
    const [selectedPeriod, setSelectedPeriod] = useState(null);
    const [statistics, setStatistics] = useState({
        totalIngresos: 0,
        totalGastos: 0,
    });

    // Función de utilidad para formatear números
    const formatCurrency = (value) => {
        const num = Number(value);
        return Number.isInteger(num) ? `${num}€` : `${num.toFixed(1)}€`;
    };

    // Función para determinar el estilo de la cantidad (positivo/negativo)
    const getAmountStyle = (value, isGasto = false) => {
        return isGasto ? `-${formatCurrency(value)}` : formatCurrency(value);
    };
    const handleDateFilter = ({ year, month }) => {
        // Actualizar el período seleccionado
        setSelectedPeriod({ year, month });

        // Buscar los datos correspondientes al período seleccionado
        const yearData = dataMonths.find((y) => y.año === year);
        if (yearData) {
            const monthData = yearData.datos.find((m) => m.mes === month);
            if (monthData) {
                setStatistics({
                    totalIngresos: Number(
                        monthData.total_ingresos.replace(",", ".")
                    ),
                    totalGastos: Number(
                        monthData.total_gastos.replace(",", ".")
                    ),
                });
            }
        }
    };

    // Inicializar con el último mes disponible
    useEffect(() => {
        if (dataMonths.length > 0) {
            const lastYear = dataMonths[dataMonths.length - 1];
            const lastMonth = lastYear.datos[lastYear.datos.length - 1];
            handleDateFilter({
                year: lastYear.año,
                month: lastMonth.mes,
            });
        }
    }, []);
    return (
        <div className="estadisticas-page">
            <Layout title="Estadísticas">
                <div className="container-date-filter">
                    <DateFilter onDateFilter={handleDateFilter} />
                </div>
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
                            {getAmountStyle(statistics.totalGastos, true)}
                        </span>
                    </div>
                </div>
                <div style={{ width: "100%", height: "400px" }}>
                    <BarChartComponent selectedPeriod={selectedPeriod} />
                </div>
            </Layout>
        </div>
    );
};

export default Estadisticas;
