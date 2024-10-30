const express = require('express');
const router = express.Router();
const authController = require('../controllers/authcontroller');
// const accessControl =require('../util/access-control').accessControl



router.post('/login',authController.login);


module.exports = router;