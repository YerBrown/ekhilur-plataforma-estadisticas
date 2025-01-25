import React, { useState } from "react";
import TaskAltRoundedIcon from "@mui/icons-material/TaskAltRounded";
import PanoramaFishEyeRoundedIcon from "@mui/icons-material/PanoramaFishEyeRounded";
import { register, login } from "../../api/auth";
import "./Authentication.css";
const Authentication = () => {
    const [isLogin, setIsLogin] = useState(true);

    const handleToggle = () => {
        setIsLogin(!isLogin);
    };

    return (
        <main>
            <div className="auth-window">
                <header>
                    <h3>{isLogin ? "Iniciar Sesión" : "Registrarse"}</h3>
                </header>
                <div className="form-container">
                    {isLogin ? <LoginForm /> : <RegisterForm />}
                    <div className="text-center mt-4">
                        <button
                            variant="link"
                            onClick={handleToggle}
                            className="text-blue-600 hover:text-blue-800"
                        >
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
    const [error, setError] = useState(null);
    const handleLogin = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const formValues = Object.fromEntries(formData.entries());
        try {
            const response = await login({
                usernameOrEmail: formValues.usernameOrEmail,
                password: formValues.password,
            });
            console.log("Login exitoso:", response);
        } catch (error) {
            console.error("Error al iniciar sesión:", error.message);
            setError(error.message);
        }
    };
    return (
        <form className="login-form" onSubmit={handleLogin}>
            <input
                type="text"
                placeholder="Nombre de usuario"
                name="usernameOrEmail"
            />
            <input type="password" placeholder="Contraseña" name="password" />
            {error && <p className="error-message">{error}</p>}
            <button type="submit">Iniciar Sesión</button>
        </form>
    );
};

const RegisterForm = () => {
    return (
        <form className="space-y-4">
            <input
                type="text"
                placeholder="Nombre de usuario"
                className="w-full"
            />
            <input
                type="email"
                placeholder="Correo electrónico"
                className="w-full"
            />
            <div className="password-data">
                <p className="checker">
                    <TaskAltRoundedIcon fontSize="small" />
                    Minimo 8 caracteres
                </p>
                <p className="checker">
                    <TaskAltRoundedIcon fontSize="small" />
                    Caracteres especiales
                </p>
                <p className="checker">
                    <TaskAltRoundedIcon fontSize="small" />
                    Mayusculas y minusculas
                </p>
                <p className="checker">
                    <TaskAltRoundedIcon fontSize="small" />
                    Numeros
                </p>
                <input
                    type="password"
                    placeholder="Contraseña"
                    className="w-full"
                />
            </div>
            <input
                type="password"
                placeholder="Repetir Contraseña"
                className="w-full"
            />
            <button className="w-full">Registrarse</button>
        </form>
    );
};

export default Authentication;
