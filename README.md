# Backend - ConectaTutor (Universidad del Rosario)

Repositorio de manejo de Backend para diseno web, elaborado por: **Geronimo Arguello**, **Daniel Moreno** y **Daniel Nieto**.

API RESTful desarrollada con **Node.js**, **Express**, **MongoDB (Mongoose)** y documentacion interactiva con **Swagger / OpenAPI**.

---

## Arquitectura del Proyecto

El backend implementa una arquitectura limpia y desacoplada en capas:

```
├── .env.example              # Plantilla de variables de entorno
├── .gitignore                # Exclusion de node_modules y .env
├── package.json              # Configuracion y dependencias de Node.js
├── README.md                 # Documentacion del proyecto
└── src/
    ├── app.js                # Configuracion de Express, CORS, middlewares y rutas
    ├── server.js             # Inicializacion del servidor HTTP y conexion a BD
    ├── config/
    │   └── db.js             # Conexion a MongoDB Atlas y siembra de datos
    ├── controllers/          # Manejadores de peticiones HTTP
    │   ├── admin.controller.js
    │   ├── auth.controller.js
    │   ├── resenas.controller.js
    │   ├── tutores.controller.js
    │   ├── tutorias.controller.js
    │   └── usuarios.controller.js
    ├── docs/
    │   └── openapi.js        # Especificacion OpenAPI 3.0 para Swagger UI
    ├── middlewares/          # Validaciones y manejo centralizado de errores
    │   ├── manejarErrores.js
    │   └── validarErrores.js
    ├── models/               # Esquemas y modelos de datos (Mongoose)
    │   ├── resena.model.js
    │   ├── tutor.model.js
    │   ├── tutoria.model.js
    │   └── usuario.model.js
    ├── routes/               # Definicion y enrutamiento de endpoints
    │   ├── admin.routes.js
    │   ├── auth.routes.js
    │   ├── resenas.routes.js
    │   ├── tutores.routes.js
    │   ├── tutorias.routes.js
    │   └── usuarios.routes.js
    ├── services/             # Logica de negocio y persistencia (dual MongoDB / memoria)
    │   ├── admin.service.js
    │   ├── auth.service.js
    │   ├── resenas.service.js
    │   ├── tutores.service.js
    │   ├── tutorias.service.js
    │   └── usuarios.service.js
    └── utils/
        ├── HttpError.js      # Clase para errores HTTP controlados
        └── seedData.js       # Datos iniciales para pruebas y desarrollo
```

---

## Instalacion y Puesta en Marcha

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar variables de entorno
Crea un archivo `.env` en la raiz del proyecto tomando como base `.env.example`:
```env
PORT=3000
MONGO_URI=mongodb+srv://jerolejalu_db_user:<db_password>@conectatutor.mqiip1h.mongodb.net/?retryWrites=true&w=majority
DB_NAME=conectatutor_db
```
> **Nota**: Si no configuras `MONGO_URI` o mientras colocas tu contrasena, el servidor funcionara automaticamente con un almacen en memoria precargado con datos iniciales.

### 3. Iniciar la aplicacion
- **Modo desarrollo (con recarga automatica):**
  ```bash
  npm run dev
  ```
- **Modo produccion:**
  ```bash
  npm start
  ```

---

## Documentacion Interactiva (Swagger UI)

Una vez iniciado el servidor, accede a:
- **Swagger UI:** [http://localhost:3000/api-docs](http://localhost:3000/api-docs)
- **Especificacion OpenAPI (JSON):** [http://localhost:3000/api/docs.json](http://localhost:3000/api/docs.json)
- **Verificacion de Salud:** [http://localhost:3000/api/salud](http://localhost:3000/api/salud)

---

## Endpoints Principales

### Autenticacion (`/api/auth`)
- `POST /api/auth/login`: Inicio de sesion (correo o prefijo y clave).
- `POST /api/auth/registro`: Registro de nuevo estudiante (valida dominio `@urosario.edu.co`).

### Tutores (`/api/tutores`)
- `GET /api/tutores`: Listar tutores disponibles (filtros: `materia`, `sede`, `modalidad`, `activo`, `estadoAprobacion`).
- `GET /api/tutores/:id`: Obtener informacion detallada de un tutor.
- `POST /api/tutores/registro`: Postulacion de nuevo monitor con notas y soporte academico.
- `PATCH /api/tutores/:id/disponibilidad`: Alternar estado activo/inactivo del tutor.
- `PUT /api/tutores/:id`: Actualizar perfil, materias o precios del tutor.

### Tutorias (`/api/tutorias`)
- `GET /api/tutorias`: Listar tutorias agendadas (filtros: `estudianteId`, `estado`).
- `GET /api/tutorias/asignadas?tutorId=...`: Obtener tutorias asignadas a un tutor especifico.
- `GET /api/tutorias/:id`: Detalle de una tutoria especifica.
- `POST /api/tutorias`: Agendar una nueva tutoria (modalidad presencial o virtual con Google Meet).
- `PATCH /api/tutorias/:id/link`: Actualizar enlace de reunion virtual.
- `PATCH /api/tutorias/:id/estado`: Modificar estado (`pendiente`, `completada`, `cancelada`).
- `POST /api/tutorias/:id/calificacion`: Calificar tutoria y guardar retroalimentacion.
- `DELETE /api/tutorias/:id`: Cancelar tutoria.

### Administracion (`/api/admin`)
- `GET /api/admin/solicitudes`: Listado de solicitudes de monitores para aprobacion.
- `PATCH /api/admin/solicitudes/:id/estado`: Aprobar o rechazar solicitud (con motivo de rechazo).
- `PATCH /api/admin/tutores/:id/visibilidad`: Activar o desactivar visibilidad en catalogo.

### Resenas y Feedback (`/api/resenas`)
- `GET /api/resenas?tutorId=...`: Obtener resenas de un tutor.
- `POST /api/resenas`: Crear calificacion detallada (4 preguntas de evaluacion y comentario).

### Usuarios (`/api/usuarios`)
- `GET /api/usuarios`: Listar usuarios registrados.
- `GET /api/usuarios/:id`: Obtener perfil de usuario.
- `PUT /api/usuarios/:id`: Actualizar datos de perfil (telefono, semestre, correo).
