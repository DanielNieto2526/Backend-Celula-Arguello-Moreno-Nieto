const mongoose = require('mongoose');

const tutoriaSchema = new mongoose.Schema(
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
        tutorUsuarioId: {
            type: String,
            default: ''
        },
        tutorNombres: {
            type: String,
            required: [true, 'El nombre del tutor es requerido']
        },
        tutorApellidos: {
            type: String,
            required: [true, 'El apellido del tutor es requerido']
        },
        tutorIniciales: {
            type: String,
            default: ''
        },
        tutorSemestreTexto: {
            type: String,
            default: ''
        },
        tutorAvatar: {
            type: String,
            default: ''
        },
        fechaTexto: {
            type: String,
            required: [true, 'La fecha de la tutoría es requerida']
        },
        fechaISO: {
            type: String,
            default: ''
        },
        tiempoRestanteTexto: {
            type: String,
            default: 'En 2 dias'
        },
        lugarTexto: {
            type: String,
            default: 'Virtual - Google Meets'
        },
        materia: {
            type: String,
            required: [true, 'La materia es requerida']
        },
        estado: {
            type: String,
            enum: ['pendiente', 'completada', 'cancelada'],
            default: 'pendiente'
        },
        esVirtual: {
            type: Boolean,
            default: false
        },
        linkReunion: {
            type: String,
            default: ''
        },
        puedeCalificar: {
            type: Boolean,
            default: false
        },
        estudianteId: {
            type: String,
            default: ''
        },
        estudianteNombres: {
            type: String,
            default: ''
        },
        estudianteApellidos: {
            type: String,
            default: ''
        },
        estudianteIniciales: {
            type: String,
            default: ''
        },
        estudianteCorreo: {
            type: String,
            default: ''
        },
        estudianteTelefono: {
            type: String,
            default: ''
        },
        estudianteCarrera: {
            type: String,
            default: ''
        },
        estudianteSemestreCompleto: {
            type: String,
            default: ''
        },
        estudianteAvatar: {
            type: String,
            default: ''
        },
        duracionHoras: {
            type: Number,
            default: 1
        },
        precioHora: {
            type: Number,
            default: 0
        },
        precioTotal: {
            type: Number,
            default: 0
        },
        modalidad: {
            type: String,
            default: ''
        },
        franjaTexto: {
            type: String,
            default: ''
        },
        diaSemana: {
            type: String,
            default: ''
        },
        diaNumero: {
            type: Number,
            default: 0
        },
        mes: {
            type: String,
            default: ''
        },
        año: {
            type: Number,
            default: 0
        },
        detalles: {
            type: String,
            default: ''
        },
        nombresArchivos: {
            type: [String],
            default: []
        },
        archivos: {
            type: [mongoose.Schema.Types.Mixed],
            default: []
        },
        archivosAdjuntos: {
            type: [mongoose.Schema.Types.Mixed],
            default: []
        },
        calificacion: {
            type: Number
        },
        comentarioEstudiante: {
            type: String,
            default: ''
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

const Tutoria = mongoose.model('Tutoria', tutoriaSchema);

module.exports = Tutoria;
