const express = require('express');
const edgeController = require('../controllers/edgeController');
const authController = require('../controllers/authController');

// Admin Router
const adminRouter = express.Router({
  mergeParams: true
});

adminRouter.use(authController.protect);
adminRouter.use(authController.restrictTo('admin'));

adminRouter.route('/').get(edgeController.getAllEdges);

adminRouter
  .route('/:id')
  .get(edgeController.getAllEdges)
  .delete(edgeController.deleteEdge);

exports.adminEdgeRouter = adminRouter;

// User Router
const userRouter = express.Router({
  mergeParams: true
});

userRouter.use(authController.protect);
userRouter.use(authController.restrictTo('user'));

userRouter
  .route('/')
  .get(edgeController.getAllMyEdges)
  .post(edgeController.createMyEdge);

userRouter
  .route('/:id')
  .get(edgeController.getMyEdge)
  .delete(edgeController.deleteMyEdge);

exports.userEdgeRouter = userRouter;
