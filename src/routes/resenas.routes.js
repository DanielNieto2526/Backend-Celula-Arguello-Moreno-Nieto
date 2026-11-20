const { Router } = require('express');
const resenasController = require('../controllers/resenas.controller');

const router = Router();

// GET /api/resenas
router.get('/', resenasController.listar);

// POST /api/resenas
router.post('/', resenasController.crear);

// GET /api/resenas/tutor/:tutorId
router.get('/tutor/:tutorId', resenasController.obtenerPorTutor);

// GET /api/resenas/tutor/:tutorId/promedio
router.get('/tutor/:tutorId/promedio', resenasController.obtenerPromedioTutor);

module.exports = router;
