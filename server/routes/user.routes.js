const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

router.post('/signup', userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/auth', userController.loginSuccess);
router.post('/logout', userController.logoutUser);

module.exports = router;
