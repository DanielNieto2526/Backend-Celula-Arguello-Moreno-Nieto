const mongoose = require('mongoose');

const resenaSchema = new mongoose.Schema(
    {
        id: {
            type: String,
            unique: true,
            sparse: true
        },
        tutorId: {
            type: String,
            required: [true, 'El ID del tutor es requerido']
        },
        tutorNombres: {
            type: String,
            default: ''
        },
        tutoriaId: {
            type: String,
            default: ''
        },
        autor: {
            type: String,
            required: [true, 'El nombre del autor es requerido']
        },
        calificacion: {
            type: Number,
            required: [true, 'La calificación es requerida'],
            min: 1,
            max: 5
        },
        pregunta1: {
            type: Number,
            min: 1,
            max: 5
        },
        pregunta2: {
            type: Number,
            min: 1,
            max: 5
        },
        pregunta3: {
            type: Number,
            min: 1,
            max: 5
        },
        pregunta4: {
            type: Number,
            min: 1,
            max: 5
        },
        comentario: {
            type: String,
            default: ''
        },
        fecha: {
            type: String,
            default: 'Hoy'
        }
    },
    {
        timestamps: true,
        versionKey: false,
        toJSON: {
            virtuals: true,
            transform: (doc, ret) => {
                ret.id = ret.id || ret._id.toString();
                delete ret._id;
                return ret;
            }
        }
    }
);

const Resena = mongoose.model('Resena', resenaSchema);

module.exports = Resena;
