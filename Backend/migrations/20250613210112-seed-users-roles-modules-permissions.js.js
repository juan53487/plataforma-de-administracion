'use strict';

const now = new Date();

module.exports = {
  async up(queryInterface, Sequelize) {
    // Insertar Usuarios
    await queryInterface.bulkInsert('users', [
      {
        name: 'Super Admin Principal',
        email: 'super@example.com',
        password: '$2b$10$WveHjRdVL8n9av41ybc0k.ywD/OSLTE6TuUlU9Xd1wElHBoctIbF6',
        is_superuser: true,
        createdAt: now,
        updatedAt: now
      },
      {
        name: 'Juan Pérez',
        email: 'juan@example.com',
        password: '$2b$10$WveHjRdVL8n9av41ybc0k.ywD/OSLTE6TuUlU9Xd1wElHBoctIbF6',
        is_superuser: false,
        createdAt: now,
        updatedAt: now
      },
      {
        name: 'Carolina Rodríguez',
        email: 'carolina@example.com',
        password: '$2b$10$WveHjRdVL8n9av41ybc0k.ywD/OSLTE6TuUlU9Xd1wElHBoctIbF6',
        is_superuser: false,
        createdAt: now,
        updatedAt: now
      }
    ], { ignoreDuplicates: true });

    // Insertar Roles
    await queryInterface.bulkInsert('roles', [
      { name: 'superadmin', description: null, createdAt: now, updatedAt: now },
      { name: 'Administrador', description: 'Rol con privilegios completos', createdAt: now, updatedAt: now },
      { name: 'Editor', description: 'Rol con acceso solo a lectura y actualización de noticias', createdAt: now, updatedAt: now }
    ], { ignoreDuplicates: true });

    // Insertar Módulos
    await queryInterface.bulkInsert('modules', [
      {
        name: 'Gestión de Usuarios',
        route: '/admin/users',
        icon: 'users-icon',
        enabled: true,
        createdAt: now,
        updatedAt: now
      },
      {
        name: 'Gestión de Noticias',
        route: '/admin/news',
        icon: 'news-icon',
        enabled: true,
        createdAt: now,
        updatedAt: now
      }
    ], { ignoreDuplicates: true });

    // Insertar Permisos
    await queryInterface.bulkInsert('permissions', [
      { name: 'create' },
      { name: 'read' },
      { name: 'update' },
      { name: 'delete' }
    ], { ignoreDuplicates: true });

    // Obtener IDs insertados
    const [users] = await queryInterface.sequelize.query(
      `SELECT id, email FROM users WHERE email IN ('super@example.com', 'juan@example.com', 'carolina@example.com')`
    );
    const [roles] = await queryInterface.sequelize.query(
      `SELECT id, name FROM roles WHERE name IN ('superadmin', 'Administrador', 'Editor')`
    );
    const [modules] = await queryInterface.sequelize.query(
      `SELECT id, route FROM modules WHERE route IN ('/admin/users', '/admin/news')`
    );
    const [permissions] = await queryInterface.sequelize.query(
      `SELECT id, name FROM permissions WHERE name IN ('create', 'read', 'update', 'delete')`
    );

    const userMap = Object.fromEntries(users.map(u => [u.email, u.id]));
    const roleMap = Object.fromEntries(roles.map(r => [r.name, r.id]));
    const moduleMap = Object.fromEntries(modules.map(m => [m.route, m.id]));
    const permissionMap = Object.fromEntries(permissions.map(p => [p.name, p.id]));

    // Relacionar Usuarios con Roles
    await queryInterface.bulkInsert('user_roles', [
      { user_id: userMap['super@example.com'], role_id: roleMap['superadmin'] },
      { user_id: userMap['juan@example.com'], role_id: roleMap['Administrador'] },
      { user_id: userMap['carolina@example.com'], role_id: roleMap['Editor'] }
    ], { ignoreDuplicates: true });

    // Relacionar Rol Administrador con todos los permisos sobre módulo de usuarios
    const permisosAdmin = ['create', 'read', 'update', 'delete'].map(p => ({
      role_id: roleMap['Administrador'],
      module_id: moduleMap['/admin/users'],
      permission_id: permissionMap[p]
    }));

    // Relacionar Rol Editor con permisos limitados sobre módulo de noticias
    const permisosEditor = ['read', 'update'].map(p => ({
      role_id: roleMap['Editor'],
      module_id: moduleMap['/admin/news'],
      permission_id: permissionMap[p]
    }));

    await queryInterface.bulkInsert('module_permissions', [...permisosAdmin, ...permisosEditor], {
      ignoreDuplicates: true
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('module_permissions', null);
    await queryInterface.bulkDelete('user_roles', null);
    await queryInterface.bulkDelete('permissions', {
      name: ['create', 'read', 'update', 'delete']
    });
    await queryInterface.bulkDelete('modules', {
      route: ['/admin/users', '/admin/news']
    });
    await queryInterface.bulkDelete('roles', {
      name: ['superadmin', 'Administrador', 'Editor']
    });
    await queryInterface.bulkDelete('users', {
      email: ['super@example.com', 'juan@example.com', 'carolina@example.com']
    });
  }
};
