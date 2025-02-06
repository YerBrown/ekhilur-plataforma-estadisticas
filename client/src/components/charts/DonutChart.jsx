import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { FaCircle } from "react-icons/fa";
import { PiCoinsBold } from "react-icons/pi";

import ChartDataLabels from "chartjs-plugin-datalabels";
import "./DonutChart.css";
// Registrar los componentes de Chart.js y el plugin personalizado
ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels, {
    id: "centerText", // Nombre del plugin
    beforeDraw(chart) {
        const { ctx } = chart;
        const chartArea = chart.chartArea;
        if (!chartArea) return;
        const total =
            `${parseFloat(
                chart.config.options.plugins.centerText?.total
            ).toFixed(2)} €` || ""; // Obtener el total desde las opciones del gráfico
        const color = chart.config.options.plugins.centerText?.color || "#fff"; // Color del texto

        ctx.save();
        ctx.font = "bold 25px Noway"; // Estilo del texto
        ctx.fillStyle = color;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        // Posicionar en el centro real del gráfico
        const centerX = (chartArea.left + chartArea.right) / 2;
        const centerY = (chartArea.top + chartArea.bottom) / 2;

        ctx.fillText(total, centerX, centerY);
        ctx.restore();
    },
});
const DonutChart = ({ data, options, legendValues }) => {
    return (
        <div className="donut-chart">
            <div className="donut-canvas">
                <div className="coin-icon">
                    <PiCoinsBold size={24} color="#FF9012" /> {/* Ajusta el tamaño y color según necesites */}
                </div>
                <Doughnut data={data} options={options} />
            </div>
            <div className="legends-container">
                {legendValues.map((item) => (
                    <div className="legend" key={item.label}>
                        <FaCircle
                            color={item.color}
                            fontSize={15}
                            className="legend-symbol"
                        />

                        <p className="legend-label">{item.label}</p>
                        <p className="legend-value">{`${item.value} €`}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DonutChart;
