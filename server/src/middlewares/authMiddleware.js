const jwt = require('jsonwebtoken');

// Revisa el encabezado Authorization: Bearer <token>
function authMiddleware(req, res, next) {
  const encabezado = req.headers.authorization;

  if (!encabezado || !encabezado.startsWith('Bearer ')) {
    return res.status(401).json({ mensaje: 'No autorizado. Token no enviado.' });
  }

  const token = encabezado.split(' ')[1];

  try {
    const datos = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = datos.id;
    next();
  } catch {
    return res.status(401).json({ mensaje: 'Token inválido o expirado.' });
  }
}

module.exports = authMiddleware;
