import React, { useState} from "react";
import Layout from "../layout/Layout";
import "./Sales.css";
import DateFilter from "../../components/DateFilter/DateFilter";
import TransactionList from "../../components/transactions-list/TransactionsList";
import mockData from "../../components/transactions-list/mockData.js";
import BarChartComponent from "../../components/charts/BarChart";




const Sales = () => {
  const [salesTransactions, setsalesTransactions] = useState(mockData);
  return (
    <Layout title="Ventas">
      <DateFilter />

      <div className="sales-container">
        <div className="content-container">

          <BarChartComponent />
        </div>
      </div>
      <TransactionList transactions={salesTrannsactions} />

    </Layout>
  );
};

export default Sales;