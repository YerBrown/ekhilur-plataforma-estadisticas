import React, { useState } from "react";
import "./DateFilter.css";

const DateFilter = ({ onFilter }) => {
  const [startMonth, setStartMonth] = useState(new Date().getMonth() + 1); // Mes actual
  const [startYear, setStartYear] = useState(new Date().getFullYear()); // Año actual
  const [isOpen, setIsOpen] = useState(false);

  const handleApplyFilter = () => {
    if (onFilter && typeof onFilter === "function") {
      const startDate = `${startYear}-${String(startMonth).padStart(2, "0")}`;
      onFilter({ startDate });
    }
  };

  const toggleFilter = () => {
    setIsOpen(!isOpen);
  };

  const months = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear - 5; i <= currentYear; i++) {
      years.push(i);
    }
    return years;
  };

  const renderScrollSelector = (items, value, onChange) => (
    <div className="scroll-selector">
      <ul className="scroll-list">
        {items.map((item, index) => (
          <li
            key={index}
            className={`scroll-item ${value === item ? "selected" : ""}`}
            onClick={() => onChange(item)}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );

  // Texto del botón: muestra el mes y año seleccionado
  const buttonText = isOpen
    ? "Cerrar Filtros"
    : `${months[startMonth - 1]} ${startYear}`;

  return (
    <div className="date-filter-container">
      <button className="toggle-button" onClick={toggleFilter}>
        {buttonText}
      </button>

      {isOpen && (
        <div className="date-filter-content">
          <div className="date-filter-group">
            <label className="date-filter-label">Mes y Año Inicio:</label>
            <div className="date-filter-scroll">
              {renderScrollSelector(
                months,
                months[startMonth - 1],
                (month) => setStartMonth(months.indexOf(month) + 1)
              )}
              {renderScrollSelector(
                generateYears(),
                startYear,
                (year) => setStartYear(year)
              )}
            </div>
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