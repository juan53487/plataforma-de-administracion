'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('module_permissions', {
      role_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'roles',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      module_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'modules',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      permission_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'permissions',
          key: 'id'
        },
        onDelete: 'CASCADE'
      }
    });

    await queryInterface.addConstraint('module_permissions', {
      fields: ['role_id', 'module_id', 'permission_id'],
      type: 'unique',
      name: 'unique_module_permission_constraint'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('module_permissions');
  }
};
