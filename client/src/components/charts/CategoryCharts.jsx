import { useState } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import { useTheme } from "../../contexts/ThemeContext";

import "./CategoryCharts.css";
import {
    FaAppleAlt,
    FaCoffee,
    FaTshirt,
    FaHeart,
    FaStore,
    FaIndustry,
    FaPaintBrush,
    FaFutbol,
    FaHandsHelping,
} from "react-icons/fa";

const categoryTemplate = [
    {
        label: "Alimentación",
        color: "#0047ba",
        "color-dark": "#001d4d",
        icon: FaAppleAlt,
    },
    {
        label: "Hostelería",
        color: "#26C485",
        "color-dark": "#0c402b",
        icon: FaCoffee,
    },
    {
        label: "Moda y Complementos",
        color: "#54a9cd",
        "color-dark": "#112f3b",
        icon: FaTshirt,
    },
    {
        label: "Salud y Estética",
        color: "#ffc412",
        "color-dark": "#4d3900",
        icon: FaHeart,
    },
    {
        label: "Servicios y Comercio General",
        color: "#6f9ef0",
        "color-dark": "#071e45",
        icon: FaStore,
    },
    {
        label: "Industria y Construcción",
        color: "#ffef21",
        "color-dark": "#4d4700",
        icon: FaIndustry,
    },
    {
        label: "Arte y Cultura",
        color: "#ff9d6d",
        "color-dark": "#4d1a00",
        icon: FaPaintBrush,
    },
    {
        label: "Deporte y Ocio",
        color: "#382ef2",
        "color-dark": "#080548",
        icon: FaFutbol,
    },
    {
        label: "Asociaciones y Cooperativas",
        color: "#ff9012",
        "color-dark": "#4d2900",
        icon: FaHandsHelping,
    },
];

const matchValues = (categoryValues) => {
    return categoryValues
        .map((categoryValue) => {
            const match = categoryTemplate.find(
                (category) => category.label === categoryValue.categoria
            );
            return match ? { ...match, ...categoryValue } : null;
        })
        .filter((category) => category !== null)
        .sort((a, b) => b.gasto - a.gasto); // Ordenar de mayor a menor
};

const CategoryChart = ({ categoryDataJson }) => {
    const { t } = useLanguage();
    const [categories, setCategories] = useState(matchValues(categoryDataJson));
    const { theme } = useTheme();

    // Obtener el gasto máximo para normalizar las barras
    const maxGasto = Math.max(...categories.map((cat) => cat.gasto));

    return (
        <div className="category-charts">
            <h2>{t.categoriesTitle}</h2>
            <div className="category-extra">
                <div className="category-container">
                    {categories.map((category) => {
                        const widthPercentage =
                            (category.gasto / (maxGasto > 0 ? maxGasto : 1)) *
                            100;
                        return (
                            <div className="category-item" key={category.label}>
                                <div className="label">
                                    {category.icon && (
                                        <category.icon size={20} />
                                    )}
                                    <h4 className="label">
                                        {t[category.label]}
                                    </h4>
                                </div>
                                <div className="value">
                                    <div className="gasto-bar">
                                        <div
                                            className="gasto-fill"
                                            style={{
                                                width: `${widthPercentage}%`,
                                                backgroundColor: category.color,
                                            }}
                                        ></div>
                                    </div>
                                    <h4 className="gasto">{`${category.gasto} €`}</h4>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default CategoryChart;
