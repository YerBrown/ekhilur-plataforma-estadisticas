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
    const searchTimeout = useRef(null);

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

    const triggerSearch = () => {
        clearTimeout(searchTimeout.current);
        searchTimeout.current = setTimeout(() => {
            onSearch({
                date: startDate && endDate ? { startDate, endDate } : null,
                name: searchTerm || null,
                amount: minAmount && maxAmount ? { minAmount, maxAmount } : null,
            });

            // Solo ejecutar la búsqueda si los filtros de fecha o importe están completos
            if ((startDate && endDate) || (minAmount && maxAmount)) {
                onSearch(filters);
            }
        }, 500); // 1 segundo de espera
    };

    const handleNameChange = (e) => {
        setSearchTerm(e.target.value);
        triggerSearch();
    };

    const handleAmountChange = (event, type) => {
        const value = event.target.value;
        if (type === "min") {
            setMinAmount(value);
        } else {
            setMaxAmount(value);
        }
        triggerSearch();
    };

    const clearFilters = () => {
        setSearchTerm("");
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

                    <div className="filter-group">
                        <input
                            type="text"
                            placeholder={t.inputImportMin}
                            value={minAmount}
                            onChange={(e) => handleAmountChange(e, "min")}
                            className="filter-input"
                        />
                        <input
                            type="text"
                            placeholder={t.inputImportMax}
                            value={maxAmount}
                            onChange={(e) => handleAmountChange(e, "max")}
                            className="filter-input"
                        />
                    </div>
                </div>
            )
            }
        </div >
    );
};

export default SearchBar;