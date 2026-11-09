/**
 * Especificación OpenAPI 3.0 para ConectaTutor (Universidad del Rosario).
 * Utilizada por Swagger UI Express en /api-docs y /api/docs.json.
 */

const openapi = {
    openapi: '3.0.3',
    info: {
        title: 'ConectaTutor API - Universidad del Rosario',
        description: 'API RESTful para la plataforma de tutorías ConectaTutor. Soporta autenticación, gestión de tutores, agendamiento de tutorías y calificaciones.',
        version: '1.0.0',
        contact: {
            name: 'Célula de Desarrollo: Geronimo Arguello, Daniel Moreno, Daniel Nieto'
        }
    },
    servers: [
        {
            url: 'http://localhost:3000/api',
            description: 'Servidor local de desarrollo'
        }
    ],
    paths: {
        '/salud': {
            get: {
                summary: 'Estado de salud de la API',
                tags: ['Salud'],
                responses: {
                    200: {
                        description: 'API en funcionamiento correcto'
                    }
                }
            }
        },
        '/auth/login': {
            post: {
                summary: 'Iniciar sesión de usuario o tutor',
                tags: ['Autenticación'],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['usuario', 'clave'],
                                properties: {
                                    usuario: { type: 'string', example: 'dmoreno@urosario.edu.co' },
                                    clave: { type: 'string', example: 'conecta2026' }
                                }
                            }
                        }
                    }
                },
                responses: {
                    200: { description: 'Inicio de sesión exitoso' },
                    401: { description: 'Credenciales inválidas' }
                }
            }
        },
        '/auth/registro/estudiante': {
            post: {
                summary: 'Registrar nuevo estudiante',
                tags: ['Autenticación'],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['nombres', 'apellidos', 'correo'],
                                properties: {
                                    nombres: { type: 'string', example: 'Daniela' },
                                    apellidos: { type: 'string', example: 'Moreno' },
                                    correo: { type: 'string', example: 'dmoreno@urosario.edu.co' },
                                    carrera: { type: 'string', example: 'Ingeniería de Sistemas' },
                                    semestre: { type: 'number', example: 6 }
                                }
                            }
                        }
                    }
                },
                responses: {
                    201: { description: 'Estudiante registrado exitosamente' }
                }
            }
        },
        '/tutores': {
            get: {
                summary: 'Listar tutores disponibles',
                tags: ['Tutores'],
                parameters: [
                    { name: 'materia', in: 'query', schema: { type: 'string' }, description: 'Filtrar por materia' },
                    { name: 'sede', in: 'query', schema: { type: 'string' }, description: 'Filtrar por sede' },
                    { name: 'modalidad', in: 'query', schema: { type: 'string' }, description: 'Filtrar por modalidad' }
                ],
                responses: {
                    200: { description: 'Listado de tutores obtenido exitosamente' }
                }
            }
        },
        '/tutores/registro': {
            post: {
                summary: 'Registrar nuevo tutor con disponibilidad y perfil',
                tags: ['Tutores'],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['nombres', 'apellidos', 'correo', 'carrera', 'precioHora'],
                                properties: {
                                    nombres: { type: 'string', example: 'Daniel' },
                                    apellidos: { type: 'string', example: 'Nieto' },
                                    correo: { type: 'string', example: 'dnieto@urosario.edu.co' },
                                    carrera: { type: 'string', example: 'MACC' },
                                    semestre: { type: 'number', example: 6 },
                                    sede: { type: 'string', example: 'Claustro' },
                                    modalidad: { type: 'string', example: 'Híbrida' },
                                    materiaPrincipal: { type: 'string', example: 'Cálculo II' },
                                    precioHora: { type: 'number', example: 20000 },
                                    descripcion: { type: 'string' }
                                }
                            }
                        }
                    }
                },
                responses: {
                    201: { description: 'Tutor registrado exitosamente' }
                }
            }
        },
        '/tutores/{id}': {
            get: {
                summary: 'Obtener información detallada de un tutor',
                tags: ['Tutores'],
                parameters: [
                    { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
                ],
                responses: {
                    200: { description: 'Información del tutor' },
                    404: { description: 'Tutor no encontrado' }
                }
            },
            patch: {
                summary: 'Actualizar perfil de tutor',
                tags: ['Tutores'],
                parameters: [
                    { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
                ],
                responses: {
                    200: { description: 'Tutor actualizado' }
                }
            }
        },
        '/tutores/{id}/disponibilidad': {
            patch: {
                summary: 'Modificar disponibilidad activa del tutor',
                tags: ['Tutores'],
                parameters: [
                    { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['activo'],
                                properties: {
                                    activo: { type: 'boolean', example: true }
                                }
                            }
                        }
                    }
                },
                responses: {
                    204: { description: 'Disponibilidad actualizada' }
                }
            }
        },
        '/tutorias': {
            get: {
                summary: 'Listar tutorías',
                tags: ['Tutorías'],
                parameters: [
                    { name: 'estudianteId', in: 'query', schema: { type: 'string' } },
                    { name: 'estado', in: 'query', schema: { type: 'string' } }
                ],
                responses: {
                    200: { description: 'Listado de tutorías' }
                }
            },
            post: {
                summary: 'Agendar una nueva tutoría',
                tags: ['Tutorías'],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['tutorId', 'diaSemana', 'franjaTexto'],
                                properties: {
                                    tutorId: { type: 'string', example: 'tutor-1' },
                                    diaNumero: { type: 'number', example: 3 },
                                    diaSemana: { type: 'string', example: 'MIE' },
                                    franjaTexto: { type: 'string', example: '2:00 - 3:00 PM' },
                                    modalidad: { type: 'string', example: 'Virtual' },
                                    materia: { type: 'string', example: 'Cálculo II' },
                                    detalles: { type: 'string' }
                                }
                            }
                        }
                    }
                },
                responses: {
                    201: { description: 'Tutoría agendada exitosamente' }
                }
            }
        },
        '/tutorias/asignadas': {
            get: {
                summary: 'Obtener tutorías asignadas a un tutor específico',
                tags: ['Tutorías'],
                parameters: [
                    { name: 'tutorId', in: 'query', schema: { type: 'string' } },
                    { name: 'tutorNombres', in: 'query', schema: { type: 'string' } }
                ],
                responses: {
                    200: { description: 'Listado de tutorías asignadas al tutor' }
                }
            }
        },
        '/tutorias/{id}': {
            get: {
                summary: 'Obtener detalles de una tutoría agendada',
                tags: ['Tutorías'],
                parameters: [
                    { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
                ],
                responses: {
                    200: { description: 'Detalle de la tutoría' }
                }
            },
            delete: {
                summary: 'Cancelar una tutoría',
                tags: ['Tutorías'],
                parameters: [
                    { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
                ],
                responses: {
                    204: { description: 'Tutoría cancelada' }
                }
            }
        },
        '/tutorias/{id}/link': {
            patch: {
                summary: 'Actualizar enlace de reunión virtual',
                tags: ['Tutorías'],
                parameters: [
                    { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['linkReunion'],
                                properties: {
                                    linkReunion: { type: 'string', example: 'https://meet.google.com/abc-defg-hij' }
                                }
                            }
                        }
                    }
                },
                responses: {
                    200: { description: 'Enlace actualizado' }
                }
            }
        },
        '/tutorias/{id}/estado': {
            patch: {
                summary: 'Actualizar estado de tutoría (pendiente, completada, cancelada)',
                tags: ['Tutorías'],
                parameters: [
                    { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['estado'],
                                properties: {
                                    estado: { type: 'string', enum: ['pendiente', 'completada', 'cancelada'] }
                                }
                            }
                        }
                    }
                },
                responses: {
                    200: { description: 'Estado actualizado' }
                }
            }
        },
        '/tutorias/{id}/calificacion': {
            post: {
                summary: 'Calificar tutoría realizada',
                tags: ['Tutorías'],
                parameters: [
                    { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['calificacion'],
                                properties: {
                                    calificacion: { type: 'number', minimum: 1, maximum: 5, example: 5 },
                                    comentarios: { type: 'string', example: 'Excelente explicación' }
                                }
                            }
                        }
                    }
                },
                responses: {
                    204: { description: 'Calificación registrada exitosamente' }
                }
            }
        },
        '/usuarios': {
            get: {
                summary: 'Listar usuarios registrados',
                tags: ['Usuarios'],
                responses: {
                    200: { description: 'Listado de usuarios' }
                }
            }
        },
        '/usuarios/{id}': {
            get: {
                summary: 'Obtener datos de un usuario por ID',
                tags: ['Usuarios'],
                parameters: [
                    { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
                ],
                responses: {
                    200: { description: 'Datos del usuario' },
                    404: { description: 'Usuario no encontrado' }
                }
            },
            put: {
                summary: 'Actualizar datos de perfil de usuario',
                tags: ['Usuarios'],
                parameters: [
                    { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
                ],
                responses: {
                    200: { description: 'Usuario actualizado' }
                }
            }
        }
    }
};

module.exports = openapi;
