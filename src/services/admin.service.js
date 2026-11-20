const Tutor = require('../models/tutor.model');
const Usuario = require('../models/usuario.model');
const { estaConectado } = require('../config/db');
const tutoresService = require('./tutores.service');
const usuariosService = require('./usuarios.service');
const HttpError = require('../utils/HttpError');

async function obtenerTodasLasSolicitudesAdmin() {
    const todos = await tutoresService.listarTutores();
    return todos;
}

async function obtenerSolicitudesPendientes() {
    const todos = await obtenerTodasLasSolicitudesAdmin();
    return todos.filter((t) => t.estadoAprobacion === 'pendiente');
}

async function obtenerTutoresParaGestion() {
    const todos = await obtenerTodasLasSolicitudesAdmin();
    return todos.filter((t) => t.estadoAprobacion === 'aprobado');
}

async function aprobarTutor(id) {
    if (estaConectado()) {
        const tutor = await Tutor.findOneAndUpdate(
            { $or: [{ id: id }, { usuarioId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }] },
            {
                estadoAprobacion: 'aprobado',
                activo: true
            },
            { new: true }
        );
        if (!tutor) {
            throw new HttpError(404, `Tutor con ID ${id} no encontrado.`);
        }

        // Actualizar también el usuario asociado si existe
        await Usuario.findOneAndUpdate(
            { $or: [{ id: tutor.usuarioId || id }, { correo: tutor.correo }] },
            {
                estadoAprobacion: 'aprobado',
                activo: true
            }
        );

        return tutor;
    }

    const tutorActualizado = await tutoresService.actualizarTutor(id, {
        estadoAprobacion: 'aprobado',
        activo: true
    });

    try {
        await usuariosService.actualizarUsuario(id, {
            estadoAprobacion: 'aprobado',
            activo: true
        });
    } catch {
        // Ignorar si el usuario no tenía el mismo id exacto
    }

    return tutorActualizado;
}

async function rechazarTutor(id, motivo = 'No cumple con los requisitos académicos mínimos') {
    if (estaConectado()) {
        const tutor = await Tutor.findOneAndUpdate(
            { $or: [{ id: id }, { usuarioId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }] },
            {
                estadoAprobacion: 'rechazado',
                activo: false,
                motivoRechazo: motivo
            },
            { new: true }
        );
        if (!tutor) {
            throw new HttpError(404, `Tutor con ID ${id} no encontrado.`);
        }

        await Usuario.findOneAndUpdate(
            { $or: [{ id: tutor.usuarioId || id }, { correo: tutor.correo }] },
            {
                estadoAprobacion: 'rechazado',
                activo: false,
                motivoRechazo: motivo
            }
        );

        return tutor;
    }

    const tutorActualizado = await tutoresService.actualizarTutor(id, {
        estadoAprobacion: 'rechazado',
        activo: false,
        motivoRechazo: motivo
    });

    try {
        await usuariosService.actualizarUsuario(id, {
            estadoAprobacion: 'rechazado',
            activo: false,
            motivoRechazo: motivo
        });
    } catch {
        // Ignorar si el usuario no tenía el mismo id exacto
    }

    return tutorActualizado;
}

async function alternarEstadoTutor(id, nuevoEstadoActivo) {
    if (estaConectado()) {
        const tutor = await Tutor.findOneAndUpdate(
            { $or: [{ id: id }, { usuarioId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }] },
            { activo: Boolean(nuevoEstadoActivo) },
            { new: true }
        );
        if (!tutor) {
            throw new HttpError(404, `Tutor con ID ${id} no encontrado.`);
        }

        await Usuario.findOneAndUpdate(
            { $or: [{ id: tutor.usuarioId || id }, { correo: tutor.correo }] },
            { activo: Boolean(nuevoEstadoActivo) }
        );

        return tutor;
    }

    const tutorActualizado = await tutoresService.actualizarTutor(id, {
        activo: Boolean(nuevoEstadoActivo)
    });

    try {
        await usuariosService.actualizarUsuario(id, {
            activo: Boolean(nuevoEstadoActivo)
        });
    } catch {
        // Ignorar si el usuario no tenía el mismo id exacto
    }

    return tutorActualizado;
}

module.exports = {
    obtenerTodasLasSolicitudesAdmin,
    obtenerSolicitudesPendientes,
    obtenerTutoresParaGestion,
    aprobarTutor,
    rechazarTutor,
    alternarEstadoTutor
};
