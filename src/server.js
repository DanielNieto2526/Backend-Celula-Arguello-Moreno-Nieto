// Servidor ConectaTutor - Universidad del Rosario
require('dotenv').config();
const app = require('./app');
const { conectarDB } = require('./config/db');

const PUERTO = process.env.PORT || 3000;

async function iniciarServidor() {
    await conectarDB();
    app.listen(PUERTO, () => {
        console.log(`🚀 ConectaTutor API escuchando en http://localhost:${PUERTO}`);
        console.log(`📚 Documentación OpenAPI / Swagger en http://localhost:${PUERTO}/api-docs`);
        console.log(`🩺 Salud de la API en http://localhost:${PUERTO}/api/salud`);
    });
}

iniciarServidor();
