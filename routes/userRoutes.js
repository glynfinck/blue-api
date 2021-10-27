const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

const router = express.Router();

router.post('/signup', authController.signUp);
router.post('/signin', authController.signIn);
router.post('/forgotPassword', authController.forgotPassword);

router
  .route('/me')
  .get(
    authController.protect,
    authController.restrictTo('user'),
    userController.getMe
  )
  .delete(
    authController.protect,
    authController.restrictTo('user'),
    userController.deleteMe
  );

module.exports = router;
