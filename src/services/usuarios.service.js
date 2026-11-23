const Usuario = require('../models/usuario.model');
const Tutor = require('../models/tutor.model');
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
        const queryOr = [{ id: id }];
        if (/^[0-9a-fA-F]{24}$/.test(id)) {
            queryOr.push({ _id: id });
        }
        if (typeof id === 'string' && id.includes('@')) {
            queryOr.push({ correo: id.trim().toLowerCase() });
        }
        const usuario = await Usuario.findOne({ $or: queryOr });
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
        const queryOr = [{ id: id }];
        if (/^[0-9a-fA-F]{24}$/.test(id)) {
            queryOr.push({ _id: id });
        }
        if (typeof id === 'string' && id.includes('@')) {
            queryOr.push({ correo: id.trim().toLowerCase() });
        }
        const usuario = await Usuario.findOneAndUpdate(
            { $or: queryOr },
            { $set: cambios },
            { new: true, runValidators: true }
        );
        if (!usuario) {
            throw new HttpError(404, `Usuario con id ${id} no encontrado`);
        }

        if (usuario.rol === 'tutor') {
            const tutorCambios = {};
            if (cambios.avatarUrl !== undefined) tutorCambios.avatarUrl = cambios.avatarUrl;
            if (cambios.fotoPerfil !== undefined) {
                tutorCambios.avatarUrl = cambios.fotoPerfil;
                tutorCambios.fotoPerfil = cambios.fotoPerfil;
            }
            if (cambios.salones !== undefined) tutorCambios.salones = cambios.salones;
            if (cambios.cursos !== undefined) tutorCambios.cursos = cambios.cursos;
            if (cambios.diasDisponibles !== undefined) tutorCambios.diasDisponibles = cambios.diasDisponibles;
            if (cambios.precioHora !== undefined) tutorCambios.precioHora = cambios.precioHora;
            if (cambios.descripcion !== undefined) tutorCambios.descripcion = cambios.descripcion;
            if (cambios.telefono !== undefined) tutorCambios.telefono = cambios.telefono;
            if (cambios.nombres !== undefined) tutorCambios.nombres = cambios.nombres;
            if (cambios.apellidos !== undefined) tutorCambios.apellidos = cambios.apellidos;
            if (cambios.sede !== undefined) tutorCambios.sede = cambios.sede;
            if (cambios.modalidad !== undefined) tutorCambios.modalidad = cambios.modalidad;

            if (Object.keys(tutorCambios).length > 0) {
                await Tutor.findOneAndUpdate(
                    { $or: [{ id: id }, { usuarioId: id }, { correo: usuario.correo }] },
                    { $set: tutorCambios }
                );
            }
        }

        // Sincronizar en vivo las tutorías relacionadas para que los cambios se reflejen en todas las pantallas
        try {
            const Tutoria = require('../models/tutoria.model');
            if (usuario.rol === 'estudiante') {
                const tutoriaEstCambios = {};
                if (cambios.telefono !== undefined) tutoriaEstCambios.estudianteTelefono = cambios.telefono;
                if (cambios.avatarUrl !== undefined) tutoriaEstCambios.estudianteAvatar = cambios.avatarUrl;
                if (cambios.nombres !== undefined) tutoriaEstCambios.estudianteNombres = cambios.nombres;
                if (cambios.apellidos !== undefined) tutoriaEstCambios.estudianteApellidos = cambios.apellidos;
                if (cambios.semestreTexto !== undefined) tutoriaEstCambios.estudianteSemestreCompleto = cambios.semestreTexto;
                if (cambios.carrera !== undefined) tutoriaEstCambios.estudianteCarrera = cambios.carrera;
                if (Object.keys(tutoriaEstCambios).length > 0) {
                    await Tutoria.updateMany(
                        { $or: [{ estudianteId: id }, { estudianteCorreo: usuario.correo }] },
                        { $set: tutoriaEstCambios }
                    );
                }
            } else if (usuario.rol === 'tutor') {
                const tutoriaTutCambios = {};
                if (cambios.avatarUrl !== undefined) tutoriaTutCambios.tutorAvatar = cambios.avatarUrl;
                if (cambios.fotoPerfil !== undefined) tutoriaTutCambios.tutorAvatar = cambios.fotoPerfil;
                if (cambios.nombres !== undefined) tutoriaTutCambios.tutorNombres = cambios.nombres;
                if (cambios.apellidos !== undefined) tutoriaTutCambios.tutorApellidos = cambios.apellidos;
                if (Object.keys(tutoriaTutCambios).length > 0) {
                    await Tutoria.updateMany(
                        { $or: [{ tutorId: id }, { tutorUsuarioId: id }] },
                        { $set: tutoriaTutCambios }
                    );
                }
            }
        } catch {
            // continuar si falla sincronización secundaria
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
