const mongoose = require('mongoose');

const franjaHorariaSchema = new mongoose.Schema(
    {
        id: { type: String },
        texto: { type: String },
        disponible: { type: Boolean, default: true }
    },
    { _id: false }
);

const diaDisponibleSchema = new mongoose.Schema(
    {
        diaSemana: { type: String, required: true },
        numero: { type: Number, required: true },
        disponible: { type: Boolean, default: true },
        franjas: [franjaHorariaSchema]
    },
    { _id: false }
);

const tutorSchema = new mongoose.Schema(
    {
        id: {
            type: String,
            unique: true,
            sparse: true
        },
        usuarioId: {
            type: String,
            default: ''
        },
        nombres: {
            type: String,
            required: [true, 'Los nombres son requeridos'],
            trim: true
        },
        apellidos: {
            type: String,
            required: [true, 'Los apellidos son requeridos'],
            trim: true
        },
        iniciales: {
            type: String,
            default: ''
        },
        semestreTexto: {
            type: String,
            default: ''
        },
        sede: {
            type: String,
            default: 'Claustro'
        },
        modalidad: {
            type: String,
            default: 'Presencial'
        },
        descripcion: {
            type: String,
            default: ''
        },
        precioHora: {
            type: Number,
            default: 20000
        },
        precioFormato: {
            type: String,
            default: '$20.000 x hora'
        },
        materiaPrincipal: {
            type: String,
            default: 'Cálculo II'
        },
        estrellas: {
            type: Number,
            default: 5.0
        },
        diasDisponibles: [diaDisponibleSchema],
        cursos: {
            type: [String],
            default: []
        },
        correo: {
            type: String,
            trim: true,
            lowercase: true
        },
        activo: {
            type: Boolean,
            default: true
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

const Tutor = mongoose.model('Tutor', tutorSchema);

module.exports = Tutor;
