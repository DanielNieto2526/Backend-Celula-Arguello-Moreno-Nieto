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

async function aprobarTutor(id, datosAdicionales = {}) {
    if (estaConectado()) {
        const queryOr = [{ id: id }, { usuarioId: id }];
        if (/^[0-9a-fA-F]{24}$/.test(id)) {
            queryOr.push({ _id: id });
        }
        let tutor = await Tutor.findOneAndUpdate(
            { $or: queryOr },
            {
                estadoAprobacion: 'aprobado',
                activo: true
            },
            { returnDocument: 'after' }
        );

        // Si el tutor no estaba en la colección Tutor (por ejemplo registrado solo en Usuario), crearlo
        if (!tutor) {
            const usuarioExistente = await Usuario.findOne({ $or: queryOr });
            if (usuarioExistente) {
                const precio = Number(datosAdicionales.precioHora || usuarioExistente.precioHora) || 0;
                const nuevoTutorData = {
                    id: usuarioExistente.id || id,
                    usuarioId: usuarioExistente.id || usuarioExistente._id.toString() || id,
                    nombres: (datosAdicionales.nombres || usuarioExistente.nombres || '').trim(),
                    apellidos: (datosAdicionales.apellidos || usuarioExistente.apellidos || '').trim(),
                    iniciales: `${(datosAdicionales.nombres || usuarioExistente.nombres || '').charAt(0)}${(datosAdicionales.apellidos || usuarioExistente.apellidos || '').charAt(0)}`.toUpperCase(),
                    correo: (datosAdicionales.correo || usuarioExistente.correo || '').trim().toLowerCase(),
                    semestreTexto: datosAdicionales.semestreTexto || usuarioExistente.semestreTexto || `${datosAdicionales.semestre || usuarioExistente.semestre || 1}º semestre`,
                    sede: datosAdicionales.sede || usuarioExistente.sede || 'Claustro',
                    modalidad: datosAdicionales.modalidad || usuarioExistente.modalidad || 'Presencial',
                    descripcion: (datosAdicionales.descripcion || usuarioExistente.descripcion || '').trim(),
                    precioHora: precio,
                    precioFormato: precio > 0 ? `$${precio.toLocaleString('es-CO')} x hora` : 'A convenir',
                    materiaPrincipal: (datosAdicionales.materiaPrincipal || usuarioExistente.materiaPrincipal || '').trim(),
                    estrellas: 0,
                    diasDisponibles: Array.isArray(datosAdicionales.diasDisponibles) ? datosAdicionales.diasDisponibles : (usuarioExistente.diasDisponibles || []),
                    cursos: Array.isArray(datosAdicionales.cursos) ? datosAdicionales.cursos : (usuarioExistente.cursos || [datosAdicionales.materiaPrincipal || usuarioExistente.materiaPrincipal].filter(Boolean)),
                    salones: Array.isArray(datosAdicionales.salones) ? datosAdicionales.salones : (usuarioExistente.salones || []),
                    activo: true,
                    estadoAprobacion: 'aprobado',
                    notaMateria: Number(datosAdicionales.notaMateria || usuarioExistente.notaMateria) || 0,
                    promedioAcumulado: Number(datosAdicionales.promedioAcumulado || usuarioExistente.promedioAcumulado) || 0,
                    soporteNotasNombre: datosAdicionales.soporteNotasNombre || usuarioExistente.soporteNotasNombre || '',
                    soporteNotasUrl: datosAdicionales.soporteNotasUrl || usuarioExistente.soporteNotasUrl || '',
                    avatarUrl: datosAdicionales.avatarUrl || usuarioExistente.avatarUrl || '',
                    fechaRegistro: new Date().toLocaleDateString('es-CO')
                };
                tutor = await Tutor.create(nuevoTutorData);
            } else if (datosAdicionales && (datosAdicionales.nombres || datosAdicionales.correo)) {
                const precio = Number(datosAdicionales.precioHora) || 0;
                const nuevoTutorData = {
                    id: id,
                    usuarioId: id,
                    nombres: (datosAdicionales.nombres || '').trim(),
                    apellidos: (datosAdicionales.apellidos || '').trim(),
                    iniciales: `${(datosAdicionales.nombres || '').charAt(0)}${(datosAdicionales.apellidos || '').charAt(0)}`.toUpperCase(),
                    semestreTexto: datosAdicionales.semestreTexto || `${datosAdicionales.semestre || 1}º semestre`,
                    sede: datosAdicionales.sede || 'Claustro',
                    modalidad: datosAdicionales.modalidad || 'Presencial',
                    descripcion: (datosAdicionales.descripcion || '').trim(),
                    precioHora: precio,
                    precioFormato: precio > 0 ? `$${precio.toLocaleString('es-CO')} x hora` : 'A convenir',
                    materiaPrincipal: (datosAdicionales.materiaPrincipal || '').trim(),
                    estrellas: 0,
                    diasDisponibles: Array.isArray(datosAdicionales.diasDisponibles) ? datosAdicionales.diasDisponibles : [],
                    cursos: Array.isArray(datosAdicionales.cursos) ? datosAdicionales.cursos : [datosAdicionales.materiaPrincipal].filter(Boolean),
                    salones: Array.isArray(datosAdicionales.salones) ? datosAdicionales.salones : [],
                    correo: (datosAdicionales.correo || '').trim().toLowerCase(),
                    activo: true,
                    estadoAprobacion: 'aprobado',
                    notaMateria: Number(datosAdicionales.notaMateria) || 0,
                    promedioAcumulado: Number(datosAdicionales.promedioAcumulado) || 0,
                    soporteNotasNombre: datosAdicionales.soporteNotasNombre || '',
                    soporteNotasUrl: datosAdicionales.soporteNotasUrl || '',
                    fechaRegistro: new Date().toLocaleDateString('es-CO')
                };
                tutor = await Tutor.create(nuevoTutorData);
            }
        }

        if (!tutor) {
            throw new HttpError(404, `Tutor con ID ${id} no encontrado.`);
        }

        // Actualizar o crear también el usuario asociado en MongoDB
        let usuario = await Usuario.findOneAndUpdate(
            { $or: [{ id: tutor.usuarioId || id }, { correo: tutor.correo }] },
            {
                estadoAprobacion: 'aprobado',
                activo: true
            },
            { returnDocument: 'after' }
        );

        if (!usuario) {
            const nuevoUsuarioData = {
                id: tutor.usuarioId || id,
                nombres: tutor.nombres,
                apellidos: tutor.apellidos,
                correo: tutor.correo,
                clave: datosAdicionales?.clave || 'conecta2026',
                rol: 'tutor',
                carrera: datosAdicionales?.carrera || tutor.semestreTexto || 'MACC',
                semestre: datosAdicionales?.semestre || 6,
                semestreTexto: tutor.semestreTexto,
                cursos: tutor.cursos,
                sede: tutor.sede,
                modalidad: tutor.modalidad,
                precioHora: tutor.precioHora,
                descripcion: tutor.descripcion,
                materiaPrincipal: tutor.materiaPrincipal,
                diasDisponibles: tutor.diasDisponibles,
                salones: tutor.salones || datosAdicionales?.salones || [],
                activo: true,
                estadoAprobacion: 'aprobado',
                notaMateria: tutor.notaMateria,
                promedioAcumulado: tutor.promedioAcumulado,
                soporteNotasNombre: tutor.soporteNotasNombre,
                soporteNotasUrl: tutor.soporteNotasUrl,
                fechaRegistro: new Date().toLocaleDateString('es-CO')
            };
            const docUsuario = new Usuario(nuevoUsuarioData);
            usuario = await docUsuario.save();
        }

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
        const queryOr = [{ id: id }, { usuarioId: id }];
        if (/^[0-9a-fA-F]{24}$/.test(id)) {
            queryOr.push({ _id: id });
        }
        const tutor = await Tutor.findOne({ $or: queryOr });

        if (tutor) {
            await Tutor.deleteMany({ $or: [{ id: id }, { usuarioId: id }, { _id: tutor._id }] });
            await Usuario.deleteMany({
                $or: [{ id: tutor.usuarioId || id }, { correo: tutor.correo }]
            });
        } else {
            await Usuario.deleteMany({ $or: queryOr });
        }

        return { id, eliminado: true, estadoAprobacion: 'rechazado', motivoRechazo: motivo };
    }

    const tutorEliminado = await tutoresService.eliminarTutor(id);
    try {
        await usuariosService.eliminarUsuario(tutorEliminado?.usuarioId || id);
    } catch {
        // Ignorar
    }

    return { id, eliminado: true, estadoAprobacion: 'rechazado', motivoRechazo: motivo };
}

async function alternarEstadoTutor(id, nuevoEstadoActivo) {
    if (estaConectado()) {
        const queryOr = [{ id: id }, { usuarioId: id }];
        if (/^[0-9a-fA-F]{24}$/.test(id)) {
            queryOr.push({ _id: id });
        }
        const tutor = await Tutor.findOneAndUpdate(
            { $or: queryOr },
            { activo: Boolean(nuevoEstadoActivo) },
            { returnDocument: 'after' }
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
