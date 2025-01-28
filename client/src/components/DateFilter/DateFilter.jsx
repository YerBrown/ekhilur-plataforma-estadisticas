import React, { useState, useRef, useEffect } from "react";
import "./DateFilter.css";

const DateFilter = ({ onFilter }) => {
  const [startMonth, setStartMonth] = useState(new Date().getMonth() + 1); 
  const [startYear, setStartYear] = useState(new Date().getFullYear()); 
  const [isOpen, setIsOpen] = useState(false);
  const filterRef = useRef(null);

  
  useEffect(() => {
    if (onFilter && typeof onFilter === "function") {
      const startDate = `${startYear}-${String(startMonth).padStart(2, "0")}`;
      onFilter({ startDate });
    }
  }, [startMonth, startYear, onFilter]);

 
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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


  const buttonText = `${months[startMonth - 1]} ${startYear}`;

  return (
    <div className="date-filter-container" ref={filterRef}>
      <button className="toggle-button" onClick={toggleFilter}>
        {buttonText}
      </button>

      {isOpen && (
        <div className="date-filter-content">
          <div className="date-filter-group">
            <label className="date-filter-label">Selecciona Mes y Año:</label>
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
        </div>
      )}
    </div>
  );
};

export default DateFilter;
