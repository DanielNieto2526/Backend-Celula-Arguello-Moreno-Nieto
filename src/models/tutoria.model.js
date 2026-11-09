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
        fechaTexto: {
            type: String,
            required: [true, 'La fecha de la tutoría es requerida']
        },
        tiempoRestanteTexto: {
            type: String,
            default: 'En 3 dias'
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
            default: '1'
        },
        estudianteNombres: {
            type: String,
            default: 'Daniela'
        },
        estudianteApellidos: {
            type: String,
            default: 'Moreno'
        },
        estudianteIniciales: {
            type: String,
            default: 'DM'
        },
        estudianteCorreo: {
            type: String,
            default: 'dmoreno@urosario.edu.co'
        },
        estudianteTelefono: {
            type: String,
            default: '320 4051954'
        },
        estudianteCarrera: {
            type: String,
            default: '6º semestre ISE'
        },
        estudianteSemestreCompleto: {
            type: String,
            default: 'sexto semestre Ingenieria de Sistemas'
        },
        estudianteAvatar: {
            type: String,
            default: ''
        },
        detalles: {
            type: String,
            default: ''
        },
        nombresArchivos: {
            type: [String],
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
