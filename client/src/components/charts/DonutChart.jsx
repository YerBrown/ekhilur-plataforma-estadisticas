import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
// Registrar los componentes de Chart.js y el plugin personalizado
ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels, {
    id: "centerText", // Nombre del plugin
    beforeDraw(chart) {
        const { width } = chart;
        const { height } = chart;
        const ctx = chart.ctx;
        const total =
            `${parseFloat(
                chart.config.options.plugins.centerText?.total
            ).toFixed(2)} €` || ""; // Obtener el total desde las opciones del gráfico
        const color = chart.config.options.plugins.centerText?.color || "#fff"; // Obtener el color desde las opciones del gráfico
        ctx.save();
        ctx.font = "bold 16px Noway"; // Estilo del texto
        ctx.fillStyle = color;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(total, width / 2, height / 2); // Texto en el centro
        ctx.restore();
    },
});
const DonutChart = ({ data, options }) => {
    return <Doughnut data={data} options={options} />;
};

export default DonutChart;
