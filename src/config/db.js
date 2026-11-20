const dns = require('node:dns');
const mongoose = require('mongoose');

// Solucion para error querySrv ECONNREFUSED en Windows/Node con DNS de proveedores locales
try {
    dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch {
    // Continuar si no se permite modificar servidores DNS
}

const {
    USUARIOS_INICIALES,
    TUTORES_INICIALES,
    TUTORIAS_INICIALES,
    RESENAS_INICIALES
} = require('../utils/seedData');

let isConnected = false;

async function conectarDB() {
    const uri = process.env.MONGO_URI || process.env.MONGO_URL;
    const dbName = process.env.DB_NAME || 'conectatutor_db';

    if (!uri || uri.trim() === '') {
        console.warn('[MongoDB] Advertencia: MONGO_URI no esta configurada en el archivo .env. La API operara con datos en memoria.');
        return false;
    }

    if (uri.includes('<db_username>') || uri.includes('<db_password>')) {
        console.warn('[MongoDB] Recuerda reemplazar <db_password> en el archivo .env con la contrasena de tu usuario en MongoDB Atlas.');
        console.warn('[MongoDB] La API operara con datos en memoria hasta que agregues tu contrasena en .env.');
        return false;
    }

    try {
        await mongoose.connect(uri, {
            dbName: dbName
        });
        isConnected = true;
        console.log(`[MongoDB] Conectado exitosamente a MongoDB Atlas (Base de datos: ${dbName})`);

        // Sembrar datos iniciales si la base de datos esta vacia
        await sembrarDatosIniciales();
        return true;
    } catch (error) {
        console.error('[MongoDB] Error al conectar a MongoDB Atlas:', error.message);
        if (error.message.includes('bad auth') || error.message.includes('Authentication failed')) {
            console.error('[MongoDB] Nota: La contrasena en el archivo .env no es correcta. Asegurate de colocar la misma contrasena con la que te conectaste en MongoDB Compass. Si contiene caracteres especiales, deben estar codificados en URL (ej: @ -> %40).');
        }
        console.warn('[MongoDB] La API continuara funcionando con el almacen en memoria.');
        return false;
    }
}

async function sembrarDatosIniciales() {
    try {
        const Usuario = require('../models/usuario.model');
        const Tutor = require('../models/tutor.model');
        const Tutoria = require('../models/tutoria.model');
        const Resena = require('../models/resena.model');

        const conteoUsuarios = await Usuario.countDocuments();
        if (conteoUsuarios === 0) {
            await Usuario.insertMany(USUARIOS_INICIALES);
            console.log('[Seed] Usuarios iniciales sembrados en MongoDB.');
        }

        const conteoTutores = await Tutor.countDocuments();
        if (conteoTutores === 0) {
            await Tutor.insertMany(TUTORES_INICIALES);
            console.log('[Seed] Tutores iniciales sembrados en MongoDB.');
        }

        const conteoTutorias = await Tutoria.countDocuments();
        if (conteoTutorias === 0) {
            await Tutoria.insertMany(TUTORIAS_INICIALES);
            console.log('[Seed] Tutorias iniciales sembradas en MongoDB.');
        }

        const conteoResenas = await Resena.countDocuments();
        if (conteoResenas === 0) {
            await Resena.insertMany(RESENAS_INICIALES);
            console.log('[Seed] Resenas iniciales sembradas en MongoDB.');
        }
    } catch (e) {
        console.warn('[Seed] No se pudieron sembrar los datos iniciales en MongoDB:', e.message);
    }
}

function estaConectado() {
    return isConnected && mongoose.connection.readyState === 1;
}

module.exports = {
    conectarDB,
    estaConectado
};
