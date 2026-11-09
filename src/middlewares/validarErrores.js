const HttpError = require('../utils/HttpError');

function validarLogin(req, res, next) {
    const { usuario, clave } = req.body || {};
    const errores = [];

    if (!usuario || typeof usuario !== 'string' || usuario.trim() === '') {
        errores.push('El campo usuario o correo es obligatorio');
    }
    if (!clave || typeof clave !== 'string' || clave.trim() === '') {
        errores.push('La contraseña es obligatoria');
    }

    if (errores.length > 0) {
        throw new HttpError(400, 'Datos de inicio de sesión incompletos', errores);
    }
    next();
}

function validarRegistroEstudiante(req, res, next) {
    const { nombres, apellidos, correo } = req.body || {};
    const errores = [];

    if (!nombres || typeof nombres !== 'string' || nombres.trim().length < 2) {
        errores.push('Los nombres son obligatorios y deben tener al menos 2 caracteres');
    }
    if (!apellidos || typeof apellidos !== 'string' || apellidos.trim().length < 2) {
        errores.push('Los apellidos son obligatorios y deben tener al menos 2 caracteres');
    }
    if (!correo || typeof correo !== 'string' || !correo.trim().toLowerCase().endsWith('@urosario.edu.co')) {
        errores.push('El correo debe pertenecer al dominio institucional (@urosario.edu.co)');
    }

    if (errores.length > 0) {
        throw new HttpError(400, 'Errores en los datos de registro de estudiante', errores);
    }
    next();
}

function validarRegistroTutor(req, res, next) {
    const { nombres, apellidos, correo, precioHora, materiaPrincipal } = req.body || {};
    const errores = [];

    if (!nombres || typeof nombres !== 'string' || nombres.trim().length < 2) {
        errores.push('Los nombres son obligatorios y deben tener al menos 2 caracteres');
    }
    if (!apellidos || typeof apellidos !== 'string' || apellidos.trim().length < 2) {
        errores.push('Los apellidos son obligatorios y deben tener al menos 2 caracteres');
    }
    if (!correo || typeof correo !== 'string' || !correo.trim().toLowerCase().endsWith('@urosario.edu.co')) {
        errores.push('El correo debe pertenecer al dominio institucional (@urosario.edu.co)');
    }
    if (precioHora !== undefined && (isNaN(Number(precioHora)) || Number(precioHora) <= 0)) {
        errores.push('El precio por hora debe ser un número positivo');
    }

    if (errores.length > 0) {
        throw new HttpError(400, 'Errores en los datos de registro de tutor', errores);
    }
    next();
}

function validarAgendamiento(req, res, next) {
    const { tutorId, diaSemana, franjaTexto } = req.body || {};
    const errores = [];

    if (!tutorId) {
        errores.push('Debe especificar el tutor para agendar la tutoría');
    }
    if (!diaSemana) {
        errores.push('Debe especificar el día de la tutoría');
    }
    if (!franjaTexto) {
        errores.push('Debe especificar la franja horaria');
    }

    if (errores.length > 0) {
        throw new HttpError(400, 'Datos de agendamiento incompletos', errores);
    }
    next();
}

module.exports = {
    validarLogin,
    validarRegistroEstudiante,
    validarRegistroTutor,
    validarAgendamiento
};
