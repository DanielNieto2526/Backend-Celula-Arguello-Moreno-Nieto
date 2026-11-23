const Tutor = require('../models/tutor.model');
const Usuario = require('../models/usuario.model');
const { estaConectado } = require('../config/db');
const { TUTORES_INICIALES } = require('../utils/seedData');
const usuariosService = require('./usuarios.service');
const HttpError = require('../utils/HttpError');

let tutoresEnMemoria = [...TUTORES_INICIALES];

function generarDiasDisponibles(diasSeleccionados = ['LUN', 'MIE', 'VIE']) {
    const dias = ['MAR', 'MIE', 'JUE', 'VIE', 'SAB', 'LUN', 'MAR'];
    const numeros = [2, 3, 4, 5, 6, 7, 8];
    return dias.map((dia, idx) => {
        const seleccionado = diasSeleccionados.includes(dia);
        return {
            diaSemana: dia,
            numero: numeros[idx],
            disponible: seleccionado,
            franjas: seleccionado
                ? [
                    { id: `f-${idx}-1`, texto: '9:00 - 10:30 AM', disponible: true },
                    { id: `f-${idx}-2`, texto: '2:00 - 3:00 PM', disponible: true },
                    { id: `f-${idx}-3`, texto: '3:00 - 4:00 PM', disponible: true }
                ]
                : []
        };
    });
}

async function listarTutores(filtros = {}) {
    let lista;
    if (estaConectado()) {
        const query = {};
        if (filtros.materia) {
            const regMat = new RegExp(filtros.materia.trim(), 'i');
            const condMat = [
                { cursos: { $regex: regMat } },
                { materiaPrincipal: { $regex: regMat } },
                { descripcion: { $regex: regMat } },
                { nombres: { $regex: regMat } },
                { apellidos: { $regex: regMat } }
            ];
            query.$or = condMat;
        }
        if (filtros.sede && filtros.sede !== 'Todas') {
            query.sede = { $regex: new RegExp(filtros.sede.trim(), 'i') };
        }
        if (filtros.modalidad && filtros.modalidad !== 'Todas') {
            const regMod = new RegExp(filtros.modalidad.trim(), 'i');
            // La modalidad Híbrida ofrece tanto presencial como virtual
            const condMod = [
                { modalidad: { $regex: regMod } },
                { modalidad: { $regex: /h[ií]brid/i } }
            ];
            if (query.$or) {
                query.$and = [{ $or: query.$or }, { $or: condMod }];
                delete query.$or;
            } else {
                query.$or = condMod;
            }
        }
        if (filtros.activo !== undefined) {
            query.activo = filtros.activo === 'true' || filtros.activo === true;
        }
        if (filtros.estadoAprobacion) {
            query.estadoAprobacion = filtros.estadoAprobacion;
        }
        lista = await Tutor.find(query);
    } else {
        lista = [...tutoresEnMemoria];
        if (filtros.materia) {
            const m = filtros.materia.toLowerCase().trim();
            lista = lista.filter((t) =>
                (t.cursos || []).some((c) => (c || '').toLowerCase().includes(m)) ||
                (t.materiaPrincipal || '').toLowerCase().includes(m) ||
                (t.descripcion || '').toLowerCase().includes(m) ||
                `${t.nombres} ${t.apellidos}`.toLowerCase().includes(m)
            );
        }
        if (filtros.sede && filtros.sede !== 'Todas') {
            const s = filtros.sede.toLowerCase().trim();
            lista = lista.filter((t) => (t.sede || '').toLowerCase().includes(s));
        }
        if (filtros.modalidad && filtros.modalidad !== 'Todas') {
            const mod = filtros.modalidad.toLowerCase().trim();
            lista = lista.filter((t) => {
                const tMod = (t.modalidad || '').toLowerCase();
                return tMod.includes(mod) || tMod.includes('hibrid') || tMod.includes('híbrid');
            });
        }
        if (filtros.activo !== undefined) {
            const act = filtros.activo === 'true' || filtros.activo === true;
            lista = lista.filter((t) => t.activo === act);
        }
        if (filtros.estadoAprobacion) {
            lista = lista.filter((t) => t.estadoAprobacion === filtros.estadoAprobacion);
        }
    }
    return lista;
}

async function obtenerTutorPorId(id) {
    if (estaConectado()) {
        const queryOr = [{ id: id }, { usuarioId: id }];
        if (/^[0-9a-fA-F]{24}$/.test(id)) {
            queryOr.push({ _id: id });
        }
        if (typeof id === 'string' && id.includes('@')) {
            queryOr.push({ correo: id.trim().toLowerCase() });
        }
        let tutor = await Tutor.findOne({ $or: queryOr });
        if (!tutor) {
            const usuario = await Usuario.findOne({ $or: queryOr });
            if (usuario && usuario.rol === 'tutor') {
                const nuevoTutorData = {
                    id: `tutor-${Date.now()}`,
                    usuarioId: usuario.id || usuario._id.toString(),
                    nombres: usuario.nombres,
                    apellidos: usuario.apellidos,
                    iniciales: `${usuario.nombres.charAt(0)}${usuario.apellidos.charAt(0)}`.toUpperCase(),
                    correo: usuario.correo,
                    semestreTexto: usuario.semestreTexto || '',
                    cursos: usuario.cursos || [],
                    sede: usuario.sede || 'Claustro',
                    modalidad: usuario.modalidad || 'Presencial',
                    precioHora: usuario.precioHora || 0,
                    precioFormato: `$${(usuario.precioHora || 0).toLocaleString('es-CO')} x hora`,
                    descripcion: usuario.descripcion || '',
                    avatarUrl: usuario.avatarUrl || '',
                    materiaPrincipal: usuario.materiaPrincipal || '',
                    diasDisponibles: usuario.diasDisponibles || [],
                    activo: usuario.activo !== undefined ? usuario.activo : true,
                    estadoAprobacion: usuario.estadoAprobacion || 'aprobado'
                };
                tutor = await Tutor.create(nuevoTutorData);
            }
        }
        if (!tutor) {
            throw new HttpError(404, `Tutor con id ${id} no encontrado`);
        }
        return tutor;
    }

    const tutor = tutoresEnMemoria.find((t) => t.id === id || t.usuarioId === id || (t.correo && t.correo.toLowerCase() === id.toLowerCase()));
    if (!tutor) {
        throw new HttpError(404, `Tutor con id ${id} no encontrado`);
    }
    return tutor;
}

async function registrarNuevoTutor(datos) {
    const correo = (datos.correo || '').trim().toLowerCase();
    if (!correo.endsWith('@urosario.edu.co')) {
        throw new HttpError(400, 'El correo debe pertenecer al dominio institucional (@urosario.edu.co).');
    }

    const idTutor = `tutor-${Date.now()}`;
    const idUsuario = idTutor;
    const iniciales = `${(datos.nombres || '').charAt(0)}${(datos.apellidos || '').charAt(0)}`.toUpperCase();
    const semestre = Number(datos.semestre) || 1;
    const carrera = (datos.carrera || '').trim();
    const sede = datos.sede || 'Claustro';
    const semestreTexto = `${semestre}º semestre ${carrera} - ${sede.toLowerCase()}`.trim();
    const precio = Number(datos.precioHora) || 0;
    const precioFormato = precio > 0 ? `$${precio.toLocaleString('es-CO')} x hora` : 'A convenir';

    const materiasLista = [
        (datos.materiaPrincipal || '').trim(),
        ...(Array.isArray(datos.cursos) ? datos.cursos : []),
        ...(Array.isArray(datos.cursosAdicionales) ? datos.cursosAdicionales : [])
    ].map((c) => (typeof c === 'string' ? c.trim() : '')).filter(Boolean);
    const cursos = Array.from(new Set(materiasLista));

    const nuevoTutorData = {
        id: idTutor,
        usuarioId: idUsuario,
        nombres: (datos.nombres || '').trim(),
        apellidos: (datos.apellidos || '').trim(),
        iniciales,
        semestreTexto,
        sede,
        modalidad: datos.modalidad || 'Presencial',
        descripcion: (datos.descripcion || '').trim(),
        precioHora: precio,
        precioFormato,
        materiaPrincipal: (datos.materiaPrincipal || '').trim(),
        estrellas: 0,
        diasDisponibles: Array.isArray(datos.diasDisponibles) && datos.diasDisponibles.length > 0 ? generarDiasDisponibles(datos.diasDisponibles) : [],
        cursos,
        salones: Array.isArray(datos.salones) ? datos.salones : [],
        correo,
        activo: false, // Inicia inactivo hasta revisión de notas por admin
        estadoAprobacion: 'pendiente',
        notaMateria: Number(datos.notaMateria) || 0,
        promedioAcumulado: Number(datos.promedioAcumulado) || 0,
        soporteNotasNombre: datos.soporteNotasNombre || '',
        soporteNotasUrl: datos.soporteNotasUrl || '',
        fechaRegistro: new Date().toLocaleDateString('es-CO')
    };

    const nuevoUsuarioData = {
        id: idUsuario,
        nombres: (datos.nombres || '').trim(),
        apellidos: (datos.apellidos || '').trim(),
        correo,
        clave: datos.clave || 'conecta2026',
        rol: 'tutor',
        carrera,
        semestre,
        semestreTexto,
        cursos,
        sede,
        modalidad: datos.modalidad || 'Presencial',
        precioHora: precio,
        descripcion: (datos.descripcion || '').trim(),
        materiaPrincipal: (datos.materiaPrincipal || '').trim(),
        salones: Array.isArray(datos.salones) ? datos.salones : [],
        diasDisponibles: Array.isArray(datos.diasDisponibles) ? datos.diasDisponibles : [],
        activo: false,
        estadoAprobacion: 'pendiente',
        notaMateria: Number(datos.notaMateria) || 0,
        promedioAcumulado: Number(datos.promedioAcumulado) || 0,
        soporteNotasNombre: datos.soporteNotasNombre || '',
        soporteNotasUrl: datos.soporteNotasUrl || '',
        fechaRegistro: new Date().toLocaleDateString('es-CO')
    };

    const usuarioCreado = await usuariosService.crearUsuario(nuevoUsuarioData);

    let tutorCreado;
    if (estaConectado()) {
        const docTutor = new Tutor(nuevoTutorData);
        tutorCreado = await docTutor.save();
    } else {
        tutoresEnMemoria.push(nuevoTutorData);
        tutorCreado = nuevoTutorData;
    }

    const usuarioRes = usuarioCreado.toJSON ? usuarioCreado.toJSON() : { ...usuarioCreado };
    delete usuarioRes.clave;

    return {
        usuario: usuarioRes,
        tutor: tutorCreado
    };
}

async function actualizarDisponibilidad(tutorId, activo) {
    if (estaConectado()) {
        const tutor = await Tutor.findOneAndUpdate(
            { $or: [{ id: tutorId }, { usuarioId: tutorId }, { _id: tutorId.match(/^[0-9a-fA-F]{24}$/) ? tutorId : null }] },
            { activo: Boolean(activo) },
            { returnDocument: 'after' }
        );
        if (!tutor) {
            throw new HttpError(404, `Tutor con id ${tutorId} no encontrado`);
        }
        return tutor;
    }

    const index = tutoresEnMemoria.findIndex((t) => t.id === tutorId || t.usuarioId === tutorId);
    if (index === -1) {
        throw new HttpError(404, `Tutor con id ${tutorId} no encontrado`);
    }
    tutoresEnMemoria[index].activo = Boolean(activo);
    return tutoresEnMemoria[index];
}

async function actualizarTutor(tutorId, cambios) {
    if (cambios.precioHora !== undefined && cambios.precioHora !== null) {
        cambios.precioHora = Number(cambios.precioHora) || 0;
        cambios.precioFormato = `$${cambios.precioHora.toLocaleString('es-CO')} x hora`;
    }

    if (estaConectado()) {
        const queryOr = [{ id: tutorId }, { usuarioId: tutorId }];
        if (/^[0-9a-fA-F]{24}$/.test(tutorId)) {
            queryOr.push({ _id: tutorId });
        }
        if (typeof tutorId === 'string' && tutorId.includes('@')) {
            queryOr.push({ correo: tutorId.trim().toLowerCase() });
        }
        if (cambios.correo) {
            queryOr.push({ correo: cambios.correo.trim().toLowerCase() });
        }

        let tutor = await Tutor.findOneAndUpdate(
            { $or: queryOr },
            { $set: cambios },
            { returnDocument: 'after' }
        );

        if (!tutor) {
            const usuarioExistente = await Usuario.findOne({ $or: queryOr });
            if (usuarioExistente) {
                const nuevoTutorData = {
                    id: `tutor-${Date.now()}`,
                    usuarioId: usuarioExistente.id || usuarioExistente._id.toString(),
                    nombres: usuarioExistente.nombres,
                    apellidos: usuarioExistente.apellidos,
                    iniciales: `${usuarioExistente.nombres.charAt(0)}${usuarioExistente.apellidos.charAt(0)}`.toUpperCase(),
                    correo: usuarioExistente.correo,
                    semestreTexto: usuarioExistente.semestreTexto || '',
                    cursos: usuarioExistente.cursos || [],
                    sede: usuarioExistente.sede || 'Claustro',
                    modalidad: usuarioExistente.modalidad || 'Presencial',
                    precioHora: usuarioExistente.precioHora || 0,
                    precioFormato: `$${(usuarioExistente.precioHora || 0).toLocaleString('es-CO')} x hora`,
                    descripcion: usuarioExistente.descripcion || '',
                    avatarUrl: usuarioExistente.avatarUrl || '',
                    materiaPrincipal: usuarioExistente.materiaPrincipal || '',
                    diasDisponibles: usuarioExistente.diasDisponibles || [],
                    activo: usuarioExistente.activo !== undefined ? usuarioExistente.activo : true,
                    estadoAprobacion: 'aprobado',
                    ...cambios
                };
                tutor = await Tutor.create(nuevoTutorData);
            }
        }

        if (!tutor) {
            throw new HttpError(404, `Tutor con id ${tutorId} no encontrado`);
        }

        // Sincronizar en la colección Usuario
        const usuarioQueryOr = [{ id: tutorId }, { id: tutor.usuarioId }];
        if (tutor.usuarioId && /^[0-9a-fA-F]{24}$/.test(tutor.usuarioId)) {
            usuarioQueryOr.push({ _id: tutor.usuarioId });
        }
        if (/^[0-9a-fA-F]{24}$/.test(tutorId)) {
            usuarioQueryOr.push({ _id: tutorId });
        }
        if (tutor.correo) {
            usuarioQueryOr.push({ correo: tutor.correo.toLowerCase() });
        }

        const camposUsuario = {};
        if (cambios.nombres !== undefined) camposUsuario.nombres = cambios.nombres;
        if (cambios.apellidos !== undefined) camposUsuario.apellidos = cambios.apellidos;
        if (cambios.avatarUrl !== undefined) camposUsuario.avatarUrl = cambios.avatarUrl;
        if (cambios.fotoPerfil !== undefined) camposUsuario.avatarUrl = cambios.fotoPerfil;
        if (cambios.diasDisponibles !== undefined) camposUsuario.diasDisponibles = cambios.diasDisponibles;
        if (cambios.precioHora !== undefined) camposUsuario.precioHora = cambios.precioHora;
        if (cambios.descripcion !== undefined) camposUsuario.descripcion = cambios.descripcion;
        if (cambios.sede !== undefined) camposUsuario.sede = cambios.sede;
        if (cambios.modalidad !== undefined) camposUsuario.modalidad = cambios.modalidad;
        if (cambios.materiaPrincipal !== undefined) camposUsuario.materiaPrincipal = cambios.materiaPrincipal;
        if (cambios.cursos !== undefined) camposUsuario.cursos = cambios.cursos;
        if (cambios.salones !== undefined) camposUsuario.salones = cambios.salones;
        if (cambios.telefono !== undefined) camposUsuario.telefono = cambios.telefono;

        if (Object.keys(camposUsuario).length > 0) {
            await Usuario.findOneAndUpdate({ $or: usuarioQueryOr }, { $set: camposUsuario });
        }

        try {
            const Tutoria = require('../models/tutoria.model');
            const tutoriaCambios = {};
            if (cambios.avatarUrl !== undefined) tutoriaCambios.tutorAvatar = cambios.avatarUrl;
            if (cambios.fotoPerfil !== undefined) tutoriaCambios.tutorAvatar = cambios.fotoPerfil;
            if (cambios.nombres !== undefined) tutoriaCambios.tutorNombres = cambios.nombres;
            if (cambios.apellidos !== undefined) tutoriaCambios.tutorApellidos = cambios.apellidos;
            if (Object.keys(tutoriaCambios).length > 0) {
                await Tutoria.updateMany(
                    { $or: [{ tutorId: tutor.id }, { tutorUsuarioId: tutor.usuarioId || tutor.id }] },
                    { $set: tutoriaCambios }
                );
            }
        } catch {}

        return tutor;
    }

    const index = tutoresEnMemoria.findIndex((t) => t.id === tutorId || t.usuarioId === tutorId || (t.correo && t.correo.toLowerCase() === tutorId.toLowerCase()));
    if (index === -1) {
        throw new HttpError(404, `Tutor con id ${tutorId} no encontrado`);
    }
    tutoresEnMemoria[index] = { ...tutoresEnMemoria[index], ...cambios };
    return tutoresEnMemoria[index];
}

async function eliminarTutor(id) {
    if (estaConectado()) {
        const tutor = await Tutor.findOneAndDelete({
            $or: [{ id: id }, { usuarioId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }]
        });
        return tutor;
    }

    const index = tutoresEnMemoria.findIndex((t) => t.id === id || t.usuarioId === id);
    if (index !== -1) {
        const [eliminado] = tutoresEnMemoria.splice(index, 1);
        return eliminado;
    }
    return null;
}

module.exports = {
    listarTutores,
    obtenerTutorPorId,
    registrarNuevoTutor,
    actualizarDisponibilidad,
    actualizarTutor,
    eliminarTutor
};
