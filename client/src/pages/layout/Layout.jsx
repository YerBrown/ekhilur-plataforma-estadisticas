import React from "react";
import { useNavigate } from "react-router-dom";
import "./Layout.css";

const Layout = ({ title, children }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="layout-container">
      <header className="layout-header">
        <button className="back-button" onClick={handleBack}>
          ← Atrás
        </button>
        <h1 className="layout-title">{title}</h1>
      </header>
      <main className="layout-content">{children}</main>
    </div>
  );
};

export default Layout;
