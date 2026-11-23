const app = require('../src/app');
const { conectarDB, estaConectado } = require('../src/config/db');

module.exports = async (req, res) => {
    const uri = process.env.MONGO_URI || process.env.MONGO_URL || process.env.MONGODB_URI;
    if (!estaConectado() && uri) {
        try {
            await conectarDB();
        } catch (error) {
            console.error('[Vercel Serverless] Error conectando a MongoDB:', error.message);
        }
    }

    // Normalizar req.url si Vercel incluye la ruta del archivo serverless
    if (req.url && req.url.startsWith('/api/index.js')) {
        req.url = req.url.replace('/api/index.js', '') || '/';
    }

    return app(req, res);
};
