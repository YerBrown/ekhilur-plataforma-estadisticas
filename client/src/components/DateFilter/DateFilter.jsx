import React, { useState, useEffect } from "react";
import { SlArrowDown } from "react-icons/sl";
import { SlArrowUp } from "react-icons/sl";
import { useLanguage } from "../../contexts/LanguageContext.jsx";
import "./DateFilter.css";

const DateFilter = ({ onDateFilter }) => {
  const { t } = useLanguage();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [isMonthOpen, setIsMonthOpen] = useState(false);
  const [isYearOpen, setIsYearOpen] = useState(false);
  const [availableYears, setAvailableYears] = useState([]);
  const [availableMonths, setAvailableMonths] = useState([]);
  const months = [
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

  const translatedMonths = months.map((month) => t.months[month] || month);

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: currentYear - 2020 + 1 }, (_, index) => 2020 + index);
    setAvailableYears(years);
    setAvailableMonths(translatedMonths);
    handleYearSelect(selectedYear);
    handleMonthSelect(selectedMonth)
  }, [t]);

  const handleMonthSelect = (month) => {
    setSelectedMonth(month);
    setIsMonthOpen(false);
    if (selectedYear && month >= 0) {
      console.log("month", month, "year", selectedYear);
      onDateFilter({ year: selectedYear, month });
    }
  };
  const handleYearSelect = (year) => {
    setSelectedYear(year);
    setIsYearOpen(false);
    if (selectedMonth >= 0 && year) {
      console.log("month", selectedMonth, "year", year);
      onDateFilter({ year, month: selectedMonth });
    }
  };

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
            {t.months[months[selectedMonth]] || months[selectedMonth] || "MES"}
            {isMonthOpen ? <SlArrowUp className="icon-small" /> : <SlArrowDown className="icon-small" />}
          </button>

          {isMonthOpen && (
            <div className="dropdown-content">
              {availableMonths.map((month, index) => (
                <button
                  key={index}
                  onClick={() => handleMonthSelect(index)}
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
            {isYearOpen ? <SlArrowUp className="icon-small" /> : <SlArrowDown className="icon-small" />}
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