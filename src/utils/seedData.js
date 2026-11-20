/**
 * Datos semilla iniciales para ConectaTutor (Universidad del Rosario).
 * Sincronizados con los datos de desarrollo del Frontend y Figma.
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
        cursos: ['Calculo II', 'Algebra Lineal', 'Analisis Real'],
        sede: 'Claustro',
        modalidad: 'Híbrida',
        precioHora: 20000,
        descripcion:
            'Sé lo retador que es el paso de Cálculo I a Cálculo II y Álgebra Lineal en los primeros semestres de ingeniería y ciencias. Fui monitor oficial de planta durante 4 semestres consecutivos y comprendo exactamente los errores típicos de parcial y dónde se confunden los conceptos teóricos.',
        diasDisponibles: ['LU', 'MA', 'MI', 'JU'],
        estadoAprobacion: 'aprobado',
        activo: true
    },
    {
        id: '3',
        nombres: 'Coordinador',
        apellidos: 'URosario',
        correo: 'coord@urosario.edu.co',
        clave: 'conecta2026',
        rol: 'admin',
        carrera: 'Coordinación Académica'
    },
    {
        id: 'tutor-jc',
        nombres: 'Juan',
        apellidos: 'Cachon',
        correo: 'jcachon@urosario.edu.co',
        clave: 'conecta2026',
        rol: 'tutor',
        carrera: 'Matematicas Aplicadas y Ciencias de la Computacion',
        semestre: 6,
        semestreTexto: '6º semestre MACC',
        cursos: ['Calculo II', 'Algebra Lineal', 'Calculo Diferencial'],
        sede: 'Mutis',
        modalidad: 'Presencial',
        precioHora: 20000,
        descripcion:
            'Monitor de Cálculo II y Álgebra Lineal. Enfoque práctico orientado a resolución de talleres y preparación para parciales.',
        diasDisponibles: ['LU', 'MA', 'MI', 'VI'],
        estadoAprobacion: 'aprobado',
        activo: true
    },
    {
        id: 'tutor-ga',
        nombres: 'Gabriela',
        apellidos: 'Arevalo',
        correo: 'garevalo@urosario.edu.co',
        clave: 'conecta2026',
        rol: 'tutor',
        carrera: 'Matematicas Aplicadas y Ciencias de la Computacion',
        semestre: 6,
        semestreTexto: '6º semestre MACC',
        cursos: ['Ing Datos', 'Bases de Datos', 'Estructuras de Datos'],
        sede: 'Claustro',
        modalidad: 'Presencial',
        precioHora: 20000,
        descripcion:
            'Monitora de Ingeniería de Datos y Bases de Datos. Apoyo en diseño relacional, modelado analítico y consultas SQL.',
        diasDisponibles: ['MA', 'JU', 'SA'],
        estadoAprobacion: 'aprobado',
        activo: true
    }
];

const TUTORES_INICIALES = [
    {
        id: 'tutor-1',
        usuarioId: '2',
        nombres: 'Daniel',
        apellidos: 'Nieto',
        iniciales: 'DN',
        semestreTexto: '6º semestre MACC - Claustro',
        sede: 'Claustro',
        modalidad: 'Presencial',
        descripcion:
            'Sé lo retador que es el paso de Cálculo I a Cálculo II y Álgebra Lineal en los primeros semestres de ingeniería y ciencias. Fui monitor oficial de planta durante 4 semestres consecutivos y comprendo exactamente los errores típicos de parcial y dónde se confunden los conceptos teóricos.',
        precioHora: 20000,
        precioFormato: '$20.000 x hora',
        materiaPrincipal: 'calculo II',
        cursos: ['Calculo II', 'Algebra Lineal', 'Analisis Real'],
        estrellas: 4.9,
        diasDisponibles: DIAS_MOCK_DEFECTO,
        correo: 'dnieto@urosario.edu.co',
        estadoAprobacion: 'aprobado',
        activo: true,
        notaMateria: 4.8,
        soporteNotasNombre: 'certificado_oficial.pdf'
    },
    {
        id: 'tutor-jc',
        usuarioId: 'tutor-jc',
        nombres: 'Juan',
        apellidos: 'Cachon',
        iniciales: 'JC',
        semestreTexto: '6º semestre MACC',
        sede: 'Mutis',
        modalidad: 'Presencial',
        descripcion:
            'Monitor de Cálculo II y Álgebra Lineal. Enfoque práctico orientado a resolución de talleres y preparación para parciales.',
        precioHora: 20000,
        precioFormato: '$20.000 x hora',
        materiaPrincipal: 'calculo II',
        cursos: ['Calculo II', 'Algebra Lineal', 'Calculo Diferencial'],
        estrellas: 5.0,
        diasDisponibles: DIAS_MOCK_DEFECTO,
        correo: 'jcachon@urosario.edu.co',
        estadoAprobacion: 'aprobado',
        activo: true,
        notaMateria: 4.8,
        soporteNotasNombre: 'certificado_notas_jc.pdf'
    },
    {
        id: 'tutor-ga',
        usuarioId: 'tutor-ga',
        nombres: 'Gabriela',
        apellidos: 'Arevalo',
        iniciales: 'GA',
        semestreTexto: '6º semestre MACC',
        sede: 'Claustro',
        modalidad: 'Presencial',
        descripcion:
            'Monitora de Ingeniería de Datos y Bases de Datos. Apoyo en diseño relacional, modelado analítico y consultas SQL.',
        precioHora: 20000,
        precioFormato: '$20.000 x hora',
        materiaPrincipal: 'Ing Datos',
        cursos: ['Ing Datos', 'Bases de Datos', 'Estructuras de Datos'],
        estrellas: 5.0,
        diasDisponibles: DIAS_MOCK_DEFECTO,
        correo: 'garevalo@urosario.edu.co',
        estadoAprobacion: 'aprobado',
        activo: true,
        notaMateria: 4.9,
        soporteNotasNombre: 'certificado_notas_ga.pdf'
    },
    {
        id: 'tutor-2',
        usuarioId: 'tutor-2',
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
        estadoAprobacion: 'aprobado',
        activo: true,
        notaMateria: 4.7
    },
    {
        id: 'tutor-3',
        usuarioId: 'tutor-3',
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
        estadoAprobacion: 'aprobado',
        activo: true,
        notaMateria: 4.8
    },
    {
        id: 'tutor-sm',
        usuarioId: 'tutor-sm',
        nombres: 'Sofia',
        apellidos: 'Martinez',
        iniciales: 'SM',
        semestreTexto: '5º semestre MACC - Claustro',
        sede: 'Claustro',
        modalidad: 'Presencial',
        descripcion:
            'Monitora de Matemáticas Discretas y Lógica Computacional. Resolución guiada de talleres prácticos y preparación para parciales.',
        precioHora: 20000,
        precioFormato: '$20.000 x hora',
        materiaPrincipal: 'Matemáticas Discretas',
        cursos: ['Matemáticas Discretas', 'Lógica Matemática', 'Teoría de Grafos'],
        estrellas: 4.9,
        diasDisponibles: DIAS_MOCK_DEFECTO,
        correo: 'smartinez@urosario.edu.co',
        estadoAprobacion: 'aprobado',
        activo: true,
        notaMateria: 4.9
    },
    {
        id: 'tutor-nr',
        usuarioId: 'tutor-nr',
        nombres: 'Nicolas',
        apellidos: 'Rueda',
        iniciales: 'NR',
        semestreTexto: '7º semestre ISE - Mutis',
        sede: 'Mutis',
        modalidad: 'Virtual',
        descripcion:
            'Monitor de Física Mecánica y Electricidad y Magnetismo. Explicación intuitiva de conceptos teóricos y problemas tipo examen.',
        precioHora: 20000,
        precioFormato: '$20.000 x hora',
        materiaPrincipal: 'Física Mecánica',
        cursos: ['Física Mecánica', 'Electromagnetismo', 'Cálculo Vectorial'],
        estrellas: 4.8,
        diasDisponibles: DIAS_MOCK_DEFECTO,
        correo: 'nrueda@urosario.edu.co',
        estadoAprobacion: 'aprobado',
        activo: true,
        notaMateria: 4.8
    },
    {
        id: 'tutor-mpv',
        usuarioId: 'tutor-mpv',
        nombres: 'Maria Paula',
        apellidos: 'Vega',
        iniciales: 'MV',
        semestreTexto: '6º semestre ISE - Claustro',
        sede: 'Claustro',
        modalidad: 'Presencial',
        descripcion:
            'Monitora de Programación Orientada a Objetos y Estructuras de Datos. Desarrollo de proyectos, patrones de diseño y depuración de código.',
        precioHora: 20000,
        precioFormato: '$20.000 x hora',
        materiaPrincipal: 'Estructuras de Datos',
        cursos: ['Estructuras de Datos', 'Programación OO', 'Algoritmos'],
        estrellas: 5.0,
        diasDisponibles: DIAS_MOCK_DEFECTO,
        correo: 'mpvega@urosario.edu.co',
        estadoAprobacion: 'aprobado',
        activo: true,
        notaMateria: 5.0
    },
    // Solicitudes pendientes de aprobación para el panel de administración
    {
        id: 'tutor-sol-1',
        usuarioId: 'tutor-sol-1',
        nombres: 'Camilo Andres',
        apellidos: 'Torres',
        iniciales: 'CT',
        correo: 'camilo.torres@urosario.edu.co',
        semestreTexto: '5º semestre MACC - Claustro',
        sede: 'Claustro',
        modalidad: 'Presencial',
        materiaPrincipal: 'Calculo I',
        notaMateria: 4.8,
        promedioAcumulado: 4.4,
        precioHora: 20000,
        precioFormato: '$20.000 x hora',
        descripcion:
            'Monitor de Cálculo I con énfasis en límites, derivadas y problemas de optimización. Gran vocación pedagógica.',
        estrellas: 5.0,
        estadoAprobacion: 'pendiente',
        activo: false,
        soporteNotasNombre: 'historial_academico_camilo_torres.pdf',
        fechaRegistro: '15/11/2026',
        cursos: ['Calculo I', 'Precalculo']
    },
    {
        id: 'tutor-sol-2',
        usuarioId: 'tutor-sol-2',
        nombres: 'Laura Sofia',
        apellidos: 'Bermudez',
        iniciales: 'LB',
        correo: 'laura.bermudez@urosario.edu.co',
        semestreTexto: '6º semestre ISE - Mutis',
        sede: 'Mutis',
        modalidad: 'Híbrida',
        materiaPrincipal: 'Estructuras de Datos',
        notaMateria: 4.6,
        promedioAcumulado: 4.3,
        precioHora: 20000,
        precioFormato: '$20.000 x hora',
        descripcion:
            'Monitora con experiencia en árboles binarios, grafos y algoritmos de búsqueda y ordenamiento.',
        estrellas: 5.0,
        estadoAprobacion: 'pendiente',
        activo: false,
        soporteNotasNombre: 'sabana_notas_laura_bermudez.pdf',
        fechaRegistro: '16/11/2026',
        cursos: ['Estructuras de Datos', 'Programación Orientada a Objetos']
    }
];

const TUTORIAS_INICIALES = [
    {
        id: 'tutoria-1',
        tutorId: 'tutor-jc',
        tutorNombres: 'Juan',
        tutorApellidos: 'Cachon',
        tutorIniciales: 'JC',
        tutorSemestreTexto: '6º semestre MACC',
        fechaTexto: 'Miercoles 2, 3:00 - 4:00 PM',
        tiempoRestanteTexto: 'Ya Tomada',
        lugarTexto: 'Laboratorio 1 - Mutis',
        materia: 'calculo II',
        estado: 'completada',
        puedeCalificar: true,
        esVirtual: false,
        estudianteId: '1',
        estudianteNombres: 'Juan Filip',
        estudianteApellidos: 'Coral',
        estudianteIniciales: 'JC',
        estudianteCarrera: '6º semestre ISE',
        estudianteTelefono: '320 4051954',
        estudianteCorreo: 'jcoral@urosario.edu.co',
        estudianteSemestreCompleto: '6º semestre Ing. de Sistemas energeticos',
        detalles:
            'Repaso de cálculo de integrales impropias y aplicaciones de cálculo diferencial e integral.',
        nombresArchivos: ['taller_calculo2.pdf']
    },
    {
        id: 'tutoria-2',
        tutorId: 'tutor-ga',
        tutorNombres: 'Gabriela',
        tutorApellidos: 'Arevalo',
        tutorIniciales: 'GA',
        tutorSemestreTexto: '6º semestre MACC',
        fechaTexto: 'Sabado 12, 7:05 - 9:05am',
        tiempoRestanteTexto: 'En 70 dias',
        lugarTexto: 'Casur 311 - Claustro',
        materia: 'Ing Datos',
        estado: 'pendiente',
        puedeCalificar: false,
        esVirtual: false,
        estudianteId: '1',
        estudianteNombres: 'Juan Filip',
        estudianteApellidos: 'Coral',
        estudianteIniciales: 'JC',
        estudianteCarrera: '6º semestre ISE',
        estudianteTelefono: '320 4051954',
        estudianteCorreo: 'jcoral@urosario.edu.co',
        estudianteSemestreCompleto: '6º semestre Ing. de Sistemas energeticos',
        detalles: 'Taller de arquitectura de pipelines y modelado dimensional.',
        nombresArchivos: ['arquitectura_datos.pdf']
    },
    {
        id: 'tutoria-3',
        tutorId: '2',
        tutorNombres: 'Daniel',
        tutorApellidos: 'Nieto',
        tutorIniciales: 'DN',
        tutorSemestreTexto: '6º semestre MACC',
        fechaTexto: 'Miercoles 2, 3:00 - 4:00 PM',
        tiempoRestanteTexto: 'En 2 dias',
        lugarTexto: 'Virtual · Google Meets',
        materia: 'Analisis Real',
        estado: 'pendiente',
        puedeCalificar: false,
        esVirtual: true,
        linkReunion: 'https://meet.google.com/foj-amx-bqp?pli=1&authuser=1',
        estudianteId: '1',
        estudianteNombres: 'Juan Filip',
        estudianteApellidos: 'Coral',
        estudianteIniciales: 'JC',
        estudianteCarrera: '6º semestre ISE',
        estudianteTelefono: '320 4051954',
        estudianteCorreo: 'jcoral@urosario.edu.co',
        estudianteSemestreCompleto: '6º semestre Ing. de Sistemas energeticos',
        detalles:
            'Dudas acerca del axioma del supremo y sucesiones de Cauchy en Análisis Real.',
        nombresArchivos: ['taller_analisis_real.pdf']
    },
    {
        id: 'tutoria-tutor-1',
        tutorId: '2',
        tutorNombres: 'Daniel',
        tutorApellidos: 'Nieto',
        tutorIniciales: 'DN',
        tutorSemestreTexto: '6º semestre MACC - Claustro',
        fechaTexto: 'Miercoles 2, 3:00 - 4:00 PM',
        tiempoRestanteTexto: 'Ya Tomada',
        lugarTexto: 'Virtual - Google Meets',
        materia: 'calculo II',
        estado: 'completada',
        esVirtual: true,
        linkReunion: 'https://meet.google.com/foj-amx-bqp?pli=1&authuser=1',
        estudianteId: 'est-dm',
        estudianteNombres: 'Daniela',
        estudianteApellidos: 'Moreno',
        estudianteIniciales: 'DM',
        estudianteCarrera: '6º semestre ISE',
        estudianteTelefono: '320 4051954',
        estudianteCorreo: 'dmoreno@urosario.edu.co',
        estudianteSemestreCompleto: 'sexto semestre Ingenieria de Sistemas',
        detalles:
            'El ultimoTe escribo porque actualmente estoy repasando el tema de integrales impropias en Cálculo II y tengo varias dudas que no he logrado resolver por mi cuenta. Específicamente, se me está dificultando plantear formalmente los límites, identificar las discontinuidades dentro del intervalo y aplicar los criterios de comparación para determinar si convergen o divergen.\n\nTe adjunto el taller asociado al tema.',
        nombresArchivos: ['taller_integrales_calculo2.pdf']
    },
    {
        id: 'tutoria-tutor-2',
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
        nombresArchivos: ['guia_corte1_analisis.pdf']
    },
    {
        id: 'tutoria-tutor-3',
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
        nombresArchivos: ['ejercicios_series.pdf']
    }
];

const RESENAS_INICIALES = [
    {
        id: 'res-dn-1',
        tutorId: '2',
        tutorNombres: 'Daniel Nieto',
        autor: 'Mariana Fuentes',
        calificacion: 5,
        pregunta1: 5,
        pregunta2: 5,
        pregunta3: 5,
        pregunta4: 5,
        comentario:
            'Daniel explica con mucha paciencia. Tenía un bloqueo total con cambio de coordenadas polares y en solo hora y media logré resolver los ejercicios del taller que caían fijo en el examen. Saqué 4.6 en el parcial. Súper recomendado.',
        fecha: 'Hace 3 días'
    },
    {
        id: 'res-jc-1',
        tutorId: 'tutor-jc',
        tutorNombres: 'Juan Cachon',
        autor: 'Carlos Mendoza',
        calificacion: 5,
        pregunta1: 5,
        pregunta2: 5,
        pregunta3: 5,
        pregunta4: 5,
        comentario:
            'Excelente tutoría de Cálculo II. Me ayudó a entender integración por partes y sustitución trigonométrica en una sola sesión.',
        fecha: 'Hace 5 días'
    },
    {
        id: 'res-ga-1',
        tutorId: 'tutor-ga',
        tutorNombres: 'Gabriela Arevalo',
        autor: 'Valentina Ríos',
        calificacion: 5,
        pregunta1: 5,
        pregunta2: 5,
        pregunta3: 5,
        pregunta4: 5,
        comentario:
            'Muy clara en la explicación de bases de datos relacionales y optimización de consultas SQL.',
        fecha: 'Hace 1 semana'
    }
];

module.exports = {
    DIAS_MOCK_DEFECTO,
    USUARIOS_INICIALES,
    TUTORES_INICIALES,
    TUTORIAS_INICIALES,
    RESENAS_INICIALES
};
