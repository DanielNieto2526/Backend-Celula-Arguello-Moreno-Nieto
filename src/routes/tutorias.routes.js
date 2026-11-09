const { Router } = require('express');
const tutoriasController = require('../controllers/tutorias.controller');
const { validarAgendamiento } = require('../middlewares/validarErrores');

const router = Router();

// GET /api/tutorias
router.get('/', tutoriasController.listar);

// GET /api/tutorias/asignadas (importante: antes de /:id)
router.get('/asignadas', tutoriasController.obtenerAsignadas);

// GET /api/tutorias/:id
router.get('/:id', tutoriasController.obtener);

// POST /api/tutorias
router.post('/', validarAgendamiento, tutoriasController.agendar);

// PATCH /api/tutorias/:id/link
router.patch('/:id/link', tutoriasController.actualizarLink);

// PATCH /api/tutorias/:id/estado
router.patch('/:id/estado', tutoriasController.actualizarEstado);

// POST /api/tutorias/:id/calificacion
router.post('/:id/calificacion', tutoriasController.calificar);

// DELETE /api/tutorias/:id
router.delete('/:id', tutoriasController.cancelar);

module.exports = router;
