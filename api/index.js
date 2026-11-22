const app = require('../src/app');
const { conectarDB, estaConectado } = require('../src/config/db');

module.exports = async (req, res) => {
    if (!estaConectado() && process.env.MONGO_URI) {
        try {
            await conectarDB();
        } catch (error) {
            console.error('[Vercel Serverless] Error conectando a MongoDB:', error.message);
        }
    }
    return app(req, res);
};
