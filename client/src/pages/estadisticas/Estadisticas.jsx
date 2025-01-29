import React from "react";
import Layout from "../layout/Layout";
import "./Estadisticas.css";
import BarChartComponent from "../../components/charts/BarChart";

const totalIngresos = 1000;
const totalGastos = 500;

const Estadisticas = () => {
    return (
        <div className="estadisticas-page">
        <Layout title="Estadísticas">
            <div className="container-ingresos-gastos">
                <div className=" item-ingresos-gastos">
                <p className="label-ingresos">INGRESOS</p>
                <span className="amount-ingresos">{totalIngresos} €</span>
                </div>
                <div className="item-ingresos-gastos">
                <p className="label-gastos">GASTOS</p>
                <span className="amount-gastos">{totalGastos} €</span>
                </div>
            </div>
            <div style={{ width: '100%', height: '400px' }}> {/* Contenedor con altura fija */}
                <BarChartComponent />
            </div>
        </Layout>
        </div>
    );
};

export default Estadisticas;
