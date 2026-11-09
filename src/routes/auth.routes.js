const { Router } = require('express');
const authController = require('../controllers/auth.controller');
const { validarLogin, validarRegistroEstudiante } = require('../middlewares/validarErrores');

const router = Router();

// POST /api/auth/login
router.post('/login', validarLogin, authController.login);

// POST /api/auth/registro/estudiante
router.post('/registro/estudiante', validarRegistroEstudiante, authController.registrarEstudiante);

module.exports = router;
