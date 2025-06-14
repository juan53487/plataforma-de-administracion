
const { User, Role,  UserRole } = require('../models');

const assignRoleToUser = async (req, res) => {
  try {
    const { user_id, role_id } = req.body;

    const user = await User.findByPk(user_id);
    const role = await Role.findByPk(role_id);

    if (!user || !role) {
      return res.status(404).json({ error: 'Usuario o rol no encontrado' });
    }

    await UserRole.findOrCreate({ where: { user_id, role_id } });

    res.status(200).json({ message: `Rol asignado correctamente al usuario` });
  } catch (error) {
    res.status(500).json({ error: 'Error al asignar rol', details: error.message });
  }
};

module.exports = { assignRoleToUser };
