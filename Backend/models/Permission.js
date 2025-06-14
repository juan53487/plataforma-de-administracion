module.exports = (sequelize, DataTypes) => {
  const Permission = sequelize.define('Permission', {
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
  }, {
    tableName: 'permissions',
    timestamps: false
  });

  Permission.associate = models => {
    Permission.belongsToMany(models.Module, {
      through: models.ModulePermission,
      foreignKey: 'permission_id',
      otherKey: 'module_id',
      as: 'Modules'
    });

    Permission.hasMany(models.ModulePermission, { foreignKey: 'permission_id' });
  };

  return Permission;
};
