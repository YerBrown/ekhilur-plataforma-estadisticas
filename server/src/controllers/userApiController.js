import userController from "./userController.js";
import { ERRORS } from "../helpers/customErrors.js";

async function getAll(req, res) {
    try {
        const users = await userController.getAll();
        return res.status(201).json({ message: "Usuarios encontrados", users });
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
export default { getAll };
