/*Utilizado para cargar por primera vez todos los permisos en la base de datos.*/


const Permission = require('./models/Permission');
const sequelize = require('./config/database');

const seedPermissions = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión establecida correctamente.');

    const actions = ['create', 'read', 'update', 'delete'];

    for (const action of actions) {
      await Permission.findOrCreate({
        where: { name: action }
      });
    }

    console.log('Permisos cargados correctamente.');
    process.exit();
  } catch (error) {
    console.error('Error cargando permisos:', error);
    process.exit(1);
  }
};

seedPermissions();
