import jwt from "jsonwebtoken";

function checkAuthorization(req, res, next) {
    try {
        const token = req.cookies?.["auth-cookie"];
        if (!token) {
            return res.status(401).json({ message: "No autorizado" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        const userIdFromParams = req.params.userId;
        if (userIdFromParams && userIdFromParams !== decoded.userId) {
            return res.status(403).json({ message: "No tienes permisos" });
        }
        next();
    } catch (error) {
        console.error(error);
        if (error.name === "TokenExpiredError") {
            return res
                .status(401)
                .json({ message: "Token expirado. Inicia sesión de nuevo." });
        }
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Token inválido." });
        }
        return res.status(500).json({ message: "Error interno del servidor." });
    }
}

export { checkAuthorization };
