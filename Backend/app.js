const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// 🧩 Importa tus rutas aquí
const authRoutes = require('./routes/authRoutes');
const moduleRoutes = require('./routes/moduleRoutes');
const roleRoutes = require('./routes/roleRoutes');
const userRoleRoutes = require('./routes/userRoleRoutes');
const modulePermissionRoutes = require('./routes/modulePermissionRoutes');


dotenv.config();

const db = require('./models'); // esto importa todos los modelos y ejecuta sus asociaciones


const app = express();
app.use(cors());
app.use(express.json());

// Rutas aquí (ejemplo inicial)
app.get('/', (req, res) => res.send('API corriendo'));
app.use('/api/auth', authRoutes); // Ruta de autenticación
app.use('/api/modules', moduleRoutes); // Ruta de módulos
app.use('/api/roles', roleRoutes); // Ruta de roles
app.use('/api/user-roles', userRoleRoutes); // Ruta de rol de usuarios
app.use('/api/module-permissions', modulePermissionRoutes); // Ruta para definir permisos de rol en modulos






const PORT = process.env.PORT || 3000;

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}.`);
    /*console.log(`Frontend esperado en: http://localhost:5173`);
    // endpoint de login
    console.log(`Endpoint de login: POST http://localhost:${PORT}/api/auth/login`);
   
    // endponts de datos
    console.log(`Endpoints de datos: GET http://localhost:${PORT}/api/data/public`);
    console.log(`Endpoints de datos protegidos: GET http://localhost:${PORT}/api/data/user-protected (requiere token)`);
    console.log(`Endpoints de datos admin: GET http://localhost:${PORT}/api/data/admin-only (requiere token de admin)`);
    // endpoints de gestion de usuarios
    console.log(`Endpoints de gestión de usuarios (Admin): /api/users`);
    // endpoints de geografía
    console.log(`Endpoints de geografía: /api/geography/departments, /api/geography/cities/:departmentId`);
    // endpoints de reportes
    console.log(`Endpoints de reportes: /api/reports`);*/
});

