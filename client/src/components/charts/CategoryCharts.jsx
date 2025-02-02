import { useState } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import DonutChart from "./DonutChart";
import "./CategoryCharts.css";


const CategoryChart = ({categoryDataJson}) => {
    const { t } = useLanguage();
    const [categories, setCategories] = useState(categoryDataJson);

    const getDataOptions = () => {
        const ategoryData = categories.map((category) => ({
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
        const ategoryOption = categories.map((category) => ({
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
                data: ategoryData[i],
                options: ategoryOption[i],
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
            <h2>{t.categoriesTitle}</h2>
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
