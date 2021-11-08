const express = require('express');
const authController = require('../controllers/authController');
const graphController = require('../controllers/graphController');
const nodeController = require('../controllers/nodeController');
const edgeController = require('../controllers/edgeController');

const nodeRoutes = require('./nodeRoutes');
const edgeRoutes = require('./edgeRoutes');

// Admin Router
const adminRouter = express.Router({
  mergeParams: true,
});

adminRouter.use(authController.protect);
adminRouter.use(authController.restrictTo('admin'));

// TODO: implement admin nested routes
adminRouter.use('/:graphId/nodes', nodeRoutes.adminNodeRouter);
adminRouter.use('/:graphId/edges', edgeRoutes.adminEdgeRouter);

adminRouter.route('/').get(graphController.getAllGraphs);

adminRouter
  .route('/:id')
  .get(graphController.getGraph)
  .delete(graphController.deleteGraph);

// User Router
exports.adminGraphRouter = adminRouter;

const userRouter = express.Router({
  mergeParams: true,
});

userRouter.use(authController.protect);
userRouter.use(authController.restrictTo('user'));

// TODO: implement user graph routes and nested nodes/edges routes
// userRouter.use('/nodes', userNodeRouter);
// userRouter.use('/edges', userEdgeRouter);

userRouter
  .route('/')
  .get(graphController.getAllMyGraphs)
  .post(graphController.createMyGraph);

userRouter
  .route('/:id')
  .get(graphController.getMyGraph)
  .patch(graphController.updateMyGraph);

exports.userGraphRouter = userRouter;
