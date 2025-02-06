import React from "react";
import "./BarraGastos.css";

const BarraGastos = ({ data }) => {
    // Encontrar el gasto máximo
    const maxGasto = Math.max(...data.map((item) => item.gasto));

    return (
        <div className="barra-gastos-container">
            {data.map((item, index) => {
                // Calcular el ancho relativo en base al gasto máximo
                const widthPercentage = (item.gasto / maxGasto) * 100;

                return (
                    <div key={index} className="barra-gasto">
                        <span className="barra-label">{item.nombre}</span>
                        <div className="barra">
                            <div
                                className="barra-fill"
                                style={{ width: `${widthPercentage}%` }}
                            ></div>
                        </div>
                        <span className="barra-valor">{item.gasto} €</span>
                    </div>
                );
            })}
        </div>
    );
};

// 📌 Ejemplo de Uso
const data = [
    { nombre: "Enero", gasto: 300 },
    { nombre: "Febrero", gasto: 500 },
    { nombre: "Marzo", gasto: 800 },
    { nombre: "Abril", gasto: 200 },
];

export default function App() {
    return <BarraGastos data={data} />;
}
