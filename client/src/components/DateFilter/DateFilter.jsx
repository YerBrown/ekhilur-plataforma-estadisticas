import React, { useState } from "react";
import "./DateFilter.css";

const DateFilter = ({ onFilter }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleApplyFilter = () => {
    if (onFilter && typeof onFilter === "function") {
      onFilter({ startDate, endDate });
    }
  };

  const toggleFilter = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="date-filter-container">
      <button className="toggle-button" onClick={toggleFilter}>
        {isOpen ? "Cerrar Filtros" : "Abrir Filtros"}
      </button>

      {isOpen && (
        <div className="date-filter-content">
          <div className="date-filter-group">
            <label htmlFor="start-date" className="date-filter-label">
              Mes y Año Inicio:
            </label>
            <input
              type="month"
              id="start-date"
              className="date-filter-input"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="date-filter-group">
            <label htmlFor="end-date" className="date-filter-label">
              Mes y Año Fin:
            </label>
            <input
              type="month"
              id="end-date"
              className="date-filter-input"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <button className="date-filter-button" onClick={handleApplyFilter}>
            Aplicar Filtro
          </button>
        </div>
      )}
    </div>
  );
};

export default DateFilter;
