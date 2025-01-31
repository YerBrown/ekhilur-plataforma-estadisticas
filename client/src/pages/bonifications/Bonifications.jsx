import React, { useState } from "react";
import Layout from "../layout/Layout";
import "./Bonifications.css";
import DateFilter from "../../components/DateFilter/DateFilter";
import TransactionList from "../../components/transactions-list/TransactionsList";
import mockData from "../../components/transactions-list/mockData.js";
import BarChartComponent from "../../components/charts/BarChart";

const Bonifications = () => {
  const [bonificationTransactions, setbonificationTransactions] = useState(mockData);
  return (
    <Layout title="Bonificaciones">
      <DateFilter />

      <div className="bonifications-container">
        <div className="content-container">

          <BarChartComponent />


          <img className="image-container"
            src="https://python-charts.com/es/parte-todo/grafico-barras-apiladas-matplotlib_files/figure-html/grafico-barras-apiladas-matplotlib.png"
            alt="Resumen de transacciones"
          />

        </div>
      </div>
      <TransactionList transactions={bonificationTransactions} />

    </Layout>
  );
};

export default Bonifications;