const HttpError = require('../utils/HttpError');

function rutaNoEncontrada(req, res, next) {
    next(new HttpError(404, `La ruta ${req.method} ${req.originalUrl} no fue encontrada en la API`));
}

function manejarErrores(err, req, res, next) {
    let statusCode = err.statusCode || 500;
    let mensaje = err.message || 'Error interno del servidor';
    let errores = err.errores || [];

    if (err instanceof HttpError) {
        statusCode = err.statusCode || 400;
        mensaje = err.mensaje || err.message;
        errores = err.errores || [];
    } else if (err instanceof SyntaxError && 'body' in err) {
        statusCode = 400;
        mensaje = 'Formato JSON inválido en el cuerpo de la petición';
        errores = ['Sintaxis JSON no válida'];
    } else if (err.name === 'ValidationError') {
        statusCode = 400;
        mensaje = 'Error de validación en los datos enviados';
        errores = Object.values(err.errors || {}).map((e) => e.message);
    } else if (err.name === 'CastError') {
        statusCode = 400;
        mensaje = 'Identificador o tipo de dato no válido';
        errores = [`Valor inválido para el campo ${err.path}`];
    } else {
        console.error(' [Error Inesperado]:', err);
    }

    return res.status(statusCode).json({
        mensaje,
        error: mensaje,
        errores
    });
}

module.exports = {
    rutaNoEncontrada,
    manejarErrores
};
