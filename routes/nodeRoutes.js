const express = require('express');
const nodeController = require('../controllers/nodeController');
const authController = require('../controllers/authController');

// Admin Router
const adminRouter = express.Router({
  mergeParams: true
});

adminRouter.use(authController.protect);
adminRouter.use(authController.restrictTo('admin'));

adminRouter.route('/').get(nodeController.getAllNodes);

adminRouter
  .route('/:id')
  .get(nodeController.getNode)
  .delete(nodeController.deleteNode);

exports.adminNodeRouter = adminRouter;

// User Router
const userRouter = express.Router({
  mergeParams: true
});

userRouter.use(authController.protect);
userRouter.use(authController.restrictTo('user'));

userRouter
  .route('/')
  .get(nodeController.getAllMyNodes)
  .post(nodeController.createMyNode);

userRouter
  .route('/:id')
  .get(nodeController.getMyNode)
  .patch(nodeController.updateMyNode)
  .delete(nodeController.deleteMyNode);

exports.userNodeRouter = userRouter;
