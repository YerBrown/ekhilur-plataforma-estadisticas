import React, { useState, useRef, useEffect } from "react";
import "./TransactionsFilter.css";

const TransactionsFilter = ({onFilterChange}) => {
    const [activeButton, setActiveButton] = useState("Todas");
    const [sliderStyles, setSliderStyles] = useState({ width: 0, left: 0 });
    const containerRef = useRef(null);

    const handleButtonClick = (label, index) => {
        setActiveButton(label);
        onFilterChange(label);
        updateSliderPosition(index);
    };

    const updateSliderPosition = (index) => {
        if (containerRef.current) {
            const buttons = containerRef.current.querySelectorAll(".transactions-button");
            const button = buttons[index];
            if (button) {
                setSliderStyles({
                    width: button.offsetWidth,
                    left: button.offsetLeft,
                });
            }
        }
    };

    useEffect(() => {
        updateSliderPosition(0);
    }, []);

    return (
        <div className="transactions-filter-container" ref={containerRef}>
            <div
                className="slider"
                style={{
                    width: sliderStyles.width,
                    transform: `translateX(${sliderStyles.left}px)`,
                }}
            ></div>

            {["Todas", "Ingresos", "Gastos"].map((label, index) => (
                <button
                    key={label}
                    className={`transactions-button ${activeButton === label ? "active" : ""}`}
                    onClick={() => handleButtonClick(label, index)}
                >
                    <p>{label}</p>
                </button>
            ))}
        </div>
    );
};

export default TransactionsFilter;