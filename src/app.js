const express = require('express');
const swaggerUi = require('swagger-ui-express');
const documentacion = require('./docs/openapi');
const authRouter = require('./routes/auth.routes');
const tutoresRouter = require('./routes/tutores.routes');
const tutoriasRouter = require('./routes/tutorias.routes');
const usuariosRouter = require('./routes/usuarios.routes');
const adminRouter = require('./routes/admin.routes');
const resenasRouter = require('./routes/resenas.routes');
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

// 2. Parsear cuerpos de peticiones JSON (límite ampliado para soportar archivos PDF e imágenes en base64)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Middleware para asegurar conexión a MongoDB en entornos serverless (Vercel)
app.use(async (req, res, next) => {
    const { estaConectado, conectarDB } = require('./config/db');
    if (!estaConectado()) {
        try {
            await conectarDB();
        } catch (e) {
            console.error('[DB Middleware] Error conectando a MongoDB:', e.message);
        }
    }
    next();
});

// 3. Documentación interactiva OpenAPI / Swagger
app.use(['/api-docs', '/api/docs'], swaggerUi.serve, swaggerUi.setup(documentacion));
app.get(['/api/docs.json', '/docs.json'], (req, res) => {
    res.json(documentacion);
});

// 4. Verificación de salud de la API (responde en /, /api, /salud y /api/salud)
const { estaConectado } = require('./config/db');
app.get(['/', '/api', '/salud', '/api/salud'], (req, res) => {
    const conectada = estaConectado();
    const uriConfig = Boolean(process.env.MONGO_URI || process.env.MONGO_URL || process.env.MONGODB_URI);
    res.json({
        estado: 'ok',
        app: 'ConectaTutor API - Universidad del Rosario',
        version: '1.0.0',
        dbConectada: conectada,
        baseDeDatos: conectada ? 'MongoDB Atlas' : 'Almacén en memoria',
        mongoConfigurada: uriConfig,
        timestamp: new Date().toISOString()
    });
});

// 5. Enrutadores del Backend (admiten tanto con prefijo /api como directo)
app.use(['/api/auth', '/auth'], authRouter);
app.use(['/api/tutores', '/tutores'], tutoresRouter);
app.use(['/api/tutorias', '/tutorias'], tutoriasRouter);
app.use(['/api/usuarios', '/usuarios'], usuariosRouter);
app.use(['/api/admin', '/admin'], adminRouter);
app.use(['/api/resenas', '/resenas'], resenasRouter);

// 6. Manejo de rutas inexistentes (404)
app.use(rutaNoEncontrada);

// 7. Manejo global de errores (500, 400, etc.)
app.use(manejarErrores);

module.exports = app;
