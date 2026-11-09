const express = require('express');
const swaggerUi = require('swagger-ui-express');
const documentacion = require('./docs/openapi');
const authRouter = require('./routes/auth.routes');
const tutoresRouter = require('./routes/tutores.routes');
const tutoriasRouter = require('./routes/tutorias.routes');
const usuariosRouter = require('./routes/usuarios.routes');
const { rutaNoEncontrada, manejarErrores } = require('./middlewares/manejarErrores');

const app = express();

// 1. CORS: Permitir comunicación con el Frontend (Vite en http://localhost:5173 u otros)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// 2. Parsear cuerpos de peticiones JSON
app.use(express.json());

// 3. Documentación interactiva OpenAPI / Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(documentacion));
app.get('/api/docs.json', (req, res) => {
    res.json(documentacion);
});

// 4. Verificación de salud de la API
app.get('/api/salud', (req, res) => {
    res.json({
        estado: 'ok',
        app: 'ConectaTutor API - Universidad del Rosario',
        version: '1.0.0',
        timestamp: new Date().toISOString()
    });
});

// 5. Enrutadores del Backend
app.use('/api/auth', authRouter);
app.use('/api/tutores', tutoresRouter);
app.use('/api/tutorias', tutoriasRouter);
app.use('/api/usuarios', usuariosRouter);

// 6. Manejo de rutas inexistentes (404)
app.use(rutaNoEncontrada);

// 7. Manejo global de errores (500, 400, etc.)
app.use(manejarErrores);

module.exports = app;
