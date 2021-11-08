const express = require('express');
const problemController = require('../controllers/problemController');
const authController = require('../controllers/authController');

const graphRoutes = require('./graphRoutes');
const solutionRoutes = require('./solutionRoutes');

const router = express.Router();

router.use('/:problemId/graphs', graphRoutes.adminGraphRouter);
router.use('/:problemId/solutions', solutionRoutes.adminSolutionRouter);

router.use('/:problemId/me/graphs', graphRoutes.userGraphRouter);
router.use('/:problemId/me/solutions', solutionRoutes.userSolutionRouter);

router
  .route('/')
  .get(problemController.getAllProblems)
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    problemController.createProblem
  );

router
  .route('/:id')
  .get(problemController.getProblem)
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    problemController.updateProblem
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    problemController.deleteProblem
  );

module.exports = router;
