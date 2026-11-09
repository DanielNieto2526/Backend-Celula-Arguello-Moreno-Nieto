const { Router } = require('express');
const usuariosController = require('../controllers/usuarios.controller');

const router = Router();

// GET /api/usuarios
router.get('/', usuariosController.listar);

// GET /api/usuarios/:id
router.get('/:id', usuariosController.obtener);

// PUT /api/usuarios/:id (o PATCH)
router.put('/:id', usuariosController.actualizar);
router.patch('/:id', usuariosController.actualizar);

// DELETE /api/usuarios/:id
router.delete('/:id', usuariosController.eliminar);

module.exports = router;
