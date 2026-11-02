const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

async function register(req, res) {
  try {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password || !nombre.trim() || !email.trim() || !password.trim()) {
      return res.status(400).json({ mensaje: 'Todos los campos son obligatorios.' });
    }

    const correo = email.trim().toLowerCase();
    const yaExiste = await User.findOne({ email: correo });

    if (yaExiste) {
      return res.status(400).json({ mensaje: 'El correo ya está registrado.' });
    }

    // Guardamos la contraseña encriptada, nunca en texto plano
    const passwordHash = await bcrypt.hash(password, 10);

    const usuario = new User({
      nombre: nombre.trim(),
      email: correo,
      password: passwordHash
    });

    await usuario.save();

    return res.status(201).json({ mensaje: 'Usuario registrado correctamente.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensaje: 'Error en el servidor.' });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password || !email.trim() || !password.trim()) {
      return res.status(400).json({ mensaje: 'Correo y contraseña son obligatorios.' });
    }

    const usuario = await User.findOne({ email: email.trim().toLowerCase() });

    if (!usuario) {
      return res.status(401).json({ mensaje: 'Credenciales incorrectas.' });
    }

    const coincide = await bcrypt.compare(password, usuario.password);

    if (!coincide) {
      return res.status(401).json({ mensaje: 'Credenciales incorrectas.' });
    }

    const token = jwt.sign({ id: usuario._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    return res.status(200).json({
      mensaje: 'Inicio de sesión exitoso.',
      token,
      nombre: usuario.nombre
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensaje: 'Error en el servidor.' });
  }
}

module.exports = { register, login };
