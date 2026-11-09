/**
 * Datos semilla iniciales para ConectaTutor (Universidad del Rosario).
 * Reflejan los datos iniciales y estructura del Frontend.
 */

const DIAS_MOCK_DEFECTO = [
    {
        diaSemana: 'MAR',
        numero: 2,
        disponible: true,
        franjas: [
            { id: 'f-1', texto: '9:00 - 10:30 AM', disponible: true },
            { id: 'f-2', texto: '11:00 - 12:30 PM', disponible: true },
            { id: 'f-3', texto: '2:00 - 3:00 PM', disponible: true },
            { id: 'f-4', texto: '3:00 - 4:00 PM', disponible: false }
        ]
    },
    {
        diaSemana: 'MIE',
        numero: 3,
        disponible: true,
        franjas: [
            { id: 'f-1', texto: '9:00 - 10:30 AM', disponible: false },
            { id: 'f-2', texto: '2:00 - 3:00 PM', disponible: true },
            { id: 'f-3', texto: '3:00 - 4:00 PM', disponible: true }
        ]
    },
    {
        diaSemana: 'JUE',
        numero: 4,
        disponible: true,
        franjas: [
            { id: 'f-1', texto: '10:00 - 11:30 AM', disponible: true },
            { id: 'f-2', texto: '2:00 - 3:00 PM', disponible: true }
        ]
    },
    {
        diaSemana: 'VIE',
        numero: 5,
        disponible: true,
        franjas: [
            { id: 'f-1', texto: '9:00 - 10:30 AM', disponible: true },
            { id: 'f-2', texto: '10:00 - 12:00 PM', disponible: false },
            { id: 'f-3', texto: '2:00 - 3:00 PM', disponible: true },
            { id: 'f-4', texto: '3:00 - 4:00 PM', disponible: true }
        ]
    },
    {
        diaSemana: 'SAB',
        numero: 6,
        disponible: false,
        franjas: []
    },
    {
        diaSemana: 'LUN',
        numero: 7,
        disponible: true,
        franjas: [
            { id: 'f-1', texto: '8:00 - 9:30 AM', disponible: true },
            { id: 'f-2', texto: '2:00 - 3:30 PM', disponible: true }
        ]
    },
    {
        diaSemana: 'MAR',
        numero: 8,
        disponible: true,
        franjas: [
            { id: 'f-1', texto: '9:00 - 10:30 AM', disponible: true },
            { id: 'f-2', texto: '3:00 - 4:00 PM', disponible: true }
        ]
    }
];

const USUARIOS_INICIALES = [
    {
        id: '1',
        nombres: 'Daniela',
        apellidos: 'Moreno',
        correo: 'dmoreno@urosario.edu.co',
        clave: 'conecta2026',
        rol: 'estudiante',
        carrera: 'Ingeniería de Sistemas',
        semestre: 6,
        semestreTexto: '6º semestre Ingeniería de Sistemas - Claustro',
        telefono: '320 4051954',
        sede: 'Claustro',
        cursos: ['Cálculo II', 'Estructuras de Datos', 'Álgebra Lineal'],
        descripcion:
            'Estudiante de sexto semestre interesada en profundizar en matemáticas aplicadas, estructuras de datos y desarrollo de software.'
    },
    {
        id: '2',
        nombres: 'Daniel',
        apellidos: 'Nieto',
        correo: 'dnieto@urosario.edu.co',
        clave: 'conecta2026',
        rol: 'tutor',
        carrera: 'Matematicas Aplicadas y Ciencias de la Computacion',
        semestre: 6,
        semestreTexto: '6º semestre MACC - Claustro',
        cursos: ['Calculo II', 'Variable Compleja', 'Analisis Real'],
        sede: 'Claustro',
        modalidad: 'Híbrida',
        precioHora: 20000,
        descripcion:
            'Sé lo retador que es el paso de Cálculo I a Cálculo II y Álgebra Lineal en los primeros semestres de ingeniería y ciencias. Fui monitor oficial de planta durante 4 semestres consecutivos y comprendo exactamente los errores típicos de parcial y dónde se confunden los conceptos teóricos.',
        diasDisponibles: ['LU', 'MA', 'MI']
    },
    {
        id: '3',
        nombres: 'Coordinador',
        apellidos: 'URosario',
        correo: 'coord@urosario.edu.co',
        clave: 'conecta2026',
        rol: 'admin'
    }
];

const TUTORES_INICIALES = [
    {
        id: 'tutor-1',
        usuarioId: '2',
        nombres: 'Daniel',
        apellidos: 'Nieto',
        iniciales: 'DN',
        semestreTexto: '6º semestre MACC - claustro',
        sede: 'Claustro',
        modalidad: 'Presencial',
        descripcion:
            'Pase Calculo 2 con promedio de 4.8 fui monitor de planta por 2 semestres. Me apasiona enseñar :D',
        precioHora: 20000,
        precioFormato: '$20.000 x hora',
        materiaPrincipal: 'calculo II',
        cursos: ['Calculo II', 'Algebra Lineal', 'Analisis Real'],
        estrellas: 4.9,
        diasDisponibles: DIAS_MOCK_DEFECTO,
        correo: 'dnieto@urosario.edu.co',
        activo: true
    },
    {
        id: 'tutor-2',
        usuarioId: 'tutor-2-user',
        nombres: 'Juan',
        apellidos: 'Cespedes',
        iniciales: 'JC',
        semestreTexto: '6º semestre MACC - Claustro',
        sede: 'Claustro',
        modalidad: 'Virtual',
        descripcion:
            'Sé lo retador que es el paso de Cálculo I a Cálculo II y Álgebra Lineal en los primeros semestres de ingeniería y ciencias. Fui monitor oficial de planta durante 4 semestres consecutivos y comprendo exactamente los errores típicos de parcial y dónde se confunden los conceptos teóricos.',
        precioHora: 20000,
        precioFormato: '$20.000 x hora',
        materiaPrincipal: 'calculo II',
        cursos: ['Calculo II', 'Algebra Lineal', 'Analisis Real'],
        estrellas: 4.9,
        diasDisponibles: DIAS_MOCK_DEFECTO,
        correo: 'jcespedes@urosario.edu.co',
        activo: true
    },
    {
        id: 'tutor-3',
        usuarioId: 'tutor-3-user',
        nombres: 'Juan',
        apellidos: 'Ditta',
        iniciales: 'JD',
        semestreTexto: '6º semestre MACC - Mutis',
        sede: 'Mutis',
        modalidad: 'Presencial',
        descripcion:
            'Pase Calculo 2 con promedio de 4.8 fui monitor de planta por 2 semestres. Me apasiona enseñar :D',
        precioHora: 20000,
        precioFormato: '$20.000 x hora',
        materiaPrincipal: 'calculo II',
        cursos: ['Calculo II', 'Algebra Lineal'],
        estrellas: 4.9,
        diasDisponibles: DIAS_MOCK_DEFECTO,
        correo: 'jditta@urosario.edu.co',
        activo: true
    }
];

const TUTORIAS_INICIALES = [
    {
        id: 'tutoria-1',
        tutorId: '2',
        tutorNombres: 'Daniel',
        tutorApellidos: 'Nieto',
        tutorIniciales: 'DN',
        tutorSemestreTexto: '6º semestre MACC - Claustro',
        fechaTexto: 'Miercoles 2, 3:00 - 4:00 PM',
        tiempoRestanteTexto: 'Ya Tomada',
        lugarTexto: 'Virtual - Google Meets',
        materia: 'calculo II',
        estado: 'pendiente',
        esVirtual: true,
        linkReunion: 'https://meet.google.com/foj-amx-bqp?pli=1&authuser=1',
        estudianteId: '1',
        estudianteNombres: 'Daniela',
        estudianteApellidos: 'Moreno',
        estudianteIniciales: 'DM',
        estudianteCarrera: '6º semestre ISE',
        estudianteTelefono: '320 4051954',
        estudianteCorreo: 'dmoreno@urosario.edu.co',
        estudianteSemestreCompleto: 'sexto semestre Ingenieria de Sistemas',
        detalles:
            'El ultimoTe escribo porque actualmente estoy repasando el tema de integrales impropias en Cálculo II y tengo varias dudas que no he logrado resolver por mi cuenta. Específicamente, se me está dificultando plantear formalmente los límites, identificar las discontinuidades dentro del intervalo y aplicar los criterios de comparación para determinar si convergen o divergen.\n\nTe adjunto el taller asociado al tema.',
        nombresArchivos: ['taller_integrales_calculo2.pdf'],
        puedeCalificar: true
    },
    {
        id: 'tutoria-2',
        tutorId: '2',
        tutorNombres: 'Daniel',
        tutorApellidos: 'Nieto',
        tutorIniciales: 'DN',
        tutorSemestreTexto: '6º semestre MACC - Claustro',
        fechaTexto: 'Jueves 3, 10:00 - 1:00am',
        tiempoRestanteTexto: 'En 2 dias',
        lugarTexto: 'Casur 311 - Claustro',
        materia: 'Analisis Real',
        estado: 'pendiente',
        esVirtual: false,
        estudianteId: 'est-lg',
        estudianteNombres: 'Luisa',
        estudianteApellidos: 'Guillerma',
        estudianteIniciales: 'LG',
        estudianteCarrera: '1º semestre MACC',
        estudianteTelefono: '315 8923412',
        estudianteCorreo: 'luisa.guillerma@urosario.edu.co',
        estudianteSemestreCompleto: 'primer semestre Matematicas Aplicadas y Ciencias de la Computacion',
        detalles:
            'Tengo dudas acerca del axioma del supremo y la construcción de los números reales por cortaduras de Dedekind.',
        nombresArchivos: ['guia_corte1_analisis.pdf'],
        puedeCalificar: false
    },
    {
        id: 'tutoria-3',
        tutorId: '2',
        tutorNombres: 'Daniel',
        tutorApellidos: 'Nieto',
        tutorIniciales: 'DN',
        tutorSemestreTexto: '6º semestre MACC - Claustro',
        fechaTexto: 'Viernes 4, 12:00 - 1:00 pm',
        tiempoRestanteTexto: 'En 2 dias',
        lugarTexto: 'Torre 2 • Sala lovelace',
        materia: 'Analisis Real',
        estado: 'pendiente',
        esVirtual: false,
        estudianteId: 'est-mg',
        estudianteNombres: 'Manuela',
        estudianteApellidos: 'Garzon',
        estudianteIniciales: 'MG',
        estudianteCarrera: '2º semestre ISE',
        estudianteTelefono: '311 4509871',
        estudianteCorreo: 'manuela.garzon@urosario.edu.co',
        estudianteSemestreCompleto: 'segundo semestre Ingenieria de Sistemas',
        detalles:
            'Revisión de series infinitas y convergencia absoluta para el examen parcial.',
        nombresArchivos: ['ejercicios_series.pdf'],
        puedeCalificar: false
    }
];

module.exports = {
    DIAS_MOCK_DEFECTO,
    USUARIOS_INICIALES,
    TUTORES_INICIALES,
    TUTORIAS_INICIALES
};
