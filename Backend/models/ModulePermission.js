module.exports = (sequelize, DataTypes) => {
  const ModulePermission = sequelize.define('ModulePermission', {
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'roles', key: 'id' }
    },
    module_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'modules', key: 'id' }
    },
    permission_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'permissions', key: 'id' }
    }
  }, {
    tableName: 'module_permissions',
    timestamps: false,
    indexes: [{
      unique: true,
      fields: ['role_id', 'module_id', 'permission_id']
    }]
  });

  ModulePermission.associate = models => {
    ModulePermission.belongsTo(models.Module, { foreignKey: 'module_id' });
    ModulePermission.belongsTo(models.Permission, { foreignKey: 'permission_id' });
    ModulePermission.belongsTo(models.Role, { foreignKey: 'role_id' });
  };

  return ModulePermission;
};
