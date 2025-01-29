import jwt from "jsonwebtoken";
import { ERRORS } from "./customErrors.js";
function checkAuthorization(req, res, next) {
    try {
        const token = req.cookies?.["authToken"];
        if (!token) {
            return res
                .status(ERRORS.MISSING_TOKEN.statusCode)
                .json({ message: ERRORS.MISSING_TOKEN.message });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error(error);
        if (error.name === "TokenExpiredError") {
            return res
                .status(ERRORS.TOKEN_EXPIRED.statusCode)
                .json({ message: ERRORS.TOKEN_EXPIRED.message });
        }
        if (error.name === "JsonWebTokenError") {
            return res
                .status(ERRORS.INVALID_TOKEN.statusCode)
                .json({ message: ERRORS.INVALID_TOKEN.message });
        }
        return res
            .status(ERRORS.INTERNAL_SERVER_ERROR.statusCode)
            .json({ message: ERRORS.INTERNAL_SERVER_ERROR.message });
    }
}

function checkRole(role) {
    return (req, res, next) => {
        if (!req.user || req.user.role !== role) {
            return res
                .status(ERRORS.ACCESS_DENIED.statusCode)
                .json({ message: ERRORS.ACCESS_DENIED.message });
        }
        next();
    };
}

function requestLogger(req, res, next) {
    const date = new Date();
    date.setHours(date.getHours() + 1);
    console.log(`[${date.toLocaleString()}] ${req.method} ${req.url}`);
    next();
}

export { checkAuthorization, checkRole, requestLogger };
