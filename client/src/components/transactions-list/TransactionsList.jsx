import { useLanguage } from "../../contexts/LanguageContext";
import "./TransactionsList.css";

const TransactionList = ({ transactions }) => {
    const { t, language } = useLanguage();

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
        let date;

        // Detectar formato y parsearlo correctamente
        if (dateString.includes("/")) {
            // Formato DD/MM/YYYY
            const [day, month, year] = dateString.split("/").map(Number);
            date = new Date(year, month - 1, day);
        } else if (dateString.includes("-")) {
            // Formato YYYY-MM-DD
            date = new Date(dateString);
        } else {
            return dateString; // En caso de formato inesperado, devolver sin cambios
        }

        // Si el idioma es euskera, usamos inglés y luego reemplazamos los valores
        if (language === "eus") {
            const locale = "en-GB";
            const weekday = new Intl.DateTimeFormat(locale, { weekday: "long" }).format(date);
            const month = new Intl.DateTimeFormat(locale, { month: "long" }).format(date);
            const day = new Intl.DateTimeFormat(locale, { day: "numeric" }).format(date);

            let formattedDate = `${month} ${day}, ${weekday}`; // `Friday, May 27`

            // Reemplazar los nombres de días y meses por sus equivalentes en euskera
            Object.keys(t.dateTranslations).forEach(engWord => {
                const eusWord = t.dateTranslations[engWord];
                formattedDate = formattedDate.replace(engWord, eusWord);
            });

            return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
        }

        // Si el idioma es español, aseguramos el formato correcto: `Viernes, 27 de mayo`
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
                                        <div className="transaction-item-content-container">
                                            <img
                                                src="/isotipo.png"
                                                alt={transaction.usuario_asociado || transaction.movimiento}
                                                className="transaction-item-image"
                                            />
                                            <p className="transaction-item-name">{transaction.usuario_asociado || transaction.movimiento}</p>
                                        </div>
                                    </div>
                                    <div className="transaction-item-amounts-container">
                                        <p className={`transaction-item-amount ${transaction.cantidad.toString().includes('-') ? 'negative' : 'positive'}`}>
                                            {transaction.cantidad} €
                                        </p>
                                        <p className="transaction-item-remaining">{transaction.saldo} €</p>
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