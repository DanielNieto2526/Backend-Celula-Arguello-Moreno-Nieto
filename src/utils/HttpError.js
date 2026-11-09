/**
 * Clase personalizada para manejo uniforme de errores HTTP en la API.
 */
class HttpError extends Error {
    constructor(statusCode, message, errores = []) {
        super(message);
        this.statusCode = statusCode;
        this.mensaje = message;
        this.errores = Array.isArray(errores) ? errores : [errores];
    }
}

module.exports = HttpError;
