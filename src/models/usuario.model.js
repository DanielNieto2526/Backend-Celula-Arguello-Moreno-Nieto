const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema(
    {
        id: {
            type: String,
            unique: true,
            sparse: true
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
        correo: {
            type: String,
            required: [true, 'El correo institucional es requerido'],
            unique: true,
            trim: true,
            lowercase: true
        },
        clave: {
            type: String,
            default: 'conecta2026'
        },
        rol: {
            type: String,
            enum: ['estudiante', 'tutor', 'admin'],
            default: 'estudiante'
        },
        semestre: {
            type: Number,
            default: 1
        },
        semestreTexto: {
            type: String,
            default: ''
        },
        carrera: {
            type: String,
            default: ''
        },
        cursos: {
            type: [String],
            default: []
        },
        avatarUrl: {
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
        precioHora: {
            type: Number,
            default: 20000
        },
        descripcion: {
            type: String,
            default: ''
        },
        materiaPrincipal: {
            type: String,
            default: ''
        },
        telefono: {
            type: String,
            default: ''
        },
        diasDisponibles: {
            type: [String],
            default: []
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

const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;
