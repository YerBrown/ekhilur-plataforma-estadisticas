import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import TaskAltRoundedIcon from "@mui/icons-material/TaskAltRounded";
import PanoramaFishEyeRoundedIcon from "@mui/icons-material/PanoramaFishEyeRounded";
import { register, login } from "../../api/auth";
import PasswordInput from "../../components/inputs/PasswordInput";
import CryptoJS from "crypto-js";
import { AuthContext } from "../../contexts/AuthContext";
import "./Authentication.css";
const Authentication = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [animating, setAnimating] = useState(false);

    const handleToggle = () => {
        setAnimating(true);
        setTimeout(() => {
            setIsLogin(!isLogin); // Cambia el contenido después de la animación de salida
            setAnimating(false); // Restaura el estado de animación
        }, 200);
    };

    return (
        <main className="login-page">
            <div className="mobile-login">
                <h2 className="logo-login">ekhidata</h2>
                <LoginForm />
            </div>
            <div className="desktop-login">
                <div className="left-side">
                    <h2 className="logo-login">ekhidata</h2>
                </div>
                <div className="right-side">
                    <LoginForm />
                </div>
            </div>
        </main>
    );
};

const LoginForm = () => {
    const [responseMessage, setResponseMessage] = useState(null);
    const navigate = useNavigate();
    const { loginUser } = useContext(AuthContext);

    const handleLogin = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const formValues = Object.fromEntries(formData.entries());
        const hashedPassword = CryptoJS.SHA256(formValues.password).toString();
        try {
            const response = await login({
                usernameOrEmail: formValues.usernameOrEmail,
                password: hashedPassword,
            });
            loginUser({
                username: response.username,
                role: response.role,
            });
            setResponseMessage({
                message: response.message,
                status: "success",
            });
            setTimeout(() => {
                navigate("/");
            }, 500);
        } catch (error) {
            console.error("Error al iniciar sesión:", error.message);
            setResponseMessage({ message: error.message, status: "failed" });
        }
    };
    return (
        <form className="login-form" onSubmit={handleLogin}>
            <input
                type="text"
                placeholder="Nombre de usuario"
                name="usernameOrEmail"
            />
            <PasswordInput name="password" placeholder="Contraseña" />
            {responseMessage && (
                <p className={`message ${responseMessage.status}`}>
                    {responseMessage.message}
                </p>
            )}
            <button className="main-button" type="submit">
                Iniciar Sesión
            </button>
        </form>
    );
};

export default Authentication;
