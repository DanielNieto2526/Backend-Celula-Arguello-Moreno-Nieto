const resenasService = require('../services/resenas.service');

async function listar(req, res, next) {
    try {
        const resenas = await resenasService.listarResenas();
        res.status(200).json(resenas);
    } catch (error) {
        next(error);
    }
}

async function obtenerPorTutor(req, res, next) {
    try {
        const { tutorId } = req.params;
        const { tutorNombres } = req.query;
        const resenas = await resenasService.obtenerResenasPorTutor(tutorId, tutorNombres);
        res.status(200).json(resenas);
    } catch (error) {
        next(error);
    }
}

async function obtenerPromedioTutor(req, res, next) {
    try {
        const { tutorId } = req.params;
        const { tutorNombres } = req.query;
        const promedio = await resenasService.calcularPromedioTutor(tutorId, tutorNombres);
        res.status(200).json(promedio);
    } catch (error) {
        next(error);
    }
}

async function crear(req, res, next) {
    try {
        const nuevaResena = await resenasService.crearResena(req.body);
        res.status(201).json(nuevaResena);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    listar,
    obtenerPorTutor,
    obtenerPromedioTutor,
    crear
};
