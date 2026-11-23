const Resena = require('../models/resena.model');
const Tutor = require('../models/tutor.model');
const { estaConectado } = require('../config/db');
const { RESENAS_INICIALES, TUTORES_INICIALES } = require('../utils/seedData');
const HttpError = require('../utils/HttpError');

let resenasEnMemoria = [...RESENAS_INICIALES];

function esMismoTutor(tutorAId, tutorBId, tutorBNombres) {
    if (!tutorAId) return false;
    if (tutorBId && tutorAId === tutorBId) return true;

    const normA = String(tutorAId).toLowerCase().trim();
    const normBId = tutorBId ? String(tutorBId).toLowerCase().trim() : '';
    const normBNombres = tutorBNombres ? String(tutorBNombres).toLowerCase().trim() : '';

    // Aliases para Daniel Nieto (verificamos nombre completo para no afectar a otros tutores)
    const esDanielA =
        normA === '2' ||
        normA === 'tutor-1' ||
        (normA.includes('daniel') && normA.includes('nieto'));
    const esDanielB =
        normBId === '2' ||
        normBId === 'tutor-1' ||
        (normBNombres.includes('daniel') && normBNombres.includes('nieto'));
    if (esDanielA && esDanielB) return true;

    // Aliases para Juan Cachon
    const esCachonA =
        normA === 'tutor-jc' ||
        normA === 'tutor-2' ||
        (normA.includes('juan') && normA.includes('cachon'));
    const esCachonB =
        normBId === 'tutor-jc' ||
        normBId === 'tutor-2' ||
        (normBNombres.includes('juan') && normBNombres.includes('cachon'));
    if (esCachonA && esCachonB) return true;

    // Aliases para Gabriela Arevalo
    const esArevaloA =
        normA === 'tutor-ga' ||
        normA === 'tutor-4' ||
        (normA.includes('gabriela') && normA.includes('arevalo'));
    const esArevaloB =
        normBId === 'tutor-ga' ||
        normBId === 'tutor-4' ||
        (normBNombres.includes('gabriela') && normBNombres.includes('arevalo'));
    if (esArevaloA && esArevaloB) return true;

    if (normBNombres && normA === normBNombres) {
        return true;
    }

    return false;
}

async function listarResenas() {
    if (estaConectado()) {
        return await Resena.find().sort({ createdAt: -1 });
    }
    return resenasEnMemoria;
}

async function obtenerResenasPorTutor(tutorId, tutorNombres) {
    const idsPermitidos = new Set();
    if (tutorId) idsPermitidos.add(tutorId.toString().toLowerCase().trim());

    if (estaConectado() && tutorId) {
        const queryOr = [{ id: tutorId }, { usuarioId: tutorId }];
        if (/^[0-9a-fA-F]{24}$/.test(tutorId)) queryOr.push({ _id: tutorId });
        try {
            const doc = await Tutor.findOne({ $or: queryOr });
            if (doc) {
                if (doc.id) idsPermitidos.add(doc.id.toLowerCase().trim());
                if (doc.usuarioId) idsPermitidos.add(doc.usuarioId.toLowerCase().trim());
                if (doc._id) idsPermitidos.add(doc._id.toString().toLowerCase().trim());
            }
        } catch {
            // continuar si falla búsqueda
        }
    }

    const todas = await listarResenas();
    return todas.filter((r) => {
        const rTutorId = (r.tutorId || '').toString().toLowerCase().trim();
        if (idsPermitidos.has(rTutorId)) return true;
        return esMismoTutor(r.tutorId, tutorId, tutorNombres);
    });
}

async function calcularPromedioTutor(tutorId, tutorNombres) {
    const lista = await obtenerResenasPorTutor(tutorId, tutorNombres);
    if (lista.length === 0) {
        return { promedio: 5.0, total: 0, estrellas: 5 };
    }

    const suma = lista.reduce((acc, r) => acc + (Number(r.calificacion) || 5), 0);
    const promedioCrudo = suma / lista.length;
    const promedio = Math.round(promedioCrudo * 10) / 10;
    const estrellas = Math.max(1, Math.min(5, Math.round(promedio)));

    return { promedio, total: lista.length, estrellas };
}

async function crearResena(datos) {
    if (!datos.tutorId) {
        throw new HttpError(400, 'El ID del tutor es requerido para registrar la reseña');
    }
    if (!datos.autor) {
        throw new HttpError(400, 'El autor de la reseña es requerido');
    }

    const calif = Number(datos.calificacion);
    if (isNaN(calif) || calif < 1 || calif > 5) {
        throw new HttpError(400, 'La calificación debe ser un número entre 1 y 5');
    }

    const nuevaResena = {
        id: datos.id || `res-${Date.now()}`,
        tutorId: datos.tutorId,
        tutorNombres: datos.tutorNombres || '',
        tutoriaId: datos.tutoriaId || '',
        autor: datos.autor,
        calificacion: calif,
        pregunta1: Number(datos.pregunta1) || calif,
        pregunta2: Number(datos.pregunta2) || calif,
        pregunta3: Number(datos.pregunta3) || calif,
        pregunta4: Number(datos.pregunta4) || calif,
        comentario: datos.comentario || '',
        fecha: datos.fecha || 'Hoy'
    };

    if (estaConectado()) {
        const doc = new Resena(nuevaResena);
        await doc.save();

        // Actualizar promedio de estrellas en el tutor
        const { promedio } = await calcularPromedioTutor(datos.tutorId, datos.tutorNombres);
        await Tutor.findOneAndUpdate(
            { $or: [{ id: datos.tutorId }, { usuarioId: datos.tutorId }] },
            { estrellas: promedio }
        );

        return doc;
    }

    resenasEnMemoria.unshift(nuevaResena);
    return nuevaResena;
}

module.exports = {
    listarResenas,
    obtenerResenasPorTutor,
    calcularPromedioTutor,
    crearResena
};
