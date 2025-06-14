
const { Module, Role, Permission, ModulePermission, UserRole } = require('../models');

const sequelize = require('../config/database');

const assignPermissionsToModule = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { role_id, module_id, permissions } = req.body; // permissions: ['create', 'read']

    const role = await Role.findByPk(role_id);
    const module = await Module.findByPk(module_id);

    if (!role || !module) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Rol o módulo no encontrado' });
    }

    // Limpiar permisos anteriores
    await ModulePermission.destroy({ where: { role_id, module_id }, transaction });

    // Asignar nuevos
    for (const permName of permissions) {
      const perm = await Permission.findOne({ where: { name: permName }, transaction });

      if (!perm) {
        await transaction.rollback();
        return res.status(400).json({ error: `Permiso "${permName}" no encontrado` });
      }

      console.log(`Asignando permiso ${perm.name} (id ${perm.id}) a role_id=${role_id}, module_id=${module_id}`);

      await ModulePermission.findOrCreate({
        where: {
          role_id,
          module_id,
          permission_id: perm.id
        },
        transaction
      });
    }

    await transaction.commit();
    res.status(200).json({ message: 'Permisos asignados correctamente' });
  } catch (error) {
    await transaction.rollback();
    console.error('ERROR COMPLETO:', error);
    return res.status(500).json({
      error: 'Error al asignar permisos',
      details: error.message,
      sequelize: error.errors || null
    });
  }
};

const getPermissionsForModule = async (req, res) => {
  try {
    const { role_id, module_id } = req.query;

    if (!role_id || !module_id) {
      return res.status(400).json({ error: 'Faltan parámetros: role_id y module_id son requeridos' });
    }

    const role = await Role.findByPk(role_id);
    const module = await Module.findByPk(module_id);

    if (!role || !module) {
      return res.status(404).json({ error: 'Rol o módulo no encontrado' });
    }

    const assignments = await ModulePermission.findAll({
      where: { role_id, module_id },
      include: [{ model: Permission, attributes: ['name'] }]
    });

    const permissions = assignments.map(a => a.Permission?.name).filter(Boolean);

    res.status(200).json({ role_id, module_id, permissions });
  } catch (error) {
    console.error('ERROR al obtener permisos:', error);
    res.status(500).json({ error: 'Error al obtener permisos', details: error.message });
  }
};

const getUserModulesWithPermissions = async (req, res) => {
  try {
    const userId = req.user.id;

    // ✅ Si el usuario es superusuario, devolver todos los módulos y todos los permisos
    if (req.user.is_superuser) {

      
      // Obtener todos los módulos y sus permisos
      const modules = await Module.findAll({
        include: {
          model: Permission,
          as: 'Permissions', // 👈 esto debe coincidir con el alias definido arriba
          through: { attributes: [] }
        }
      });
      
      // Convertir los módulos en un formato de respuesta
      const result = modules.map(mod => ({
        id: mod.id,
        name: mod.name,
        permissions: mod.Permissions.map(p => p.name)
      }));
      //console.log("Modulos del super usuario: ", result)

      return res.json({ modules: result });
    }

    // Obtener los roles del usuario
    const userRoles = await UserRole.findAll({
      where: { user_id: userId }
    });

    const roleIds = userRoles.map(ur => ur.role_id);

    // Obtener todas las combinaciones de módulo + permiso de esos roles
    const modulePermissions = await ModulePermission.findAll({
      where: {
        role_id: roleIds
      },
      include: [
        { model: Module, attributes: ['id', 'name'] },
        { model: Permission, attributes: ['name'] }
      ]
    });

    // Organizar datos por módulo
    const moduleMap = {};

    modulePermissions.forEach(mp => {
      const moduleId = mp.Module.id;
      const moduleName = mp.Module.name;
      const permissionName = mp.Permission.name;

      if (!moduleMap[moduleId]) {
        moduleMap[moduleId] = {
          id: moduleId,
          name: moduleName,
          permissions: new Set()
        };
      }

      moduleMap[moduleId].permissions.add(permissionName);
    });

    // Convertir Set a array
    const result = Object.values(moduleMap).map(mod => ({
      ...mod,
      permissions: Array.from(mod.permissions)
    }));

    res.json({ modules: result });

  } catch (error) {
    console.error('Error al obtener módulos y permisos del usuario:', error);
    res.status(500).json({ error: 'Error al obtener módulos y permisos' });
  }
};

module.exports = {
  assignPermissionsToModule,
  getPermissionsForModule,
  getUserModulesWithPermissions
};
