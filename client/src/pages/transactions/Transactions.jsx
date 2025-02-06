import { useState, useEffect } from "react";
import { useLanguage } from "../../contexts/LanguageContext.jsx";
import Layout from "../../pages/layout/Layout";
import TransactionList from "../../components/transactions-list/TransactionsList";
import SearchBar from "../../components/search-bar/SearchBar";
import TransactionsFilter from "../../components/buttons/transactions-filter/TransactionsFilter.jsx";
import "./Transactions.css";
import { getTransactions } from "../../api/realData.js";

const Transactions = () => {
    const { t } = useLanguage();
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [apiData, setApiData] = useState();

    const loadApiData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await getTransactions();
            setApiData(data);
            setFilteredTransactions(data);
        } catch (error) {
            console.error("Error al cargar datos:", error);
            setError("No se pudieron cargar los datos. Por favor, intente más tarde.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadApiData();
    }, []);

    useEffect(() => {
        const handleTopClick = (event) => {
            if (event.clientY < 50) {
                window.scrollTo({ top: 0, behavior: "smooth" });
            }
        };
        document.addEventListener("click", handleTopClick);
        return () => {
            document.removeEventListener("click", handleTopClick);
        };
    }, []);

    const parseDate = (dateString) => {
        if (!dateString) return null;
        const [day, month, year] = dateString.split("/").map(Number);
        return new Date(year, month - 1, day); // Meses en JS van de 0 a 11
    };

/*     const handleSearch = ({ date, name, amount }) => {
        if (!date && !name && !amount) {
            setFilteredTransactions(data);
            return;
        }

        let filtered = apiData;

        // FILTRAR POR NOMBRE
        if (name) {
            filtered = filtered.filter(transaction =>
                transaction.usuario_asociado.toLowerCase().includes(name.toLowerCase()) || transaction.movimiento.toLowerCase().includes(name.toLowerCase()));
        }

        // FILTRAR POR FECHA
        if (date && (date.startDate || date.endDate)) {
            filtered = filtered.filter(transaction => {
                const transactionDate = parseDate(transaction.fecha);
                const startDate = date.startDate ? parseDate(date.startDate) : null;
                const endDate = date.endDate ? parseDate(date.endDate) : null;

                return (!startDate || transactionDate >= startDate) &&
                    (!endDate || transactionDate <= endDate);
            });
        }

        // FILTRAR POR IMPORTE
        if (amount && amount.minAmount && amount.maxAmount) {
            filtered = filtered.filter(transaction => {
                // Convertimos los valores de transacción y los filtros a números reales
                const transactionAmount = parseFloat(transaction.cantidad.replace(/\./g, "").replace(",", "."));
                const minAmount = parseFloat(amount.minAmount.replace(/\./g, "").replace(",", "."));
                const maxAmount = parseFloat(amount.maxAmount.replace(/\./g, "").replace(",", "."));

                // Aseguramos que los valores negativos también se incluyan
                return transactionAmount >= minAmount && transactionAmount <= maxAmount;
            });
        }

        setFilteredTransactions(filtered);
    }; */


    const handleFilterChange = (filter) => {
        if (filter === t.all) {
            setFilteredTransactions(apiData);
        } else if (filter === t.incomes) {
            setFilteredTransactions(apiData.filter(transaction => transaction.cantidad > 0));
        } else if (filter === t.expenses) {
            setFilteredTransactions(apiData.filter(transaction => transaction.cantidad < 0));
        }
    };
    
    return (
        <Layout title={t.transactionTitle}>
            <div className="transactions-content-container">
                {/* <SearchBar onSearch={handleSearch} /> */}
                <TransactionsFilter onFilterChange={handleFilterChange} />
                <TransactionList transactions={filteredTransactions} />
            </div>
        </Layout>
    );
};

export default Transactions;