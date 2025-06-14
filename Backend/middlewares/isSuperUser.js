const isSuperUser = (req, res, next) => {
 
  if (!req.user || !req.user.is_superuser) {
    return res.status(403).json({ error: 'Acceso denegado. Se requiere superusuario.' });
  }
  next();
};

module.exports = isSuperUser;
