import React, { PureComponent, useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { totalAño, totalMes, dataPruebas } from '../../api/dataPruebas.js';

const BarChartComponent = () => {
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        // Obtenemos los años disponibles
        const años = Object.keys(dataPruebas[0].movimientos_por_año);

        // Creamos un array con todos los meses disponibles y sus años
        const todosLosMeses = [];
        años.forEach(año => {
            const mesesDelAño = Object.keys(dataPruebas[0].movimientos_por_año[año].meses);
            mesesDelAño.forEach(mes => {
                todosLosMeses.push({
                    año: año,
                    mes: mes
                });
            });
        });

        // Obtenemos los últimos 4 meses
        const ultimos4 = todosLosMeses.slice(-4);

        // Creamos los datos para el gráfico
        const datos = ultimos4.map(({ año, mes }) => {
            const totales = totalMes(año, mes);
            return {
                periodo: `${mes.charAt(0).toUpperCase() + mes.slice(1)} ${año}`,
                ingresos: totales.ingresos,
                gastos: totales.gastos
            };
        });

        setChartData(datos);
    }, []);
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

                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="periodo"  // Cambiar 'mes' por 'periodo' (no se porque se me corta)
                        angle={0}  // Añadir esta línea para el angulo del texto de debajo de los gráficos
                        textAnchor="middle"  // Añadir esta línea para centrar texto
                        height={60}  // Añadir esta línea
                        label={{
                            value: 'Periodos',  // Añadir esta línea
                            position: 'bottom',
                            offset: 0
                        }}
                    />
                    <YAxis
                        label={{
                            value: 'Importe',
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
                        dataKey="ingresos"
                        fill="url(#ingresosGradient)"
                        name="Ingresos"
                    />
                    <Bar
                        dataKey="gastos"
                        fill="url(#gastosGradient)"
                        name="Gastos"
                    />
                </BarChart>
            </ResponsiveContainer>

        </>
    );
};

export default BarChartComponent;
