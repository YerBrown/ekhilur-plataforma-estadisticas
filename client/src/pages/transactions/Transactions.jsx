import { useState } from "react";
import Layout from "../../pages/layout/Layout";
import TransactionList from "../../components/transactions-list/TransactionsList";
import mockTransactions from "../../components/transactions-list/mockData.js";
import SearchBar from "../../components/search-bar/SearchBar";

const Transactions = () => {
    const [filteredTransactions, setFilteredTransactions] = useState(mockTransactions);

    const handleSearch = ({term, filter}) => {
        const filtered = mockTransactions.filter((transaction) => {
            if (filter === "date") {
                return transaction.date.toLowerCase().includes(term);
            } else if (filter === "name") {
                return transaction.name.toLowerCase().includes(term);
            } else if (filter === "amount") {
                return transaction.amount.toLowerCase().includes(term);
            }
            return true;
        });
        setFilteredTransactions(filtered);
    };

    return (
        <Layout title="Transacciones">
            <SearchBar onSearch={handleSearch} />
            <TransactionList transactions={filteredTransactions} />
        </Layout>
    );
};

export default Transactions;