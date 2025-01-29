import { Link, useNavigate } from "react-router-dom";
import { logout } from "../api/auth";
import { FaUserSecret } from "react-icons/fa";
import "./ProfileAvatar.css";
import { useState } from "react";

const ProfileAvatar = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();
    const handleLogout = async () => {
        await logout();
        navigate("/authentication"); // Redirige al login después de cerrar sesión
    };
    const handleOpenModal = () => {
        setIsModalOpen((prev) => !prev);
    };

    return (
        <>
            <button className="user-avatar" onClick={handleOpenModal}>
                {/* <img src="" alt="User Profile Avatar" /> */}
                <FaUserSecret size={24} />
            </button>
            <div className={`logout-modal ${isModalOpen ? "active" : ""}`}>
                <button onClick={handleLogout}>Cerrar Sesion</button>
            </div>
        </>
    );
};

export default ProfileAvatar;
