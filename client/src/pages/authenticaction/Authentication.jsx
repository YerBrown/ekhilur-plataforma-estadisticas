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
        <main>
            <div
                className={`auth-window ${isLogin ? "login" : "register"} ${
                    animating ? "fade-out" : "fade-in"
                }`}
            >
                <header>
                    <h3>{isLogin ? "Iniciar Sesión" : "Registrarse"}</h3>
                </header>
                <div className={"form-container"}>
                    {isLogin ? <LoginForm /> : <RegisterForm />}
                    <div className="change-form">
                        <button variant="link" onClick={handleToggle}>
                            {isLogin
                                ? "¿No tienes cuenta? Regístrate"
                                : "Volver a Iniciar Sesión"}
                        </button>
                    </div>
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
            console.log("Respuesta del backend:", response);
            
            loginUser({
                username: response.username,
                role: response.role,
            });

            setResponseMessage({
                message: response.message,
                status: "success",
            });
            setTimeout(() => {
                navigate("/home");
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

const RegisterForm = () => {
    const [responseMessage, setResponseMessage] = useState(null);
    const [password, setPassword] = useState("");
    const [conditions, setConditions] = useState({
        minLength: false,
        hasUpperAndLower: false,
        hasNumber: false,
        hasSpecialChar: false,
    });
    const navigate = useNavigate();
    const handleRegister = async (e) => {
        e.preventDefault();

        const allConditionsMet = Object.values(conditions).every(
            (condition) => condition
        );
        if (/\s/.test(password)) {
            setResponseMessage({
                message: "La contraseña no debe contener espacios.",
                status: "failed",
            });
            return;
        }
        if (!allConditionsMet) {
            setResponseMessage({
                message: "La contraseña no cumple con todos los requisitos.",
                status: "failed",
            });
            return;
        }

        const formData = new FormData(e.target);
        const formValues = Object.fromEntries(formData.entries());
        const hashedPassword = CryptoJS.SHA256(formValues.password).toString();
        const hashedPasswordRepeat = CryptoJS.SHA256(
            formValues.passwordRepeat
        ).toString();
        formValues.password = hashedPassword;
        formValues.passwordRepeat = hashedPasswordRepeat;
        try {
            const response = await register(formValues);
            console.log("Registro exitoso:", response);
            setResponseMessage({
                message: response.message,
                status: "success",
            });
            setTimeout(() => {
                navigate("/");
            }, 500);
        } catch (error) {
            console.error("Error al registrarse:", error.message);
            setResponseMessage({ message: error.message, status: "failed" });
        }
    };
    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        validatePassword(newPassword);
    };
    const validatePassword = (password) => {
        const newConditions = {
            minLength: password.length >= 8,
            hasUpperAndLower: /[A-Z]/.test(password) && /[a-z]/.test(password),
            hasNumber: /\d/.test(password),
            hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
        };
        setConditions(newConditions);
    };
    return (
        <form className="register-form" onSubmit={handleRegister}>
            <input
                type="text"
                name="username"
                placeholder="Nombre de usuario"
                required={true}
            />
            <input
                type="email"
                name="email"
                placeholder="Correo electrónico"
                required={true}
            />
            <div className="password-data">
                <p className="checker">
                    {conditions.minLength ? (
                        <TaskAltRoundedIcon fontSize="small" />
                    ) : (
                        <PanoramaFishEyeRoundedIcon fontSize="small" />
                    )}
                    Minimo 8 caracteres
                </p>
                <p className="checker">
                    {conditions.hasUpperAndLower ? (
                        <TaskAltRoundedIcon fontSize="small" />
                    ) : (
                        <PanoramaFishEyeRoundedIcon fontSize="small" />
                    )}
                    Mayusculas y minusculas
                </p>
                <p className="checker">
                    {conditions.hasNumber ? (
                        <TaskAltRoundedIcon fontSize="small" />
                    ) : (
                        <PanoramaFishEyeRoundedIcon fontSize="small" />
                    )}
                    Numeros
                </p>
                <p className="checker">
                    {conditions.hasSpecialChar ? (
                        <TaskAltRoundedIcon fontSize="small" />
                    ) : (
                        <PanoramaFishEyeRoundedIcon fontSize="small" />
                    )}
                    Caracteres especiales
                </p>
                <PasswordInput
                    name="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={handlePasswordChange}
                    required={true}
                />
            </div>
            <PasswordInput
                placeholder="Repetir Contraseña"
                name="passwordRepeat"
                required={true}
            />
            {responseMessage && (
                <p className={`message ${responseMessage.status}`}>
                    {responseMessage.message}
                </p>
            )}
            <button className="main-button" type="submit">
                Registrarse
            </button>
        </form>
    );
};

export default Authentication;
