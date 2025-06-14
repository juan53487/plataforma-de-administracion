# Backend - Plataforma de Administración Sindical
Este proyecto constituye la API RESTful que gestiona la autenticación de usuarios, roles, permisos y visibilidad de módulos de la plataforma.


## 🗂️ Estructura de Carpetas
``` bash
Backend/
├── Descripción Backend.md
├── app.js                # Archivo principal de la app Express
├── package.json          # Configuraciones de entorno y dependencias
├── config/               # Configuración de conexión a base de datos (Sequelize)
├── controllers/          # Lógica de manejo de endpoints (Roles, Auth, etc.)
├── middlewares/          # Funciones de manejo de errores y validaciones
├── migrations/           # Migraciones de Sequelize
├── models/               # Modelos de Sequelize y asociaciones
│   ├── index.js          # Archivo principal de Sequelize
│   └── *.js              # Modelos: User, Role, Permission, etc.
├── routes/               # Rutas agrupadas por recurso
├── seeders/              # Datos iniciales opcionales (semillas)
├── seedPermissions.js    # Semilla de permisos iniciales
├── services              
└── utils                 # Funciones de utilidad (JWT, etc.)
    └── jwt.js 
```

## 🔄 Relación entre Tablas / Modelos
   1. User
      - Contiene información básica del usuario.
      - 🔗 Relación N:M con Role a través de UserRole.
   2. Role
      - Define los roles existentes (admin, lector, etc.).
      - 🔗 Relación N:M con User (UserRole)
      - 🔗 Relación N:M con Module a través de ModulePermission
   3. Permission
      - Define acciones posibles (create, read, update, delete).
      - 🔗 Relación N:M con ModulePermission
   4. Module
      - Define los módulos visibles del frontend.
      - 🔗 Relación N:M con Role (ModulePermission intermedia)
   5. ModulePermission
      - Tabla intermedia que une módulos con roles y asigna permisos específicos.
   6. UserRole
      - Tabla intermedia que une usuarios con roles.

## 🔐 Autenticación
Se utiliza JWT para proteger las rutas.
El token se debe enviar en cada solicitud en la cabecera Authorization:
```bash
Authorization: Bearer <token>
```
## 🔧 Endpoints Principales
Todos los endpoints que requieren autenticación usan middleware authMiddleware.

### 🔐 Auth
| Método | Ruta              | Descripción                                  |
| ------ | ----------------- | -------------------------------------------- |
| POST   | `/api/auth/login` | Autenticación (email y password)             |
| GET    | `/api/auth/me`    | Obtener usuario autenticado (requiere token) |

### 👥 Users
| Método | Ruta         | Descripción         |
| ------ | ------------ | ------------------- |
| GET    | `/api/users` | Listar usuarios     |
| POST   | `/api/users` | Crear nuevo usuario |

### 🔓 Roles
| Método | Ruta         | Descripción                        |
| ------ | ------------ | ---------------------------------- |
| GET    | `/api/roles` | Listar roles con módulos asociados |
| POST   | `/api/roles` | Crear un nuevo rol                 |


### 🧩 Módulos
| Método | Ruta           | Descripción              |
| ------ | -------------- | ------------------------ |
| GET    | `/api/modules` | Listar todos los módulos |
| POST   | `/api/modules` | Crear un nuevo módulo    |


### 🛂 Permisos
| Método | Ruta               | Descripción                 |
| ------ | ------------------ | --------------------------- |
| GET    | `/api/permissions` | Listar acciones disponibles |
| POST   | `/api/permissions` | Crear una nueva acción      |


### 🔗 Asignaciones
| Método | Ruta                      | Descripción                          |
| ------ | ------------------------- | ------------------------------------ |
| POST   | `/api/module-permissions` | Asignar permisos a un módulo por rol |
| POST   | `/api/user-roles`         | Asignar rol a un usuario             |

## 🧪 Pruebas con Postman

```bash
   Login de Usuario

   Metodo: POST
   Ruta: /api/auth/login
   Headers: Content-Type: application/json
   Body:
      {
         "email": "usuario@example.com",
         "password": "123456"
      }
   Respuesta:
      {
         "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJqdWFuQGV4YW1wbGUuY29tIiwiaXNfc3VwZXJ1c2VyIjpmYWxzZSwiaWF0IjoxNzQ5ODcwMTk3LCJleHAiOjE3NDk5NTY1OTd9.Il3gfB3f4FmmRBw8sCJMCEXpZDxYqs6LbIJUlN5m95E",
         "user": {
            "id": 2,
            "name": "Juan Pérez",
            "email": "juan@example.com",
            "is_superuser": false
         }
      }
```
```bash
   Crear un nuevo Rol

   Metodo: POST
   Ruta: /api/roles
   Headers: 
      Authorization: Bearer <token>
      Content-Type: application/json
   Body:
      {
      "name": "Lector",
      "description": "Rol con privilegios de lectura"
      }

   Respuesta:
      {
         "message": "Rol creado exitosamente",
         "role": {
            "id": 11,
            "description": "Rol con privilegios de lectura",
            "name": "Lector"
         }
      }
```

```bash
   Crear un nuevo Módulo

   Metodo: POST
   Ruta: /api/modules
   Headers: 
      Authorization: Bearer <token>
      Content-Type: application/json
   Body:
      {
      "name": "Gestión de usuarios",
      "route": "/usuarios",
      "icon": "users",
      "enabled": true
      }

   Respuesta:
      {
            "message": "Módulo creado correctamente",
            "module": {
               "enabled": true,
               "id": 4,
               "name": "Creacion de usuarios",
               "route": "/usuarios",
               "icon": "users-icon",
               "updatedAt": "2025-06-14T03:09:48.714Z",
               "createdAt": "2025-06-14T03:09:48.714Z"
            }
      }
```

```bash
   Asignar permisos a un Modulo por Rol

   Metodo: POST
   Ruta: /api/module-permissions/assign
   Headers: 
      Authorization: Bearer <token>
      Content-Type: application/json
   Body:
      {
         "role_id": 10,
         "module_id": 4,
         "permissions": ["read", "update"]
      }

   Respuesta:
      {
         "message": "Permisos asignados correctamente"
      }
```

```bash
   Asignar Rol a un Usuario

   Metodo: POST
   Ruta: api/user-roles/assign
   Headers: 
      Authorization: Bearer <token>
      Content-Type: application/json
   Body:
      {
         "user_id": 4,
         "role_id": 2
      }


   Respuesta:
      {
         "message": "Rol asignado correctamente al usuario"
      }
```

```bash
   Obtener Permisos del Usuario

   Metodo: Get
   Ruta: /api/permissions/my-permissions
   Headers: 
      Authorization: Bearer <token>
      Content-Type: application/json
      
   Respuesta:
      {
         "modules": [
            {
                  "id": 1,
                  "name": "Gestión de Usuarios",
                  "permissions": [
                     "create",
                     "read",
                     "update",
                     "delete"
                  ]
            },
            {
                  "id": 2,
                  "name": "Gestión de Noticias",
                  "permissions": [
                     "read",
                     "update"
                  ]
            },
            {
                  "id": 3,
                  "name": "Creacion de validaciones",
                  "permissions": []
            },
            {
                  "id": 4,
                  "name": "Creacion de validaciones usuarios",
                  "permissions": [
                     "read",
                     "update"
                  ]
            }
         ]
      }
```

```bash
   Obtener Roles y Modulos del Usuario

   Metodo: Get
   Ruta: /api/auth/me
   Headers: 
      Authorization: Bearer <token>
      Content-Type: application/json
   Respuesta:
      {
         "id": 2,
         "name": "Juan Pérez",
         "email": "juan@example.com",
         "Roles": [
            {
                  "id": 2,
                  "name": "Administrador",
                  "description": "Rol con privilegios completos",
                  "Modules": [
                     {
                        "id": 1,
                        "name": "Gestión de Usuarios",
                        "route": "/admin/users",
                        "icon": "users-icon",
                        "enabled": true,
                        "createdAt": "2025-06-13T22:35:44.000Z",
                        "updatedAt": "2025-06-13T22:35:44.000Z"
                     }
                  ]
            }
         ]
      }
```



## 📚 Documentación de Endpoints
- [Endpoints](Endpoints.md)
- [Rutas](Rutas.md)
- [Modelos](Modelos.md)
- [Semillas](Semillas.md)
- [Migraciones](Migraciones.md)
- [JWT](JWT.md)
- [Autenticación](Autenticación.md)
- [Roles](Roles.md)
- [Permisos](Permisos.md)
- [Módulos](Módulos.md)
- [Usuarios](Usuarios.md)
- [Visibilidad de Módulos](Visibilidad.md)
- [Autenticación

