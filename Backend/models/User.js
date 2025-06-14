module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    is_superuser: { type: DataTypes.BOOLEAN, defaultValue: false }
  }, {
    tableName: 'users',
    timestamps: true
  });

  User.associate = models => {
    User.belongsToMany(models.Role, {
      through: models.UserRole,
      foreignKey: 'user_id',
      otherKey: 'role_id'
    });

    User.hasMany(models.UserRole, { foreignKey: 'user_id' });
  };

  return User;
};
