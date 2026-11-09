const Tutor = require('../models/tutor.model');
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
            query.cursos = { $regex: new RegExp(filtros.materia, 'i') };
        }
        if (filtros.sede) {
            query.sede = { $regex: new RegExp(filtros.sede, 'i') };
        }
        if (filtros.modalidad) {
            query.modalidad = { $regex: new RegExp(filtros.modalidad, 'i') };
        }
        if (filtros.activo !== undefined) {
            query.activo = filtros.activo === 'true' || filtros.activo === true;
        }
        lista = await Tutor.find(query);
    } else {
        lista = [...tutoresEnMemoria];
        if (filtros.materia) {
            const m = filtros.materia.toLowerCase();
            lista = lista.filter((t) => (t.cursos || []).some((c) => c.toLowerCase().includes(m)) || (t.materiaPrincipal || '').toLowerCase().includes(m));
        }
        if (filtros.sede) {
            const s = filtros.sede.toLowerCase();
            lista = lista.filter((t) => (t.sede || '').toLowerCase().includes(s));
        }
        if (filtros.modalidad) {
            const mod = filtros.modalidad.toLowerCase();
            lista = lista.filter((t) => (t.modalidad || '').toLowerCase().includes(mod));
        }
        if (filtros.activo !== undefined) {
            const act = filtros.activo === 'true' || filtros.activo === true;
            lista = lista.filter((t) => t.activo === act);
        }
    }
    return lista;
}

async function obtenerTutorPorId(id) {
    if (estaConectado()) {
        const tutor = await Tutor.findOne({
            $or: [{ id: id }, { usuarioId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }]
        });
        if (!tutor) {
            throw new HttpError(404, `Tutor con id ${id} no encontrado`);
        }
        return tutor;
    }

    const tutor = tutoresEnMemoria.find((t) => t.id === id || t.usuarioId === id);
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
    const idUsuario = `user-tutor-${Date.now()}`;
    const iniciales = `${(datos.nombres || '').charAt(0)}${(datos.apellidos || '').charAt(0)}`.toUpperCase();
    const semestreTexto = `${datos.semestre || 6}º semestre ${datos.carrera || 'MACC'} - ${(datos.sede || 'Claustro').toLowerCase()}`;
    const precio = Number(datos.precioHora) || 20000;
    const precioFormato = `$${precio.toLocaleString('es-CO')} x hora`;

    const cursos = [
        (datos.materiaPrincipal || 'Cálculo II').trim(),
        ...(datos.cursosAdicionales || []).map((c) => c.trim())
    ];

    const nuevoTutorData = {
        id: idTutor,
        usuarioId: idUsuario,
        nombres: datos.nombres.trim(),
        apellidos: datos.apellidos.trim(),
        iniciales,
        semestreTexto,
        sede: datos.sede || 'Claustro',
        modalidad: datos.modalidad || 'Presencial',
        descripcion: (datos.descripcion || '').trim(),
        precioHora: precio,
        precioFormato,
        materiaPrincipal: (datos.materiaPrincipal || 'Cálculo II').trim(),
        estrellas: 5.0,
        diasDisponibles: generarDiasDisponibles(datos.diasDisponibles),
        cursos,
        correo,
        activo: true
    };

    const nuevoUsuarioData = {
        id: idUsuario,
        nombres: datos.nombres.trim(),
        apellidos: datos.apellidos.trim(),
        correo,
        clave: datos.clave || 'conecta2026',
        rol: 'tutor',
        carrera: datos.carrera,
        semestre: Number(datos.semestre) || 6,
        semestreTexto,
        cursos,
        sede: datos.sede,
        modalidad: datos.modalidad,
        precioHora: precio,
        descripcion: datos.descripcion,
        materiaPrincipal: datos.materiaPrincipal,
        diasDisponibles: datos.diasDisponibles || ['LU', 'MA', 'MI']
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
            { new: true }
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
    if (cambios.precioHora) {
        cambios.precioFormato = `$${Number(cambios.precioHora).toLocaleString('es-CO')} x hora`;
    }

    if (estaConectado()) {
        const tutor = await Tutor.findOneAndUpdate(
            { $or: [{ id: tutorId }, { usuarioId: tutorId }, { _id: tutorId.match(/^[0-9a-fA-F]{24}$/) ? tutorId : null }] },
            cambios,
            { new: true, runValidators: true }
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
    tutoresEnMemoria[index] = { ...tutoresEnMemoria[index], ...cambios };
    return tutoresEnMemoria[index];
}

module.exports = {
    listarTutores,
    obtenerTutorPorId,
    registrarNuevoTutor,
    actualizarDisponibilidad,
    actualizarTutor
};
