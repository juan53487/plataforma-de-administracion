const express = require('express');
const router = express.Router();
const { verifyToken } = require('../utils/jwt');
const isSuperUser = require('../middlewares/isSuperUser');
const { createRole } = require('../controllers/roleController');

router.post('/', verifyToken, isSuperUser, createRole);

module.exports = router;
