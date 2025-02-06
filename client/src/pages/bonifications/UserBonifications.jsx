import { useState, useEffect } from "react";
import { useLanguage } from "../../contexts/LanguageContext.jsx";
import Layout from "../layout/Layout";
import "./UserBonifications.css";
import GraficoLibrerias from "../../components/charts/BarChartNew";
import DateFilter from "../../components/DateFilter/DateFilter";
import { getCashbackGeneratedByMonth } from "../../api/realData";
import TransactionList from "../../components/transactions-list/TransactionsList";
import mockData from "../../api/mockDataUser.js";

const UserBonifications = () => {
    const { t } = useLanguage();
    const [selectedPeriod, setSelectedPeriod] = useState({
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
    });
    const [bonifications, setBonifications] = useState({
        totalBonifications: 0,
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
            const data = await getCashbackGeneratedByMonth();
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
        // Buscar los datos para el mes seleccionado
        const monthData = data.find(
            (item) =>
                item.año === year.toString() &&
                parseInt(item.mes, 10) === month + 1
        );

        // Actualizar el total de bonificaciones
        if (monthData) {
            setBonifications({
                totalBonifications: Number(monthData.bonificaciones),
            });
        } else {
            setBonifications({
                totalBonifications: 0,
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

    return (
        <Layout title={t.bonificationTitle}>
            <div className="bonifications-content-container">
                <DateFilter onDateFilter={handleDateFilter} />

                {error && <div className="error-message">{error}</div>}

                {isLoading ? (
                    <div className="loading-message">Cargando datos...</div>
                ) : (
                    <>
                        <div className="container-ingresos-gastos">
                            <div className="item-ingresos-gastos">
                                <p className="label-ingresos">{t.received}</p>
                                <span className="amount-ingresos">
                                    {formatCurrency(
                                        bonifications.totalBonifications
                                    )}
                                </span>
                            </div>
                        </div>
                        <div className="chart-container">
                            <GraficoLibrerias
                                data={apiData}
                                targetYear={selectedPeriod.year}
                                targetMonth={selectedPeriod.month}
                                primaryKey={"bonificaciones"}
                                secondaryKey={null}
                                showFilters={true}
                            />
                        </div>
                        <TransactionList transactions={filteredTransactions} />
                    </>
                )}
            </div>
        </Layout>
    );
};

export default UserBonifications;
