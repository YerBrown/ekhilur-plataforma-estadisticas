import { useState, useEffect } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import Layout from "../layout/Layout.jsx";
import "./CommerceBonifications.css";
import GraficoLibrerias from "../../components/charts/BarChartNew";
import DateFilter from "../../components/DateFilter/DateFilter.jsx";
import { getCashbacksByMonth } from "../../api/realData.js";
import BonificationsFilter from "../../components/buttons/bonifications-filter/BonificationsFilter.jsx";
import TransactionList from "../../components/transactions-list/TransactionsList";
import mockData from "../../api/mockDataBonificationCommerce.js";

const CommerceBonifications = () => {
    const { t } = useLanguage();
    const [selectedPeriod, setSelectedPeriod] = useState({
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
    });
    const [bonifications, setBonifications] = useState({
        totalRecibidos: 0,
        totalEmitidos: 0,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [apiData, setApiData] = useState([
        { año: "2022", mes: "11", valor: 100, otroValor: 80 },
        { año: "2022", mes: "12", valor: 150, otroValor: 120 },
        { año: "2023", mes: "01", valor: 200, otroValor: 180 },
        { año: "2023", mes: "02", valor: 250, otroValor: 220 },
        { año: "2023", mes: "03", valor: 300, otroValor: 270 },
        { año: "2024", mes: "12", valor: 150, otroValor: 120 },
        { año: "2024", mes: "01", valor: 200, otroValor: 180 },
        { año: "2024", mes: "02", valor: 250, otroValor: 220 },
        { año: "2024", mes: "03", valor: 300, otroValor: 270 },
    ]);
    const [filteredTransactions, setFilteredTransactions] = useState(mockData);

    useEffect(() => {
        // Filtrar las transacciones basadas en el periodo seleccionado
        const filteredData = mockData.filter((transaction) => {
            const transactionYear = parseInt(transaction.año, 10);
            const transactionMonth = parseInt(transaction.mes, 10);

            return (
                transactionYear === selectedPeriod.year &&
                transactionMonth === selectedPeriod.month + 1
            );
        });

        setFilteredTransactions(filteredData);
    }, [selectedPeriod]);

    const loadApiData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await getCashbacksByMonth();
            console.log("Hola", data);
            setApiData(data);

            if (selectedPeriod) {
                updateBonifications(data, selectedPeriod);
            }
        } catch (error) {
            console.error("Error al cargar datos:", error);
            setError(
                "No se pudieron cargar los datos. Por favor, intente más tarde."
            );
            setError(
                "No se pudieron cargar los datos. Por favor, intente más tarde."
            );
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadApiData();
    }, []);

    const updateBonifications = (data, period) => {
        if (!data) return;

        const { year, month } = period;
        const monthData = data.find(
            (item) =>
                item.año === year.toString() &&
                parseInt(item.mes, 10) === month + 1
        );

        // Actualizar el total de bonificaciones
        if (monthData) {
            setBonifications({
                totalRecibidos: Number(monthData.bonificaciones_recibidas),
                totalEmitidos: Number(monthData.bonificaciones_emitidas),
            });
        } else {
            setBonifications({
                totalRecibidos: 0,
                totalEmitidos: 0,
            });
        }
    };
    const formatCurrency = (value) => {
        const num = Number(value);
        if (isNaN(num)) return "0€";
        return Number.isInteger(num) ? `${num}€` : `${num.toFixed(1)}€`;
    };

    const handleDateFilter = ({ year, month }) => {
        setSelectedPeriod({ year, month });
        if (apiData) {
            updateBonifications(apiData, { year, month });
        }
    };

    const handleFilterChange = (filter) => {
        if (filter === t.all) {
            setFilteredTransactions(mockData);
        } else if (filter === t.received) {
            setFilteredTransactions(
                mockData.filter(
                    (transaction) =>
                        !transaction.cantidad.toString().includes("-")
                )
            );
        } else if (filter === t.emmited) {
            setFilteredTransactions(
                mockData.filter((transaction) =>
                    transaction.cantidad.toString().includes("-")
                )
            );
        }
    };

    return (
        <Layout title={t.bonificationTitle}>
            <DateFilter onDateFilter={handleDateFilter} />

            {error && <div className="error-message">{error}</div>}

            {isLoading ? (
                <div className="loading-message">Cargando datos...</div>
            ) : (
                <div className="bonifications-content-container">
                    <div className="container-recibidos-emitidos">
                        <div className="item-recibidos-emitidos">
                            <p className="label-recibidos">{t.received}</p>
                            <span className="amount-recibidos">
                                {formatCurrency(bonifications.totalRecibidos)}
                            </span>
                        </div>
                        <div className="item-recibidos-emitidos">
                            <p className="label-emitidos">{t.emmited}</p>
                            <span className="amount-emitidos">
                                {formatCurrency(bonifications.totalEmitidos)}
                            </span>
                        </div>
                    </div>
                    <div className="chart-container">
                        <GraficoLibrerias
                            data={apiData}
                            targetYear={selectedPeriod.year}
                            targetMonth={selectedPeriod.month}
                            primaryKey={"bonificaciones_recibidas"}
                            secondaryKey={"bonificaciones_emitidas"}
                            showFilters={true}
                        />
                    </div>
                    <BonificationsFilter onFilterChange={handleFilterChange} />
                    <TransactionList transactions={filteredTransactions} />
                </div>
            )}
        </Layout>
    );
};

export default CommerceBonifications;
