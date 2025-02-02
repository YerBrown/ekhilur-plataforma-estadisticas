import { useState, useRef, useEffect } from "react";
import { useLanguage } from "../../../contexts/LanguageContext.jsx";
import "./TransactionsFilter.css";

const TransactionsFilter = ({ onFilterChange }) => {
    const { t } = useLanguage();
    const [activeButton, setActiveButton] = useState("all");
    const [sliderStyles, setSliderStyles] = useState({ width: 0, left: 0 });
    const containerRef = useRef(null);

    const handleButtonClick = (key, index) => {
        let label;
        switch (key) {
            case "all":
                label = t.all;
                break;
            case "incomes":
                label = t.incomes;
                break;
            case "expenses":
                label = t.expenses;
                break;
            default:
                label = t.all;
        }
        setActiveButton(key);
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

            {[
                { key: "all", label: t.all },
                { key: "incomes", label: t.incomes },
                { key: "expenses", label: t.expenses }
            ].map(({ key, label }, index) => (
                <button
                    key={key}
                    className={`transactions-button ${activeButton === key ? "active" : ""}`}
                    onClick={() => handleButtonClick(key, index)}
                >
                    <p>{label}</p>
                </button>
            ))}
        </div>
    );
};

export default TransactionsFilter;