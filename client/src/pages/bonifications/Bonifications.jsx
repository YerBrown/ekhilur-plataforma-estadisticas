import React from "react";
import Layout from "../layout/Layout";
import "./Bonifications.css";
import DateFilter from "../../components/DateFilter/DateFilter";

const Bonifications = () => {
  return (
    <Layout title="Bonificaciones">
      <DateFilter />

      <div className="bonifications-container">
        <div className="content-container">
          <div className="image-container">
            <img
              src="https://python-charts.com/es/parte-todo/grafico-barras-apiladas-matplotlib_files/figure-html/grafico-barras-apiladas-matplotlib.png"
              alt="Gráfico de barras"
            />
          </div>
          <div className="image-container">
            <img
              src="https://python-charts.com/es/parte-todo/grafico-barras-apiladas-matplotlib_files/figure-html/grafico-barras-apiladas-matplotlib.png"
              alt="Resumen de transacciones"
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Bonifications;