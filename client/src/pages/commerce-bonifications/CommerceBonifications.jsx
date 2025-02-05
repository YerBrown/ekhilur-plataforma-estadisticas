import { useState, useEffect } from "react";
import Layout from "../layout/Layout.jsx";
import "./CommerceBonifications.css";
import BarChartComponent from "../../components/charts/BarChart.jsx";
import DateFilter from "../../components/DateFilter/DateFilter.jsx";
import { getCashbackGeneratedByMonth } from "../../api/realData.js";
import { useLanguage } from "../../contexts/LanguageContext.jsx";
import BonificationsFilter from "../../components/buttons/bonifications-filter/BonificationsFilter.jsx";
import TransactionList from "../../components/transactions-list/TransactionsList";
import mockData from "../../components/transactions-list/mockData.js";

const CommerceBonifications = () => {
    const { t } = useLanguage();
    const [selectedPeriod, setSelectedPeriod] = useState(null);
    const [bonifications, setBonifications] = useState({
        totalRecibidos: 0,
        totalEmitidos: 0,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [apiData, setApiData] = useState(null);
    const [transactions, setTransactions] = useState(null);
    const [filteredTransactions, setFilteredTransactions] = useState(mockData);

    // Función para cargar los datos de la API
    const loadApiData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            // 1. Obtener datos de la API
            const data = await getCashbackGeneratedByMonth();

            // 2. Transformar los datos al formato que espera el BarChart
            const transformedData = data.map((item) => ({
                año: item.anio, // Mantener año
                mes: item.mes, // Mantener mes
                income: Number(item.total_cashback_recibido), // Poner total_cantidad como income
                expenses: Number(item.total_cashback_emitido), // Poner expenses a 0 (no lo usamos)
            }));

            // 3. Guardar los datos transformados
            setApiData(transformedData);
            /* const transactionsData = data.map(item => ({
                fecha: `${item.anio}-${item.mes}-01`,
                movimiento: item.Movimiento,
                cantidad: item.total_cantidad,
            }));
            setTransactions(transactionsData); */

            // 4. Si hay un período seleccionado, actualizar las bonificaciones
            if (selectedPeriod) {
                updateBonifications(transformedData, selectedPeriod);
            }
        } catch (error) {
            console.error("Error al cargar datos:", error);
            setError(
                "No se pudieron cargar los datos. Por favor, intente más tarde."
            );
        } finally {
            setIsLoading(false);
        }
    };

    // Cargar datos cuando el componente se monta
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
                totalRecibidos: monthData.incomes,
                totalEmitidos: monthData.expenses,
            });
        } else {
            setBonifications({
                totalRecibidos: 0,
                totalEmitidos: 0,
            });
        }
    };

    // Función para formatear números
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
            <div className="container-date-filter">
                <DateFilter onDateFilter={handleDateFilter} />
            </div>

            {error && <div className="error-message">{error}</div>}

            {isLoading ? (
                <div className="loading-message">Cargando datos...</div>
            ) : (
                <>
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
                    <div className="chart-section">
                        <BarChartComponent
                            selectedPeriod={selectedPeriod}
                            dataBars={apiData || []}
                        />
                    </div>
                    <BonificationsFilter onFilterChange={handleFilterChange} />
                    <TransactionList transactions={filteredTransactions} />
                </>
            )}
        </Layout>
    );
};

export default CommerceBonifications;
