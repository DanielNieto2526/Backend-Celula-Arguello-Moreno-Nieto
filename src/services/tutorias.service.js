const Tutoria = require('../models/tutoria.model');
const { estaConectado } = require('../config/db');
const { TUTORIAS_INICIALES } = require('../utils/seedData');
const HttpError = require('../utils/HttpError');

let tutoriasEnMemoria = [...TUTORIAS_INICIALES];

const MESES_MAP = {
    enero: 0, ene: 0,
    febrero: 1, feb: 1,
    marzo: 2, mar: 2,
    abril: 3, abr: 3,
    mayo: 4, may: 4,
    junio: 5, jun: 5,
    julio: 6, jul: 6,
    agosto: 7, ago: 7,
    septiembre: 8, sep: 8, sept: 8,
    octubre: 9, oct: 9,
    noviembre: 10, nov: 10,
    diciembre: 11, dic: 11
};

function calcularTiempoRestante(fechaISO, fechaTexto, estado, calificacion) {
    if (estado === 'completada') return 'Finalizada';
    if (estado === 'cancelada') return 'Cancelada';
    if (calificacion !== undefined && calificacion !== null && Number(calificacion) > 0) return 'Ya Tomada';

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    let target = null;

    if (fechaISO && /^\d{4}-\d{2}-\d{2}/.test(fechaISO)) {
        const parts = fechaISO.substring(0, 10).split('-').map(Number);
        target = new Date(parts[0], parts[1] - 1, parts[2], 0, 0, 0, 0);
    } else if (fechaTexto) {
        const matchCompleto = String(fechaTexto).match(/(\d{1,2})\s+de\s+([a-zA-ZáéíóúÁÉÍÓÚ]+)(?:\s+de\s+(\d{4}))?/i);
        if (matchCompleto) {
            const dia = parseInt(matchCompleto[1], 10);
            const mesStr = matchCompleto[2].toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
            const mes = MESES_MAP[mesStr] !== undefined ? MESES_MAP[mesStr] : hoy.getMonth();
            let anio = matchCompleto[3] ? parseInt(matchCompleto[3], 10) : hoy.getFullYear();

            if (!matchCompleto[3]) {
                if (mes < hoy.getMonth() || (mes === hoy.getMonth() && dia < hoy.getDate() - 15)) {
                    anio += 1;
                }
            }
            target = new Date(anio, mes, dia, 0, 0, 0, 0);
        } else {
            const matchSimple = String(fechaTexto).match(/(?:[a-zA-ZáéíóúÁÉÍÓÚ]+)\s+(\d{1,2})/i);
            if (matchSimple) {
                const dia = parseInt(matchSimple[1], 10);
                let anio = hoy.getFullYear();
                let mes = hoy.getMonth();
                if (dia < hoy.getDate() - 15) {
                    mes += 1;
                    if (mes > 11) {
                        mes = 0;
                        anio += 1;
                    }
                }
                target = new Date(anio, mes, dia, 0, 0, 0, 0);
            }
        }
    }

    if (!target || isNaN(target.getTime())) {
        return 'En 2 dias';
    }

    const diffMs = target.getTime() - hoy.getTime();
    const diffDias = Math.round(diffMs / (1000 * 60 * 60 * 24));

    if (diffDias < 0) return 'Ya Tomada';
    if (diffDias === 0) return 'Hoy';
    if (diffDias === 1) return 'En 1 dia';
    return `En ${diffDias} dias`;
}

async function listarTutorias(filtros = {}) {
    if (estaConectado()) {
        const query = {};
        if (filtros.estudianteId && filtros.estudianteCorreo) {
            query.$or = [
                { estudianteId: filtros.estudianteId },
                { estudianteCorreo: filtros.estudianteCorreo.toLowerCase().trim() }
            ];
        } else if (filtros.estudianteId) {
            query.$or = [
                { estudianteId: filtros.estudianteId },
                { estudianteCorreo: filtros.estudianteId.toLowerCase().trim() }
            ];
        } else if (filtros.estudianteCorreo) {
            query.estudianteCorreo = filtros.estudianteCorreo.toLowerCase().trim();
        }
        if (filtros.estado) {
            query.estado = filtros.estado;
        } else {
            // Excluir tutorías canceladas por defecto para no mostrar sesiones eliminadas
            query.estado = { $ne: 'cancelada' };
        }
        const docs = await Tutoria.find(query).sort({ createdAt: -1 });
        try {
            const Tutor = require('../models/tutor.model');
            return await Promise.all(
                docs.map(async (doc) => {
                    const item = doc.toJSON ? doc.toJSON() : { ...doc._doc };
                    item.tiempoRestanteTexto = calcularTiempoRestante(item.fechaISO, item.fechaTexto, item.estado, item.calificacion);
                    if (!item.tutorAvatar && (item.tutorId || item.tutorUsuarioId)) {
                        try {
                            const tut = await Tutor.findOne({ $or: [{ id: item.tutorId }, { usuarioId: item.tutorId }] });
                            if (tut && (tut.avatarUrl || tut.fotoPerfil)) {
                                item.tutorAvatar = tut.avatarUrl || tut.fotoPerfil;
                            }
                        } catch {}
                    }
                    return item;
                })
            );
        } catch {
            return docs.map((d) => {
                const item = d.toJSON ? d.toJSON() : { ...d._doc };
                item.tiempoRestanteTexto = calcularTiempoRestante(item.fechaISO, item.fechaTexto, item.estado, item.calificacion);
                return item;
            });
        }
    }

    let lista = tutoriasEnMemoria.map((t) => ({
        ...t,
        tiempoRestanteTexto: calcularTiempoRestante(t.fechaISO, t.fechaTexto, t.estado, t.calificacion)
    }));
    if (filtros.estudianteId) {
        lista = lista.filter((t) => t.estudianteId === filtros.estudianteId);
    }
    if (filtros.estado) {
        lista = lista.filter((t) => t.estado === filtros.estado);
    } else {
        lista = lista.filter((t) => t.estado !== 'cancelada');
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

        // Enriquecer en vivo con datos actualizados del estudiante y del tutor en MongoDB
        try {
            const Usuario = require('../models/usuario.model');
            const Tutor = require('../models/tutor.model');

            if (tutoria.estudianteId || tutoria.estudianteCorreo) {
                const queryEst = [];
                if (tutoria.estudianteId) {
                    queryEst.push({ id: tutoria.estudianteId });
                    if (/^[0-9a-fA-F]{24}$/.test(tutoria.estudianteId)) queryEst.push({ _id: tutoria.estudianteId });
                }
                if (tutoria.estudianteCorreo) queryEst.push({ correo: tutoria.estudianteCorreo.toLowerCase() });
                const docEst = await Usuario.findOne({ $or: queryEst });
                if (docEst) {
                    if (docEst.telefono) tutoria.estudianteTelefono = docEst.telefono;
                    if (docEst.avatarUrl) tutoria.estudianteAvatar = docEst.avatarUrl;
                    if (docEst.nombres) tutoria.estudianteNombres = docEst.nombres;
                    if (docEst.apellidos) tutoria.estudianteApellidos = docEst.apellidos;
                    if (docEst.carrera) tutoria.estudianteCarrera = docEst.carrera;
                    if (docEst.semestreTexto) tutoria.estudianteSemestreCompleto = docEst.semestreTexto;
                }
            }

            if (tutoria.tutorId || tutoria.tutorUsuarioId) {
                const queryTut = [];
                if (tutoria.tutorId) {
                    queryTut.push({ id: tutoria.tutorId });
                    queryTut.push({ usuarioId: tutoria.tutorId });
                }
                if (tutoria.tutorUsuarioId) {
                    queryTut.push({ id: tutoria.tutorUsuarioId });
                    queryTut.push({ usuarioId: tutoria.tutorUsuarioId });
                }
                const docTut = await Tutor.findOne({ $or: queryTut });
                if (docTut && (docTut.avatarUrl || docTut.fotoPerfil)) {
                    tutoria.tutorAvatar = docTut.avatarUrl || docTut.fotoPerfil;
                }
            }
        } catch {
            // continuar si falla enriquecimiento en vivo
        }

        tutoria.tiempoRestanteTexto = calcularTiempoRestante(tutoria.fechaISO, tutoria.fechaTexto, tutoria.estado, tutoria.calificacion);
        return tutoria;
    }

    const tutoria = tutoriasEnMemoria.find((t) => t.id === id);
    if (!tutoria) {
        throw new HttpError(404, `Tutoría con id ${id} no encontrada`);
    }
    tutoria.tiempoRestanteTexto = calcularTiempoRestante(tutoria.fechaISO, tutoria.fechaTexto, tutoria.estado, tutoria.calificacion);
    return tutoria;
}

async function obtenerTutoriasPorTutor(tutorId, tutorNombres) {
    if (estaConectado()) {
        const Tutor = require('../models/tutor.model');
        let tutorDoc = null;
        if (tutorId) {
            const queryOr = [{ id: tutorId }, { usuarioId: tutorId }];
            if (/^[0-9a-fA-F]{24}$/.test(tutorId)) {
                queryOr.push({ _id: tutorId });
            }
            tutorDoc = await Tutor.findOne({ $or: queryOr });
        }

        const condiciones = [];
        if (tutorId) {
            condiciones.push({ tutorId: tutorId });
            condiciones.push({ tutorUsuarioId: tutorId });
        }
        if (tutorDoc) {
            if (tutorDoc.id) {
                condiciones.push({ tutorId: tutorDoc.id });
                condiciones.push({ tutorUsuarioId: tutorDoc.id });
            }
            if (tutorDoc.usuarioId) {
                condiciones.push({ tutorId: tutorDoc.usuarioId });
                condiciones.push({ tutorUsuarioId: tutorDoc.usuarioId });
            }
        }
        if (tutorNombres && tutorNombres.trim()) {
            const regex = new RegExp(tutorNombres.trim().replace(/\s+/g, '.*'), 'i');
            condiciones.push({
                $expr: {
                    $regexMatch: {
                        input: { $concat: ['$tutorNombres', ' ', '$tutorApellidos'] },
                        regex: regex
                    }
                }
            });
        }
        if (condiciones.length === 0) {
            return [];
        }
        const tutorias = await Tutoria.find({ $or: condiciones }).sort({ createdAt: -1 });
        try {
            const Usuario = require('../models/usuario.model');
            return await Promise.all(
                tutorias.map(async (t) => {
                    const tutObj = t.toJSON ? t.toJSON() : { ...t._doc };
                    tutObj.tiempoRestanteTexto = calcularTiempoRestante(tutObj.fechaISO, tutObj.fechaTexto, tutObj.estado, tutObj.calificacion);
                    if (!tutObj.estudianteAvatar && (tutObj.estudianteId || tutObj.estudianteCorreo)) {
                        try {
                            const queryEst = [];
                            if (tutObj.estudianteId) queryEst.push({ id: tutObj.estudianteId });
                            if (tutObj.estudianteCorreo) queryEst.push({ correo: tutObj.estudianteCorreo.toLowerCase() });
                            const estDoc = await Usuario.findOne({ $or: queryEst });
                            if (estDoc && estDoc.avatarUrl) {
                                tutObj.estudianteAvatar = estDoc.avatarUrl;
                            }
                        } catch {}
                    }
                    return tutObj;
                })
            );
        } catch {
            return tutorias.map((t) => {
                const tutObj = t.toJSON ? t.toJSON() : { ...t._doc };
                tutObj.tiempoRestanteTexto = calcularTiempoRestante(tutObj.fechaISO, tutObj.fechaTexto, tutObj.estado, tutObj.calificacion);
                return tutObj;
            });
        }
    }

    if (tutorId || tutorNombres) {
        const normalizar = (s) => (s || '').toLowerCase().trim();
        return tutoriasEnMemoria
            .filter((t) => {
                if (tutorId && (t.tutorId === tutorId || t.tutorUsuarioId === tutorId)) {
                    return true;
                }
                if (tutorNombres && normalizar(`${t.tutorNombres} ${t.tutorApellidos}`).includes(normalizar(tutorNombres))) {
                    return true;
                }
                return false;
            })
            .map((t) => ({
                ...t,
                tiempoRestanteTexto: calcularTiempoRestante(t.fechaISO, t.fechaTexto, t.estado, t.calificacion)
            }));
    }

    return [];
}

async function agendarTutoria(datos) {
    const id = `tutoria-${Date.now()}`;
    const esVirtual = datos.modalidad === 'Virtual';

    let tutorEncontrado = null;
    let estudianteEncontrado = null;
    if (estaConectado()) {
        const Tutor = require('../models/tutor.model');
        const Usuario = require('../models/usuario.model');

        const queryOr = [{ id: datos.tutorId }, { usuarioId: datos.tutorId }];
        if (datos.tutorId && /^[0-9a-fA-F]{24}$/.test(datos.tutorId)) {
            queryOr.push({ _id: datos.tutorId });
        }
        tutorEncontrado = await Tutor.findOne({ $or: queryOr });

        const queryEst = [];
        if (datos.estudianteId) {
            queryEst.push({ id: datos.estudianteId });
            if (/^[0-9a-fA-F]{24}$/.test(datos.estudianteId)) queryEst.push({ _id: datos.estudianteId });
        }
        if (datos.estudianteCorreo) {
            queryEst.push({ correo: datos.estudianteCorreo.toLowerCase().trim() });
        }
        if (queryEst.length > 0) {
            estudianteEncontrado = await Usuario.findOne({ $or: queryEst });
        }
    }

    const tutorIdFinal = datos.tutorId || (tutorEncontrado ? tutorEncontrado.id : '');
    const tutorUsuarioIdFinal = datos.tutorUsuarioId || (tutorEncontrado ? tutorEncontrado.usuarioId : '');
    const tutorNombres = datos.tutorNombres || (tutorEncontrado ? tutorEncontrado.nombres : '');
    const tutorApellidos = datos.tutorApellidos || (tutorEncontrado ? tutorEncontrado.apellidos : '');
    const tutorIniciales = datos.tutorIniciales || (tutorEncontrado ? tutorEncontrado.iniciales : `${(tutorNombres || 'T').charAt(0)}${(tutorApellidos || 'U').charAt(0)}`.toUpperCase());
    const tutorSemestreTexto = datos.tutorSemestreTexto || (tutorEncontrado ? tutorEncontrado.semestreTexto : '');
    const tutorAvatar = datos.tutorAvatar || (tutorEncontrado ? (tutorEncontrado.avatarUrl || tutorEncontrado.fotoPerfil) : '') || '';

    const duracionHoras = Number(datos.duracionHoras) || 1;
    const precioPorHora = tutorEncontrado ? (Number(tutorEncontrado.precioHora) || 0) : (Number(datos.precioHora) || 0);
    const precioTotal = Number(datos.precioTotal) || (precioPorHora * duracionHoras);

    const estudianteIdFinal = datos.estudianteId || (estudianteEncontrado ? estudianteEncontrado.id : '');
    const estudianteNombres = datos.estudianteNombres || (estudianteEncontrado ? estudianteEncontrado.nombres : '');
    const estudianteApellidos = datos.estudianteApellidos || (estudianteEncontrado ? estudianteEncontrado.apellidos : '');
    const estudianteIniciales = datos.estudianteIniciales || (estudianteNombres && estudianteApellidos ? `${estudianteNombres.charAt(0)}${estudianteApellidos.charAt(0)}`.toUpperCase() : '');
    const estudianteCorreo = datos.estudianteCorreo || (estudianteEncontrado ? estudianteEncontrado.correo : '');
    const estudianteCarrera = datos.estudianteCarrera || (estudianteEncontrado ? estudianteEncontrado.carrera : '') || '';
    const estudianteTelefono = datos.estudianteTelefono !== undefined && datos.estudianteTelefono !== null ? datos.estudianteTelefono : (estudianteEncontrado ? estudianteEncontrado.telefono : '') || '';
    const estudianteSemestreCompleto = datos.estudianteSemestreCompleto || (estudianteEncontrado ? estudianteEncontrado.semestreTexto : '') || '';
    const estudianteAvatar = datos.estudianteAvatar || (estudianteEncontrado ? estudianteEncontrado.avatarUrl : '') || '';

    const fechaTexto = datos.fechaTexto || `${datos.diaSemana || 'LUN'} ${datos.diaNumero || 2}, ${datos.franjaTexto || '9:00 - 10:30 AM'}`;
    const fechaISO = datos.fechaISO || (datos.fecha ? datos.fecha : '');
    const tiempoRestanteTexto = calcularTiempoRestante(fechaISO, fechaTexto, 'pendiente');
    const lugarTexto = esVirtual ? 'Virtual - Google Meets' : (datos.lugarOSede || 'Sede Claustro');
    const linkReunion = esVirtual ? (datos.linkReunion || 'https://meet.google.com/foj-amx-bqp?pli=1&authuser=1') : '';

    const archivosFinales = Array.isArray(datos.archivos) ? datos.archivos : (Array.isArray(datos.archivosAdjuntos) ? datos.archivosAdjuntos : []);
    const nombresArchivos = Array.isArray(datos.nombresArchivos) && datos.nombresArchivos.length > 0
        ? datos.nombresArchivos
        : archivosFinales.map((a) => (a && a.nombre ? a.nombre : 'archivo')).filter(Boolean);

    const nuevaTutoria = {
        id,
        tutorId: tutorIdFinal,
        tutorUsuarioId: tutorUsuarioIdFinal,
        tutorNombres,
        tutorApellidos,
        tutorIniciales,
        tutorSemestreTexto,
        tutorAvatar,
        fechaTexto,
        fechaISO,
        tiempoRestanteTexto,
        lugarTexto,
        materia: datos.materia || (tutorEncontrado ? tutorEncontrado.materiaPrincipal : ''),
        modalidad: datos.modalidad || (esVirtual ? 'Virtual' : 'Presencial'),
        franjaTexto: datos.franjaTexto || '',
        diaSemana: datos.diaSemana || '',
        diaNumero: Number(datos.diaNumero) || 0,
        mes: datos.mes || '',
        año: Number(datos.año) || new Date().getFullYear(),
        duracionHoras,
        precioHora: precioPorHora,
        precioTotal,
        estado: 'pendiente',
        esVirtual,
        linkReunion,
        puedeCalificar: false,
        estudianteId: estudianteIdFinal,
        estudianteNombres,
        estudianteApellidos,
        estudianteIniciales,
        estudianteCorreo,
        estudianteCarrera,
        estudianteTelefono,
        estudianteSemestreCompleto,
        estudianteAvatar,
        detalles: datos.detalles || '',
        nombresArchivos,
        archivos: archivosFinales,
        archivosAdjuntos: archivosFinales
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
            { returnDocument: 'after' }
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
            { returnDocument: 'after' }
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
            { returnDocument: 'after' }
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
    if (estaConectado()) {
        const queryOr = [{ id: id }];
        if (/^[0-9a-fA-F]{24}$/.test(id)) {
            queryOr.push({ _id: id });
        }
        // Eliminar directamente de MongoDB Atlas para que la cancelación sea definitiva y no reaparezca
        const eliminada = await Tutoria.findOneAndDelete({ $or: queryOr });
        if (!eliminada) {
            // Si ya no existe o falló por índice, intentar borrado por id
            await Tutoria.deleteOne({ id });
        }
        return { id, estado: 'cancelada', mensaje: 'Tutoría cancelada y eliminada con éxito' };
    }

    tutoriasEnMemoria = tutoriasEnMemoria.filter((t) => t.id !== id);
    return { id, estado: 'cancelada' };
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
