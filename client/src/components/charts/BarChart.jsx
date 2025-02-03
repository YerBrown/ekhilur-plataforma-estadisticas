import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import MonthYearFilter from '../month-year-filter/MonthYearFilter';
import "./BarChart.css";

const getAbbreviatedMonth = (month) => {
    const abbreviations = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
    return abbreviations[month] || month;
};

const calculateMaxValue = (data, primaryKey, secondaryKey, showSecondary) => {
    if (!data || data.length === 0) return 1000;
    const maxPrimary = Math.max(...data.map((item) => Number(item[primaryKey]) || 0));
    const maxSecondary = showSecondary ? Math.max(...data.map((item) => Number(item[secondaryKey]) || 0)) : 0;
    const maxValue = Math.max(maxPrimary, maxSecondary);
    return maxValue === 0 ? 1000 : maxValue;
};

const BarChartComponent = ({
    selectedPeriod,
    dataBars,
    dataKeys = {
        primary: 'income',
        secondary: 'expenses'
    },
    colors = {
        primary: "var(--color-grafico-naranja)",
        secondary: "var(--color-grafico-naranja-claro)"
    },
    mappingKeys = {
        year: 'año',
        month: 'mes'
    },
    showSecondaryBar = true,
    onViewChange
}) => {
    const [chartData, setChartData] = useState([]);
    const [maxValue, setMaxValue] = useState(1000);
    const [isMonthly, setIsMonthly] = useState(true);

    useEffect(() => {
        if (!selectedPeriod || !dataBars || !Array.isArray(dataBars)) {
            setChartData([]);
            setMaxValue(1000);
            return;
        }

        const selectedMonth = selectedPeriod.month;
        const monthsToShow = [
            selectedMonth > 0 ? selectedMonth - 1 : 11,
            selectedMonth,
            selectedMonth < 11 ? selectedMonth + 1 : 0
        ];

        const processedData = monthsToShow.map(monthNum => {
            const baseMonth = {
                period: getAbbreviatedMonth(monthNum),
                month: String(monthNum + 1).padStart(2, '0'),
                year: selectedPeriod.year.toString(),
                hasData: false,
                [dataKeys.primary]: null
            };

            if (showSecondaryBar) {
                baseMonth[dataKeys.secondary] = null;
            }

            const monthData = dataBars.find(data =>
                data[mappingKeys.year] === baseMonth.year &&
                data[mappingKeys.month] === baseMonth.month
            );

            if (!monthData) return baseMonth;

            const primaryValue = Number(monthData[dataKeys.primary]);
            const secondaryValue = showSecondaryBar ? Number(monthData[dataKeys.secondary]) : 0;

            return {
                ...baseMonth,
                [dataKeys.primary]: !isNaN(primaryValue) && primaryValue > 0 ? primaryValue : null,
                [dataKeys.secondary]: showSecondaryBar && !isNaN(secondaryValue) && secondaryValue > 0 ? secondaryValue : null,
                hasData: true
            };
        });

        setChartData(processedData);
        setMaxValue(calculateMaxValue(processedData, dataKeys.primary, dataKeys.secondary, showSecondaryBar));
    }, [selectedPeriod, dataBars, dataKeys.primary, dataKeys.secondary, mappingKeys.year, mappingKeys.month, showSecondaryBar]);

    // Manejador para el cambio de vista
    const handleViewChange = (monthly) => {
        setIsMonthly(monthly);
        if (onViewChange) {
            onViewChange(monthly ? 'month' : 'year');
        }
    };

    return (
            <div className="chart-container">
                <div className="chart-wrapper">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart
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
                            />
                            <YAxis
                                domain={[0, maxValue]}
                                axisLine={true}
                                tickLine={false}
                                ticks={[maxValue]}
                                interval="preserveEnd"
                                tickFormatter={(value) => value}
                                minTickGap={0}
                                allowDecimals={false}
                                hide={false}
                            />
                            <Bar
                                dataKey={dataKeys.primary}
                                radius={[6, 6, 0, 0]}
                                fill={colors.primary}
                            />
                            {showSecondaryBar && (
                                <Bar
                                    dataKey={dataKeys.secondary}
                                    radius={[6, 6, 0, 0]}
                                    fill={colors.secondary}
                                />
                            )}
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                
                <MonthYearFilter
                    isMonthly={isMonthly}
                    onChange={handleViewChange}
                />
            </div>
    );
};

export default BarChartComponent;