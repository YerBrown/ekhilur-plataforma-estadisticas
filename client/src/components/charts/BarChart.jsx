import React, { PureComponent, useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { dataYears, dataMonths } from '../../api/dataPruebas.js';
import DateFilter from '../DateFilter/DateFilter';
const BarChartComponent = () => {
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        const allMonths = dataMonths.flatMap(yearData =>
            yearData.datos.map(monthData => ({
                period: `${monthData.mes} ${yearData.año}`,
                expenses: monthData.total_gastos,
                income: monthData.total_ingresos,
                year: yearData.año,
                month: monthData.mes
            }))
        );

        const lastThreeMonths = allMonths.slice(-3);
        setChartData(lastThreeMonths);

        const lastMonth = lastThreeMonths[lastThreeMonths.length - 1];
        if (lastMonth) {
            handleDateFilter({ year: lastMonth.year, month: lastMonth.month });
        }
    }, []);

    const handleDateFilter = ({ year, month }) => {
        const allMonths = dataMonths.flatMap(yearData =>
            yearData.datos.map(monthData => ({
                period: `${monthData.mes} ${yearData.año}`,
                expenses: monthData.total_gastos,
                income: monthData.total_ingresos,
                year: yearData.año,
                month: monthData.mes
            }))
        );

        const selectedIndex = allMonths.findIndex(
            item => item.year === year && item.month === month
        );

        if (selectedIndex === -1) {
            console.log("Mes no encontrado");
            return;
        }

        let displayedMonths = [];

        if (selectedIndex > 0) {
            displayedMonths.push(allMonths[selectedIndex - 1]);
        }

        displayedMonths.push(allMonths[selectedIndex]);

        if (selectedIndex < allMonths.length - 1) {
            displayedMonths.push(allMonths[selectedIndex + 1]);
        }

        setChartData(displayedMonths);
    };
    /*const getLastThreeYears = () => {
        return dataYears.slice(-3).map(year => ({
            period: year.año,
            expenses: Number(year.total_gastos),
            income: Number(year.total_ingresos)
        }));
    }; */




    return (
        <>
            <DateFilter onDateFilter={handleDateFilter} />
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
                    <defs>
                        <linearGradient id="ingresosGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="rgb(0, 71, 186)" stopOpacity={0.6} />
                            <stop offset="95%" stopColor=" rgb(1, 27, 70)" stopOpacity={0.9} />
                        </linearGradient>
                        <linearGradient id="gastosGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="rgb(255, 144, 18)" stopOpacity={0.6} />
                            <stop offset="95%" stopColor=" rgb(168, 91, 4)" stopOpacity={1} />
                        </linearGradient>
                    </defs>


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
                        ticks={[0, 800]}
                        domain={[0, 800]}
                        label={{
                            angle: -90,
                            position: 'insideLeft',
                            offset: -5
                        }}
                    />


                    <Legend
                        verticalAlign="top"
                        height={36}
                    />
                    <Bar
                        dataKey="income"
                        fill="url(#ingresosGradient)"
                        name="Ingresos"
                        label={{
                            position: 'top',
                            formatter: (value, _, __) => `${Number(value).toFixed(2)}€`
                        }}
                    />
                    <Bar
                        dataKey="expenses"
                        fill="url(#gastosGradient)"
                        name="Gastos"
                        label={{
                            position: 'top',
                            formatter: (value, _, __) => `${Number(value).toFixed(2)}€`
                        }}
                    />
                </BarChart>
            </ResponsiveContainer>

        </>
    );
};

export default BarChartComponent;
