import React, { useState, useEffect } from "react";
import Layout from "../layout/Layout";
import "./Estadisticas.css";
import BarChartComponent from "../../components/charts/BarChart";
import DateFilter from "../../components/DateFilter/DateFilter";
import { dataMonths } from "../../api/dataPruebas";
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
const categoryOptions = [
    {
        label: "Alimentación",
        color: "#0047ba",
        "color-dark": "#001d4d",
        icon: FaAppleAlt,
    },
    {
        label: "Hostelería",
        color: "#26C485",
        "color-dark": "#0c402b",
        icon: FaCoffee,
    },
    {
        label: "Moda y Complementos",
        color: "#54a9cd",
        "color-dark": "#112f3b",
        icon: FaTshirt,
    },
    {
        label: "Salud y Estética",
        color: "#ffc412",
        "color-dark": "#4d3900",
        icon: FaHeart,
    },
    {
        label: "Servicios y Comercio General",
        color: "#6f9ef0",
        "color-dark": "#071e45",
        icon: FaStore,
    },
    {
        label: "Industria y Construcción",
        color: "#ffef21",
        "color-dark": "#4d4700",
        icon: FaIndustry,
    },
    {
        label: "Arte y Cultura",
        value: 13,
        color: "#ff9d6d",
        "color-dark": "#4d1a00",
        icon: FaPaintBrush,
    },
    {
        label: "Deporte y Ocio",
        value: 6,
        color: "#382ef2",
        "color-dark": "#080548",
        icon: FaFutbol,
    },
    {
        label: "Asociaciones y Cooperativas",
        value: 120,
        color: "#ff9012",
        "color-dark": "#4d2900",
        icon: FaHandsHelping,
    },
];
const fakeApiData = [
    {
        label: "Alimentación",
        value: 50,
    },
    {
        label: "Hostelería",
        value: 32,
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
        const yearData = dataMonths.find((y) => y.año == year);
        if (yearData) {
            const monthData = yearData.datos.find((m) => parseInt(m.mes, 10) == month + 1);
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
                <div className="chart-section">
                    <BarChartComponent selectedPeriod={selectedPeriod} dataBars={dataMonths} />
                </div>
                <CategoryChart categoryDataJson={categoryOptions} />
                <div>

                </div>
            </Layout>
        </div>
    );
};

export default Estadisticas;
