module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: true },
  }, {
    tableName: 'roles',
    timestamps: false
  });

  Role.associate = models => {
    Role.belongsToMany(models.Module, {
      through: models.ModulePermission,
      foreignKey: 'role_id',
      otherKey: 'module_id'
    });

    Role.hasMany(models.ModulePermission, { foreignKey: 'role_id' });

    Role.belongsToMany(models.User, {
      through: models.UserRole,
      foreignKey: 'role_id',
      otherKey: 'user_id'
    });

    Role.hasMany(models.UserRole, { foreignKey: 'role_id' });

  };

  return Role;
};
