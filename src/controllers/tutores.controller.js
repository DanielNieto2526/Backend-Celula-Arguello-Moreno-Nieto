const tutoresService = require('../services/tutores.service');

async function listar(req, res, next) {
    try {
        const filtros = {
            materia: req.query.materia,
            sede: req.query.sede,
            modalidad: req.query.modalidad,
            activo: req.query.activo
        };
        const tutores = await tutoresService.listarTutores(filtros);
        res.status(200).json(tutores);
    } catch (error) {
        next(error);
    }
}

async function obtener(req, res, next) {
    try {
        const tutor = await tutoresService.obtenerTutorPorId(req.params.id);
        res.status(200).json(tutor);
    } catch (error) {
        next(error);
    }
}

async function registrar(req, res, next) {
    try {
        const resultado = await tutoresService.registrarNuevoTutor(req.body);
        res.status(201).json(resultado);
    } catch (error) {
        next(error);
    }
}

async function actualizarDisponibilidad(req, res, next) {
    try {
        await tutoresService.actualizarDisponibilidad(req.params.id, req.body.activo);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
}

async function actualizar(req, res, next) {
    try {
        const tutorActualizado = await tutoresService.actualizarTutor(req.params.id, req.body);
        res.status(200).json(tutorActualizado);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    listar,
    obtener,
    registrar,
    actualizarDisponibilidad,
    actualizar
};
