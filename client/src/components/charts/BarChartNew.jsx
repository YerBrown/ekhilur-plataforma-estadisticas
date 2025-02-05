import React, { useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    LabelList,
} from "recharts";
import "./BarChart.css";

const getAbbreviatedMonth = (month) => {
    const abbreviations = [
        "ene",
        "feb",
        "mar",
        "abr",
        "may",
        "jun",
        "jul",
        "ago",
        "sep",
        "oct",
        "nov",
        "dic",
    ];
    return abbreviations[month - 1] || month;
};
// Helper para calcular fechas relativas (meses en formato string)
const calculateRelativeDates = (year, month) => {
    const currentDate = new Date(year, parseInt(month, 10) - 1); // Convertir mes a base 0
    const previousDate = new Date(year, parseInt(month, 10));
    const nextDate = new Date(year, parseInt(month, 10) + 1);

    return {
        current: {
            año: currentDate.getFullYear(),
            mes: (currentDate.getMonth() + 1).toString().padStart(2, "0"), // Formato "01"
        },
        previous: {
            año: previousDate.getFullYear(),
            mes: (previousDate.getMonth() + 1).toString().padStart(2, "0"), // Formato "01"
        },
        next: {
            año: nextDate.getFullYear(),
            mes: (nextDate.getMonth() + 1).toString().padStart(2, "0"), // Formato "01"
        },
    };
};

// Helper para calcular años relativos
const calculateRelativeYears = (year) => {
    return {
        previous: year - 1,
        current: year,
        next: year + 1,
    };
};

const getFilteredData = (
    dataToFilter,
    targetYear,
    targetMonth,
    filterType,
    primaryKey,
    secondaryKey = null,
) => {
    const { previous, current, next } = calculateRelativeYears(targetYear);
    let filteredData = [];
    console.log(dataToFilter, targetYear, targetMonth, filterType);
    if (filterType === "mes") {
        // Filtrar por meses
        const { current, previous, next } = calculateRelativeDates(
            targetYear,
            targetMonth
        );

        console.log(
            `Current:${current.año} ${current.mes}, previous:${previous.año} ${previous.mes}, next:${next.año} ${next.mes}`
        );

        filteredData = dataToFilter.filter((item) => {
            return (
                (item.año === previous.año.toString() &&
                    item.mes === previous.mes.toString()) ||
                (item.año === current.año.toString() &&
                    item.mes === current.mes.toString()) ||
                (item.año === next.año.toString() &&
                    item.mes === next.mes.toString())
            );
        });
    } else if (filterType === "año") {
        // Filtrar por años
        filteredData = dataToFilter
            .filter((item) => {
                const year = parseInt(item.año, 10);
                return year === previous || year === current || year === next;
            })
            .reduce((acc, item) => {
                const year = item.año;
                const existing = acc.find((el) => el.año === year);
                if (existing) {
                    existing[primaryKey] += item[primaryKey] || 0;
                    if (secondaryKey) {
                        existing[secondaryKey] =
                            (existing[secondaryKey] || 0) +
                            (item[secondaryKey] || 0);
                    }
                } else {
                    acc.push({
                        año: year,
                        ...(primaryKey
                            ? { [primaryKey]: item[primaryKey] || 0 }
                            : {}),
                        ...(secondaryKey
                            ? { [secondaryKey]: item[secondaryKey] || 0 }
                            : {}),
                    });
                }
                return acc;
            }, []);
    }

    return filteredData;
};
const GraficoLibrerias = ({
    data,
    colors = {
        primary: "var(--color-grafico-naranja)",
        secondary: "var(--color-grafico-naranja-claro)",
    },
    targetYear,
    targetMonth,
    primaryKey,
    secondaryKey = null,
    showFilters = true,
}) => {
    const [filterType, setFilterType] = useState("mes"); // Estado para el filtro (mes o año)

    // Formatear el eje X
    const formatXAxis = (entry) => {
        if (filterType === "mes") {
            return `${getAbbreviatedMonth(Number(entry.mes))}`;
        }
        return entry.año;
    };
    return (
        <div>
            {showFilters && (
                <div className="chart-controls">
                    <button onClick={() => setFilterType("mes")}>
                        Filtrar por Mes
                    </button>
                    <button onClick={() => setFilterType("año")}>
                        Filtrar por Año
                    </button>
                </div>
            )}

            <ResponsiveContainer width="100%" height={400}>
                <BarChart
                    data={getFilteredData(
                        data,
                        targetYear,
                        targetMonth,
                        filterType,
                        primaryKey,
                        secondaryKey
                    )}
                    margin={{
                        top: 20,
                        right: 20,
                        left: -25,
                        bottom: 0,
                    }}
                >
                    <XAxis dataKey={formatXAxis} />
                    <YAxis />
                    <Tooltip />
                    <Bar
                        dataKey={primaryKey}
                        fill={colors.primary}
                        radius={[6, 6, 0, 0]}
                    >
                        <LabelList dataKey={primaryKey} position="top" />
                    </Bar>
                    {secondaryKey && (
                        <Bar
                            dataKey={secondaryKey}
                            fill={colors.secondary}
                            radius={[6, 6, 0, 0]}
                            name="Segundo Valor"
                        >
                            <LabelList dataKey={secondaryKey} position="top" />
                        </Bar>
                    )}
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default GraficoLibrerias;
