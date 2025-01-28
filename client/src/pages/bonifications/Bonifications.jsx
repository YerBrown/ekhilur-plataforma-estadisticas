import React from "react";
import Layout from "../layout/Layout";
import "./Bonifications.css";
import DateFilter from "../../components/DateFilter/DateFilter";

const Bonifications = () => {
  return (
    <Layout title="Bonificaciones">
      <p>Esto es la pagina de bonificaciones</p>
      <DateFilter />
      <div>
        <img src="https://python-charts.com/es/parte-todo/grafico-barras-apiladas-matplotlib_files/figure-html/grafico-barras-apiladas-matplotlib.png" alt="Descripción de la imagen" width="200" height="150" />

      </div>

      <div>
        <img src="https://python-charts.com/es/parte-todo/grafico-barras-apiladas-matplotlib_files/figure-html/grafico-barras-apiladas-matplotlib.png" alt="Descripción de la imagen" width="200" height="150" />


      </div>
    </Layout>
  );
};

export default Bonifications;