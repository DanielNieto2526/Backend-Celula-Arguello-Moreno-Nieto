const Usuario = require('../models/usuario.model');
const { estaConectado } = require('../config/db');
const { USUARIOS_INICIALES } = require('../utils/seedData');
const HttpError = require('../utils/HttpError');

// Almacén en memoria como respaldo cuando no hay conexión a MongoDB
let usuariosEnMemoria = [...USUARIOS_INICIALES];

async function listarUsuarios() {
    if (estaConectado()) {
        return await Usuario.find();
    }
    return usuariosEnMemoria;
}

async function obtenerUsuarioPorId(id) {
    if (estaConectado()) {
        const usuario = await Usuario.findOne({ $or: [{ id: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }] });
        if (!usuario) {
            throw new HttpError(404, `Usuario con id ${id} no encontrado`);
        }
        return usuario;
    }

    const usuario = usuariosEnMemoria.find((u) => u.id === id);
    if (!usuario) {
        throw new HttpError(404, `Usuario con id ${id} no encontrado`);
    }
    return usuario;
}

async function obtenerUsuarioPorCorreo(correo) {
    const normalizado = correo.trim().toLowerCase();
    if (estaConectado()) {
        return await Usuario.findOne({ correo: normalizado });
    }
    return usuariosEnMemoria.find((u) => u.correo.toLowerCase() === normalizado) || null;
}

async function crearUsuario(datos) {
    const correoNormalizado = datos.correo.trim().toLowerCase();
    const existente = await obtenerUsuarioPorCorreo(correoNormalizado);
    if (existente) {
        throw new HttpError(409, `Ya existe un usuario registrado con el correo ${correoNormalizado}`);
    }

    const nuevoId = datos.id || `user-${Date.now()}`;
    const payload = {
        ...datos,
        id: nuevoId,
        correo: correoNormalizado
    };

    if (estaConectado()) {
        const doc = new Usuario(payload);
        return await doc.save();
    }

    usuariosEnMemoria.push(payload);
    return payload;
}

async function actualizarUsuario(id, cambios) {
    if (estaConectado()) {
        const usuario = await Usuario.findOneAndUpdate(
            { $or: [{ id: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }] },
            cambios,
            { new: true, runValidators: true }
        );
        if (!usuario) {
            throw new HttpError(404, `Usuario con id ${id} no encontrado`);
        }
        return usuario;
    }

    const index = usuariosEnMemoria.findIndex((u) => u.id === id);
    if (index === -1) {
        throw new HttpError(404, `Usuario con id ${id} no encontrado`);
    }
    usuariosEnMemoria[index] = { ...usuariosEnMemoria[index], ...cambios };
    return usuariosEnMemoria[index];
}

async function eliminarUsuario(id) {
    if (estaConectado()) {
        const usuario = await Usuario.findOneAndDelete({
            $or: [{ id: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }]
        });
        if (!usuario) {
            throw new HttpError(404, `Usuario con id ${id} no encontrado`);
        }
        return usuario;
    }

    const index = usuariosEnMemoria.findIndex((u) => u.id === id);
    if (index === -1) {
        throw new HttpError(404, `Usuario con id ${id} no encontrado`);
    }
    const [eliminado] = usuariosEnMemoria.splice(index, 1);
    return eliminado;
}

module.exports = {
    listarUsuarios,
    obtenerUsuarioPorId,
    obtenerUsuarioPorCorreo,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario
};
