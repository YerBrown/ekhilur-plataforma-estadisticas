import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import "./BarChart.css";
const BarChartComponent = ({ selectedPeriod, dataBars }) => {
    const [chartData, setChartData] = useState([]);
    const [maxValue, setMaxValue] = useState(0);
    const calculateMaxValue = (data) => {
        const maxIncome = Math.max(...data.map(item => item.income));
        const maxExpenses = Math.max(...data.map(item => item.expenses));
        const maxValue = Math.max(maxIncome, maxExpenses);
        return maxValue === 0 ? 1000 : Math.ceil(maxValue / 1000) * 1000;
    };

    const getAbbreviatedMonth = (month) => {
        const abbreviations = {
            'enero': 'ene',
            'febrero': 'feb',
            'marzo': 'mar',
            'abril': 'abr',
            'mayo': 'may',
            'junio': 'jun',
            'julio': 'jul',
            'agosto': 'ago',
            'septiembre': 'sep',
            'octubre': 'oct',
            'noviembre': 'nov',
            'diciembre': 'dic'
        };
        return abbreviations[month.toLowerCase()] || month;
    };
    useEffect(() => {
        if (!selectedPeriod) return;

        const allMonths = dataBars.flatMap(yearData =>
            yearData.datos.map(monthData => ({
                period: getAbbreviatedMonth(monthData.mes),
                expenses: Number(monthData.total_gastos.replace(',', '.')),
                income: Number(monthData.total_ingresos.replace(',', '.')),
                year: yearData.año,
                month: monthData.mes
            }))
        );

        const selectedIndex = allMonths.findIndex(
            item => item.year === selectedPeriod.year &&
                item.month === selectedPeriod.month
        );

        if (selectedIndex === -1) return;

        // Obtener los meses adyacentes
        const displayedMonths = [];
        if (selectedIndex > 0) {
            displayedMonths.push(allMonths[selectedIndex - 1]);
        }
        displayedMonths.push(allMonths[selectedIndex]);
        if (selectedIndex < allMonths.length - 1) {
            displayedMonths.push(allMonths[selectedIndex + 1]);
        }

        setChartData(displayedMonths);
        setMaxValue(calculateMaxValue(displayedMonths));
    }, [selectedPeriod]);

    return (
        <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    width={500}
                    height={300}
                    data={chartData}
                    margin={{
                        top: 20,
                        right: 20,
                        left: -25,
                        bottom: 0
                    }}
                >

                    <XAxis
                        dataKey="period"
                        angle={0}  // Añadir esta línea para el angulo del texto de debajo de los gráficos
                        textAnchor="middle"  // Añadir esta línea para centrar texto
                        height={60}
                        label={{
                            position: 'bottom',
                            offset: 0
                        }}
                    />
                    <YAxis
                        domain={[0, maxValue || 1000]} // Aseguramos un dominio mínimo
                        axisLine={true}
                        tickLine={false}
                        ticks={maxValue === 0 ? [0, 1000] : [0, maxValue]}
                        interval="preserveEnd"
                        tickFormatter={(value) => value}
                        minTickGap={0}
                        allowDecimals={false}
                        hide={false}
                        style={{
                            fontSize: '12px'  // Aquí puedes ajustar el tamaño que desees
                        }}
                    />
                    <Bar
                        dataKey="income"
                        radius={[6, 6, 0, 0]}
                        fill="var(--color-grafico-naranja)"

                    />
                    <Bar
                        dataKey="expenses"
                        radius={[6, 6, 0, 0]}
                        fill="var(--color-grafico-naranja-claro)"

                    />
                </BarChart>
            </ResponsiveContainer>

        </div>
    );
};

export default BarChartComponent;
