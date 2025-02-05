import { useState, useEffect } from "react";
import { useLanguage } from "../../contexts/LanguageContext.jsx";
import { getUserInfo } from "../../api/realData";
import Layout from "../layout/Layout";
import { Eye, EyeOff } from "lucide-react";
import "./UserPage.css";

const UserPage = () => {
    const { t } = useLanguage();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [apiData, setApiData] = useState([]);
    const [showIban, setShowIban] = useState(false);
    const [showPhone, setShowPhone] = useState(false);
    const [showAddress, setShowAddress] = useState(false);

    const loadApiData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await getUserInfo();
            setApiData(data);
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

    return (
        <>
            {error && <div className="error-message">{error}</div>}

            {isLoading ? (
                <div className="loading-message">Cargando datos...</div>
            ) : (
                <div className="user-profile-container">
                    <div className="user-profile-header">
                        <img src="/logo_uno.png" alt="Foto de perfil" />
                    </div>
                    <div className="user-profile-info">
                        <div className="info-group">
                            <span className="info-label">{t.username}:</span>
                            <span className="info-value">{apiData.nombre_usuario}</span>
                        </div>

                        <div className="info-group">
                            <span className="info-label">{t.phone}:</span>
                            <span className="info-value">
                                {showPhone ? apiData.telefono : `${apiData.telefono?.slice(0, 3)}*** *** ***`}
                            </span>
                            <button onClick={() => setShowPhone(!showPhone)} className="toggle-button">
                                {showPhone ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>

                        <div className="info-group">
                            <span className="info-label">{t.email}:</span>
                            <span className="info-value">{apiData.email}</span>
                        </div>

                        <div className="info-group">
                            <span className="info-label">{t.address}:</span>
                            <span className="info-value">
                                {showAddress ? apiData.direccion : `***************${apiData.direccion?.slice(15)}`}
                            </span>
                            <button onClick={() => setShowAddress(!showAddress)} className="toggle-button">
                                {showAddress ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>

                        <div className="info-group">
                            <span className="info-label">{t.birthdate}:</span>
                            <span className="info-value">{apiData.fecha_nacimiento}</span>
                        </div>

                        <div className="info-group">
                            <span className="info-label">{t.job}:</span>
                            <span className="info-value">{apiData.ocupacion}</span>
                        </div>

                        <div className="info-group">
                            <span className="info-label">{t.iban}:</span>
                            <span className="info-value">
                                {showIban ? apiData.iban : `${apiData.iban?.slice(0, 3)}****************`}
                            </span>
                            <button onClick={() => setShowIban(!showIban)} className="toggle-button">
                                {showIban ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>

                        <div className="info-group">
                            <span className="info-label">{t.capital}:</span>
                            <span className="info-value">{apiData.capital_social_abonado === "Sí" ? t.yes : t.no}</span>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default UserPage;
