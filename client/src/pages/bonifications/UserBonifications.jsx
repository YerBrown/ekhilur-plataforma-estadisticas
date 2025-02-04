import { useState, useEffect } from "react";
import { useLanguage } from "../../contexts/LanguageContext.jsx";
import Layout from "../layout/Layout";
import "./UserBonifications.css";
import BarChartComponent from "../../components/charts/BarChart";
import DateFilter from "../../components/DateFilter/DateFilter";
import mockData  from "../../components/transactions-list/mockData.js";
import { getCashbackGeneratedByTypeMonthAndYear } from "../../api/realData";
import TransactionList from "../../components/transactions-list/TransactionsList";


const UserBonifications = () => {
    const { t } = useLanguage();
    const [selectedPeriod, setSelectedPeriod] = useState(null);
    const [bonifications, setBonifications] = useState({
        totalBonifications: 0,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [apiData, setApiData] = useState(null);
    const [transactions, setTransactions] = useState(null);

    const loadApiData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            // 1. Obtener datos de la API
            const data = await getCashbackGeneratedByTypeMonthAndYear();

            // 2. Transformar los datos al formato que espera el BarChart
            const transformedData = data.map(item => ({
                año: item.anio,                         // Mantener año
                mes: item.mes,                          // Mantener mes
                income: Number(item.total_cantidad),    // Poner total_cantidad como income
                expenses: 0                             // Poner expenses a 0 (no lo usamos)
            }));

            // 3. Guardar los datos transformados
            setApiData(transformedData);
            const transactionsData = data.map(item => ({
                fecha: `${item.anio}-${item.mes}-01`,
                movimiento: item.Movimiento,
                cantidad: item.total_cantidad,
            }));
            setTransactions(transactionsData);

            // 4. Si hay un período seleccionado, actualizar las bonificaciones
            if (selectedPeriod) {
                updateBonifications(transformedData, selectedPeriod);
            }
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

    const updateBonifications = (data, period) => {
        if (!data) return;

        const { year, month } = period;
        // Buscar los datos para el mes seleccionado
        const monthData = data.find(item =>
            item.año === year.toString() &&
            parseInt(item.mes, 10) === month + 1
        );

        // Actualizar el total de bonificaciones
        if (monthData) {
            setBonifications({
                totalBonifications: monthData.income
            });
        } else {
            setBonifications({
                totalBonifications: 0
            });
        }
    };

    const formatCurrency = (value) => {
        const num = Number(value);
        if (isNaN(num)) return '0€';
        return Number.isInteger(num) ? `${num}€` : `${num.toFixed(1)}€`;
    };

    const handleDateFilter = ({ year, month }) => {
        setSelectedPeriod({ year, month });
        if (apiData) {
            updateBonifications(apiData, { year, month });
        }
    };

    return (
        <div className="bonifications-page">
            <Layout title={t.bonificationTitle}>
                <div className="container-date-filter">
                    <DateFilter onDateFilter={handleDateFilter} />
                </div>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                {isLoading ? (
                    <div className="loading-message">
                        Cargando datos...
                    </div>
                ) : (
                    <>
                        <div className="container-ingresos-gastos">
                            <div className="item-ingresos-gastos">
                                <p className="label-ingresos">{t.received}</p>
                                <span className="amount-ingresos">
                                    {formatCurrency(bonifications.totalBonifications)}
                                </span>
                            </div>
                        </div>
                        <div className="chart-section">
                            <BarChartComponent
                                selectedPeriod={selectedPeriod}
                                dataBars={apiData || []}
                            />
                        </div>
                        <TransactionList transactions={mockData} />
                    </>
                )}
            </Layout>
        </div>
    );
};

export default UserBonifications;