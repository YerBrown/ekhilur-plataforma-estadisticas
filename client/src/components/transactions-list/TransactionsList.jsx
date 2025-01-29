import "./TransactionsList.css";

const TransactionList = ({ transactions }) => {
    // AGRUPAR TRANSACCIONES POR FECHA
    const groupedTransactions = transactions.reduce((groups, transaction) => {
        const fecha = transaction.fecha;
        if (!groups[fecha]) {
            groups[fecha] = [];
        }
        groups[fecha].push(transaction);
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
                {Object.keys(groupedTransactions).sort().reverse().map((fecha) => (
                    <div key={fecha} className="transaction-group-container">
                        <div className="transaction-group-header">
                            <h2 className="transaction-group-title">{formatDate(fecha)}</h2>
                        </div>
                        <div className="transaction-group-list">
                            {groupedTransactions[fecha].map((transaction, index) => (
                                <div key={index} className="transaction-item">
                                    <div className="transaction-item-header">
                                        <p className="transaction-item-time">{transaction.hora}</p>
                                    </div>
                                    <div className="transaction-item-content">
                                        <div className="transaction-item-image-container">
                                            <img
                                                src="/ekhilur/Ekhilur_isotipo.png"
                                                alt={transaction.usuario_asociado || transaction.movimiento}
                                                className="transaction-item-image"
                                            />
                                        </div>
                                        <div className="transaction-item-name-container">
                                            <p className="transaction-item-name">{transaction.usuario_asociado || transaction.movimiento}</p>
                                        </div>
                                        <div className="transaction-item-amounts-container">
                                            <p className={`transaction-item-amount ${transaction.cantidad.toString().includes('-') ? 'negative' : 'positive'}`}>
                                                {transaction.cantidad}
                                            </p>
                                            <p className="transaction-item-remaining">{transaction.saldo}</p>
                                        </div>
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