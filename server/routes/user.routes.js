const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

router.post('/signup', userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/auth', userController.authenticateUser);
router.post('/logout', userController.logoutUser);
router.post('/password-confirm', userController.confirmPassword);
router.post('/password-reset', userController.resetPassword);
router.post('/resign', userController.resignUser);

module.exports = router;
