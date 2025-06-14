const express = require('express');
const router = express.Router();
const { verifyToken } = require('../utils/jwt');
const isSuperUser = require('../middlewares/isSuperUser');
const { assignRoleToUser } = require('../controllers/userRoleController');

router.post('/assign', verifyToken, isSuperUser, assignRoleToUser);

module.exports = router;
