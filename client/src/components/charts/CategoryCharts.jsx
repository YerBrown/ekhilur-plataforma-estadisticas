import React, { useState } from "react";
import DonutChart from "./DonutChart";
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
    const matchedCategories = categoryValues
        .map((categoryValue) => {
            const match = categoryTemplate.find(
                (category) => category.label === categoryValue.label
            );
            return match ? { ...match, ...categoryValue } : null;
        })
        .filter((category) => category !== null);
    return matchedCategories;
};
const CategoryChart = ({ categoryDataJson }) => {
    const [categories, setCategories] = useState(matchValues(categoryDataJson));

    const getDataOptions = () => {
        const categoryData = categories.map((category) => ({
            datasets: [
                {
                    label: "Single Category",
                    data: [category.value, totalCategoryValue - category.value],
                    backgroundColor: [category.color, category["color-dark"]],
                    hoverBackgroundColor: [
                        category.color,
                        category["color-dark"],
                    ],
                },
            ],
        }));
        const categoryOption = categories.map((category) => ({
            responsive: true,
            maintainAspectRatio: false, // Permitir personalizar ancho y alto
            plugins: {
                legend: {
                    display: false, // Ocultar leyenda
                },
                tooltip: {
                    enabled: false, // Deshabilitar tooltips
                },
                centerText: {
                    total: `${category.value} €`, // Pasar el total calculado
                },
                datalabels: {
                    display: false,
                },
            },
            elements: {
                arc: {
                    borderWidth: 0,
                },
            },
            cutout: "70%", // Ajustar el tamaño del agujero central
            radius: "90%",
        }));

        const dataAndOptions = [];
        for (let i = 0; i < categories.length; i++) {
            dataAndOptions.push({
                categoryJson: categories[i],
                data: categoryData[i],
                options: categoryOption[i],
            });
        }
        return dataAndOptions;
    };

    const categoryLabels = categories.map((item) => item.label);
    const categoryValues = categories.map((item) => item.value);
    const categoryColors = categories.map((item) => item.color);
    const totalCategoryValue = categoryValues.reduce(
        (acc, currentValue) => (acc += currentValue)
    );
    const categoryData = {
        labels: categoryLabels,
        datasets: [
            {
                label: "Wallet",
                data: categoryValues,
                backgroundColor: categoryColors,
                hoverBackgroundColor: categoryColors,
            },
        ],
    };

    const categoryOptions = {
        responsive: true,
        maintainAspectRatio: false, // Permitir personalizar ancho y alto
        plugins: {
            legend: {
                display: false, // Ocultar leyenda
            },
            tooltip: {
                enabled: false, // Deshabilitar tooltips
            },
            drawIcons: {}, // Plugin para dibujar iconos
            datalabels: {
                display: false,
            },
        },
        elements: {
            arc: {
                borderWidth: 0,
            },
        },
        cutout: "70%", // Ajustar el tamaño del agujero central
        radius: "90%",
    };
    return (
        <div className="category-charts">
            <h2>Categorias</h2>
            <div className="category-extra">
                <div className="category-container">
                    {getDataOptions().map((category) => (
                        <div
                            className="category-item"
                            key={category.categoryJson.label}
                        >
                            {category.categoryJson.icon && (
                                <category.categoryJson.icon size={24} />
                            )}
                            <h4>{category.categoryJson.label}</h4>
                            <div className="donut">
                                <DonutChart
                                    data={category.data}
                                    options={category.options}
                                    className="category-donut"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CategoryChart;
