import React from "react";
import Layout from "../layout/Layout";
import "./Bonifications.css";
import DateFilter from "../../components/DateFilter/DateFilter";

const Bonifications = () => {
  return (
    <Layout title="Bonificaciones">
      <p>Esto es la pagina de bonificaciones</p>
      <DateFilter />
    </Layout>
  );
};

export default Bonifications;
