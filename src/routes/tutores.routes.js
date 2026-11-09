const { Router } = require('express');
const tutoresController = require('../controllers/tutores.controller');
const { validarRegistroTutor } = require('../middlewares/validarErrores');

const router = Router();

// GET /api/tutores
router.get('/', tutoresController.listar);

// POST /api/tutores/registro
router.post('/registro', validarRegistroTutor, tutoresController.registrar);

// GET /api/tutores/:id
router.get('/:id', tutoresController.obtener);

// PATCH /api/tutores/:id/disponibilidad
router.patch('/:id/disponibilidad', tutoresController.actualizarDisponibilidad);

// PUT / PATCH /api/tutores/:id
router.put('/:id', tutoresController.actualizar);
router.patch('/:id', tutoresController.actualizar);

module.exports = router;
