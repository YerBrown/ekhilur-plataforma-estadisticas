import authController from "./authController.js";
import { ERRORS } from "../helpers/customErrors.js";
async function register(req, res) {
    try {
        const { username, email, password, passwordRepeat } = req.body;
        const token = await authController.register(
            username,
            email,
            password,
            passwordRepeat
        );
        res.cookie("authToken", token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24,
        });

        return res
            .status(201)
            .json({ message: "Usuario registrado correctamente" });
    } catch (error) {
        if (error instanceof Error) {
            return res
                .status(error.statusCode)
                .json({ message: error.message });
        }
        return res
            .status(ERRORS.INTERNAL_SERVER_ERROR.statusCode)
            .json({ message: ERRORS.INTERNAL_SERVER_ERROR.message });
    }
}

async function login(req, res) {
    try {
        const { usernameOrEmail, password } = req.body;
        const token = await authController.login(usernameOrEmail, password);
        res.cookie("authToken", token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24,
        });

        return res
            .status(200)
            .json({ message: "Sesión iniciada correctamente" });
    } catch (error) {
        if (error instanceof Error) {
            return res
                .status(error.statusCode)
                .json({ message: error.message });
        }
        return res
            .status(ERRORS.INTERNAL_SERVER_ERROR.statusCode)
            .json({ message: ERRORS.INTERNAL_SERVER_ERROR.message });
    }
}

export default { register, login };
