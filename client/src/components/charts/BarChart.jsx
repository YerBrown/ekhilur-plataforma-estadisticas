import { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import "./BarChart.css";

const getAbbreviatedMonth = (month, t) => {
    const abbreviations = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
    const monthKey = abbreviations[month] || month;
    return t.monthsAbbreviations[monthKey] || monthKey;
};

const calculateMaxValue = (data, primaryKey, secondaryKey, showSecondary) => {
    if (!data || data.length === 0) return 1000;
    const maxPrimary = Math.max(...data.map((item) => Number(item[primaryKey]) || 0));
    const maxSecondary = showSecondary ? Math.max(...data.map((item) => Number(item[secondaryKey]) || 0)) : 0;
    const maxValue = Math.max(maxPrimary, maxSecondary);
    return maxValue === 0 ? 1000 : Math.ceil(maxValue / 1000) * 1000;
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
    showSecondaryBar = true
}) => {
    const [chartData, setChartData] = useState([]);
    const [maxValue, setMaxValue] = useState(1000);
    const { t } = useLanguage();
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

        // Crear datos base para los meses a mostrar

        const processedData = monthsToShow.map(monthNum => {
            const baseMonth = {
                period: getAbbreviatedMonth(monthNum, t),
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
                        domain={[0, maxValue]}
                        axisLine={true}
                        tickLine={false}
                        ticks={[0, maxValue]}
                        interval="preserveEnd"
                        tickFormatter={(value) => value}
                        minTickGap={0}
                        allowDecimals={false}
                        hide={false}
                        style={{
                            fontSize: '12px'
                        }}
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
    );
};

export default BarChartComponent;