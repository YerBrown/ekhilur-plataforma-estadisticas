import { useLanguage } from "../../contexts/LanguageContext";
import "./TransactionsList.css";

const TransactionList = ({ transactions }) => {
    const { t, language } = useLanguage();

    // AGRUPAR TRANSACCIONES POR FECHA
    const groupedTransactions = transactions.reduce((groups, transaction) => {
        const fecha = transaction.fecha;
        console.log(fecha);

        if (!groups[fecha]) {
            groups[fecha] = [];
        }
        groups[fecha].push(transaction);
        groups[fecha].sort((a, b) => {
            const timeA = a.hora.split(":").map(Number);
            const timeB = b.hora.split(":").map(Number);
            return timeB[0] - timeA[0] || timeB[1] - timeA[1];
        });
        return groups;
    }, {});

    const sortedDates = Object.keys(groupedTransactions).sort((a, b) => new Date(b) - new Date(a));

    // FORMATEAR FECHAS PARA EL TITULO
    const formatDate = (dateString) => {
        const [year, month, day] = dateString.split("-").map(Number);
        const date = new Date(year, month - 1, day);

        if (isNaN(date.getTime())) {
            console.error("Fecha inválida:", dateString);
            return dateString;
        }

        if (language === "eus") {
            const locale = "en-GB";
            const weekday = new Intl.DateTimeFormat(locale, { weekday: "long" }).format(date);
            const month = new Intl.DateTimeFormat(locale, { month: "long" }).format(date);
            const day = new Intl.DateTimeFormat(locale, { day: "numeric" }).format(date);

            let formattedDate = `${month} ${day}, ${weekday}`;

            Object.keys(t.dateTranslations).forEach(engWord => {
                const eusWord = t.dateTranslations[engWord];
                formattedDate = formattedDate.replace(engWord, eusWord);
            });

            return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
        }

        if (language === "es") {
            const locale = "es-ES";
            const weekday = new Intl.DateTimeFormat(locale, { weekday: "long" }).format(date);
            const month = new Intl.DateTimeFormat(locale, { month: "long" }).format(date);
            const day = new Intl.DateTimeFormat(locale, { day: "numeric" }).format(date);

            return `${weekday.charAt(0).toUpperCase() + weekday.slice(1)}, ${day} de ${month}`;
        }

        return dateString;
    };

    return (
        <div className="transaction-list-container">
            {sortedDates.map((fecha) => (
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
                                            src="/isotipo.png"
                                            alt={transaction.usuario_asociado || transaction.movimiento}
                                            className="transaction-item-image"
                                        />
                                        <div className="transaction-item-name-container">
                                            <p className="transaction-item-name">{transaction.usuario_asociado || transaction.movimiento}</p>
                                        </div>
                                    </div>
                                    <div className="transaction-item-amounts-container">
                                        <p className={`transaction-item-amount ${transaction.cantidad < 0 ? 'negative' : 'positive'}`}>
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
    );
};

export default TransactionList;