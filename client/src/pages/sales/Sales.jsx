import React, { useState } from "react";
import Layout from "../layout/Layout";
import "./Sales.css";
import DateFilter from "../../components/DateFilter/DateFilter";
import TransactionList from "../../components/transactions-list/TransactionsList";
import mockData from "../../components/transactions-list/mockData.js";


const Sales = () => {

  const [salesTransactions, setsalesTransactions] = useState(mockData);
  return (
    <Layout title="sales">
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
      <TransactionList transactions={salesTransactions} />

    </Layout>
  );


};

export default Sales;
