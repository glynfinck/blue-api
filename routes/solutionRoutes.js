const express = require('express');
const solutionController = require('../controllers/solutionController');
const authController = require('../controllers/authController');

const adminRouter = express.Router({
  mergeParams: true,
});

adminRouter.use(authController.protect);
adminRouter.use(authController.restrictTo('admin'));

adminRouter.route('/').get(solutionController.getAllSolutions);

adminRouter
  .route('/:id')
  .get(solutionController.getSolution)
  .delete(solutionController.deleteSolution);

exports.adminSolutionRouter = adminRouter;

const userRouter = express.Router({
  mergeParams: true,
});

userRouter.use(authController.protect);
userRouter.use(authController.restrictTo('user'));

userRouter
  .route('/')
  .get(solutionController.getAllMySolutions)
  .post(solutionController.createMySolution);

userRouter
  .route('/:id')
  .get(solutionController.getMySolution)
  .patch(solutionController.updateMySolution);

exports.userSolutionRouter = userRouter;
