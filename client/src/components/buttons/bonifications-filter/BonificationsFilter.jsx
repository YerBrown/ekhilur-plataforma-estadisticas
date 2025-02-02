import { useState, useRef, useEffect } from "react";
import { useLanguage } from "../../../contexts/LanguageContext.jsx";
import "./BonificationsFilter.css";

const BonificationsFilter = ({ onFilterChange }) => {
    const { t } = useLanguage();
    const [activeButton, setActiveButton] = useState("all");
    const [sliderStyles, setSliderStyles] = useState({ width: 0, left: 0 });
    const containerRef = useRef(null);

    const handleButtonClick = (label, index) => {
        setActiveButton(label);
        onFilterChange(label);
        updateSliderPosition(index);
    };

    const updateSliderPosition = (index) => {
        if (containerRef.current) {
            const buttons = containerRef.current.querySelectorAll(".bonifications-button");
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
        <div className="bonifications-filter-container" ref={containerRef}>
            <div
                className="slider"
                style={{
                    width: sliderStyles.width,
                    transform: `translateX(${sliderStyles.left}px)`,
                }}
            ></div>

            {[
                { key: "all", label: t.all },
                { key: "emmited", label: t.emmited },
                { key: "received", label: t.received }
            ].map(({ key, label }, index) => (
                <button
                    key={key}
                    className={`bonifications-button ${activeButton === key ? "active" : ""}`}
                    onClick={() => handleButtonClick(key, index)}
                >
                    <p>{label}</p>
                </button>
            ))}
        </div>
    );
};

export default BonificationsFilter;