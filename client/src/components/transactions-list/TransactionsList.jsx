import "./TransactionsList.css";

const TransactionList = ({ transactions }) => {
    // AGRUPAR TRANSACCIONES POR FECHA
    const groupedTransactions = transactions.reduce((groups, transaction) => {
        const date = transaction.date;
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(transaction);
        return groups;
    }, {});

    // FORMATEAR FECHAS PARA EL TITULO
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("es-ES", {
            weekday: "long",
            day: "numeric",
            month: "long"
        });
    };

    return (
        <>
            <div className="transaction-list-container">
                {Object.keys(groupedTransactions).sort().reverse().map((date) => (
                    <div key={date} className="transaction-group-container">
                        <div className="transaction-group-header">
                            <h2 className="transaction-group-title">{formatDate(date)}</h2>
                        </div>
                        <div className="transaction-group-list">
                            {groupedTransactions[date].map((transaction, index) => (
                                <div
                                    key={index}
                                    className="transaction-item"
                                >
                                    <div className="transaction-item-image-container">
                                        <img
                                            src={transaction.image}
                                            alt={transaction.name}
                                            className="transaction-item-image"
                                        />
                                    </div>
                                    <div className="transaction-item-name-container">
                                        <p className="transaction-item-name">{transaction.name}</p>
                                    </div>
                                    <div className="transaction-item-amounts-container">
                                        <p className="transaction-item-amount">{transaction.amount}</p>
                                        <p className="transaction-item-remaining">{transaction.remainingBalance}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default TransactionList;