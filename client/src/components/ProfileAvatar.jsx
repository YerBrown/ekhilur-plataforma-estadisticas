import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext.jsx";
import { logout } from "../api/auth";
import { AuthContext } from "../contexts/AuthContext";
import { FaUser } from "react-icons/fa6";
import "./ProfileAvatar.css";
import { useState, useEffect, useRef, useContext } from "react";

const ProfileAvatar = () => {
    const { t } = useLanguage();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();
    const modalRef = useRef(null);
    const { logoutUser } = useContext(AuthContext);

    const handleLogout = async () => {
        await logout();
        await logoutUser();
        navigate("/authentication"); // Redirige al login después de cerrar sesión
    };
    const handleOpenModal = () => {
        setIsModalOpen((prev) => !prev);
    };

    const handleClickOutside = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
            setIsModalOpen(false);
        }
    };

    useEffect(() => {
        if (isModalOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isModalOpen]);

    return (
        <>
            <button className="user-avatar" onClick={handleOpenModal}>
                {/* <img src="" alt="User Profile Avatar" /> */}
                <FaUser size={30} />
            </button>
            <div ref={modalRef} className={`logout-modal ${isModalOpen ? "active" : ""}`}>
                <button onClick={handleLogout}>{t.logout}</button>
                
                <button onClick={() => navigate("/user")}>{t.viewProfile}</button>
            </div>
        </>
    );
};

export default ProfileAvatar;
