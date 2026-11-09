const authService = require('../services/auth.service');

async function login(req, res, next) {
    try {
        const usuario = await authService.login(req.body);
        res.status(200).json(usuario);
    } catch (error) {
        next(error);
    }
}

async function registrarEstudiante(req, res, next) {
    try {
        const nuevoEstudiante = await authService.registrarEstudiante(req.body);
        res.status(201).json(nuevoEstudiante);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    login,
    registrarEstudiante
};
