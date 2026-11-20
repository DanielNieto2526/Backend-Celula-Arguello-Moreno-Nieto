const { Router } = require('express');
const adminController = require('../controllers/admin.controller');

const router = Router();

// GET /api/admin/solicitudes - Listar todas las solicitudes/tutores para admin
router.get('/solicitudes', adminController.obtenerTodasLasSolicitudes);

// GET /api/admin/solicitudes/pendientes - Listar solicitudes pendientes de notas
router.get('/solicitudes/pendientes', adminController.obtenerPendientes);

// GET /api/admin/tutores - Listar tutores aprobados para gestión
router.get('/tutores', adminController.obtenerGestion);

// POST o PATCH /api/admin/tutores/:id/aprobar - Aprobar tutor
router.post('/tutores/:id/aprobar', adminController.aprobar);
router.patch('/tutores/:id/aprobar', adminController.aprobar);

// POST o PATCH /api/admin/tutores/:id/rechazar - Rechazar tutor
router.post('/tutores/:id/rechazar', adminController.rechazar);
router.patch('/tutores/:id/rechazar', adminController.rechazar);

// PATCH /api/admin/tutores/:id/estado - Habilitar o deshabilitar tutor en catálogo
router.patch('/tutores/:id/estado', adminController.alternarEstado);

module.exports = router;
