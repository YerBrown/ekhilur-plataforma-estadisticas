import React, { useState, useEffect } from "react";
import { dataMonths } from "../../api/dataPruebas";
import "./DateFilter.css";

const DateFilter = ({ onDateFilter }) => {
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [isMonthOpen, setIsMonthOpen] = useState(false);
  const [isYearOpen, setIsYearOpen] = useState(false);
  const [availableYears, setAvailableYears] = useState([]);
  const [availableMonths, setAvailableMonths] = useState([]);
  const monthOrder = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre"
  ];
  useEffect(() => {
    const years = [...new Set(dataMonths.map(year => year.año))].sort((a, b) => b - a);
    // Ordenar años de mayor a menor
    const months = [...new Set(dataMonths.flatMap(year =>
      year.datos.map(data => data.mes)
    ))];
     
      const orderedMonths = months.sort((a, b) => 
        monthOrder.indexOf(a) - monthOrder.indexOf(b)
      );  // Ordenar meses según el orden definido

    setAvailableYears(years);
    setAvailableMonths(monthOrder);
  }, []);

  const handleMonthSelect = (month) => {
    setSelectedMonth(month);
    setIsMonthOpen(false);
    if (selectedYear && month) {
      onDateFilter({ year: selectedYear, month });
    }
  };
  const handleYearSelect = (year) => {
    setSelectedYear(year);
    setIsYearOpen(false);
    if (selectedMonth && year) {
      onDateFilter({ year, month: selectedMonth });
    }
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


  const buttonText = `${months[selectedMonth - 1]} ${selectedYear}`;

  return (
    <div className="date-filter-container">
      <div className="date-filter-group">
        {/* Dropdown de Mes */}
        <div className="filter-dropdown">
          <button
            onClick={() => {
              setIsMonthOpen(!isMonthOpen);
              setIsYearOpen(false);
            }}
            className="date-filter-button"
          >
            {selectedMonth || "MES"}
          </button>

          {isMonthOpen && (
            <div className="dropdown-content">
              {availableMonths.map((month) => (
                <button
                  key={month}
                  onClick={() => handleMonthSelect(month)}
                  className="dropdown-item"
                >
                  {month}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Dropdown de Año */}
        <div className="filter-dropdown">
          <button
            onClick={() => {
              setIsYearOpen(!isYearOpen);
              setIsMonthOpen(false);
            }}
            className="date-filter-button"
          >
            {selectedYear || "AÑO"}
          </button>

          {isYearOpen && (
            <div className="dropdown-content">
              {availableYears.map((year) => (
                <button
                  key={year}
                  onClick={() => handleYearSelect(year)}
                  className="dropdown-item"
                >
                  {year}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DateFilter;