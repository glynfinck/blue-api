const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const solutionController = require('../controllers/solutionController');

const router = express.Router();

router.post('/signup', authController.signUp);
router.post('/signin', authController.signIn);
router.post('/forgotPassword', authController.forgotPassword);

module.exports = router;
