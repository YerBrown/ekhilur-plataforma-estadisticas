import { useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext.jsx";
import { logout } from "../api/auth";
import { AuthContext } from "../contexts/AuthContext";
import { FaUser } from "react-icons/fa6";
import "./ProfileAvatar.css";
import { useState, useEffect, useRef, useContext } from "react";

const ProfileAvatar = () => {
    const { t, setSpanish, setBasque } = useLanguage();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();
    const modalRef = useRef(null);
    const { logoutUser } = useContext(AuthContext);

    const handleLogout = async () => {
        await logout();
        await logoutUser();
        navigate("/authentication");
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
                <FaUser size={30} />
            </button>
            <div ref={modalRef} className={`logout-modal ${isModalOpen ? "active" : ""}`}>
                <div className="language-selector">
                    <button onClick={setSpanish}>ES</button>
                    <button onClick={setBasque}>EU</button>
                </div>
                <button onClick={() => navigate("/user")}>{t.viewProfile}</button>
                <button onClick={handleLogout}>{t.logout}</button>
            </div>
        </>
    );
};

export default ProfileAvatar;