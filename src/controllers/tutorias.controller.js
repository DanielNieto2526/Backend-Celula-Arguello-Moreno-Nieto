const tutoriasService = require('../services/tutorias.service');

async function listar(req, res, next) {
    try {
        const filtros = {
            estudianteId: req.query.estudianteId,
            estado: req.query.estado
        };
        const tutorias = await tutoriasService.listarTutorias(filtros);
        res.status(200).json(tutorias);
    } catch (error) {
        next(error);
    }
}

async function obtener(req, res, next) {
    try {
        const tutoria = await tutoriasService.obtenerTutoriaPorId(req.params.id);
        res.status(200).json(tutoria);
    } catch (error) {
        next(error);
    }
}

async function obtenerAsignadas(req, res, next) {
    try {
        const { tutorId, tutorNombres } = req.query;
        const tutorias = await tutoriasService.obtenerTutoriasPorTutor(tutorId, tutorNombres);
        res.status(200).json(tutorias);
    } catch (error) {
        next(error);
    }
}

async function agendar(req, res, next) {
    try {
        const nuevaTutoria = await tutoriasService.agendarTutoria(req.body);
        res.status(201).json(nuevaTutoria);
    } catch (error) {
        next(error);
    }
}

async function actualizarLink(req, res, next) {
    try {
        const actualizada = await tutoriasService.actualizarLinkReunion(req.params.id, req.body.linkReunion);
        res.status(200).json(actualizada);
    } catch (error) {
        next(error);
    }
}

async function actualizarEstado(req, res, next) {
    try {
        const actualizada = await tutoriasService.actualizarEstadoTutoria(req.params.id, req.body.estado);
        res.status(200).json(actualizada);
    } catch (error) {
        next(error);
    }
}

async function calificar(req, res, next) {
    try {
        const { calificacion, comentarios } = req.body;
        await tutoriasService.calificarTutoria(req.params.id, calificacion, comentarios);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
}

async function cancelar(req, res, next) {
    try {
        await tutoriasService.cancelarTutoria(req.params.id);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
}

module.exports = {
    listar,
    obtener,
    obtenerAsignadas,
    agendar,
    actualizarLink,
    actualizarEstado,
    calificar,
    cancelar
};
