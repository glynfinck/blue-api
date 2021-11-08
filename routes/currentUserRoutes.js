const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const solutionController = require('../controllers/solutionController');
const graphController = require('../controllers/graphController');

const graphRouter = require('./graphRoutes');

const router = express.Router();

// router
//   .route('/')
//   .get(
//     authController.protect,
//     authController.restrictTo('user'),
//     userController.getMe
//   )
//   .delete(
//     authController.protect,
//     authController.restrictTo('user'),
//     userController.deleteMe
//   );

// router
//   .route('/solutions')
//   .get(
//     authController.protect,
//     authController.restrictTo('user'),
//     solutionController.getAllMySolutions
//   )
//   .post(
//     authController.protect,
//     authController.restrictTo('user'),
//     solutionController.createMySolution
//   );

// router
//   .route('/graphs')
//   .get(
//     authController.protect,
//     authController.restrictTo('user'),
//     graphController.getAllMyGraphs
//   )
//   .post(
//     authController.protect,
//     authController.restrictTo('user'),
//     graphController.createMyGraph
//   );

module.exports = router;
