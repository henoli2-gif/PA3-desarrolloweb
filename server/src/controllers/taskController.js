const Task = require('../models/Task');

async function obtenerTareas(req, res) {
  try {
    // Solo las tareas del usuario que envio el token
    const tareas = await Task.find({ userId: req.userId });
    return res.status(200).json(tareas);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensaje: 'Error en el servidor.' });
  }
}

async function crearTarea(req, res) {
  try {
    const { titulo, descripcion } = req.body;

    if (!titulo || !descripcion || !titulo.trim() || !descripcion.trim()) {
      return res.status(400).json({ mensaje: 'El título y la descripción son obligatorios.' });
    }

    const tarea = new Task({
      titulo: titulo.trim(),
      descripcion: descripcion.trim(),
      userId: req.userId
    });

    await tarea.save();
    return res.status(201).json(tarea);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensaje: 'Error en el servidor.' });
  }
}

async function eliminarTarea(req, res) {
  try {
    const tarea = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });

    if (!tarea) {
      return res.status(400).json({ mensaje: 'La tarea no existe o no te pertenece.' });
    }

    return res.status(200).json({ mensaje: 'Tarea eliminada correctamente.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensaje: 'Error en el servidor.' });
  }
}

module.exports = { obtenerTareas, crearTarea, eliminarTarea };
