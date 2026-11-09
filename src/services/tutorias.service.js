const Tutoria = require('../models/tutoria.model');
const { estaConectado } = require('../config/db');
const { TUTORIAS_INICIALES } = require('../utils/seedData');
const HttpError = require('../utils/HttpError');

let tutoriasEnMemoria = [...TUTORIAS_INICIALES];

async function listarTutorias(filtros = {}) {
    if (estaConectado()) {
        const query = {};
        if (filtros.estudianteId) {
            query.estudianteId = filtros.estudianteId;
        }
        if (filtros.estado) {
            query.estado = filtros.estado;
        }
        return await Tutoria.find(query).sort({ createdAt: -1 });
    }

    let lista = [...tutoriasEnMemoria];
    if (filtros.estudianteId) {
        lista = lista.filter((t) => t.estudianteId === filtros.estudianteId);
    }
    if (filtros.estado) {
        lista = lista.filter((t) => t.estado === filtros.estado);
    }
    return lista;
}

async function obtenerTutoriaPorId(id) {
    if (estaConectado()) {
        const tutoria = await Tutoria.findOne({
            $or: [{ id: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }]
        });
        if (!tutoria) {
            throw new HttpError(404, `Tutoría con id ${id} no encontrada`);
        }
        return tutoria;
    }

    const tutoria = tutoriasEnMemoria.find((t) => t.id === id);
    if (!tutoria) {
        throw new HttpError(404, `Tutoría con id ${id} no encontrada`);
    }
    return tutoria;
}

async function obtenerTutoriasPorTutor(tutorId, tutorNombres) {
    if (estaConectado()) {
        const condiciones = [];
        if (tutorId) {
            condiciones.push({ tutorId: tutorId });
            condiciones.push({ tutorId: '2' });
            condiciones.push({ tutorId: 'tutor-1' });
        }
        if (tutorNombres) {
            condiciones.push({
                tutorNombres: { $regex: new RegExp(tutorNombres, 'i') }
            });
        }
        const query = condiciones.length > 0 ? { $or: condiciones } : {};
        const resultados = await Tutoria.find(query).sort({ createdAt: -1 });
        if (resultados.length > 0) return resultados;
        return await Tutoria.find().sort({ createdAt: -1 });
    }

    if (tutorId || tutorNombres) {
        const normalizar = (s) => (s || '').toLowerCase().trim();
        const filtradas = tutoriasEnMemoria.filter((t) => {
            if (tutorId && (t.tutorId === tutorId || t.tutorId === '2' || t.tutorId === 'tutor-1')) {
                return true;
            }
            if (tutorNombres && normalizar(`${t.tutorNombres} ${t.tutorApellidos}`).includes(normalizar(tutorNombres))) {
                return true;
            }
            return false;
        });
        if (filtradas.length > 0) return filtradas;
    }

    return [...tutoriasEnMemoria];
}

async function agendarTutoria(datos) {
    const id = `tutoria-${Date.now()}`;
    const esVirtual = datos.modalidad === 'Virtual';

    const fechaTexto = datos.fechaTexto || `${datos.diaSemana || 'LUN'} ${datos.diaNumero || 2}, ${datos.franjaTexto || '9:00 - 10:30 AM'}`;
    const lugarTexto = esVirtual ? 'Virtual - Google Meets' : (datos.lugarOSede || 'Sede Claustro');
    const linkReunion = esVirtual ? (datos.linkReunion || 'https://meet.google.com/foj-amx-bqp?pli=1&authuser=1') : '';

    const nuevaTutoria = {
        id,
        tutorId: datos.tutorId,
        tutorNombres: datos.tutorNombres || '',
        tutorApellidos: datos.tutorApellidos || '',
        tutorIniciales: datos.tutorIniciales || `${(datos.tutorNombres || 'T').charAt(0)}${(datos.tutorApellidos || 'U').charAt(0)}`.toUpperCase(),
        tutorSemestreTexto: datos.tutorSemestreTexto || '',
        fechaTexto,
        tiempoRestanteTexto: 'En 3 dias',
        lugarTexto,
        materia: datos.materia || 'Cálculo II',
        estado: 'pendiente',
        esVirtual,
        linkReunion,
        puedeCalificar: false,
        estudianteId: datos.estudianteId || '1',
        estudianteNombres: datos.estudianteNombres || 'Daniela',
        estudianteApellidos: datos.estudianteApellidos || 'Moreno',
        estudianteIniciales: datos.estudianteIniciales || `${(datos.estudianteNombres || 'D').charAt(0)}${(datos.estudianteApellidos || 'M').charAt(0)}`.toUpperCase(),
        estudianteCorreo: datos.estudianteCorreo || 'dmoreno@urosario.edu.co',
        estudianteCarrera: datos.estudianteCarrera || '6º semestre ISE',
        estudianteTelefono: datos.estudianteTelefono || '320 4051954',
        estudianteSemestreCompleto: datos.estudianteSemestreCompleto || 'sexto semestre Ingenieria de Sistemas',
        estudianteAvatar: datos.estudianteAvatar || '',
        detalles: datos.detalles || '',
        nombresArchivos: Array.isArray(datos.nombresArchivos) ? datos.nombresArchivos : []
    };

    if (estaConectado()) {
        const doc = new Tutoria(nuevaTutoria);
        return await doc.save();
    }

    tutoriasEnMemoria.unshift(nuevaTutoria);
    return nuevaTutoria;
}

async function actualizarLinkReunion(id, linkReunion) {
    if (estaConectado()) {
        const tutoria = await Tutoria.findOneAndUpdate(
            { $or: [{ id: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }] },
            { linkReunion },
            { new: true }
        );
        if (!tutoria) {
            throw new HttpError(404, `Tutoría con id ${id} no encontrada`);
        }
        return tutoria;
    }

    const index = tutoriasEnMemoria.findIndex((t) => t.id === id);
    if (index === -1) {
        throw new HttpError(404, `Tutoría con id ${id} no encontrada`);
    }
    tutoriasEnMemoria[index].linkReunion = linkReunion;
    return tutoriasEnMemoria[index];
}

async function actualizarEstadoTutoria(id, nuevoEstado) {
    const validos = ['pendiente', 'completada', 'cancelada'];
    if (!validos.includes(nuevoEstado)) {
        throw new HttpError(400, `Estado inválido. Debe ser uno de: ${validos.join(', ')}`);
    }

    const tiempoRestante = nuevoEstado === 'completada' ? 'Finalizada' : undefined;
    const update = { estado: nuevoEstado };
    if (tiempoRestante) update.tiempoRestanteTexto = tiempoRestante;

    if (estaConectado()) {
        const tutoria = await Tutoria.findOneAndUpdate(
            { $or: [{ id: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }] },
            update,
            { new: true }
        );
        if (!tutoria) {
            throw new HttpError(404, `Tutoría con id ${id} no encontrada`);
        }
        return tutoria;
    }

    const index = tutoriasEnMemoria.findIndex((t) => t.id === id);
    if (index === -1) {
        throw new HttpError(404, `Tutoría con id ${id} no encontrada`);
    }
    tutoriasEnMemoria[index].estado = nuevoEstado;
    if (tiempoRestante) {
        tutoriasEnMemoria[index].tiempoRestanteTexto = tiempoRestante;
    }
    return tutoriasEnMemoria[index];
}

async function calificarTutoria(id, calificacion, comentarios) {
    const califNum = Number(calificacion);
    if (isNaN(califNum) || califNum < 1 || califNum > 5) {
        throw new HttpError(400, 'La calificación debe ser un número entre 1 y 5');
    }

    const update = {
        calificacion: califNum,
        comentarioEstudiante: comentarios || '',
        puedeCalificar: false,
        estado: 'completada',
        tiempoRestanteTexto: 'Finalizada'
    };

    if (estaConectado()) {
        const tutoria = await Tutoria.findOneAndUpdate(
            { $or: [{ id: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }] },
            update,
            { new: true }
        );
        if (!tutoria) {
            throw new HttpError(404, `Tutoría con id ${id} no encontrada`);
        }
        return tutoria;
    }

    const index = tutoriasEnMemoria.findIndex((t) => t.id === id);
    if (index === -1) {
        throw new HttpError(404, `Tutoría con id ${id} no encontrada`);
    }
    tutoriasEnMemoria[index] = { ...tutoriasEnMemoria[index], ...update };
    return tutoriasEnMemoria[index];
}

async function cancelarTutoria(id) {
    return await actualizarEstadoTutoria(id, 'cancelada');
}

module.exports = {
    listarTutorias,
    obtenerTutoriaPorId,
    obtenerTutoriasPorTutor,
    agendarTutoria,
    actualizarLinkReunion,
    actualizarEstadoTutoria,
    calificarTutoria,
    cancelarTutoria
};
