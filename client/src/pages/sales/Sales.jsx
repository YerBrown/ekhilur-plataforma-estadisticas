import React from "react";
import Layout from "../layout/Layout";
import "./Sales.css";
import DateFilter from "../../components/DateFilter/DateFilter";

const Bonifications = () => {
  return (
    <Layout title="Ventas">
      <DateFilter />

      <div className="sales-container">
        <div className="content-container">
          
            <img className="image-container"
              src="https://python-charts.com/es/parte-todo/grafico-barras-apiladas-matplotlib_files/figure-html/grafico-barras-apiladas-matplotlib.png"
              alt="Gráfico de barras"
            />
          
          
            <img className="image-container"
              src="https://python-charts.com/es/parte-todo/grafico-barras-apiladas-matplotlib_files/figure-html/grafico-barras-apiladas-matplotlib.png"
              alt="Resumen de transacciones"
            />
          
        </div>
      </div>
    </Layout>
  );
};

export default Bonifications;