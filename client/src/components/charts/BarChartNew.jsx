import { useState } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    LabelList,
} from "recharts";
import "./BarChartNew.css";

const singleGradient = {
    id: "singleBarGradient",
    colors: {
        start: "#FF9012",
        end: "#0047ba"
    }
};

const dualGradient1 = {
    id: "dualBarGradient1",
    colors: {
        start: "#00E1FD",
        middle: "#0094DB",
        end: "#002E78"
    }
};

const dualGradient2 = {
    id: "dualBarGradient2",
    colors: {
        start: "#FF9012",
        middle: "#FF5A1C",
        end: "#CC0000"
    }
};

const getAbbreviatedMonth = (month, t) => {
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
    const monthKey = abbreviations[month - 1] || month;
    return t.monthsAbbreviations[monthKey] || monthKey;
};
// Helper para calcular fechas relativas (meses en formato string)
const calculateRelativeDates = (year, month) => {
    const currentDate = new Date(year, parseInt(month, 10) - 2); // Convertir mes a base 0
    const previousDate = new Date(year, parseInt(month, 10) - 1);
    const nextDate = new Date(year, parseInt(month, 10));

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
        previous: year - 2,
        current: year - 1,
        next: year,
    };
};

const transformDataForDisplay = (data, primaryKey, secondaryKey = null) => {
    console.log("antes de transformar", data);
    const tarnsformedData = data.map((item) => ({
        ...item,
        [primaryKey]: Number(Math.abs(item[primaryKey]).toFixed(2) || 0),
        ...(secondaryKey && {
            [secondaryKey]: Number(
                Math.abs(item[secondaryKey]).toFixed(2) || 0
            ),
        }),
        originalValues: {
            [primaryKey]: item[primaryKey],
            ...(secondaryKey && { [secondaryKey]: item[secondaryKey] }),
        },
    }));
    console.log("despues de transformar", tarnsformedData);
    return tarnsformedData;
};

const getFilteredData = (
    dataToFilter,
    targetYear,
    targetMonth,
    filterType,
    primaryKey,
    secondaryKey = null
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
                    existing[primaryKey] = Number(
                        (
                            existing[primaryKey] + (item[primaryKey] || 0)
                        ).toFixed(2)
                    );
                    if (secondaryKey) {
                        existing[secondaryKey] = Number(
                            (
                                (existing[secondaryKey] || 0) +
                                (item[secondaryKey] || 0)
                            ).toFixed(2)
                        );
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

    return transformDataForDisplay(filteredData, primaryKey, secondaryKey);
};
const GraficoLibrerias = ({
    data,
    colors = {
        primary: "var(--color-barras)",
        secondary: "var(--color-grafico-naranja-claro)",
    },
    targetYear,
    targetMonth,
    primaryKey,
    secondaryKey = null,
    showFilters = true,
    height = 400,
}) => {
    const [filterType, setFilterType] = useState("mes"); // Estado para el filtro (mes o año)
    const { t } = useLanguage();
    // Formatear el eje X
    const formatXAxis = (entry) => {
        if (filterType === "mes") {
            return `${getAbbreviatedMonth(Number(entry.mes), t)}`;
        }
        return entry.año;
    };
    return (
        <>
            <ResponsiveContainer width="100%" height={height}>
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
                        right: 25,
                        left: 5,
                        bottom: 0,
                    }}
                >
                    <defs>
                        <linearGradient id={singleGradient.id} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={singleGradient.colors.start} stopOpacity={0.8} />
                            <stop offset="100%" stopColor={singleGradient.colors.end} stopOpacity={0.9} />
                        </linearGradient>
                        <linearGradient id={dualGradient1.id} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={dualGradient1.colors.start} stopOpacity={0.8} />
                            <stop offset="30%" stopColor={dualGradient1.colors.middle} stopOpacity={0.8} />
                            <stop offset="100%" stopColor={dualGradient1.colors.end} stopOpacity={0.7} />
                        </linearGradient>
                        <linearGradient id={dualGradient2.id} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={dualGradient2.colors.start} stopOpacity={0.8} />
                            <stop offset="30%" stopColor={dualGradient2.colors.middle} stopOpacity={0.8} />
                            <stop offset="100%" stopColor={dualGradient2.colors.end} stopOpacity={0.7} />
                        </linearGradient>
                    </defs>

                    <XAxis dataKey={formatXAxis}
                        stroke="var(--color-letra)" />
                    <YAxis tickCount={3}
                        stroke="var(--color-letra)" />
                    {/*<Tooltip />*/}
                    <Bar
                        dataKey={primaryKey}
                        fill={`url(#${secondaryKey ? dualGradient1.id : singleGradient.id})`}
                        radius={[6, 6, 0, 0]}
                        barSize={80}
                        maxBarSize={150}
                    >
                        <LabelList
                            dataKey={primaryKey}
                            position="top"
                            fill="var(--color-letra)"
                            formatter={(value) => (value === 0 ? "" : value)}
                        />
                    </Bar>
                    {secondaryKey && (
                        <Bar
                            dataKey={secondaryKey}
                            fill={`url(#${dualGradient2.id})`}
                            radius={[6, 6, 0, 0]}
                            name={secondaryKey}
                            barSize={80}
                            maxBarSize={150}
                        >
                            <LabelList
                                dataKey={secondaryKey}
                                position="top"
                                fill="var(--color-letra)"
                                formatter={(value) =>
                                    value === 0 ? "" : value
                                }
                            />
                        </Bar>
                    )}
                </BarChart>
            </ResponsiveContainer>
            {showFilters && (
                <div className="chart-controls">
                    <button onClick={() => setFilterType("mes")}>MESES</button>
                    <button onClick={() => setFilterType("año")}>AÑOS</button>
                </div>
            )}
        </>
    );
};

export default GraficoLibrerias;
