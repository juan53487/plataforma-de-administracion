const { Role } = require('../models');

const createRole = async (req, res) => {
  try {
    const { name, description } = req.body;

    const [role, created] = await Role.findOrCreate({
      where: { name },
      defaults: { description }
    });

    if (!created) {
      return res.status(400).json({ error: 'El rol ya existe' });
    }

    res.status(201).json({ message: 'Rol creado exitosamente', role });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear rol', details: error.message });
  }
};

module.exports = { createRole };
