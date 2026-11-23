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
        avatarUrl: {
            type: String,
            default: ''
        },
        fotoPerfil: {
            type: String,
            default: ''
        },
        telefono: {
            type: String,
            default: ''
        },
        descripcion: {
            type: String,
            default: ''
        },
        precioHora: {
            type: Number,
            default: 0
        },
        precioFormato: {
            type: String,
            default: 'A convenir'
        },
        materiaPrincipal: {
            type: String,
            default: ''
        },
        estrellas: {
            type: Number,
            default: 0
        },
        diasDisponibles: {
            type: [mongoose.Schema.Types.Mixed],
            default: []
        },
        salones: {
            type: [mongoose.Schema.Types.Mixed],
            default: []
        },
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
            default: false
        },
        estadoAprobacion: {
            type: String,
            enum: ['pendiente', 'aprobado', 'rechazado'],
            default: 'pendiente'
        },
        notaMateria: {
            type: Number,
            default: 0
        },
        promedioAcumulado: {
            type: Number,
            default: 0
        },
        soporteNotasNombre: {
            type: String,
            default: ''
        },
        soporteNotasUrl: {
            type: String,
            default: ''
        },
        motivoRechazo: {
            type: String,
            default: ''
        },
        fechaRegistro: {
            type: String,
            default: () => new Date().toLocaleDateString('es-CO')
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
