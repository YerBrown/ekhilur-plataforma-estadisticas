import { useRef, useState, useEffect } from "react";
import { useLanguage } from "../../contexts/LanguageContext.jsx";
import { GoSearch } from "react-icons/go";
import { IoCloseOutline } from "react-icons/io5";
import "./SearchBar.css";

const SearchBar = ({ onSearch }) => {
    const { t } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [minAmount, setMinAmount] = useState("");
    const [maxAmount, setMaxAmount] = useState("");
    const searchBarRef = useRef(null);
    const buttonRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                searchBarRef.current &&
                !searchBarRef.current.contains(event.target) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const toggleMenu = (e) => {
        e.stopPropagation();
        setIsOpen((prev) => !prev);
    };

    // Convierte el valor introducido en un formato con dos decimales
    const formatToCurrency = (value) => {
        const numericValue = value.replace(/\D/g, ""); // Elimina cualquier carácter no numérico
        if (!numericValue) return ""; // Si está vacío, retorna una cadena vacía

        const integerPart = numericValue.slice(0, -2) || "0"; // Parte entera
        const decimalPart = numericValue.slice(-2).padStart(2, "0"); // Parte decimal

        return `${parseInt(integerPart, 10).toLocaleString("es-ES")},${decimalPart}`;
    };

    // Maneja los cambios en los campos de importe
    const handleAmountChange = (value, type) => {
        const formattedValue = formatToCurrency(value);
        if (type === "min") {
            setMinAmount(formattedValue);
        } else {
            setMaxAmount(formattedValue);
        }

        // Actualiza la búsqueda con los valores actuales
        handleSearch(
            type === "min" ? formattedValue : minAmount,
            type === "max" ? formattedValue : maxAmount
        );
    };

    const handleSearch = (min = minAmount, max = maxAmount) => {
        const filters = {
            date: startDate || endDate ? { startDate, endDate } : null,
            name: searchTerm ? searchTerm : null,
            amount: min || max ? { minAmount: min, maxAmount: max } : null,
        };
        onSearch(filters);
    };

    const handleNameChange = (e) => {
        setSearchTerm(e.target.value);
        handleSearch();
    };

    const formatDate = (value) => {
        // Elimina caracteres no numéricos
        const numericValue = value.replace(/\D/g, "");

        // Separa los valores en DD, MM y AAAA
        let day = numericValue.slice(0, 2);
        let month = numericValue.slice(2, 4);
        let year = numericValue.slice(4, 8);

        // Construye la fecha con el formato DD/MM/AAAA
        let formattedDate = day;
        if (month) formattedDate += `/${month}`;
        if (year) formattedDate += `/${year}`;

        return formattedDate;
    };

    const handleDateInput = (event, type) => {
        const formattedDate = formatDate(event.target.value);
        if (type === "start") {
            setStartDate(formattedDate);
        } else {
            setEndDate(formattedDate);
        }
        if (formattedDate.length === 10 && (type === "start" ? endDate : startDate)?.length === 10) {
            handleSearch();
        }
    };

    const getCurrentDate = () => {
        const today = new Date();
        const day = String(today.getDate()).padStart(2, "0");
        const month = String(today.getMonth() + 1).padStart(2, "0"); // Los meses van de 0 a 11
        const year = today.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const clearFilters = () => {
        setSearchTerm("");
        setStartDate(null);
        setEndDate(null);
        setMinAmount("");
        setMaxAmount("");
        onSearch({ date: null, name: null, amount: null });
    };

    return (
        <div className="search-bar-container">
            <button className="search-button" ref={buttonRef} onClick={toggleMenu}>
                <GoSearch className="search-icon" size={24} />
            </button>

            {isOpen && (
                <div className="search-bar" onClick={(e) => e.stopPropagation()} ref={searchBarRef}>
                    <div className="search-bar-name">
                        <div className="search-bar-name-input-container">
                            <input
                                type="text"
                                placeholder={t.searchBarInput}
                                value={searchTerm}
                                onChange={handleNameChange}
                                className="search-bar-name-input"
                            />
                            <IoCloseOutline
                                className="clear-icon"
                                onClick={clearFilters}
                            />
                        </div>
                    </div>

                    <div className="search-bar-filters">
                        <div className="filter-group">
                            <label className="filter-label">{t.filterDate}</label>
                            <div className="filter-dates">
                                <input
                                    type="text"
                                    placeholder={getCurrentDate()}
                                    value={startDate || ""}
                                    onChange={(e) => handleDateInput(e, "start")}
                                    maxLength="10"
                                    className="search-bar-date-input"
                                />
                                <input
                                    type="text"
                                    placeholder={getCurrentDate()}
                                    value={endDate || ""}
                                    onChange={(e) => handleDateInput(e, "end")}
                                    maxLength="10"
                                    className="search-bar-date-input"
                                />
                            </div>
                        </div>

                        <div className="filter-group">
                            <label className="filter-label">{t.filterImport}</label>
                            <div className="filter-amounts">
                                <input
                                    type="text"
                                    placeholder={t.inputImportMin}
                                    value={minAmount}
                                    onChange={(e) => handleAmountChange(e.target.value, "min")}
                                    className="filter-input"
                                />
                                <input
                                    type="text"
                                    placeholder={t.inputImportMax}
                                    value={maxAmount}
                                    onChange={(e) => handleAmountChange(e.target.value, "max")}
                                    className="filter-input"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchBar;