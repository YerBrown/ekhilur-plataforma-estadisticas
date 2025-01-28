import { useState } from "react";
import { GoSearch } from "react-icons/go";
import { IoCloseOutline } from "react-icons/io5";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./SearchBar.css";

const SearchBar = ({ onSearch }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [minAmount, setMinAmount] = useState("");
    const [maxAmount, setMaxAmount] = useState("");

    const handleSearch = () => {
        const filters = {
            date: startDate || endDate ? { startDate, endDate } : null,
            name: searchTerm ? searchTerm : null,
            amount: minAmount || maxAmount ? { minAmount, maxAmount } : null,
        };
        onSearch(filters);
    };

    const handleNameChange = (e) => {
        setSearchTerm(e.target.value);
        handleSearch();
    };

    const handleDateChange = (start, end) => {
        setStartDate(start);
        setEndDate(end);
        handleSearch();
    };

    const handleAmountChange = (min, max) => {
        setMinAmount(min);
        setMaxAmount(max);
        handleSearch();
    };

    const clearFilters = () => {
        setSearchTerm("");
        setStartDate(null);
        setEndDate(null);
        setMinAmount("");
        setMaxAmount("");
        handleSearch();
    };

    return (
        <div className="search-bar-container">
            <button className="search-button" onClick={() => setIsOpen(!isOpen)}>
                <GoSearch className="search-icon" size={24} />
            </button>

            {isOpen && (
                <div className="search-bar">
                    <div className="search-bar-name">
                        <div className="search-bar-name-input-container">
                            <input
                                type="text"
                                placeholder="Buscar transacciones"
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
                            <label className="filter-label">Periodo:</label>
                            <div className="filter-dates">
                                <DatePicker
                                    selected={startDate}
                                    onChange={(date) => handleDateChange(date, endDate)}
                                    placeholderText="Desde"
                                    className="search-bar-date-input"
                                />
                                <DatePicker
                                    selected={endDate}
                                    onChange={(date) => handleDateChange(startDate, date)}
                                    placeholderText="Hasta"
                                    className="search-bar-date-input"
                                />
                            </div>
                        </div>

                        <div className="filter-group">
                            <label className="filter-label">Importe</label>
                            <div className="filter-amounts">
                                <input
                                    type="number"
                                    placeholder="Min."
                                    value={minAmount}
                                    onChange={(e) => handleAmountChange(e.target.value, maxAmount)}
                                    className="filter-input"
                                />
                                <input
                                    type="number"
                                    placeholder="Max."
                                    value={maxAmount}
                                    onChange={(e) => handleAmountChange(minAmount, e.target.value)}
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