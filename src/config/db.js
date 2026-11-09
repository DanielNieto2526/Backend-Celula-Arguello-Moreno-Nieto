const mongoose = require('mongoose');
const { USUARIOS_INICIALES, TUTORES_INICIALES, TUTORIAS_INICIALES } = require('../utils/seedData');

let isConnected = false;

async function conectarDB() {
    const uri = process.env.MONGO_URI || process.env.MONGO_URL;
    const dbName = process.env.DB_NAME || 'conectatutor_db';

    if (!uri || uri.trim() === '') {
        console.warn('⚠️ [MongoDB] Advertencia: MONGO_URI no está configurada en el archivo .env. La API operará con datos en memoria.');
        return false;
    }

    if (uri.includes('<db_username>') || uri.includes('<db_password>')) {
        console.warn('⚠️ [MongoDB] Recuerda reemplazar <db_username> y <db_password> en el archivo .env con tus credenciales de MongoDB Atlas. Operando en memoria.');
        return false;
    }

    try {
        await mongoose.connect(uri, {
            dbName: dbName
        });
        isConnected = true;
        console.log(`✅ Conectado exitosamente a MongoDB Atlas (Base de datos: ${dbName})`);

        // Sembrar datos iniciales si la base de datos está vacía
        await sembrarDatosIniciales();
        return true;
    } catch (error) {
        console.error('❌ Error al conectar a MongoDB Atlas:', error.message);
        console.warn('⚠️ La API continuará funcionando con el almacén en memoria para demostración.');
        return false;
    }
}

async function sembrarDatosIniciales() {
    try {
        const Usuario = require('../models/usuario.model');
        const Tutor = require('../models/tutor.model');
        const Tutoria = require('../models/tutoria.model');

        const conteoUsuarios = await Usuario.countDocuments();
        if (conteoUsuarios === 0) {
            await Usuario.insertMany(USUARIOS_INICIALES);
            console.log('🌱 [Seed] Usuarios iniciales sembrados en MongoDB.');
        }

        const conteoTutores = await Tutor.countDocuments();
        if (conteoTutores === 0) {
            await Tutor.insertMany(TUTORES_INICIALES);
            console.log('🌱 [Seed] Tutores iniciales sembrados en MongoDB.');
        }

        const conteoTutorias = await Tutoria.countDocuments();
        if (conteoTutorias === 0) {
            await Tutoria.insertMany(TUTORIAS_INICIALES);
            console.log('🌱 [Seed] Tutorías iniciales sembradas en MongoDB.');
        }
    } catch (e) {
        console.warn('⚠️ No se pudieron sembrar los datos iniciales en MongoDB:', e.message);
    }
}

function estaConectado() {
    return isConnected && mongoose.connection.readyState === 1;
}

module.exports = {
    conectarDB,
    estaConectado
};
