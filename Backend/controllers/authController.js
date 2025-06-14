const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/jwt');
const { User, Role, Module, UserRole, ModulePermission } = require('../models');


const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(409).json({ error: 'Email ya registrado' });

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hash });

    res.status(201).json({ message: 'Usuario registrado correctamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error al registrar usuario', details: err.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  
  
  try {
    const user = await User.findOne({ where: { email } });
    
    //console.log("Nombre: ",user.name);
    //console.log("Email: ",user.email);
    //console.log("Password: ",user.password);
    //console.log("is_superuser: ",user.is_superuser);

    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Contraseña incorrecta' });

    const token = generateToken(user);
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, is_superuser: user.is_superuser } });
  } catch (err) {
    res.status(500).json({ error: 'Error al iniciar sesión', details: err.message });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'name', 'email'],
      include: {
        model: Role,
        through: { attributes: [] }, // Oculta la tabla intermedia
        include: {
          model: Module,
          through: { attributes: [] }, // Oculta module_permissions
          where: { enabled: true },
          required: false
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error en /me:', error);
    res.status(500).json({ error: 'Error al obtener usuario', details: error.message });
  }
};



module.exports = { register, login, getMe };
