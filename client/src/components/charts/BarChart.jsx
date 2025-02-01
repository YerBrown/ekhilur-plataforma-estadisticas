import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import "./BarChart.css";

const BarChartComponent = ({ selectedPeriod, dataBars }) => {
    const [chartData, setChartData] = useState([]);
    const [maxValue, setMaxValue] = useState(0);

    const calculateMaxValue = (data) => {
        if (!data || data.length === 0) return 1000;
        const maxIncome = Math.max(...data.map((item) => Number(item.income) || 0));
        const maxExpenses = Math.max(...data.map((item) => Number(item.expenses) || 0));
        const maxValue = Math.max(maxIncome, maxExpenses);
        return maxValue === 0 ? 1000 : Math.ceil(maxValue / 1000) * 1000;
    };

    const getAbbreviatedMonth = (month) => {
        const abbreviations = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
        return abbreviations[month] || month;
    };

    useEffect(() => {
        // Reset el estado cuando cambian las props
        if (!selectedPeriod || !dataBars || !Array.isArray(dataBars)) {
            setChartData([]);
            setMaxValue(1000);
            return;
        }

        // Crear un array de meses para mostrar (mes anterior, actual y siguiente)
        const selectedMonth = selectedPeriod.month;
        const monthsToShow = [
            selectedMonth > 0 ? selectedMonth - 1 : 11,
            selectedMonth,
            selectedMonth < 11 ? selectedMonth + 1 : 0
        ];

        // Crear datos base para los meses a mostrar
        const baseMonths = monthsToShow.map(monthNum => ({
            period: getAbbreviatedMonth(monthNum),
            expenses: null,
            income: null,
            month: String(monthNum + 1).padStart(2, '0'),
            year: selectedPeriod.year.toString(),
            hasData: false
        }));

        // Buscar datos reales para cada mes
        const processedMonths = baseMonths.map(baseMonth => {
            const monthData = dataBars.find(data => 
                data.año === baseMonth.year && 
                data.mes === baseMonth.month
            );

            if (!monthData) return baseMonth;

            const expenses = Number(monthData.gastos);
            const income = Number(monthData.ingresos);

            const validExpenses = !isNaN(expenses) && expenses > 0 ? expenses : null;
            const validIncome = !isNaN(income) && income > 0 ? income : null;

            return {
                ...baseMonth,
                expenses: validExpenses,
                income: validIncome,
                hasData: validExpenses !== null || validIncome !== null
            };
        });

        setChartData(processedMonths);
        
        // Calcular maxValue solo con los datos válidos
        const monthsWithData = processedMonths.filter(month => month.hasData);
        setMaxValue(calculateMaxValue(monthsWithData));

    }, [selectedPeriod, dataBars]);

    const renderBar = (dataKey, color) => {
        // Solo renderizar la barra si hay al menos un valor válido
        const hasValues = chartData.some(item => item[dataKey] !== null && item[dataKey] > 0);
        
        if (!hasValues) return null;

        return (
            <Bar
                dataKey={dataKey}
                radius={[6, 6, 0, 0]}
                fill={color}
            />
        );
    };

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
                        angle={0}
                        textAnchor="middle"
                        height={60}
                        label={{
                            position: "bottom",
                            offset: 0,
                        }}
                    />
                    <YAxis
                        domain={[0, maxValue || 1000]}
                        axisLine={true}
                        tickLine={false}
                        ticks={maxValue === 0 ? [0, 1000] : [0, maxValue]}
                        interval="preserveEnd"
                        tickFormatter={(value) => value}
                        minTickGap={0}
                        allowDecimals={false}
                        hide={false}
                        style={{
                            fontSize: '12px'
                        }}
                    />
                    {renderBar("income", "var(--color-grafico-naranja)")}
                    {renderBar("expenses", "var(--color-grafico-naranja-claro)")}
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default BarChartComponent;