import userController from "./userController.js";
import { ERRORS } from "../helpers/customErrors.js";

async function getAll(req, res) {
    try {
        const users = await userController.getAll();
        const safeUsers = users.map((user) => {
            return {
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
            };
        });
        return res
            .status(safeUsers.length > 0 ? 200 : 204)
            .json({ message: "Usuarios encontrados", users: safeUsers });
    } catch (error) {
        console.error("Error al obtener los usuarios:", error);
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
async function getById(req, res) {
    try {
        const user = await userController.getById(req.params.userId);
        if (!user) {
            throw ERRORS.USER_NOT_FOUND;
        }
        const safeUser = {
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
        };
        return res
            .status(200)
            .json({ message: "Usuario encontrado", user: safeUser });
    } catch (error) {
        console.error("Error al obtener el usuario:", error);
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
async function checkPassword(req, res) {
    try {
        const isCorrectPassword = await userController.checkCurrentPassword(
            req.user.userId,
            req.body.password
        );
        if (!isCorrectPassword) {
            return res
                .status(ERRORS.INVALID_PASSWORD.statusCode)
                .json({ message: ERRORS.INVALID_PASSWORD.message });
        }
        return res.status(200).json({ message: "Contraseña correcta" });
    } catch (error) {}
}
async function changePassword(req, res) {
    try {
        const updatedUser = await userController.changePassword(
            req.user.userId,
            req.body.password,
            req.body.passwordRepeat
        );
        return res
            .status(200)
            .json({ message: "Contraseña actualizada correctamente" });
    } catch (error) {
        console.error("Error al actualizar la contraseña:", error);
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
export default { getAll, getById, checkPassword, changePassword };
