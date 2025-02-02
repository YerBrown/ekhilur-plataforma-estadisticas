import React from 'react';
import './MonthYearFilter.css';

const MonthYearFilter = ({ 
  isMonthly, 
  onChange,
}) => {
  return (
    <div className="filter-container">
      <div className="filter-grid">
        {/* Opción de Años */}
        <div 
          className={`filter-option ${!isMonthly ? 'active' : 'inactive'}`}
          onClick={() => onChange(false)}
        >
          <span className="filter-label">Años</span>
        </div>
        
        {/* Opción de Meses */}
        <div 
          className={`filter-option ${isMonthly ? 'active' : 'inactive'}`}
          onClick={() => onChange(true)}
        >
          <span className="filter-label">Meses</span>
        </div>
      </div>
    </div>
  );
};

export default MonthYearFilter;