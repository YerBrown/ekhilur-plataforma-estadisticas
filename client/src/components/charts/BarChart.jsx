import React, { PureComponent, useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { dataMonths } from '../../api/dataPruebas.js';
const BarChartComponent = ({ selectedPeriod }) => {
    const [chartData, setChartData] = useState([]);
    const [maxValue, setMaxValue] = useState(0);
    const calculateMaxValue = (data) => {
        const maxIncome = Math.max(...data.map(item => item.income));
        const maxExpenses = Math.max(...data.map(item => item.expenses));
        return Math.ceil(Math.max(maxIncome, maxExpenses) * 1.1);
    };


    useEffect(() => {
        if (!selectedPeriod) return;

        const allMonths = dataMonths.flatMap(yearData =>
            yearData.datos.map(monthData => ({
                period: `${monthData.mes} ${yearData.año}`,
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
        <>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    width={500}
                    height={300}
                    data={chartData}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
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
                        ticks={[0]}
                        domain={[0, maxValue]}
                        label={{
                            angle: -90,
                            position: 'insideLeft',
                            offset: -5
                        }}
                    />

                    <Bar
                        dataKey="income"
                        radius={[6, 6, 0, 0]} 
                        fill="rgb(0, 71, 186)"
                        label={{
                            position: 'top',
                            formatter: (value, _, __) => {
                                const num = Number(value);
                                return `${Number.isInteger(num) ? num : num.toFixed(1)}€`;
                            }
                        }}
                    />
                    <Bar
                        dataKey="expenses"
                        radius={[6, 6, 0, 0]} 
                        fill="rgb(255, 144, 18)"
                        label={{
                            position: 'top',
                            formatter: (value, _, __) => {
                                const num = Number(value);
                                return `-${Number.isInteger(num) ? num : num.toFixed(1)}€`;
                            }
                        }}
                    />
                </BarChart>
            </ResponsiveContainer>

        </>
    );
};

export default BarChartComponent;
