import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { logout } from "../../api/auth";
import "./Navbar.css";
const Navbar = ({ username }) => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/authentication"); // Redirige al login después de cerrar sesión
    };

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <Link to="/home">Home</Link>
                <Link to="/my-profile">My Profile</Link>
            </div>
            <div className="navbar-right">
                <span className="username">{username}</span>
                <button onClick={handleLogout} className="logout-button">
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
