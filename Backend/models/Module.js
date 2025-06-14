module.exports = (sequelize, DataTypes) => {
  const Module = sequelize.define('Module', {
    name: { type: DataTypes.STRING, allowNull: false },
    route: { type: DataTypes.STRING, allowNull: false },
    icon: { type: DataTypes.STRING },
    enabled: { type: DataTypes.BOOLEAN, defaultValue: true }
  }, {
    tableName: 'modules',
    timestamps: true
  });

  Module.associate = models => {
    Module.belongsToMany(models.Role, {
      through: models.ModulePermission,
      foreignKey: 'module_id',
      otherKey: 'role_id'
    });

    Module.belongsToMany(models.Permission, {
      through: models.ModulePermission,
      foreignKey: 'module_id',
      otherKey: 'permission_id',
      as: 'Permissions'
    });

    Module.hasMany(models.ModulePermission, { foreignKey: 'module_id' });
  };

  return Module;
};
