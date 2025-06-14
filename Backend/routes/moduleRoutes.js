const express = require('express');
const router = express.Router();
const { verifyToken } = require('../utils/jwt');
const isSuperUser = require('../middlewares/isSuperUser');
const { createModule } = require('../controllers/moduleController');

router.post('/', verifyToken, isSuperUser, createModule);

module.exports = router;
