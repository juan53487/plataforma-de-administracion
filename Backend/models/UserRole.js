module.exports = (sequelize, DataTypes) => {
  const UserRole = sequelize.define('UserRole', {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' }
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'roles', key: 'id' }
    }
  }, {
    tableName: 'user_roles',
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'role_id']
      }
    ]
  });

  UserRole.associate = models => {
    UserRole.belongsTo(models.User, { foreignKey: 'user_id' });
    UserRole.belongsTo(models.Role, { foreignKey: 'role_id' });
  };

  return UserRole;
};
