# Backend - ConectaTutor (Universidad del Rosario)

Repositorio de manejo de Backend para diseño web, elaborado por: **Geronimo Arguello**, **Daniel Moreno** y **Daniel Nieto**.

API RESTful desarrollada con **Node.js**, **Express**, **MongoDB (Mongoose)** y documentación interactiva con **Swagger / OpenAPI**.

---

## 🚀 Arquitectura del Proyecto

El backend implementa una arquitectura limpia y desacoplada en capas:

```
├── .env.example              # Plantilla de variables de entorno
├── .gitignore                # Exclusión de node_modules y .env
├── package.json              # Configuración y dependencias de Node.js
├── README.md                 # Documentación del proyecto
└── src/
    ├── app.js                # Configuración de Express, CORS, middlewares y rutas
    ├── server.js             # Inicialización del servidor HTTP y conexión a BD
    ├── config/
    │   └── db.js             # Conexión a MongoDB Atlas y siembra de datos
    ├── controllers/          # Manejadores de peticiones HTTP
    │   ├── auth.controller.js
    │   ├── tutores.controller.js
    │   ├── tutorias.controller.js
    │   └── usuarios.controller.js
    ├── docs/
    │   └── openapi.js        # Especificación OpenAPI 3.0 para Swagger UI
    ├── middlewares/          # Validaciones y manejo centralizado de errores
    │   ├── manejarErrores.js
    │   └── validarErrores.js
    ├── models/               # Esquemas y modelos de datos (Mongoose)
    │   ├── tutor.model.js
    │   ├── tutoria.model.js
    │   └── usuario.model.js
    ├── routes/               # Definición y enrutamiento de endpoints
    │   ├── auth.routes.js
    │   ├── tutores.routes.js
    │   ├── tutorias.routes.js
    │   └── usuarios.routes.js
    ├── services/             # Lógica de negocio y persistencia (dual MongoDB / memoria)
    │   ├── auth.service.js
    │   ├── tutores.service.js
    │   ├── tutorias.service.js
    │   └── usuarios.service.js
    └── utils/
        ├── HttpError.js      # Clase para errores HTTP controlados
        └── seedData.js       # Datos iniciales para pruebas y desarrollo
```

---

## 🛠️ Instalación y Puesta en Marcha

### 1. Clonar el repositorio e instalar dependencias
```bash
npm install
```

### 2. Configurar variables de entorno
Crea un archivo `.env` en la raíz del proyecto tomando como base `.env.example`:
```env
PORT=3000
MONGO_URI=mongodb+srv://<usuario>:<password>@cluster0.example.mongodb.net/
DB_NAME=conectatutor_db
```
> **Nota**: Si no configuras `MONGO_URI`, el servidor funcionará automáticamente con un almacén en memoria precargado con datos iniciales para desarrollo y pruebas.

### 3. Iniciar la aplicación
- **Modo desarrollo (con recarga automática):**
  ```bash
  npm run dev
  ```
- **Modo producción:**
  ```bash
  npm start
  ```

---

## 📚 Documentación Interactiva (Swagger UI)

Una vez iniciado el servidor, accede a:
- **Swagger UI:** [http://localhost:3000/api-docs](http://localhost:3000/api-docs)
- **Especificación OpenAPI (JSON):** [http://localhost:3000/api/docs.json](http://localhost:3000/api/docs.json)
- **Verificación de Salud:** [http://localhost:3000/api/salud](http://localhost:3000/api/salud)

---

## 📡 Endpoints Principales

### 🔐 Autenticación (`/api/auth`)
- `POST /api/auth/login`: Inicio de sesión (correo o prefijo antes del arroba y clave).
- `POST /api/auth/registro/estudiante`: Registro de nuevo estudiante (valida `@urosario.edu.co`).

### 👨‍🏫 Tutores (`/api/tutores`)
- `GET /api/tutores`: Listar tutores disponibles (filtros opcionales: `materia`, `sede`, `modalidad`, `activo`).
- `GET /api/tutores/:id`: Obtener información detallada de un tutor.
- `POST /api/tutores/registro`: Registrar nuevo tutor con materias, precios y días disponibles.
- `PATCH /api/tutores/:id/disponibilidad`: Alternar estado activo/inactivo del tutor.
- `PATCH /api/tutores/:id`: Actualizar perfil, materias o precios del tutor.

### 📅 Tutorías (`/api/tutorias`)
- `GET /api/tutorias`: Listar tutorías agendadas (filtros: `estudianteId`, `estado`).
- `GET /api/tutorias/asignadas?tutorId=...`: Obtener tutorías asignadas a un tutor específico.
- `GET /api/tutorias/:id`: Detalle de una tutoría específica.
- `POST /api/tutorias`: Agendar una nueva tutoría (modalidad presencial o virtual).
- `PATCH /api/tutorias/:id/link`: Actualizar enlace de reunión virtual (Google Meet / Teams).
- `PATCH /api/tutorias/:id/estado`: Modificar estado (`pendiente`, `completada`, `cancelada`).
- `POST /api/tutorias/:id/calificacion`: Calificar tutoría (1 a 5 estrellas y comentarios).
- `DELETE /api/tutorias/:id`: Cancelar tutoría.

### 👤 Usuarios (`/api/usuarios`)
- `GET /api/usuarios`: Listar usuarios registrados.
- `GET /api/usuarios/:id`: Obtener perfil de usuario.
- `PUT /api/usuarios/:id` o `PATCH /api/usuarios/:id`: Actualizar datos de perfil (teléfono, semestre, correo).
