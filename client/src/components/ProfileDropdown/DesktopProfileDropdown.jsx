import { useState } from "react";
import { useLanguage } from "../../contexts/LanguageContext.jsx";
import { Eye, EyeOff } from "lucide-react";
//import "./DesktopProfileDropdown.css"; // Estilos específicos para este componente

const DesktopProfileDropdown = ({ userData }) => {
    const { t } = useLanguage();
    const [showIban, setShowIban] = useState(false);
    const [showPhone, setShowPhone] = useState(false);
    const [showAddress, setShowAddress] = useState(false);

    return (
        <div className="desktop-profile-dropdown">
            <div className="user-profile-info">
                <div className="info-group">
                    <span className="info-label">{t.username}:</span>
                    <span className="info-value">{userData.nombre_usuario}</span>
                </div>

                <div className="info-group">
                    <span className="info-label">{t.phone}:</span>
                    <span className="info-value">
                        {showPhone ? userData.telefono : `${userData.telefono?.slice(0, 3)}*** *** ***`}
                    </span>
                    <button onClick={() => setShowPhone(!showPhone)} className="toggle-button">
                        {showPhone ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                </div>

                <div className="info-group">
                    <span className="info-label">{t.email}:</span>
                    <span className="info-value">{userData.email}</span>
                </div>

                <div className="info-group">
                    <span className="info-label">{t.address}:</span>
                    <span className="info-value">
                        {showAddress ? userData.direccion : `***************${userData.direccion?.slice(15)}`}
                    </span>
                    <button onClick={() => setShowAddress(!showAddress)} className="toggle-button">
                        {showAddress ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                </div>

                <div className="info-group">
                    <span className="info-label">{t.iban}:</span>
                    <span className="info-value">
                        {showIban ? userData.iban : `${userData.iban?.slice(0, 3)}*****************`}
                    </span>
                    <button onClick={() => setShowIban(!showIban)} className="toggle-button">
                        {showIban ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                </div>
            </div>

            <button className="logout-button">{t.logout}</button>
        </div>
    );
};

export default DesktopProfileDropdown;