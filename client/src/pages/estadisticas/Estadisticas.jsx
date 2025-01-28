import React from "react";
import Layout from "../layout/Layout";
import "./Estadisticas.css";
import BarChartComponent from "../../components/charts/BarChart";
import DateFilter from "../../components/DateFilter/DateFilter";

const Estadisticas = () => {
    return (
        <Layout title="Estadísticas">
            <DateFilter/>
            <div style={{ width: '100%', height: '400px' }}> {/* Contenedor con altura fija */}
                <BarChartComponent />
            </div>
        </Layout>
    );
};

export default Estadisticas;
