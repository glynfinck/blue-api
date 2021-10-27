const express = require('express');
const solutionController = require('../controllers/solutionController');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(authController.protect, solutionController.getAllSolutions)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    solutionController.createSolution
  );

router
  .route('/:id')
  .get(authController.protect, solutionController.getSolution)
  .patch(
    authController.protect,
    authController.restrictTo('user'),
    solutionController.updateSolution
  )
  .delete(
    authController.protect,
    authController.restrictTo('user'),
    solutionController.deleteSolution
  );

module.exports = router;
