const Resena = require('../models/resena.model');
const Tutor = require('../models/tutor.model');
const { estaConectado } = require('../config/db');
const { RESENAS_INICIALES, TUTORES_INICIALES } = require('../utils/seedData');
const HttpError = require('../utils/HttpError');

let resenasEnMemoria = [...RESENAS_INICIALES];

function esMismoTutor(tutorAId, tutorBId, tutorBNombres) {
    if (!tutorAId) return false;
    if (tutorBId && tutorAId === tutorBId) return true;

    // Aliases para Daniel Nieto
    const esDanielA =
        tutorAId === '2' ||
        tutorAId === 'tutor-1' ||
        tutorAId.toLowerCase().includes('nieto') ||
        tutorAId.toLowerCase().includes('daniel');
    const esDanielB =
        tutorBId === '2' ||
        tutorBId === 'tutor-1' ||
        (tutorBNombres &&
            (tutorBNombres.toLowerCase().includes('daniel') ||
                tutorBNombres.toLowerCase().includes('nieto')));
    if (esDanielA && esDanielB) return true;

    // Aliases para Juan Cachon
    const esCachonA =
        tutorAId === 'tutor-jc' ||
        tutorAId === 'tutor-2' ||
        tutorAId.toLowerCase().includes('cachon');
    const esCachonB =
        tutorBId === 'tutor-jc' ||
        tutorBId === 'tutor-2' ||
        (tutorBNombres && tutorBNombres.toLowerCase().includes('cachon'));
    if (esCachonA && esCachonB) return true;

    // Aliases para Gabriela Arevalo
    const esArevaloA =
        tutorAId === 'tutor-ga' ||
        tutorAId === 'tutor-4' ||
        tutorAId.toLowerCase().includes('arevalo');
    const esArevaloB =
        tutorBId === 'tutor-ga' ||
        tutorBId === 'tutor-4' ||
        (tutorBNombres && tutorBNombres.toLowerCase().includes('arevalo'));
    if (esArevaloA && esArevaloB) return true;

    if (tutorBNombres && tutorAId.toLowerCase() === tutorBNombres.toLowerCase().trim()) {
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
    const todas = await listarResenas();
    return todas.filter((r) => esMismoTutor(r.tutorId, tutorId, tutorNombres));
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
