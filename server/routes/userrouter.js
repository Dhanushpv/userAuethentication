const express = require('express');
const router = express.Router();
const userController = require('../controllers/usercontroller');
// const accessControl =require('../util/access-control').accessControl



router.post('/user',userController.create1);
router.post('/verifyOtp',userController.verifyOtp);
router.get('/users/:id',userController.getsingle);
router.put('/resetpassword/:id',userController.resetPassword);
router.post('/forgot_password',userController.forgetPassword);
router.patch('/reset-password',userController.passwordResetController);





module.exports = router;