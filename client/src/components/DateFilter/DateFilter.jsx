import React, { useState } from "react";
import "./DateFilter.css";

const DateFilter = ({ onFilter }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleApplyFilter = () => {
    if (onFilter && typeof onFilter === "function") {
      onFilter({ startDate, endDate });
    }
  };

  return (
    <div className="date-filter-container">
      <div className="date-filter-group">
        <label htmlFor="start-date" className="date-filter-label">
          Fecha Inicio:
        </label>
        <input
          type="date"
          id="start-date"
          className="date-filter-input"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </div>
      <div className="date-filter-group">
        <label htmlFor="end-date" className="date-filter-label">
          Fecha Fin:
        </label>
        <input
          type="date"
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
  );
};

export default DateFilter;
