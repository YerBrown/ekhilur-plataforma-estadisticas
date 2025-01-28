import React, { PureComponent } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
    {
        movimientos_por_año: 2022,
        meses: "enero",
        gastos: 4000,
        ingresos: 2400,
        amt: 2400,
    },
    {
        movimientos_por_año: 2023,
        meses: "febrero",
        gastos: 3000,
        ingresos: 1398,
        amt: 2210,
    },
    {
        movimientos_por_año: 2024,
        meses: "marzo",
        gastos: 2000,
        ingresos: 9800,
        amt: 2290,
    },
    {
        movimientos_por_año: 2025,
        meses: "abril",
        gastos: 2780,
        ingresos: 3908,
        amt: 2000,
    }
];


const BarChartComponent = () => {
        return (
        <>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    width={500}
                    height={300}
                    data={data}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                        dataKey="meses" 
                        tickFormatter={(mes) => `${mes}`}
                        label={{ 
                            value: 'Meses', 
                            position: 'bottom', 
                            offset: 0 
                        }}
                    />
                    <YAxis 
                        label={{ 
                            value: 'Valores', 
                            angle: -90, 
                            position: 'insideLeft',
                            offset: -5
                        }}
                    />
                    <Tooltip 
                        formatter={(value, name) => [`${value}`, name]}
                        labelFormatter={(label) => `${label}`}
                    />
                    <Legend 
                        verticalAlign="top"
                        height={36}
                    />
                    <Bar 
                        dataKey="ingresos" 
                        fill="#0047ba" 
                        background={{ fill: '#eee' }}
                        name="Ingresos"
                    />
                    <Bar 
                        dataKey="gastos" 
                        fill="#FF9012"
                        name="Gastos" 
                    />
                </BarChart>
            </ResponsiveContainer>
        
</>
        );
    };

export default BarChartComponent;
