import { useState } from "react";
import Layout from "../../pages/layout/Layout";
import TransactionList from "../../components/transactions-list/TransactionsList";
import mockData from "../../components/transactions-list/mockData.js";
import SearchBar from "../../components/search-bar/SearchBar";
import TransactionsFilter from "../../components/buttons/transactions-filter/TransactionsFilter.jsx";
import "./Transactions.css";

const Transactions = () => {
    const [filteredTransactions, setFilteredTransactions] = useState(mockData);

    const handleSearch = ({ term, filter }) => {
        const filtered = mockData.filter((transaction) => {
            if (filter === "fecha") {
                return transaction.date.toLowerCase().includes(term);
            } else if (filter === "usuario_asociado") {
                return transaction.name.toLowerCase().includes(term);
            } else if (filter === "cantidad") {
                return transaction.amount.toLowerCase().includes(term);
            }
            return true;
        });
        setFilteredTransactions(filtered);
    };

    const handleFilterChange = (filter) => {
        if (filter === "Todas") {
            setFilteredTransactions(mockData);
        } else if (filter === "Ingresos") {
            setFilteredTransactions(mockData.filter(transaction => !transaction.cantidad.toString().includes('-')));
        } else if (filter === "Gastos") {
            setFilteredTransactions(mockData.filter(transaction => transaction.cantidad.toString().includes('-')));
        }
    };

    return (
        <Layout title="Transacciones">
            <SearchBar onSearch={handleSearch} />
            <TransactionsFilter onFilterChange={handleFilterChange}/>
            <TransactionList transactions={filteredTransactions} />
        </Layout>
    );
};

export default Transactions;