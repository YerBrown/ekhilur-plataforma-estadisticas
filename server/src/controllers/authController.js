import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import userController from "./userController.js";
import { ERRORS } from "../helpers/customErrors.js";

async function register(username, email, password, passwordRepeat) {
    // Validar input
    if (password !== passwordRepeat) {
        throw ERRORS.PASSWORDS_MISMATCH;
    }

    // Crear nuevo usuario
    const newUser = await userController.create(username, email, password);

    // Generar token
    const token = jwt.sign(
        {
            userId: newUser._id,
            username: newUser.username,
            email: newUser.email,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );
    return token;
}

async function login(usernameOrEmail, password) {
    // Validar que los campos requeridos están presentes
    if (!usernameOrEmail || !password) {
        throw ERRORS.CREDENTIALS_NOT_COMPLETE;
    }

    // Buscar al usuario por username o email
    const user = await User.findOne({
        $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    });

    // Si no se encuentra al usuario
    if (!user) {
        throw ERRORS.INVALID_CREDENTIALS;
    }

    // Comparar la contraseña
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        throw ERRORS.INVALID_CREDENTIALS;
    }

    const token = jwt.sign(
        { userId: user._id, username: user.username, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );

    return token;
}

async function verifyToken(token) {
    try {
        if (!token) {
            throw ERRORS.UNAUTHENTICATED;
        }
        const user = jwt.verify(token, process.env.JWT_SECRET);
        return user;
    } catch (error) {
        // Manejar errores específicos de JWT
        if (error.name === "TokenExpiredError") {
            throw ERRORS.TOKEN_EXPIRED;
        } else if (error.name === "JsonWebTokenError") {
            throw ERRORS.INVALID_TOKEN;
        } else {
            throw ERRORS.INTERNAL_SERVER_ERROR;
        }
    }
}

export default { register, login, verifyToken };
