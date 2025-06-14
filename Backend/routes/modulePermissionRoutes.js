const express = require('express');
const router = express.Router();
const { verifyToken } = require('../utils/jwt');
const isSuperUser = require('../middlewares/isSuperUser');
const { assignPermissionsToModule,
    getUserModulesWithPermissions, } = require('../controllers/modulePermissionController');



router.post('/assign', verifyToken, isSuperUser, assignPermissionsToModule);
router.get('/my-permissions', verifyToken, getUserModulesWithPermissions);

module.exports = router;
