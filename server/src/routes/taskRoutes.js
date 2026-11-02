const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { obtenerTareas, crearTarea, eliminarTarea } = require('../controllers/taskController');

const router = express.Router();

// Todas las rutas de tareas piden un JWT valido
router.use(authMiddleware);

router.get('/', obtenerTareas);
router.post('/', crearTarea);
router.delete('/:id', eliminarTarea);

module.exports = router;
