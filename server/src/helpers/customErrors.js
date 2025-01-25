class CustomError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

const ERRORS = {
    // SERVER
    INTERNAL_SERVER_ERROR: new CustomError("Error interno del servidor", 500),
    // USER
    USER_NOT_FOUND: new CustomError("Usuario no encontrado", 404),
    USERNAME_ALREADY_EXISTS: new CustomError(
        "El nombre de usuario ya está registrado",
        409
    ),
    EMAIL_ALREADY_EXISTS: new CustomError("El email ya está registrado", 409),

    // AUTHENTICATION
    INVALID_CREDENTIALS: new CustomError("Credenciales inválidas", 401),
    PASSWORDS_MISMATCH: new CustomError("Las contraseñas no coinciden", 400),
    CREDENTIALS_NOT_COMPLETE: new CustomError(
        "Se requiere username o email, y contraseña",
        400
    ),
    // VALIDATION
    INVALID_EMAIL_FORMAT: new CustomError(
        "El correo electrónico no tiene un formato válido",
        400
    ),
    INVALID_PASSWORD_FORMAT: new CustomError(
        "La contraseña debe tener entre 8 y 20 caracteres, incluir letras mayúsculas, minúsculas, un número y un carácter especial",
        400
    ),
};

function createCustomError(message, statusCode) {
    return new CustomError(message, statusCode);
}

export { ERRORS, createCustomError, CustomError };
