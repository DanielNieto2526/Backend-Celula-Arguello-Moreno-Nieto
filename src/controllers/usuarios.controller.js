const usuariosService = require('../services/usuarios.service');

async function listar(req, res, next) {
    try {
        const usuarios = await usuariosService.listarUsuarios();
        res.status(200).json(usuarios);
    } catch (error) {
        next(error);
    }
}

async function obtener(req, res, next) {
    try {
        const usuario = await usuariosService.obtenerUsuarioPorId(req.params.id);
        res.status(200).json(usuario);
    } catch (error) {
        next(error);
    }
}

async function actualizar(req, res, next) {
    try {
        const usuarioActualizado = await usuariosService.actualizarUsuario(req.params.id, req.body);
        res.status(200).json(usuarioActualizado);
    } catch (error) {
        next(error);
    }
}

async function eliminar(req, res, next) {
    try {
        await usuariosService.eliminarUsuario(req.params.id);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
}

module.exports = {
    listar,
    obtener,
    actualizar,
    eliminar
};
